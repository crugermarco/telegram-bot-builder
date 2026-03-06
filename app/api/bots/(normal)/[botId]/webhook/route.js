// /api/bots/[botId]/webhook/route.js

import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import jwt from "jsonwebtoken";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Estado de conversación (en producción usa Redis o BD)
const conversationState = new Map();

export async function POST(request, { params }) {
  try {
    const botId = params.botId;
    const body = await request.json();
    
    console.log(`📨 Webhook recibido para bot ${botId}:`, body);
    
    // Verificar que es un mensaje de Telegram
    if (body.message) {
      const chatId = body.message.chat.id;
      const userId = body.message.from.id.toString();
      const text = body.message.text || "";
      
      console.log(`💬 Mensaje de ${userId}: ${text}`);
      
      // Obtener el bot y su flujo
      const { data: bot, error: botError } = await supabase
        .from('bots')
        .select('*')
        .eq('id', botId)
        .single();
      
      if (botError || !bot) {
        console.error("Bot no encontrado:", botError);
        return NextResponse.json({ ok: true });
      }
      
      const nodes = bot.flow?.nodes || [];
      const edges = bot.flow?.edges || [];
      
      // Procesar el mensaje
      await processMessage(chatId, userId, text, nodes, edges, bot.token);
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en webhook:", error);
    return NextResponse.json({ ok: true }); // Siempre responder ok a Telegram
  }
}

async function processMessage(chatId, userId, text, nodes, edges, botToken) {
  try {
    // Obtener o crear estado de conversación
    let state = conversationState.get(userId) || { 
      currentNodeId: null,
      waitingFor: null 
    };
    
    let currentNode = null;
    
    // Si es /start o no hay nodo actual, buscar nodo inicial
    if (text === "/start" || !state.currentNodeId) {
      currentNode = nodes.find(node => 
        node.type !== "condition" && node.type !== "googlesheets"
      );
      if (currentNode) {
        state.currentNodeId = currentNode.id;
        state.waitingFor = null;
      }
    } else {
      currentNode = nodes.find(node => node.id === state.currentNodeId);
    }
    
    if (!currentNode) {
      await sendTelegramMessage(chatId, "No hay nodos configurados", botToken);
      return;
    }
    
    // Procesar según tipo de nodo
    await processNode(chatId, userId, currentNode, nodes, edges, botToken, state, text);
    
    // Guardar estado actualizado
    conversationState.set(userId, state);
    
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    await sendTelegramMessage(chatId, "Error procesando mensaje", botToken);
  }
}

async function processNode(chatId, userId, currentNode, nodes, edges, botToken, state, userMessage = null) {
  
  switch (currentNode.type) {
    case "text":
      // Enviar mensaje de texto
      await sendTelegramMessage(chatId, currentNode.data.content || "Mensaje de texto", botToken);
      
      // Avanzar al siguiente nodo
      const nextEdge = edges.find(edge => edge.source === currentNode.id);
      if (nextEdge) {
        state.currentNodeId = nextEdge.target;
        state.waitingFor = null;
        
        const nextNode = nodes.find(node => node.id === nextEdge.target);
        if (nextNode) {
          await processNode(chatId, userId, nextNode, nodes, edges, botToken, state);
        }
      }
      break;
      
    case "buttons":
      if (state.waitingFor === "button_response") {
        // Usuario seleccionó una opción
        const selectedOption = userMessage;
        const optionIndex = currentNode.data.options.findIndex(opt => opt === selectedOption);
        
        if (optionIndex !== -1) {
          await sendTelegramMessage(chatId, `Seleccionaste: ${selectedOption}`, botToken);
          
          // Buscar conexión específica
          const nextEdgeForOption = edges.find(edge => 
            edge.source === currentNode.id && edge.sourceHandle === `opt${optionIndex}`
          );
          
          if (nextEdgeForOption) {
            state.currentNodeId = nextEdgeForOption.target;
            state.waitingFor = null;
            
            const nextNode = nodes.find(node => node.id === nextEdgeForOption.target);
            if (nextNode) {
              await processNode(chatId, userId, nextNode, nodes, edges, botToken, state);
            }
          }
        } else {
          await sendTelegramMessage(chatId, "Opción no válida. Elige una de las opciones:", botToken);
        }
      } else {
        // PRIMERO: Mostrar el mensaje del nodo
        if (currentNode.data.mensaje) {
          await sendTelegramMessage(chatId, currentNode.data.mensaje, botToken);
        }
        
        // SEGUNDO: Crear teclado con las opciones
        const keyboard = {
          reply_markup: {
            keyboard: currentNode.data.options.map(opt => [opt]),
            one_time_keyboard: true,
            resize_keyboard: true
          }
        };
        
        // Enviar opciones como botones
        await sendTelegramMessage(chatId, "Elige una opción:", botToken, keyboard);
        
        state.waitingFor = "button_response";
      }
      break;
      
    case "preguntar":
      if (state.waitingFor === "question_response") {
        // Guardar respuesta
        const respuesta = userMessage;
        let confirmacion = currentNode.data.mensajeConfirmacion || "¡Gracias!";
        
        // Reemplazar variables
        confirmacion = confirmacion.replace(/{{[^}]+}}/g, respuesta);
        await sendTelegramMessage(chatId, confirmacion, botToken);
        
        // Avanzar
        const nextEdge = edges.find(edge => edge.source === currentNode.id);
        if (nextEdge) {
          state.currentNodeId = nextEdge.target;
          state.waitingFor = null;
          
          const nextNode = nodes.find(node => node.id === nextEdge.target);
          if (nextNode) {
            await processNode(chatId, userId, nextNode, nodes, edges, botToken, state);
          }
        }
      } else {
        await sendTelegramMessage(chatId, currentNode.data.pregunta || "¿Cuál es tu nombre?", botToken);
        state.waitingFor = "question_response";
      }
      break;
      
    case "delay":
      await sendTelegramMessage(chatId, `⏳ Esperando ${currentNode.data.seconds || 1} segundos...`, botToken);
      
      setTimeout(async () => {
        const nextEdge = edges.find(edge => edge.source === currentNode.id);
        if (nextEdge) {
          state.currentNodeId = nextEdge.target;
          
          const nextNode = nodes.find(node => node.id === nextEdge.target);
          if (nextNode) {
            await processNode(chatId, userId, nextNode, nodes, edges, botToken, state);
          }
        }
      }, (currentNode.data.seconds || 1) * 1000);
      break;
      
    case "variable":
      await sendTelegramMessage(chatId, `Variable ${currentNode.data.variableName} guardada`, botToken);
      
      const nextEdgeAfterVar = edges.find(edge => edge.source === currentNode.id);
      if (nextEdgeAfterVar) {
        state.currentNodeId = nextEdgeAfterVar.target;
        
        const nextNode = nodes.find(node => node.id === nextEdgeAfterVar.target);
        if (nextNode) {
          await processNode(chatId, userId, nextNode, nodes, edges, botToken, state);
        }
      }
      break;
      
    case "googlesheets":
      await sendTelegramMessage(chatId, "📊 Guardando datos en Google Sheets...", botToken);
      
      const nextEdgeAfterSheet = edges.find(edge => edge.source === currentNode.id);
      if (nextEdgeAfterSheet) {
        state.currentNodeId = nextEdgeAfterSheet.target;
        
        const nextNode = nodes.find(node => node.id === nextEdgeAfterSheet.target);
        if (nextNode) {
          await processNode(chatId, userId, nextNode, nodes, edges, botToken, state);
        }
      }
      break;
      
    default:
      await sendTelegramMessage(chatId, "Tipo de nodo no soportado", botToken);
  }
}

async function sendTelegramMessage(chatId, text, botToken, extra = {}) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        ...extra
      })
    });
  } catch (error) {
    console.error("Error enviando mensaje:", error);
  }
}