import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Referencia a los bots activos (debe ser la misma que en start)
const activeBots = global.activeBots || new Map();
global.activeBots = activeBots;

export async function POST(request, { params }) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "secret");
    const userId = decoded.userId;
    const botId = params.botId;

    // Verificar bot
    const bot = await prisma.bot.findFirst({
      where: { 
        id: botId,
        userId: userId 
      }
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot no encontrado" }, { status: 404 });
    }

    // Detener bot si está activo
    if (activeBots.has(botId)) {
      const botService = activeBots.get(botId);
      await botService.stop();
      activeBots.delete(botId);
    }

    // Actualizar estado en DB
    await prisma.bot.update({
      where: { id: botId },
      data: { status: "inactive" }
    });

    return NextResponse.json({ message: "✅ Bot detenido correctamente" });
  } catch (error) {
    console.error("Error deteniendo bot:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
