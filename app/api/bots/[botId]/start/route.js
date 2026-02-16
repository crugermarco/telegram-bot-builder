import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { Telegraf } from 'telegraf';
import TelegramBotService from "@/lib/telegram/bot";
import { 
  setActiveBot, 
  stopAndRemoveBot,
  isBotActive,
  getActiveBot
} from "@/lib/telegram/activeBots";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para esperar
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request, { params }) {
  try {
    // ========== 1. VERIFICAR AUTENTICACIÓN ==========
    const token = request.cookies.get("token")?.value ||
                  request.headers.get("authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "secret-key-2024");
    const userId = decoded.userId;
    const botId = params.botId;

    console.log(`🚀 INICIANDO bot ${botId}...`);

    // ========== 2. VERIFICAR QUE EL BOT EXISTE ==========
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    if (botError || !bot) {
      return NextResponse.json({ error: "Bot no encontrado" }, { status: 404 });
    }

    // ========== 3. VERIFICAR SI YA HAY UNA INSTANCIA ACTIVA ==========
    if (isBotActive(botId)) {
      console.log(`⚠️ Ya hay una instancia activa del bot ${botId}, deteniéndola...`);
      
      // Detener la instancia anterior
      await stopAndRemoveBot(botId);
      console.log(`✅ Instancia anterior detenida`);
      
      // Esperar a que Telegram libere la conexión
      await sleep(2000);
    }

    // ========== 4. LIMPIAR WEBHOOK EN TELEGRAM ==========
    try {
      console.log(`🌐 Limpiando webhook en Telegram...`);
      
      // Usar Telegraf para limpiar
      const tempBot = new Telegraf(bot.token);
      await tempBot.telegram.callApi('deleteWebhook', { drop_pending_updates: true });
      
      // También usar API directa por si acaso
      await axios.get(
        `https://api.telegram.org/bot${bot.token}/deleteWebhook?drop_pending_updates=true`
      );
      
      console.log(`✅ Webhook eliminado`);
    } catch (cleanupError) {
      console.log(`⚠️ Error limpiando webhook (no crítico):`, cleanupError.message);
    }

    await sleep(1000);

    // ========== 5. INICIAR EL BOT ==========
    try {
      console.log(`🆕 Creando nueva instancia del bot...`);
      const botService = new TelegramBotService(bot.token, botId);
      
      // Iniciar el bot (esto se queda ejecutándose)
      // Pero NO debemos esperar a que termine para responder
      botService.start().then(async (started) => {
        if (started) {
          console.log(`✅ Bot ${botId} iniciado correctamente`);
          
          // Guardar en memoria
          setActiveBot(botId, botService);
          
          // Actualizar estado en BD
          await supabase
            .from('bots')
            .update({ 
              status: 'active', 
              updated_at: new Date().toISOString()
            })
            .eq('id', botId);
            
          console.log(`✅ Estado actualizado en BD`);
        } else {
          console.error(`❌ No se pudo iniciar el bot`);
          
          // Asegurar estado inactivo
          await supabase
            .from('bots')
            .update({ status: 'inactive' })
            .eq('id', botId);
        }
      }).catch(async (error) => {
        console.error(`❌ Error iniciando bot:`, error);
        
        // Si hay error 409, forzar limpieza más agresiva
        if (error.response?.error_code === 409) {
          console.log(`⚠️ Error 409 detectado, forzando limpieza...`);
          
          // Intentar matar la instancia de Telegram
          try {
            await axios.get(
              `https://api.telegram.org/bot${bot.token}/getUpdates`,
              { params: { timeout: 1 } }
            );
            
            await axios.post(
              `https://api.telegram.org/bot${bot.token}/setWebhook`,
              { url: '' }
            );
          } catch (e) {
            console.log(`Error en limpieza forzada:`, e.message);
          }
        }
        
        // Actualizar BD a inactive
        await supabase
          .from('bots')
          .update({ status: 'inactive' })
          .eq('id', botId);
      });

      // ========== 6. RESPONDER INMEDIATAMENTE ==========
      return NextResponse.json({
        success: true,
        message: "✅ Bot iniciándose en segundo plano...",
        botId: bot.id,
        status: 'active', // Decimos que está activo aunque el bot esté iniciando
        stats: {
          nodes: bot.flow.nodes.length,
          edges: bot.flow.edges?.length || 0
        }
      });

    } catch (error) {
      console.error("❌ Error en start:", error);
      
      // Asegurar estado inactivo
      await supabase
        .from('bots')
        .update({ status: 'inactive' })
        .eq('id', botId);

      return NextResponse.json(
        { error: "Error al iniciar el bot: " + error.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error en start:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: "Error al publicar el bot: " + error.message },
      { status: 500 }
    );
  }
}