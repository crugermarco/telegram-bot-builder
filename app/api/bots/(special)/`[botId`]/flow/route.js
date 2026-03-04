import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import jwt from "jsonwebtoken";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request, { params }) {
  try {
    // ========== 1. VERIFICAR AUTENTICACIÓN ==========
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "secret");
    const userId = decoded.userId;
    const botId = params.botId;

    // ========== 2. VERIFICAR QUE EL BOT PERTENECE AL USUARIO ==========
    const { data: bot, error } = await supabase
      .from('bots')
      .select('flow, user_id')
      .eq('id', botId)
      .single();

    if (error) {
      console.error("Error en GET /flow (special):", error);
      return NextResponse.json({ error: "Error al obtener el flow" }, { status: 500 });
    }

    if (!bot) {
      return NextResponse.json({ error: "Bot no encontrado" }, { status: 404 });
    }

    if (bot.user_id !== userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // ========== 3. DEVOLVER EL FLOW ==========
    const flow = bot?.flow || { nodes: [], edges: [] };
    
    return NextResponse.json({ flow });

  } catch (error) {
    console.error("Error en GET /flow (special):", error);
    return NextResponse.json({ 
      error: error.message,
      flow: { nodes: [], edges: [] } 
    }, { status: 500 });
  }
}