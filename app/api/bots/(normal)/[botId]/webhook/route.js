import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const conversationState = new Map();
// ========== NUEVO: Caché para Gemini ==========
const geminiCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hora en milisegundos
const requestTracker = new Map(); // Para tracking de solicitudes duplicadas

export async function POST(request, { params }) {
  try {
    const botId = params.botId;
    const body = await request.json();
    
    console.log(`📨 Webhook recibido para bot ${botId}:`, body);
    
    if (body.message) {
      const chatId = body.message.chat.id;
      const userId = body.message.from.id.toString();
      const text = body.message.text || "";
      const user = body.message.from;
      
      console.log(`💬 Mensaje de ${userId}: ${text}`);
      
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
      
      await processMessage(chatId, userId, text, nodes, edges, bot.token, user);
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en webhook:", error);
    return NextResponse.json({ ok: true });
  }
}

async function processMessage(chatId, userId, text, nodes, edges, botToken, user) {
  try {
    let state = conversationState.get(userId) || { 
      currentNodeId: null,
      waitingFor: null,
      variables: {
        nombre: user.first_name || '',
        apellido: user.last_name || '',
        username: user.username || '',
        id: user.id.toString(),
        fecha: new Date().toLocaleDateString('es-ES'),
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      },
      // ========== NUEVO: Tracking de mensajes procesados ==========
      lastProcessedMessage: null,
      lastProcessedNode: null,
      lastProcessedTime: null
    };
    
    let currentNode = null;
    
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
    
    state.variables.fecha = new Date().toLocaleDateString('es-ES');
    state.variables.hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    await processNode(chatId, userId, currentNode, nodes, edges, botToken, state, text);
    
    conversationState.set(userId, state);
    
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    await sendTelegramMessage(chatId, "Error procesando mensaje", botToken);
  }
}

async function callGeminiAI(personality, knowledge, userMessage, variables, currentNode) {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        console.error("❌ GEMINI_API_KEY no configurada");
        return {
          response: "Lo siento, el servicio de IA no está configurado correctamente.",
          intent: "default"
        };
      }
  
      // Crear una clave única para esta solicitud
      const cacheKey = `${personality.substring(0, 100)}-${knowledge.substring(0, 100)}-${userMessage}-${JSON.stringify(variables)}`;
      
      // Verificar si ya tenemos esta respuesta en caché
      if (geminiCache.has(cacheKey)) {
        const cached = geminiCache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          console.log(`🔄 Usando respuesta en caché para: "${userMessage.substring(0, 30)}..."`);
          return cached.data;
        } else {
          geminiCache.delete(cacheKey);
        }
      }
  
      // Obtener las intenciones del nodo actual para pasarlas a Gemini
      const intentsList = currentNode?.data?.intents?.join(', ') || 'Ventas, Soporte, Saludo, Despedida, Reclamo, default';
  
      const prompt = `
  ${personality}
  
  Información del negocio:
  ${knowledge}
  
  Variables de la conversación:
  ${JSON.stringify(variables, null, 2)}
  
  Mensaje del usuario: "${userMessage}"
  
  Analiza el mensaje del usuario y responde de manera natural y útil basándote en la información proporcionada.
  
  IMPORTANTE: Tu respuesta DEBE ser un objeto JSON con dos campos:
  1. "response": tu respuesta al usuario (texto natural)
  2. "intent": la intención detectada (una de las siguientes: ${intentsList})
  
  Ejemplo de formato de respuesta:
  {
    "response": "¡Hola! ¿En qué puedo ayudarte hoy?",
    "intent": "Saludo"
  }
  
  Responde SOLO con el objeto JSON, sin texto adicional.
  `;
  
      console.log(`🤖 Enviando prompt a Gemini AI usando modelo gemini-2.5-flash...`);
  
      // ========== CAMBIO IMPORTANTE: usar gemini-2.5-flash ==========
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        console.error("❌ Error de Gemini API:", data);
        
        // Manejo específico de error de cuota
        if (data.error?.message?.includes('Quota exceeded') || data.error?.message?.includes('quota')) {
          console.warn("⚠️ Cuota de Gemini excedida. Usando respuesta de respaldo.");
          return {
            response: "Lo siento, el servicio de IA está muy solicitado en este momento. Por favor, intenta de nuevo en unos minutos.",
            intent: "default"
          };
        }
        
        throw new Error(data.error?.message || 'Error desconocido');
      }
  
      const aiText = data.candidates[0].content.parts[0].text;
      console.log(`🤖 Respuesta de Gemini:`, aiText);
  
      let result;
      try {
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
          result = {
            response: result.response || "No pude procesar tu mensaje.",
            intent: result.intent || "default"
          };
        } else {
          result = {
            response: aiText,
            intent: "default"
          };
        }
      } catch (parseError) {
        console.error("❌ Error parseando respuesta de Gemini:", parseError);
        result = {
          response: aiText,
          intent: "default"
        };
      }
      
      // Guardar en caché
      geminiCache.set(cacheKey, {
        timestamp: Date.now(),
        data: result
      });
      
      return result;
  
    } catch (error) {
      console.error("❌ Error en callGeminiAI:", error);
      
      // Respuesta de fallback amigable
      return {
        response: "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.",
        intent: "default"
      };
    }
}

async function processNode(chatId, userId, currentNode, nodes, edges, botToken, state, userMessage = null) {
  
  console.log(`🔄 Procesando nodo: ${currentNode.type} (${currentNode.id})`);
  
  switch (currentNode.type) {
    case "text":
      const textContent = replaceVariables(currentNode.data.content || "Mensaje de texto", state.variables);
      await sendTelegramMessage(chatId, textContent, botToken);
      
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
        const selectedOption = userMessage;
        const optionIndex = currentNode.data.options.findIndex(opt => opt === selectedOption);
        
        if (optionIndex !== -1) {
          state.variables.respuesta = selectedOption;
          state.variables.ultimo_mensaje = selectedOption;
          console.log(`📦 Variables guardadas: respuesta = ${selectedOption}`);
          
          await sendTelegramMessage(chatId, `Seleccionaste: ${selectedOption}`, botToken);
          
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
        if (currentNode.data.mensaje) {
          const mensajeProcesado = replaceVariables(currentNode.data.mensaje, state.variables);
          await sendTelegramMessage(chatId, mensajeProcesado, botToken);
        }
        
        const keyboard = {
          reply_markup: {
            keyboard: currentNode.data.options.map(opt => [opt]),
            one_time_keyboard: true,
            resize_keyboard: true
          }
        };
        
        await sendTelegramMessage(chatId, "Elige una opción:", botToken, keyboard);
        state.waitingFor = "button_response";
      }
      break;
      
    case "preguntar":
      if (state.waitingFor === "question_response") {
        const respuesta = userMessage;
        const variableGuardar = currentNode.data.variableGuardar;
        
        if (variableGuardar) {
          state.variables[variableGuardar] = respuesta;
          console.log(`📦 Variable guardada: ${variableGuardar} = ${respuesta}`);
          console.log(`📦 Variables actuales:`, state.variables);
        }
        
        let confirmacion = currentNode.data.mensajeConfirmacion || "¡Gracias!";
        confirmacion = replaceVariables(confirmacion, state.variables);
        await sendTelegramMessage(chatId, confirmacion, botToken);
        
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
      
      const nextEdgeAfterSheet = edges.find(edge => edge.source === currentNode.id);
      if (nextEdgeAfterSheet) {
        state.currentNodeId = nextEdgeAfterSheet.target;
        const nextNode = nodes.find(node => node.id === nextEdgeAfterSheet.target);
        if (nextNode) {
          await processNode(chatId, userId, nextNode, nodes, edges, botToken, state);
        }
      }
      break;
      
    case "imagetext":
      const imageUrl = currentNode.data.imageUrl;
      const caption = replaceVariables(currentNode.data.caption || "", state.variables);
      
      if (imageUrl) {
        console.log(`🖼️ Enviando imagen: ${imageUrl}`);
        await sendTelegramPhoto(chatId, imageUrl, caption, botToken);
      } else {
        await sendTelegramMessage(chatId, caption || "Imagen no disponible", botToken);
      }
      
      const nextEdgeImage = edges.find(edge => edge.source === currentNode.id);
      if (nextEdgeImage) {
        state.currentNodeId = nextEdgeImage.target;
        state.waitingFor = null;
        
        const nextNode = nodes.find(node => node.id === nextEdgeImage.target);
        if (nextNode) {
          await processNode(chatId, userId, nextNode, nodes, edges, botToken, state);
        }
      }
      break;
      
    case "imagebuttons":
      if (state.waitingFor === "button_response") {
        const selectedOption = userMessage;
        const optionIndex = currentNode.data.options.findIndex(opt => opt === selectedOption);
        
        if (optionIndex !== -1) {
          state.variables.respuesta = selectedOption;
          state.variables.ultimo_mensaje = selectedOption;
          console.log(`📦 Variables guardadas: respuesta = ${selectedOption}`);
          
          await sendTelegramMessage(chatId, `Seleccionaste: ${selectedOption}`, botToken);
          
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
        const imageUrl = currentNode.data.imageUrl;
        const caption = replaceVariables(currentNode.data.caption || "Selecciona una opción:", state.variables);
        
        if (imageUrl) {
          console.log(`🖼️ Enviando imagen con botones: ${imageUrl}`);
          await sendTelegramPhoto(chatId, imageUrl, caption, botToken);
        } else {
          await sendTelegramMessage(chatId, caption, botToken);
        }
        
        const keyboard = {
          reply_markup: {
            keyboard: currentNode.data.options.map(opt => [opt]),
            one_time_keyboard: true,
            resize_keyboard: true
          }
        };
        
        await sendTelegramMessage(chatId, "Elige una opción:", botToken, keyboard);
        state.waitingFor = "button_response";
      }
      break;
      
    // ========== NODO AI CON PROTECCIÓN DE DUPLICADOS ==========
    case "ai":
      console.log(`🤖 Procesando nodo AI...`);
      
      // ========== DETECCIÓN DE MENSAJES DUPLICADOS ==========
      // Evitar procesar el mismo mensaje múltiples veces en el mismo nodo
      const requestKey = `${userId}-${currentNode.id}-${userMessage}`;
      const now = Date.now();
      
      if (state.lastProcessedMessage === userMessage && 
          state.lastProcessedNode === currentNode.id &&
          state.lastProcessedTime && 
          (now - state.lastProcessedTime) < 5000) { // 5 segundos de ventana
        console.log(`⏭️ Mensaje duplicado detectado, ignorando para evitar llamada extra a Gemini`);
        return;
      }
      
      // Actualizar el tracking
      state.lastProcessedMessage = userMessage;
      state.lastProcessedNode = currentNode.id;
      state.lastProcessedTime = now;
      
      console.log(`🤖 Personalidad:`, currentNode.data.personality);
      console.log(`🤖 Conocimiento:`, currentNode.data.knowledge);
      console.log(`🤖 Intenciones:`, currentNode.data.intents);
      console.log(`🤖 Mensaje usuario:`, userMessage);
      
      if (state.waitingFor === "ai_response") {
        state.waitingFor = null;
      }
      
      // Pasar currentNode a la función para obtener las intenciones
      const aiResult = await callGeminiAI(
        currentNode.data.personality || "Eres un asistente amigable.",
        currentNode.data.knowledge || "",
        userMessage,
        state.variables,
        currentNode // Pasar el nodo actual
      );
      
      console.log(`🤖 Resultado AI:`, aiResult);
      
      state.variables.ai_response = aiResult.response;
      state.variables.ai_intent = aiResult.intent;
      state.variables.ultimo_mensaje = aiResult.response;
      
      await sendTelegramMessage(chatId, aiResult.response, botToken);
      
      const intentConnector = `intent-${aiResult.intent}`;
      
      const nextEdgeForIntent = edges.find(edge => 
        edge.source === currentNode.id && edge.sourceHandle === intentConnector
      );
      
      if (nextEdgeForIntent) {
        console.log(`➡️ Continuando por intención: ${aiResult.intent}`);
        state.currentNodeId = nextEdgeForIntent.target;
        state.waitingFor = null;
        
        const nextNode = nodes.find(node => node.id === nextEdgeForIntent.target);
        if (nextNode) {
          await processNode(chatId, userId, nextNode, nodes, edges, botToken, state);
        }
      } else {
        const defaultEdge = edges.find(edge => edge.source === currentNode.id && !edge.sourceHandle);
        if (defaultEdge) {
          console.log(`➡️ No se encontró conector para intención, usando default`);
          state.currentNodeId = defaultEdge.target;
          state.waitingFor = null;
          
          const nextNode = nodes.find(node => node.id === defaultEdge.target);
          if (nextNode) {
            await processNode(chatId, userId, nextNode, nodes, edges, botToken, state);
          }
        } else {
          console.log(`⚠️ No hay conectores para este nodo AI`);
        }
      }
      break;
      
    default:
      await sendTelegramMessage(chatId, "Tipo de nodo no soportado", botToken);
  }
}

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
    
    const payload = {
      ...variables,
      timestamp: new Date().toISOString(),
      user_id: userId,
      sheet_name: sheetName
    };
    
    console.log(`📊 Payload enviado:`, JSON.stringify(payload, null, 2));

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

function replaceVariables(text, variables = {}) {
  if (!text) return text;
  
  let result = text;
  
  Object.entries(variables).forEach(([key, val]) => {
    result = result.replaceAll(`{{${key}}}`, val?.toString() || '');
  });
  
  return result;
}

async function sendTelegramPhoto(chatId, photoUrl, caption, botToken) {
  try {
    console.log(`📸 Enviando foto a ${chatId}: ${photoUrl.substring(0, 50)}...`);
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption: caption || ""
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error("❌ Error enviando foto:", result);
      
      if (caption) {
        await sendTelegramMessage(chatId, `[Imagen no disponible]\n\n${caption}`, botToken);
      } else {
        await sendTelegramMessage(chatId, "Imagen no disponible", botToken);
      }
    } else {
      console.log("✅ Foto enviada correctamente");
    }
  } catch (error) {
    console.error("❌ Error en sendTelegramPhoto:", error);
    
    if (caption) {
      await sendTelegramMessage(chatId, `[Error al enviar imagen]\n\n${caption}`, botToken);
    } else {
      await sendTelegramMessage(chatId, "Error al enviar imagen", botToken);
    }
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