import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // ⚠️ PERMITIR SIEMPRE LAS APIs DE AUTENTICACIÓN
  if (path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // 🆕 PERMITIR WEBHOOKS DE TELEGRAM (SIN AUTENTICACIÓN)
  // Los webhooks de Telegram necesitan ser públicos
  if (path.includes('/api/bots/') && path.includes('/webhook')) {
    console.log(`🔓 Webhook público accesible: ${path}`);
    return NextResponse.next();
  }

  // PERMITIR SIEMPRE PÁGINAS PÚBLICAS
  const isPublicPath = path === "/" || 
                      path === "/login" || 
                      path === "/register";

  if (isPublicPath) {
    return NextResponse.next();
  }

  // RUTAS PROTEGIDAS - VERIFICAR TOKEN
  const token = request.cookies.get("token")?.value;
  
  if (!token) {
    console.log(`⚠️ Acceso no autorizado a ruta protegida: ${path}`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "secret-key-2024"
    );
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.log(`❌ Token inválido o expirado: ${path}`);
    // Token inválido o expirado - ELIMINAR COOKIE
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',  // SOLO PROTEGE EL DASHBOARD
    '/api/:path*'         // APIs (excepto auth y webhooks)
  ]
};
