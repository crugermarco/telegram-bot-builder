import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import jwt from "jsonwebtoken";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request) {  // ← Quitamos { params }
  try {
    // ========== 1. VERIFICAR AUTENTICACIÓN ==========
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "secret");
    const userId = decoded.userId;

    // ========== 2. OBTENER TODOS LOS BOTS DEL USUARIO ==========
    const { data: bots, error } = await supabase
      .from('bots')
      .select('id, name, flow, status')
      .eq('user_id', userId);

    if (error) {
      console.error("Error en GET /bots/flow:", error);
      return NextResponse.json({ error: "Error al obtener los bots" }, { status: 500 });
    }

    // ========== 3. DEVOLVER LISTA DE BOTS CON SUS FLOWS ==========
    return NextResponse.json({ bots });

  } catch (error) {
    console.error("Error en GET /bots/flow:", error);
    return NextResponse.json({ 
      error: error.message,
      bots: [] 
    }, { status: 500 });
  }
}