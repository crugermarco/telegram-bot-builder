import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import TelegramBotService from "@/lib/telegram/bot";

// Almacenar instancias activas
const activeBots = new Map();

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

    // Verificar que tiene token
    if (!bot.token) {
      return NextResponse.json({ error: "El bot no tiene token de Telegram" }, { status: 400 });
    }

    // Verificar que tiene flow
    if (!bot.flow || bot.flow === "{}") {
      return NextResponse.json({ error: "El bot no tiene un flow configurado" }, { status: 400 });
    }

    // Detener instancia anterior si existe
    if (activeBots.has(botId)) {
      const oldBot = activeBots.get(botId);
      await oldBot.stop();
      activeBots.delete(botId);
    }

    // Crear y iniciar nuevo bot
    const botService = new TelegramBotService(bot.token, botId);
    const started = await botService.start();

    if (started) {
      activeBots.set(botId, botService);
      return NextResponse.json({ message: "✅ Bot iniciado correctamente en Telegram" });
    } else {
      return NextResponse.json({ error: "Error al iniciar el bot" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error iniciando bot:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
