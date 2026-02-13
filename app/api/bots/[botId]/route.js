import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';

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

    console.log("🔍 Buscando bot:", botId, "para usuario:", userId);

    const { data: bot, error } = await supabase
      .from('bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    if (error || !bot) {
      console.error("❌ Bot no encontrado:", error);
      return NextResponse.json({ error: "Bot no encontrado" }, { status: 404 });
    }

    console.log("✅ Bot encontrado:", bot.name);
    return NextResponse.json({ bot });
    
  } catch (error) {
    console.error("❌ Error en GET /api/bots/[botId]:", error);
    return NextResponse.json(
      { error: "Error al obtener el bot" },
      { status: 500 }
    );
  }
}