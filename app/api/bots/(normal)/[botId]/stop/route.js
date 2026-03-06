import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { 
  isBotActive, 
  stopAndRemoveBot,
  getActiveBot
} from "@/lib/telegram/activeBots";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Variable para controlar procesos simultáneos
const processingBots = new Map();

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

    console.log(`🛑 Deteniendo bot ${botId} (webhook)...`);

    // Evitar múltiples detenciones simultáneas
    if (processingBots.has(botId)) {
      return NextResponse.json({
        success: true,
        message: "✅ Bot ya está en proceso de detención",
        botId,
        status: 'inactive'
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
      return NextResponse.json(
        { error: "Bot no encontrado" },
        { status: 404 }
      );
    }

    // ========== 3. ELIMINAR WEBHOOK EN TELEGRAM ==========
    let webhookEliminado = false;
    try {
      console.log(`🌐 Eliminando webhook en Telegram...`);
      
      // Obtener información del webhook antes de eliminar
      const webhookInfo = await axios.get(
        `https://api.telegram.org/bot${bot.token}/getWebhookInfo`
      );
      console.log(`📊 Webhook actual:`, webhookInfo.data.result?.url || 'No configurado');
      
      // Eliminar webhook
      const deleteResponse = await axios.get(
        `https://api.telegram.org/bot${bot.token}/deleteWebhook?drop_pending_updates=true`
      );
      
      if (deleteResponse.data.ok) {
        console.log(`✅ Webhook eliminado exitosamente`);
        webhookEliminado = true;
      } else {
        console.log(`⚠️ Error eliminando webhook:`, deleteResponse.data.description);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar que se eliminó
      const verifyDelete = await axios.get(
        `https://api.telegram.org/bot${bot.token}/getWebhookInfo`
      );
      console.log(`📊 Verificación post-eliminación:`, {
        url: verifyDelete.data.result?.url || 'Eliminado'
      });
      
    } catch (e) {
      console.log(`⚠️ Error en limpieza de webhook:`, e.message);
    }

    // ========== 4. DETENER INSTANCIA EN MEMORIA ==========
    let stopped = false;
    if (isBotActive(botId)) {
      console.log(`⚠️ Eliminando instancia de memoria...`);
      
      // Obtener el servicio antes de eliminarlo
      const botService = getActiveBot(botId);
      
      // Llamar al método stop del servicio si existe
      if (botService && botService.stop) {
        try {
          await botService.stop();
        } catch (e) {
          console.log(`Error llamando stop():`, e.message);
        }
      }
      
      stopped = await stopAndRemoveBot(botId);
      console.log(`✅ Bot eliminado de memoria: ${stopped}`);
    } else {
      console.log(`ℹ️ No hay instancia en memoria para eliminar`);
    }

    // ========== 5. ACTUALIZAR ESTADO EN BASE DE DATOS ==========
    console.log(`📝 Actualizando estado en BD a 'inactive'...`);
    
    const { error: updateError, data: updatedData } = await supabase
      .from('bots')
      .update({ 
        status: 'inactive', 
        updated_at: new Date().toISOString()
      })
      .eq('id', botId)
      .select();

    if (updateError) {
      console.error("❌ Error actualizando estado:", updateError);
      processingBots.delete(botId);
      throw updateError;
    }

    console.log(`✅ Estado actualizado:`, updatedData);

    // ========== 6. VERIFICACIÓN FINAL ==========
    console.log(`🔍 Verificando estado final...`);
    
    try {
      const finalCheck = await axios.get(
        `https://api.telegram.org/bot${bot.token}/getWebhookInfo`
      );
      
      if (finalCheck.data.result?.url) {
        console.log(`⚠️ Webhook aún presente: ${finalCheck.data.result.url}`);
      } else {
        console.log(`✅ Webhook confirmado como eliminado`);
      }
    } catch (e) {
      console.log(`✅ No se pudo verificar, asumimos limpio`);
    }

    processingBots.delete(botId);

    // ========== 7. RESPONDER CON ÉXITO ==========
    const mensajeFinal = webhookEliminado 
      ? "✅ Bot detenido y webhook eliminado"
      : "⚠️ Bot detenido pero puede requerir limpieza manual";

    return NextResponse.json({
      success: true,
      message: mensajeFinal,
      botId: bot.id,
      status: 'inactive',
      webhookEliminado
    });

  } catch (error) {
    console.error("❌ Error en stop:", error);
    
    if (params?.botId) {
      processingBots.delete(params.botId);
      
      // Intentar actualizar BD a inactive aunque falle
      await supabase
        .from('bots')
        .update({ status: 'inactive' })
        .eq('id', params.botId);
    }
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al detener el bot: " + error.message },
      { status: 500 }
    );
  }
}