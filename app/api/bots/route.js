import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';
import { isBotActive } from "@/lib/telegram/activeBots";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request) {
  try {
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

    console.log(`🔍 Buscando bots para usuario: ${userId}`);

    const { data: bots, error } = await supabase
      .from('bots')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching bots:", error);
      return NextResponse.json(
        { error: "Error al cargar los bots" },
        { status: 500 }
      );
    }

    // Sincronizar estado REAL con base de datos
    const syncedBots = await Promise.all(bots.map(async (bot) => {
      const realmenteActivo = isBotActive(bot.id);
      let estadoCorrecto = bot.status;
      
      // Si hay discrepancia, corregir en base de datos
      if (bot.status === 'active' && !realmenteActivo) {
        console.log(`⚠️ Corrigiendo bot ${bot.id}: activo en DB pero inactivo en memoria`);
        await supabase
          .from('bots')
          .update({ status: 'inactive' })
          .eq('id', bot.id);
        estadoCorrecto = 'inactive';
      }
      
      if (bot.status === 'inactive' && realmenteActivo) {
        console.log(`⚠️ Corrigiendo bot ${bot.id}: inactivo en DB pero activo en memoria`);
        await supabase
          .from('bots')
          .update({ status: 'active' })
          .eq('id', bot.id);
        estadoCorrecto = 'active';
      }
      
      return { ...bot, status: estadoCorrecto };
    }));

    console.log(`✅ Encontrados ${syncedBots.length} bots:`);
    syncedBots.forEach(b => console.log(`  • ${b.name}: ${b.status}`));

    return NextResponse.json({ 
      bots: syncedBots,
      count: syncedBots.length 
    });

  } catch (error) {
    console.error("Error en GET /api/bots:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al cargar los bots" },
      { status: 500 }
    );
  }
}