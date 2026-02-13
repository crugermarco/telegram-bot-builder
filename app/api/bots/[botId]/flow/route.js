// app/api/bots/[botId]/flow/route.js
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

export async function GET(request, { params }) {
  try {
    const { data: bot, error } = await supabase
      .from('bots')
      .select('flow')
      .eq('id', params.botId)
      .single();

    if (error) throw error;
    
    // Asegurar que flow siempre tenga nodes y edges
    const flow = bot?.flow || { nodes: [], edges: [] };
    return NextResponse.json({ flow });
  } catch (error) {
    return NextResponse.json({ flow: { nodes: [], edges: [] } });
  }
}

export async function POST(request, { params }) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nodes, edges } = await request.json();

    // Verificar que el bot pertenece al usuario
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('user_id')
      .eq('id', params.botId)
      .single();

    if (botError || !bot || bot.user_id !== userId) {
      return NextResponse.json({ error: "Bot no encontrado" }, { status: 404 });
    }

    // Guardar flow - IMPORTANTE: Enviar como objeto, no string
    const { error } = await supabase
      .from('bots')
      .update({ 
        flow: { nodes, edges },  // ← Esto es un objeto, no string
        updated_at: new Date()
      })
      .eq('id', params.botId);

    if (error) {
      console.error("Error de Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "✅ Flow guardado correctamente" });
  } catch (error) {
    console.error("Error guardando flow:", error);
    return NextResponse.json({ 
      error: "Error al guardar el flow: " + error.message 
    }, { status: 500 });
  }
}