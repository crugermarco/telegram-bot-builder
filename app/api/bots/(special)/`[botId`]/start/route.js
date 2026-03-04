import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Telegraf } from 'telegraf';
import { createClient } from '@supabase/supabase-js';

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapa de bots activos
const activeBots = global.activeBots || new Map();
global.activeBots = activeBots;

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
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const botId = params.botId;

    // Verificar bot
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    if (botError || !bot) {
      return NextResponse.json({ error: "Bot no encontrado" }, { status: 404 });
    }

    // Si ya está activo, no iniciar de nuevo
    if (activeBots.has(botId)) {
      return NextResponse.json({ 
        message: "El bot ya está en ejecución",
        status: "active"
      });
    }

    // Crear instancia del bot
    const botInstance = new Telegraf(bot.token);
    
    // Configurar comandos básicos (opcional)
    botInstance.start((ctx) => ctx.reply('¡Bot iniciado!'));
    botInstance.help((ctx) => ctx.reply('Comandos disponibles: /start, /help'));

    // Guardar referencia
    activeBots.set(botId, botInstance);

    // Iniciar bot (polling)
    botInstance.launch()
      .catch(error => {
        console.error(`Error lanzando bot ${botId}:`, error);
        activeBots.delete(botId);
      });

    // Actualizar estado
    await supabase
      .from('bots')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', botId);

    return NextResponse.json({ 
      message: "✅ Bot iniciado correctamente",
      status: "active"
    });

  } catch (error) {
    console.error("Error iniciando bot:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}