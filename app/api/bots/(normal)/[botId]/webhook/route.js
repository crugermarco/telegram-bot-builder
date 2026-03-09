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
      const user = body.message.from;
      
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
      await processMessage(chatId, userId, text, nodes, edges, bot.token, user);
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en webhook:", error);
    return NextResponse.json({ ok: true }); // Siempre responder ok a Telegram
  }
}

async function processMessage(chatId, userId, text, nodes, edges, botToken, user) {
  try {
    // Obtener o crear estado de conversación con variables iniciales
    let state = conversationState.get(userId) || { 
      currentNodeId: null,
      waitingFor: null,
      variables: {
        // Variables iniciales del usuario
        nombre: user.first_name || '',
        apellido: user.last_name || '',
        username: user.username || '',
        id: user.id.toString(),
        // Variables del sistema
        fecha: new Date().toLocaleDateString('es-ES'),
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      }
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
        console.log(`🎯 Nodo inicial: ${currentNode.type} (${currentNode.id})`);
      }
    } else {
      currentNode = nodes.find(node => node.id === state.currentNodeId);
    }
    
    if (!currentNode) {
      await sendTelegramMessage(chatId, "No hay nodos configurados", botToken);
      return;
    }
    
    // Actualizar fecha/hora en cada mensaje
    state.variables.fecha = new Date().toLocaleDateString('es-ES');
    state.variables.hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
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
  
  console.log(`🔄 Procesando nodo: ${currentNode.type} (${currentNode.id})`);
  
  switch (currentNode.type) {
    case "text":
      // Enviar mensaje de texto con variables
      const textContent = replaceVariables(currentNode.data.content || "Mensaje de texto", state.variables);
      await sendTelegramMessage(chatId, textContent, botToken);
      
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
          // 🟢 GUARDAR VARIABLES DE RESPUESTA
          state.variables.respuesta = selectedOption;
          state.variables.ultimo_mensaje = selectedOption;
          console.log(`📦 Variables guardadas: respuesta = ${selectedOption}`);
          
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
        // PRIMERO: Mostrar el mensaje del nodo con variables
        if (currentNode.data.mensaje) {
          const mensajeProcesado = replaceVariables(currentNode.data.mensaje, state.variables);
          await sendTelegramMessage(chatId, mensajeProcesado, botToken);
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
        // 🟢 GUARDAR LA RESPUESTA EN LA VARIABLE CORRESPONDIENTE
        const respuesta = userMessage;
        const variableGuardar = currentNode.data.variableGuardar;
        
        if (variableGuardar) {
          state.variables[variableGuardar] = respuesta;
          console.log(`📦 Variable guardada: ${variableGuardar} = ${respuesta}`);
          console.log(`📦 Variables actuales:`, state.variables);
        }
        
        // Procesar mensaje de confirmación con variables
        let confirmacion = currentNode.data.mensajeConfirmacion || "¡Gracias!";
        confirmacion = replaceVariables(confirmacion, state.variables);
        await sendTelegramMessage(chatId, confirmacion, botToken);
        
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
      } else {
        const preguntaProcesada = replaceVariables(currentNode.data.pregunta || "¿Cuál es tu nombre?", state.variables);
        await sendTelegramMessage(chatId, preguntaProcesada, botToken);
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
      // 🟢 GUARDAR VARIABLE CON SU VALOR
      if (currentNode.data.variableName) {
        const valorProcesado = replaceVariables(currentNode.data.variableValue || '', state.variables);
        state.variables[currentNode.data.variableName] = valorProcesado;
        console.log(`📦 Variable seteada: ${currentNode.data.variableName} = ${valorProcesado}`);
      }
      
      await sendTelegramMessage(chatId, `Variable ${currentNode.data.variableName || ''} guardada`, botToken);
      
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
      console.log(`📊 INTENTANDO guardar en Google Sheets...`);
      console.log(`📊 Datos del nodo:`, JSON.stringify(currentNode.data, null, 2));
      console.log(`📊 Variables disponibles:`, state.variables);
      
      await callGoogleSheets(chatId, currentNode.data, userId, botToken, state.variables);
      
      // Avanzar al siguiente nodo
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

// ========== FUNCIÓN PARA GOOGLE SHEETS ==========
async function callGoogleSheets(chatId, data, userId, botToken, variables) {
  const { appsScriptUrl, sheetName = 'Hoja1' } = data;
  
  try {
    if (!appsScriptUrl) {
      console.error(`❌ Google Sheets: URL del Web App no configurada`);
      await sendTelegramMessage(chatId, "❌ Google Sheets: URL no configurada", botToken);
      return;
    }

    console.log(`📊 Enviando a Google Sheets: ${appsScriptUrl}`);
    console.log(`📊 Variables disponibles:`, JSON.stringify(variables, null, 2));
    
    // Preparar payload con todas las variables
    const payload = {
      ...variables,
      timestamp: new Date().toISOString(),
      user_id: userId,
      sheet_name: sheetName
    };
    
    console.log(`📊 Payload enviado:`, JSON.stringify(payload, null, 2));

    // Enviar a Google Sheets
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log(`📊 Respuesta de Google Sheets:`, result);

    if (result.success) {
      await sendTelegramMessage(chatId, `✅ Datos guardados correctamente en ${sheetName}`, botToken);
    } else {
      throw new Error(result.error || 'Error desconocido');
    }

  } catch (error) {
    console.error(`❌ Error en Google Sheets:`, error.message);
    await sendTelegramMessage(chatId, `❌ Error al guardar: ${error.message}`, botToken);
  }
}

// ========== FUNCIÓN PARA REEMPLAZAR VARIABLES EN TEXTOS ==========
function replaceVariables(text, variables = {}) {
  if (!text) return text;
  
  let result = text;
  
  // Reemplazar todas las variables {{nombre}} por su valor
  Object.entries(variables).forEach(([key, val]) => {
    result = result.replaceAll(`{{${key}}}`, val?.toString() || '');
  });
  
  return result;
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