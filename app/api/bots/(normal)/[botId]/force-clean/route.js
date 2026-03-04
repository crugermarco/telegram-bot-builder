import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
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
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "secret-key-2024");
    const userId = decoded.userId;
    const botId = params.botId;

    const { data: bot } = await supabase
      .from('bots')
      .select('token')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    if (!bot) {
      return NextResponse.json({ error: "Bot no encontrado" }, { status: 404 });
    }

    console.log(`🧹 LIMPIEZA DE EMERGENCIA para bot ${botId}`);

    // 1. Detener en memoria
    await stopAndRemoveBot(botId);

    // 2. Limpiar webhook con API directa
    await axios.get(
      `https://api.telegram.org/bot${bot.token}/deleteWebhook?drop_pending_updates=true`
    );
    
    await axios.post(
      `https://api.telegram.org/bot${bot.token}/setWebhook`,
      { url: '' }
    );

    // 3. Obtener y limpiar updates
    const updates = await axios.get(
      `https://api.telegram.org/bot${bot.token}/getUpdates`
    );
    
    if (updates.data.result?.length > 0) {
      const lastId = updates.data.result[updates.data.result.length - 1].update_id;
      await axios.get(
        `https://api.telegram.org/bot${bot.token}/getUpdates`,
        { params: { offset: lastId + 1 } }
      );
    }

    // 4. Actualizar BD a inactive
    await supabase
      .from('bots')
      .update({ status: 'inactive' })
      .eq('id', botId);

    return NextResponse.json({
      success: true,
      message: "✅ Limpieza forzada completada. Ahora puedes intentar iniciar el bot."
    });

  } catch (error) {
    console.error("Error en limpieza:", error);
    return NextResponse.json(
      { error: "Error en limpieza: " + error.message },
      { status: 500 }
    );
  }
}