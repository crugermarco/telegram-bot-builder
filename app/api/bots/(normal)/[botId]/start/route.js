import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import TelegramBotService from "@/lib/telegram/bot";
import { setActiveBot, stopAndRemoveBot, isBotActive } from "@/lib/telegram/activeBots";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para esperar
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Variable para controlar si ya estamos procesando
const processingBots = new Map();

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

    // Evitar múltiples inicios simultáneos
    if (processingBots.has(botId)) {
      return NextResponse.json({
        success: true,
        message: "✅ Bot ya está en proceso de inicio",
        botId,
        status: 'active'
      });
    }
    processingBots.set(botId, true);

    // ========== 2. VERIFICAR QUE EL BOT EXISTE ==========
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    if (botError || !bot) {
      processingBots.delete(botId);
      return NextResponse.json({ error: "Bot no encontrado" }, { status: 404 });
    }

    // ========== 3. DETENER INSTANCIA ANTERIOR SI EXISTE ==========
    if (isBotActive(botId)) {
      console.log(`⚠️ Deteniendo instancia anterior en memoria...`);
      await stopAndRemoveBot(botId);
      await sleep(3000); // Aumentar tiempo para asegurar limpieza
    }

    // ========== 4. LIMPIAR WEBHOOK EN TELEGRAM ==========
    try {
      console.log(`🌐 Limpiando webhook en Telegram...`);
      await axios.get(
        `https://api.telegram.org/bot${bot.token}/deleteWebhook?drop_pending_updates=true`
      );
      console.log(`✅ Webhook eliminado`);
      await sleep(2000);
    } catch (e) {
      console.log(`⚠️ Error limpiando webhook:`, e.message);
    }

    // ========== 5. INICIAR EL BOT ==========
    try {
      console.log(`🆕 Creando nueva instancia del bot...`);
      const botService = new TelegramBotService(bot.token, botId);
      
      // Iniciar el bot y ESPERAR a que realmente inicie
      const started = await botService.start();
      
      if (started) {
        console.log(`✅ Bot ${botId} iniciado correctamente`);
        
        // Guardar en memoria
        setActiveBot(botId, botService);
        console.log(`✅ Bot ${botId} registrado en memoria activa`);
        
        // ===== ACTUALIZAR ESTADO EN BASE DE DATOS =====
        console.log(`📝 Actualizando estado en BD a 'active'...`);
        const { error: updateError } = await supabase
          .from('bots')
          .update({ 
            status: 'active', 
            updated_at: new Date().toISOString()
          })
          .eq('id', botId);

        if (updateError) {
          console.error(`❌ Error actualizando BD:`, updateError);
        } else {
          console.log(`✅ Estado actualizado en BD a 'active'`);
        }
        
        // Limpiar flag de procesamiento
        processingBots.delete(botId);
        
        // ========== 6. RESPONDER CON ÉXITO ==========
        return NextResponse.json({
          success: true,
          message: "✅ Bot iniciado correctamente",
          botId: bot.id,
          status: 'active',
          stats: {
            nodes: bot.flow?.nodes?.length || 0,
            edges: bot.flow?.edges?.length || 0
          }
        });
      } else {
        throw new Error("No se pudo iniciar el bot");
      }

    } catch (error) {
      console.error("❌ Error en start:", error);
      
      // Asegurar estado inactivo
      if (isBotActive(botId)) {
        await stopAndRemoveBot(botId);
      }
      
      await supabase
        .from('bots')
        .update({ status: 'inactive' })
        .eq('id', botId);
      
      processingBots.delete(botId);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error en start:", error);
    
    if (params?.botId) {
      processingBots.delete(params.botId);
    }
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: "Error al publicar el bot: " + error.message },
      { status: 500 }
    );
  }
}