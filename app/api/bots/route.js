import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getUserFromToken(request) {
  const token = request.cookies.get("token")?.value ||
                request.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "secret-key-2024");
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("🔍 Buscando bots para usuario:", userId);

    // CONSULTA CORREGIDA - IMPORTANTE: así se hace en Supabase
    const { data: bots, error } = await supabase
      .from('bots')
      .select('*')
      .eq('user_id', userId)  // <- filtrar por usuario logueado
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ Error de Supabase:", error);
      throw error;
    }

    console.log(`✅ Encontrados ${bots?.length || 0} bots:`, bots);

    return NextResponse.json({ bots: bots || [] });
    
  } catch (error) {
    console.error("❌ Error en GET /api/bots:", error);
    return NextResponse.json(
      { error: "Error al cargar bots: " + error.message },
      { status: 500 }
    );
  }
}