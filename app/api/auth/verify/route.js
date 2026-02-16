import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value || 
                  request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "secret-key-2024");
    
    // Buscar usuario en Supabase en lugar de Prisma
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      console.error("Error buscando usuario:", error);
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
    }

    // Eliminar password del objeto user antes de enviarlo
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Error en verify:", error);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}