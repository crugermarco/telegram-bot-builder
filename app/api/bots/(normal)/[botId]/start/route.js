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

    // ========== 3. DETENER INSTANCIA ANTERIOR SI EXISTE ==========
    if (isBotActive(botId)) {
      console.log(`⚠️ Deteniendo instancia anterior en memoria...`);
      await stopAndRemoveBot(botId);
      await sleep(2000);
    }

    // ========== 4. LIMPIAR WEBHOOK EN TELEGRAM ==========
    try {
      console.log(`🌐 Limpiando webhook en Telegram...`);
      await axios.get(
        `https://api.telegram.org/bot${bot.token}/deleteWebhook?drop_pending_updates=true`
      );
      console.log(`✅ Webhook eliminado`);
    } catch (e) {
      console.log(`⚠️ Error limpiando webhook:`, e.message);
    }

    await sleep(1000);

    // ========== 5. INICIAR EL BOT ==========
    try {
      console.log(`🆕 Creando nueva instancia del bot...`);
      const botService = new TelegramBotService(bot.token, botId);
      
      // Iniciar el bot (esto se queda ejecutándose en segundo plano)
      botService.start().then(async (started) => {
        if (started) {
          console.log(`✅ Bot ${botId} iniciado correctamente en segundo plano`);
          
          // Guardar en memoria
          setActiveBot(botId, botService);
          console.log(`✅ Bot ${botId} registrado en memoria activa`);
          
          // ===== ACTUALIZAR ESTADO EN BASE DE DATOS =====
          console.log(`📝 Actualizando estado en BD a 'active'...`);
          const { error: updateError, data: updatedData } = await supabase
            .from('bots')
            .update({ 
              status: 'active', 
              updated_at: new Date().toISOString()
            })
            .eq('id', botId)
            .select();

          if (updateError) {
            console.error(`❌ Error actualizando BD:`, updateError);
          } else {
            console.log(`✅ Estado actualizado en BD:`, updatedData);
          }
        } else {
          console.error(`❌ No se pudo iniciar el bot`);
          
          // Asegurar estado inactivo
          await supabase
            .from('bots')
            .update({ status: 'inactive' })
            .eq('id', botId);
        }
      }).catch(async (error) => {
        // ===== NUEVA LÓGICA: Manejar 409 como "ya está activo" =====
        if (error.response?.error_code === 409) {
          console.log(`⚠️ Bot ${botId} ya está activo (error 409) - considerando como éxito`);
          
          // Verificar con Telegram si el bot realmente está activo
          try {
            // Intentar obtener información del webhook
            const webhookInfo = await axios.get(
              `https://api.telegram.org/bot${bot.token}/getWebhookInfo`
            );
            
            // Intentar obtener updates (para ver si hay polling)
            const updatesInfo = await axios.get(
              `https://api.telegram.org/bot${bot.token}/getUpdates`,
              { params: { timeout: 1, offset: -1 } }
            );
            
            console.log(`📊 Webhook info:`, webhookInfo.data);
            console.log(`📊 Updates info:`, updatesInfo.data);
            
            // Si hay webhook configurado o updates pendientes, el bot está activo
            const tieneWebhook = webhookInfo.data.result?.url;
            const tieneUpdates = updatesInfo.data.result?.length > 0;
            
            if (tieneWebhook || tieneUpdates) {
              console.log(`✅ Confirmado: Bot ${botId} está activo en Telegram`);
              
              // Crear un servicio dummy para tener referencia en memoria
              const dummyService = { 
                botId, 
                token: bot.token,
                isRunning: true, 
                uptime: Date.now() - 60000, // Asumimos que lleva 1 minuto activo
                stop: async () => {
                  console.log(`🛑 Deteniendo bot dummy ${botId}...`);
                  // Intentar limpiar webhook al detener
                  try {
                    await axios.get(
                      `https://api.telegram.org/bot${bot.token}/deleteWebhook?drop_pending_updates=true`
                    );
                  } catch (e) {
                    console.log(`Error limpiando webhook:`, e.message);
                  }
                }
              };
              
              // Guardar en memoria aunque no tengamos el servicio real
              setActiveBot(botId, dummyService);
              console.log(`✅ Bot ${botId} registrado en memoria (modo dummy)`);
              
              // Actualizar BD a active
              await supabase
                .from('bots')
                .update({ 
                  status: 'active',
                  updated_at: new Date().toISOString()
                })
                .eq('id', botId);
                
              console.log(`✅ Bot ${botId} marcado como activo a pesar del error 409`);
            } else {
              console.log(`⚠️ No se pudo confirmar si el bot está activo`);
            }
          } catch (verifyError) {
            console.error(`❌ Error verificando bot después de 409:`, verifyError);
          }
        } else {
          // Otros errores sí se reportan
          console.error(`❌ Error en segundo plano:`, error);
          await supabase
            .from('bots')
            .update({ status: 'inactive' })
            .eq('id', botId);
        }
      });

      // ========== 6. RESPONDER INMEDIATAMENTE ==========
      console.log(`✅ Respondiendo al cliente inmediatamente con estado 'active'`);
      return NextResponse.json({
        success: true,
        message: "✅ Bot iniciándose en segundo plano...",
        botId: bot.id,
        status: 'active', // Decimos que está activo aunque esté iniciando
        stats: {
          nodes: bot.flow.nodes.length,
          edges: bot.flow.edges?.length || 0
        }
      });

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

      return NextResponse.json(
        { error: error.message },
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