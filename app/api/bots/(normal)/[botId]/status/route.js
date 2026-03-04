import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
import { isBotActive, getActiveBot } from "@/lib/telegram/activeBots";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request, { params }) {
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
      .select('status')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    const realmenteActivo = isBotActive(botId);
    const botService = getActiveBot(botId);

    return NextResponse.json({
      botId,
      databaseStatus: bot?.status || 'unknown',
      realStatus: realmenteActivo ? 'active' : 'inactive',
      isActive: realmenteActivo,
      synchronized: bot?.status === (realmenteActivo ? 'active' : 'inactive'),
      uptime: botService?.uptime ? `${Math.floor((Date.now() - botService.uptime) / 1000)}s` : null
    });

  } catch (error) {
    console.error("Error verificando estado:", error);
    return NextResponse.json(
      { error: "Error al verificar estado" },
      { status: 500 }
    );
  }
}