import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Referencia a los bots activos (debe ser la misma que en start)
const activeBots = new Map();

export async function POST(request, { params }) {
  try {
    // ========== 1. VERIFICAR AUTENTICACIÓN ==========
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

    // ========== 2. VERIFICAR QUE EL BOT EXISTE Y PERTENECE AL USUARIO ==========
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    if (botError || !bot) {
      return NextResponse.json(
        { error: "Bot no encontrado" },
        { status: 404 }
      );
    }

    // ========== 3. DETENER INSTANCIA DEL BOT SI EXISTE ==========
    if (activeBots.has(botId)) {
      const botService = activeBots.get(botId);
      try {
        await botService.stop();
      } catch (e) {
        console.error("Error deteniendo bot:", e);
      }
      activeBots.delete(botId);
    }

    // ========== 4. ACTUALIZAR ESTADO EN BASE DE DATOS ==========
    const { error: updateError } = await supabase
      .from('bots')
      .update({ 
        status: 'inactive', 
        updated_at: new Date().toISOString()
      })
      .eq('id', botId);

    if (updateError) {
      throw updateError;
    }

    // ========== 5. RESPONDER CON ÉXITO ==========
    return NextResponse.json({
      success: true,
      message: "✅ Bot detenido correctamente",
      botId: bot.id,
      status: 'inactive'
    });

  } catch (error) {
    console.error("Error en stop:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al detener el bot: " + error.message },
      { status: 500 }
    );
  }
}