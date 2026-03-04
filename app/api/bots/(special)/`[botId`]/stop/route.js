import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Referencia a los bots activos
const activeBots = global.activeBots || new Map();
global.activeBots = activeBots;

// Función para verificar autenticación (reutilizable)
async function getUserFromToken(request) {
  const token = request.cookies.get("token")?.value ||
                request.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "secret");
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(request, { params }) {
  try {
    // ========== 1. VERIFICAR AUTENTICACIÓN ==========
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const botId = params.botId;

    // ========== 2. VERIFICAR QUE EL BOT EXISTE Y PERTENECE AL USUARIO ==========
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    if (botError || !bot) {
      return NextResponse.json({ error: "Bot no encontrado" }, { status: 404 });
    }

    // ========== 3. DETENER BOT SI ESTÁ ACTIVO ==========
    if (activeBots.has(botId)) {
      const botService = activeBots.get(botId);
      
      // Dependiendo de cómo implementaste el bot:
      if (botService && typeof botService.stop === 'function') {
        await botService.stop();
      } else if (botService && typeof botService.close === 'function') {
        await botService.close();
      } else if (botService && typeof botService.terminate === 'function') {
        botService.terminate();
      }
      
      activeBots.delete(botId);
    }

    // ========== 4. ACTUALIZAR ESTADO EN SUPABASE ==========
    const { error: updateError } = await supabase
      .from('bots')
      .update({ 
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', botId);

    if (updateError) {
      console.error("Error actualizando estado:", updateError);
    }

    return NextResponse.json({ 
      message: "✅ Bot detenido correctamente",
      status: "inactive"
    });

  } catch (error) {
    console.error("Error deteniendo bot:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}