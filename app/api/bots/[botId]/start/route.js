import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import TelegramBotService from "@/lib/telegram/bot";
import { 
  setActiveBot, 
  stopAndRemoveBot,
  isBotActive
} from "@/lib/telegram/activeBots";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para esperar
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para forzar limpieza usando API directa de Telegram
async function forceTelegramCleanup(token) {
  console.log(`🧹 Forzando limpieza en Telegram...`);
  
  try {
    const deleteWebhookRes = await axios.get(
      `https://api.telegram.org/bot${token}/deleteWebhook?drop_pending_updates=true`
    );
    console.log(`✅ deleteWebhook:`, deleteWebhookRes.data);

    const setWebhookRes = await axios.post(
      `https://api.telegram.org/bot${token}/setWebhook`,
      { url: '' }
    );
    console.log(`✅ setWebhook:`, setWebhookRes.data);

    return true;
  } catch (error) {
    console.error(`❌ Error en forceTelegramCleanup:`, error.response?.data || error.message);
    return false;
  }
}

export async function POST(request, { params }) {
  try {
    // ========== 1. VERIFICAR AUTENTICACIÓN ==========
    const token = request.cookies.get("token")?.value ||
                  request.headers.get("authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "secret-key-2024"
    );
    const userId = decoded.userId;
    const botId = params.botId;

    console.log(`🚀 Intentando iniciar bot ${botId}...`);

    // ========== 2. VERIFICAR QUE EL BOT EXISTE Y PERTENECE AL USUARIO ==========
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    if (botError || !bot) {
      return NextResponse.json(
        { error: "Bot no encontrado" },
        { status: 404 }
      );
    }

    // ========== 3. VERIFICAR REQUISITOS ==========
    if (!bot.token) {
      return NextResponse.json(
        { error: "El bot no tiene token de Telegram configurado" },
        { status: 400 }
      );
    }

    if (!bot.flow || !bot.flow.nodes || bot.flow.nodes.length === 0) {
      return NextResponse.json(
        { error: "El bot no tiene nodos configurados. Agrega al menos un mensaje." },
        { status: 400 }
      );
    }

    // ========== 4. LIMPIEZA COMPLETA ==========
    console.log(`🔍 Limpiando instancias anteriores del bot ${botId}...`);
    
    if (isBotActive(botId)) {
      console.log(`⚠️ Deteniendo instancia en memoria...`);
      await stopAndRemoveBot(botId);
      await sleep(2000);
    }

    console.log(`🔫 Ejecutando limpieza forzada con API directa...`);
    await forceTelegramCleanup(bot.token);
    
    console.log(`⏳ Esperando 3 segundos...`);
    await sleep(3000);

    // ========== 5. INICIAR NUEVA INSTANCIA DEL BOT ==========
    try {
      console.log(`🆕 Creando nueva instancia del bot ${botId}...`);
      const botService = new TelegramBotService(bot.token, botId);
      
      const started = await botService.start();

      if (!started) {
        throw new Error("No se pudo iniciar el bot");
      }

      // ========== 6. GUARDAR EN MEMORIA ==========
      setActiveBot(botId, botService);
      console.log(`✅ Bot ${botId} registrado en memoria activa`);

      // ========== 7. ACTUALIZAR ESTADO EN BASE DE DATOS ==========
      console.log(`📝 ACTUALIZANDO ESTADO EN BD a 'active'...`);
      
      const { error: updateError, data: updatedData } = await supabase
        .from('bots')
        .update({ 
          status: 'active', 
          updated_at: new Date().toISOString()
        })
        .eq('id', botId)
        .select();

      if (updateError) {
        console.error("❌ Error actualizando estado:", updateError);
      } else {
        console.log(`✅ Estado actualizado:`, updatedData);
      }

      // ========== 8. VERIFICAR QUE EL ESTADO SE ACTUALIZÓ ==========
      const { data: verifyBot } = await supabase
        .from('bots')
        .select('status')
        .eq('id', botId)
        .single();

      console.log(`🔍 VERIFICACIÓN - Estado en BD: ${verifyBot?.status}`);

      // ========== 9. RESPONDER CON ÉXITO ==========
      return NextResponse.json({
        success: true,
        message: "✅ Bot iniciado correctamente en Telegram",
        botId: bot.id,
        status: 'active', // ← ENVIAMOS 'active' EXPLÍCITAMENTE
        stats: {
          nodes: bot.flow.nodes.length,
          edges: bot.flow.edges?.length || 0
        }
      });

    } catch (error) {
      console.error("❌ Error iniciando bot:", error);
      
      // Asegurar que el estado quede como inactivo
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
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al publicar el bot: " + error.message },
      { status: 500 }
    );
  }
}