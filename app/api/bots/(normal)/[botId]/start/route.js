import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { setActiveBot, stopAndRemoveBot, isBotActive } from "@/lib/telegram/activeBots";

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
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "secret-key-2024");
    const userId = decoded.userId;
    const botId = params.botId;

    console.log(`🚀 INICIANDO bot ${botId} con WEBHOOK...`);

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
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // ========== 4. CONFIGURAR WEBHOOK EN TELEGRAM ==========
    try {
      // Obtener la URL base (Vercel o variable de entorno)
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                     (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
      
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_APP_URL no configurada");
      }

      const webhookUrl = `${baseUrl}/api/bots/${botId}/webhook`;
      console.log(`📌 Configurando webhook: ${webhookUrl}`);

      // 1. Primero eliminar cualquier webhook existente
      console.log(`🌐 Limpiando webhook anterior...`);
      await axios.get(
        `https://api.telegram.org/bot${bot.token}/deleteWebhook?drop_pending_updates=true`
      );
      console.log(`✅ Webhook anterior eliminado`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 2. Configurar el nuevo webhook
      console.log(`🌐 Configurando nuevo webhook...`);
      const webhookResponse = await axios.post(
        `https://api.telegram.org/bot${bot.token}/setWebhook`,
        {
          url: webhookUrl,
          allowed_updates: ["message", "callback_query"],
          drop_pending_updates: true,
          max_connections: 40
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      if (!webhookResponse.data.ok) {
        throw new Error(webhookResponse.data.description || "Error configurando webhook");
      }

      console.log(`✅ Webhook configurado exitosamente`);

      // 3. Verificar la configuración
      const verifyInfo = await axios.get(
        `https://api.telegram.org/bot${bot.token}/getWebhookInfo`
      );
      console.log(`📊 Webhook verificado:`, {
        url: verifyInfo.data.result?.url,
        pending: verifyInfo.data.result?.pending_update_count,
        has_custom_certificate: verifyInfo.data.result?.has_custom_certificate
      });

      if (!verifyInfo.data.result?.url) {
        throw new Error("El webhook no se configuró correctamente");
      }

    } catch (error) {
      console.error(`❌ Error configurando webhook:`, error.message);
      processingBots.delete(botId);
      
      // Intentar limpiar
      try {
        await axios.get(
          `https://api.telegram.org/bot${bot.token}/deleteWebhook?drop_pending_updates=true`
        );
      } catch (e) {}
      
      return NextResponse.json(
        { error: `Error configurando webhook: ${error.message}` },
        { status: 500 }
      );
    }

    // ========== 5. REGISTRAR EN MEMORIA ==========
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
    
    const webhookUrl = `${baseUrl}/api/bots/${botId}/webhook`;
    
    const botTracker = {
      botId,
      token: bot.token,
      status: 'active',
      startTime: Date.now(),
      webhookUrl: webhookUrl,
      isRunning: true,
      stop: async () => {
        console.log(`🛑 Deteniendo bot ${botId}...`);
        try {
          await axios.get(
            `https://api.telegram.org/bot${bot.token}/deleteWebhook?drop_pending_updates=true`
          );
          console.log(`✅ Webhook eliminado`);
          return true;
        } catch (e) {
          console.log(`Error eliminando webhook:`, e.message);
          return false;
        }
      }
    };
    
    setActiveBot(botId, botTracker);
    console.log(`✅ Bot ${botId} registrado en memoria con webhook`);

    // ========== 6. ACTUALIZAR ESTADO EN BASE DE DATOS ==========
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

    processingBots.delete(botId);

    // ========== 7. RESPONDER CON ÉXITO ==========
    return NextResponse.json({
      success: true,
      message: "✅ Bot iniciado correctamente con webhook",
      botId: bot.id,
      status: 'active',
      webhookUrl: webhookUrl,
      stats: {
        nodes: bot.flow?.nodes?.length || 0,
        edges: bot.flow?.edges?.length || 0
      }
    });

  } catch (error) {
    console.error("❌ Error en start:", error);
    
    if (params?.botId) {
      processingBots.delete(params.botId);
      
      // Asegurar estado inactivo en BD
      await supabase
        .from('bots')
        .update({ status: 'inactive' })
        .eq('id', params.botId);
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