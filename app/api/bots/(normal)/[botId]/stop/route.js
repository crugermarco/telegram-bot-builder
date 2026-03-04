import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { 
  isBotActive, 
  stopAndRemoveBot
} from "@/lib/telegram/activeBots";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    console.log(`🛑 Intentando detener bot ${botId}...`);

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
    let stopped = false;
    if (isBotActive(botId)) {
      console.log(`⚠️ Deteniendo instancia en memoria...`);
      stopped = await stopAndRemoveBot(botId);
      console.log(`✅ Bot detenido: ${stopped}`);
    } else {
      console.log(`ℹ️ No hay instancia en memoria para detener`);
    }

    // ========== 4. LIMPIEZA EN TELEGRAM ==========
    try {
      await axios.get(
        `https://api.telegram.org/bot${bot.token}/deleteWebhook?drop_pending_updates=true`
      );
      console.log(`✅ Webhook eliminado en Telegram`);
    } catch (e) {
      console.log(`⚠️ Error limpiando webhook:`, e.message);
    }

    // ========== 5. ACTUALIZAR ESTADO EN BASE DE DATOS ==========
    console.log(`📝 ACTUALIZANDO ESTADO EN BD a 'inactive'...`);
    
    const { error: updateError, data: updatedData } = await supabase
      .from('bots')
      .update({ 
        status: 'inactive', 
        updated_at: new Date().toISOString()
      })
      .eq('id', botId)
      .select();

    if (updateError) {
      console.error("❌ Error actualizando estado:", updateError);
      throw updateError;
    }

    console.log(`✅ Estado actualizado:`, updatedData);

    // ========== 6. VERIFICAR QUE EL ESTADO SE ACTUALIZÓ ==========
    const { data: verifyBot } = await supabase
      .from('bots')
      .select('status')
      .eq('id', botId)
      .single();

    console.log(`🔍 VERIFICACIÓN - Estado en BD: ${verifyBot?.status}`);

    // ========== 7. RESPONDER CON ÉXITO ==========
    return NextResponse.json({
      success: true,
      message: stopped ? "✅ Bot detenido correctamente" : "✅ Estado actualizado a inactivo",
      botId: bot.id,
      status: 'inactive' // ← ENVIAMOS 'inactive' EXPLÍCITAMENTE
    });

  } catch (error) {
    console.error("❌ Error en stop:", error);
    
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