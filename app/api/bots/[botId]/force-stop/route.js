import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import { stopAndRemoveBot } from "@/lib/telegram/activeBots";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request, { params }) {
  try {
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

    console.log(`🔥 FORCE STOP para bot ${botId}`);

    // 1. Detener en memoria
    await stopAndRemoveBot(botId);

    // 2. Limpiar webhook de Telegram
    try {
      const tempBot = new Telegraf(bot.token);
      await tempBot.telegram.callApi('deleteWebhook', { drop_pending_updates: true });
      await tempBot.telegram.callApi('setWebhook', { url: '' });
    } catch (e) {
      console.log("Error limpiando webhook:", e.message);
    }

    // 3. Usar API directa de Telegram como respaldo
    try {
      await axios.post(`https://api.telegram.org/bot${bot.token}/deleteWebhook`, {
        drop_pending_updates: true
      });
      await axios.post(`https://api.telegram.org/bot${bot.token}/setWebhook`, {
        url: ''
      });
    } catch (e) {
      console.log("Error con API directa:", e.message);
    }

    // 4. Actualizar BD
    await supabase
      .from('bots')
      .update({ status: 'inactive' })
      .eq('id', botId);

    return NextResponse.json({
      success: true,
      message: "✅ Bot detenido forzosamente"
    });

  } catch (error) {
    console.error("Error en force-stop:", error);
    return NextResponse.json(
      { error: "Error al detener el bot" },
      { status: 500 }
    );
  }
}