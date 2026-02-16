import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
import { isBotActive } from "@/lib/telegram/activeBots";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request, { params }) {
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

    console.log(`🔍 Buscando bot: ${botId} para usuario: ${userId}`);

    const { data: bot, error } = await supabase
      .from('bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    if (error || !bot) {
      console.error("Error obteniendo bot:", error);
      return NextResponse.json(
        { error: "Bot no encontrado" },
        { status: 404 }
      );
    }

    // Verificar estado real en memoria
    const realmenteActivo = isBotActive(botId);
    let estadoCorrecto = bot.status;
    
    // Corregir discrepancia si es necesario
    if (bot.status === 'active' && !realmenteActivo) {
      console.log(`⚠️ Corrigiendo bot ${bot.id}: activo en DB pero inactivo en memoria`);
      await supabase
        .from('bots')
        .update({ status: 'inactive' })
        .eq('id', bot.id);
      estadoCorrecto = 'inactive';
    }
    
    if (bot.status === 'inactive' && realmenteActivo) {
      console.log(`⚠️ Corrigiendo bot ${bot.id}: inactivo en DB pero activo en memoria`);
      await supabase
        .from('bots')
        .update({ status: 'active' })
        .eq('id', bot.id);
      estadoCorrecto = 'active';
    }

    console.log(`✅ Bot encontrado: ${bot.name} (estado: ${estadoCorrecto})`);

    // Devolver el bot con el estado corregido
    return NextResponse.json({ 
      bot: { ...bot, status: estadoCorrecto }
    });

  } catch (error) {
    console.error("Error en GET /api/bots/[botId]:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al cargar el bot" },
      { status: 500 }
    );
  }
}