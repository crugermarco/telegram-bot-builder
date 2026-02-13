import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "✅ Logout exitoso" });
  
  // ELIMINAR COOKIE
  response.cookies.delete("token");
  
  return response;
}