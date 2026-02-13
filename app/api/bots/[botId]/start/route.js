import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
import TelegramBotService from "@/lib/telegram/bot";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Almacenar instancias activas de bots
const activeBots = new Map();

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

    // ========== 3. VERIFICAR QUE TIENE TOKEN DE TELEGRAM ==========
    if (!bot.token) {
      return NextResponse.json(
        { error: "El bot no tiene token de Telegram configurado" },
        { status: 400 }
      );
    }

    // ========== 4. VERIFICAR QUE TIENE FLOW CON NODOS ==========
    if (!bot.flow || !bot.flow.nodes || bot.flow.nodes.length === 0) {
      return NextResponse.json(
        { error: "El bot no tiene nodos configurados. Agrega al menos un mensaje." },
        { status: 400 }
      );
    }

    // ========== 5. DETENER INSTANCIA ANTERIOR SI EXISTE ==========
    if (activeBots.has(botId)) {
      const oldBot = activeBots.get(botId);
      try {
        await oldBot.stop();
      } catch (e) {
        console.error("Error deteniendo instancia anterior:", e);
      }
      activeBots.delete(botId);
    }

    // ========== 6. INICIAR NUEVA INSTANCIA DEL BOT ==========
    try {
      const botService = new TelegramBotService(bot.token, botId);
      const started = await botService.start();

      if (!started) {
        throw new Error("No se pudo iniciar el bot");
      }

      // Guardar instancia
      activeBots.set(botId, botService);

      // ========== 7. ACTUALIZAR ESTADO EN BASE DE DATOS ==========
      const { error: updateError } = await supabase
        .from('bots')
        .update({ 
          status: 'active', 
          updated_at: new Date().toISOString()
        })
        .eq('id', botId);

      if (updateError) {
        console.error("Error actualizando estado:", updateError);
      }

      // ========== 8. RESPONDER CON ÉXITO ==========
      return NextResponse.json({
        success: true,
        message: "✅ Bot iniciado correctamente en Telegram",
        botId: bot.id,
        status: 'active',
        stats: {
          nodes: bot.flow.nodes.length,
          edges: bot.flow.edges?.length || 0
        }
      });

    } catch (error) {
      console.error("Error iniciando bot:", error);
      
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