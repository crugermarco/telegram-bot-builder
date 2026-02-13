import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { message } = await request.json();
    
    let response = "✅ Recibido: " + message;
    
    if (message.toLowerCase().includes("hola")) {
      response = "¡Hola! ¿Cómo estás?";
    } else if (message.toLowerCase().includes("gracias")) {
      response = "¡De nada!";
    }

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}