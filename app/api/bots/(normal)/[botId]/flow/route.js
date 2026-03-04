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
    // ========== 1. VERIFICAR AUTENTICACIÓN ==========
    const userId = await getUserFromToken(request);
    if (!userId) {
      console.log("❌ GET /flow: No autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const botId = params.botId;
    console.log(`📦 GET /flow: Buscando flow para bot ${botId}, usuario ${userId}`);

    // ========== 2. VERIFICAR QUE EL BOT EXISTE Y PERTENECE AL USUARIO ==========
    const { data: bot, error } = await supabase
      .from('bots')
      .select('flow, user_id')
      .eq('id', botId)
      .single();

    if (error) {
      console.error("❌ GET /flow: Error de Supabase:", error);
      return NextResponse.json({ error: "Error al obtener el bot" }, { status: 500 });
    }

    if (!bot) {
      console.log(`❌ GET /flow: Bot ${botId} no encontrado`);
      return NextResponse.json({ error: "Bot no encontrado" }, { status: 404 });
    }

    // ========== 3. VERIFICAR QUE EL BOT PERTENECE AL USUARIO ==========
    if (bot.user_id !== userId) {
      console.log(`❌ GET /flow: Bot ${botId} no pertenece al usuario ${userId}`);
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // ========== 4. DEVOLVER EL FLOW ==========
    console.log(`✅ GET /flow: Flow obtenido para bot ${botId}`, 
      bot.flow ? `con ${bot.flow.nodes?.length || 0} nodos` : 'vacío');
    
    // Asegurar que flow siempre tenga nodes y edges
    const flow = bot?.flow || { nodes: [], edges: [] };
    return NextResponse.json({ flow });
    
  } catch (error) {
    console.error("❌ GET /flow: Error general:", error);
    return NextResponse.json({ flow: { nodes: [], edges: [] } });
  }
}

export async function POST(request, { params }) {
  try {
    // ========== 1. VERIFICAR AUTENTICACIÓN ==========
    const userId = await getUserFromToken(request);
    if (!userId) {
      console.log("❌ POST /flow: No autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const botId = params.botId;
    const { nodes, edges } = await request.json();

    console.log(`📦 POST /flow: Guardando flow para bot ${botId}, usuario ${userId}`);
    console.log(`📊 Nodos: ${nodes?.length || 0}, Conexiones: ${edges?.length || 0}`);

    // ========== 2. VERIFICAR QUE EL BOT EXISTE Y PERTENECE AL USUARIO ==========
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('user_id')
      .eq('id', botId)
      .single();

    if (botError) {
      console.error("❌ POST /flow: Error verificando bot:", botError);
      return NextResponse.json({ error: "Error al verificar el bot" }, { status: 500 });
    }

    if (!bot) {
      console.log(`❌ POST /flow: Bot ${botId} no encontrado`);
      return NextResponse.json({ error: "Bot no encontrado" }, { status: 404 });
    }

    if (bot.user_id !== userId) {
      console.log(`❌ POST /flow: Bot ${botId} no pertenece al usuario ${userId}`);
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // ========== 3. GUARDAR FLOW ==========
    const { error } = await supabase
      .from('bots')
      .update({ 
        flow: { nodes, edges },
        updated_at: new Date().toISOString()
      })
      .eq('id', botId);

    if (error) {
      console.error("❌ POST /flow: Error de Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ POST /flow: Flow guardado correctamente para bot ${botId}`);
    return NextResponse.json({ message: "✅ Flow guardado correctamente" });
    
  } catch (error) {
    console.error("❌ POST /flow: Error general:", error);
    return NextResponse.json({ 
      error: "Error al guardar el flow: " + error.message 
    }, { status: 500 });
  }
}