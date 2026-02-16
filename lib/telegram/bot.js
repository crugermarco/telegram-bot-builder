// lib/telegram/bot.js
import { Telegraf, Markup } from 'telegraf';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class TelegramBotService {
  constructor(token, botId) {
    if (!token) throw new Error('Token requerido');
    this.bot = new Telegraf(token);
    this.token = token;
    this.botId = botId;
    this.activeSessions = new Map();
    this.uptime = null;
    this.isRunning = false;
  }

  async start() {
    try {
      console.log(`🚀 Iniciando bot ${this.botId}...`);

      // Cargar flow del bot
      const { data: bot, error } = await supabase
        .from('bots')
        .select('flow')
        .eq('id', this.botId)
        .single();

      if (error || !bot) throw new Error('Bot no encontrado');
      if (!bot.flow?.nodes?.length) throw new Error('Bot sin nodos');

      this.flow = bot.flow;
      
      // Mapa de nodos por ID
      this.nodesMap = new Map();
      this.flow.nodes.forEach(node => this.nodesMap.set(node.id, node));

      // ========== COMANDO /START ==========
      this.bot.command('start', async (ctx) => {
        const userId = ctx.from.id.toString();
        console.log(`✅ /start recibido de ${userId}`);
        
        // Inicializar sesión
        this.activeSessions.set(userId, {
          currentNodeId: null,
          variables: {
            nombre: ctx.from.first_name || '',
            apellido: ctx.from.last_name || '',
            username: ctx.from.username || '',
            id: ctx.from.id.toString()
          },
          history: [],
          esperandoRespuesta: null
        });

        // Buscar el primer nodo de texto en el flujo
        const startNode = this.flow.nodes.find(n => n.type === 'text');
        
        if (startNode) {
          console.log(`✅ Nodo inicial encontrado: ${startNode.id}`);
          await this.processNode(ctx, startNode.id, userId);
        } else {
          await ctx.reply('¡Bienvenido! El bot está siendo configurado.');
        }
      });

      // ========== MANEJAR MENSAJES DE TEXTO - VERSIÓN CORREGIDA ==========
      this.bot.on('text', async (ctx) => {
        const userId = ctx.from.id.toString();
        let session = this.activeSessions.get(userId);
        
        if (!session) {
          session = {
            currentNodeId: null,
            variables: {
              nombre: ctx.from.first_name || '',
              apellido: ctx.from.last_name || '',
              username: ctx.from.username || '',
              id: ctx.from.id.toString()
            },
            history: [],
            esperandoRespuesta: null
          };
          this.activeSessions.set(userId, session);
        }

        console.log(`💬 Mensaje de ${userId}: ${ctx.message.text}`);
        
        // ========== MANEJAR RESPUESTAS PENDIENTES ==========
        if (session.esperandoRespuesta) {
          const respuesta = ctx.message.text;
          const { tipo, variable, mensajeConfirmacion } = session.esperandoRespuesta;
          
          if (tipo === 'preguntar') {
            // Guardar la respuesta en la variable
            session.variables[variable] = respuesta;
            console.log(`📦 Variable ${variable} guardada = ${respuesta}`);
            
            // Enviar mensaje de confirmación (procesando variables)
            const mensajeFinal = this.processVariables(
              mensajeConfirmacion || `¡Gracias! Tu respuesta ha sido guardada.`, 
              ctx.from, 
              session.variables
            );
            await ctx.reply(mensajeFinal);
            
            // Limpiar estado de espera
            session.esperandoRespuesta = null;
            
            // Continuar al siguiente nodo
            const nextNode = this.getNextNode(session.currentNodeId);
            if (nextNode) {
              console.log(`⚡ Respuesta recibida → Siguiente nodo (${nextNode})`);
              await this.processNode(ctx, nextNode, userId);
            }
            return;
          }
        }

        // Si no hay respuesta pendiente, continuar con el flujo normal
        session.variables.ultimo_mensaje = ctx.message.text;
        session.variables.respuesta = ctx.message.text;

        // ========== FLUJO AUTOMÁTICO ==========
        if (session.currentNodeId) {
          const currentNode = this.nodesMap.get(session.currentNodeId);
          
          // SI EL NODO ACTUAL ES DE TEXTO, IR AL SIGUIENTE AUTOMÁTICAMENTE
          if (currentNode?.type === 'text') {
            const nextNode = this.getNextNode(session.currentNodeId);
            if (nextNode) {
              console.log(`⚡ Texto → Siguiente nodo (${nextNode})`);
              await this.processNode(ctx, nextNode, userId);
              return;
            }
          }
        }

        // SI NO HAY FLUJO, RESPONDER CON ECO
        await ctx.reply(`Recibido: ${ctx.message.text}`);
      });

      // ========== MANEJAR CALLBACKS DE BOTONES ==========
      this.bot.on('callback_query', async (ctx) => {
        const userId = ctx.from.id.toString();
        let session = this.activeSessions.get(userId);
        
        if (!session) {
          session = {
            currentNodeId: null,
            variables: {
              nombre: ctx.from.first_name || '',
              apellido: ctx.from.last_name || '',
              username: ctx.from.username || '',
              id: ctx.from.id.toString()
            },
            history: [],
            esperandoRespuesta: null
          };
          this.activeSessions.set(userId, session);
        }

        const callbackData = ctx.callbackQuery.data;
        console.log(`🔘 Callback de ${userId}: ${callbackData}`);
        
        await ctx.answerCbQuery();
        
        // Guardar callback en variables
        session.variables.callback_data = callbackData;
        session.variables.respuesta = callbackData;
        
        console.log(`📦 Variable respuesta = ${callbackData}`);

        // ========== FLUJO AUTOMÁTICO DESDE BOTONES ==========
        if (session.currentNodeId) {
          const currentNode = this.nodesMap.get(session.currentNodeId);
          
          // SI EL NODO ACTUAL ES DE BOTONES, IR AL SIGUIENTE
          if (currentNode?.type === 'buttons') {
            const nextNode = this.getNextNode(session.currentNodeId);
            if (nextNode) {
              console.log(`⚡ Botón → Siguiente nodo (${nextNode})`);
              await this.processNode(ctx, nextNode, userId);
              return;
            }
          }
        }

        await ctx.reply(`Opción seleccionada: ${callbackData}`);
      });

      await this.bot.launch();
      
      // Registrar tiempo de inicio y estado
      this.uptime = Date.now();
      this.isRunning = true;
      
      console.log(`✅ Bot ${this.botId} ACTIVO en Telegram`);
      
      return true;

    } catch (error) {
      console.error('❌ Error en start:', error);
      throw error;
    }
  }

  async processNode(ctx, nodeId, userId) {
    const node = this.nodesMap.get(nodeId);
    if (!node) {
      console.error(`❌ Nodo ${nodeId} no encontrado`);
      return;
    }

    console.log(`🔄 Procesando nodo: ${node.type} (${nodeId})`);

    const session = this.activeSessions.get(userId);
    if (session) {
      session.currentNodeId = nodeId;
      session.history.push(nodeId);
    }

    switch (node.type) {
      case 'text':
        await this.sendTextMessage(ctx, node.data);
        break;
        
      case 'buttons':
        await this.sendButtons(ctx, node.data);
        break;
        
      case 'condition':
        await this.evaluateCondition(ctx, node.data, userId);
        break;
        
      case 'variable':
        await this.saveVariable(ctx, node.data, userId);
        break;
        
      case 'googlesheets':
        await this.callGoogleSheets(ctx, node.data, userId);
        break;
        
      case 'preguntar':
        await this.handlePreguntar(ctx, node.data, userId);
        break;
        
      case 'delay':
        await this.delay(node.data.seconds || 1);
        const nextNode = this.getNextNode(nodeId);
        if (nextNode) {
          await this.processNode(ctx, nextNode, userId);
        }
        break;
        
      default:
        console.log(`⚠️ Tipo de nodo no manejado: ${node.type}`);
    }
  }

  async sendTextMessage(ctx, data) {
    const { content, typing = false } = data;
    
    if (typing) {
      await ctx.sendChatAction('typing');
      await this.delay(1.5);
    }

    const session = this.activeSessions.get(ctx.from.id.toString());
    const processedContent = this.processVariables(content, ctx.from, session?.variables);
    
    console.log(`📤 Enviando: ${processedContent.substring(0, 50)}...`);
    await ctx.reply(processedContent);
  }

  // ========== NODO DE BOTONES SIMPLIFICADO ==========
  async sendButtons(ctx, data) {
    const { question, options = [] } = data;
    
    if (options.length === 0) {
      await ctx.reply(question || 'Selecciona una opción:');
      return;
    }

    // Normalizar valores: sin tildes, minúsculas, sin espacios
    const normalizeValue = (text) => {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    };

    // Crear teclado - el texto visible es el original, el valor es normalizado
    const keyboard = options.map(opt => {
      const normalizedValue = normalizeValue(opt);
      console.log(`🔘 Botón: "${opt}" → valor: "${normalizedValue}"`);
      return [Markup.button.callback(opt, normalizedValue)];
    });

    await ctx.reply(question || 'Selecciona una opción:', {
      ...Markup.inlineKeyboard(keyboard)
    });

    console.log(`🔘 Enviados ${options.length} botones:`, options);
  }

  // ========== NODO DE CONDICIÓN NORMALIZADO ==========
  async evaluateCondition(ctx, data, userId) {
    const session = this.activeSessions.get(userId);
    if (!session) {
      console.log('❌ No hay sesión para evaluar condición');
      return;
    }

    const variable = data.variable || 'respuesta';
    const operator = data.operator || 'equals';
    const value = data.value || '';
    
    let variableValue = session.variables[variable] || '';
    
    // Función de normalización consistente
    const normalize = (str) => {
      return String(str)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    };

    const normalizedVariable = normalize(variableValue);
    const normalizedValue = normalize(value);

    console.log('========== CONDICIÓN ==========');
    console.log(`Variable: ${variable}`);
    console.log(`Valor original: "${variableValue}"`);
    console.log(`Valor normalizado: "${normalizedVariable}"`);
    console.log(`Comparar con: "${value}" → normalizado: "${normalizedValue}"`);
    console.log(`Operador: ${operator}`);

    let result = false;
    
    switch (operator) {
      case 'equals':
        result = normalizedVariable === normalizedValue;
        console.log(`Comparación: "${normalizedVariable}" === "${normalizedValue}" = ${result}`);
        break;
      case 'contains':
        result = normalizedVariable.includes(normalizedValue);
        break;
      case 'greater':
        result = Number(normalizedVariable) > Number(normalizedValue);
        break;
      case 'less':
        result = Number(normalizedVariable) < Number(normalizedValue);
        break;
    }
    
    console.log(`📊 RESULTADO: ${result ? '✅ VERDADERO' : '❌ FALSO'}`);
    console.log('===============================');

    const edges = this.flow.edges?.filter(e => e.source === session.currentNodeId) || [];
    let nextNodeId = null;
    
    if (result) {
      nextNodeId = edges.find(e => e.sourceHandle === 'true')?.target;
      console.log('➡️ Tomando camino VERDADERO');
    } else {
      nextNodeId = edges.find(e => e.sourceHandle === 'false')?.target;
      console.log('➡️ Tomando camino FALSO');
    }
    
    if (nextNodeId) {
      await this.processNode(ctx, nextNodeId, userId);
    }
  }

  async saveVariable(ctx, data, userId) {
    const session = this.activeSessions.get(userId);
    if (!session) return;
    
    const { variableName, variableValue, operation = 'set', storageType = 'temporal' } = data;
    if (!variableName) return;

    const processedValue = this.processVariables(variableValue || '', ctx.from, session.variables);
    
    console.log(`📦 Guardando variable: ${variableName} = ${processedValue}`);

    switch (operation) {
      case 'set':
        session.variables[variableName] = processedValue;
        break;
      case 'append':
        if (!session.variables[variableName]) session.variables[variableName] = [];
        if (Array.isArray(session.variables[variableName])) {
          session.variables[variableName].push(processedValue);
        }
        break;
      case 'clear':
        delete session.variables[variableName];
        break;
    }

    if (storageType === 'permanente') {
      await supabase
        .from('user_data')
        .upsert({
          user_id: userId,
          bot_id: this.botId,
          key: variableName,
          value: processedValue,
          updated_at: new Date()
        });
    }

    const nextNode = this.getNextNode(session.currentNodeId);
    if (nextNode) {
      await this.processNode(ctx, nextNode, userId);
    }
  }

  // ========== NODO DE GOOGLE SHEETS ==========
  async callGoogleSheets(ctx, data, userId) {
    const session = this.activeSessions.get(userId);
    const { appsScriptUrl, sheetName = 'Hoja1' } = data;
    
    try {
      if (!appsScriptUrl) {
        await ctx.reply('❌ Google Sheets: URL del Web App no configurada');
        return;
      }

      console.log(`📊 Google Sheets - POST: ${appsScriptUrl} - ${sheetName}`);
      
      // Preparar payload con todas las variables de la sesión
      const payload = {
        ...session?.variables,
        timestamp: new Date().toISOString(),
        user_id: userId,
        bot_id: this.botId
      };
      
      console.log('📦 Variables disponibles para Google Sheets:', payload);

      // Enviar a Google Sheets
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.success) {
        await ctx.reply(`✅ Datos guardados correctamente en ${sheetName}`);
      } else {
        throw new Error(result.error || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error en Google Sheets:', error);
      await ctx.reply('❌ Error al conectar con Google Sheets: ' + error.message);
    }

    // Continuar al siguiente nodo
    const nextNode = this.getNextNode(session?.currentNodeId);
    if (nextNode) {
      await this.processNode(ctx, nextNode, userId);
    }
  }

  // ========== NODO DE PREGUNTAR Y GUARDAR ==========
  async handlePreguntar(ctx, data, userId) {
    const { pregunta, variableGuardar, mensajeConfirmacion } = data;
    const session = this.activeSessions.get(userId);
    
    if (!session) {
      console.log('❌ No hay sesión para preguntar');
      return;
    }

    // Guardar el contexto para saber qué variable llenar cuando responda
    session.esperandoRespuesta = {
      tipo: 'preguntar',
      variable: variableGuardar,
      mensajeConfirmacion: mensajeConfirmacion
    };

    // Hacer la pregunta
    await ctx.reply(pregunta);
    console.log(`❓ Pregunta enviada: "${pregunta}" (esperando respuesta para variable: ${variableGuardar})`);
    
    // NO continuar automáticamente - esperar la respuesta del usuario
  }

  getNextNode(currentNodeId) {
    if (!this.flow?.edges) return null;
    const edge = this.flow.edges.find(e => e.source === currentNodeId);
    return edge?.target;
  }

  processVariables(text, user, variables = {}) {
    if (!text) return text;
    
    const userVars = {
      '{{nombre}}': user.first_name || '',
      '{{apellido}}': user.last_name || '',
      '{{username}}': user.username || '',
      '{{id}}': user.id.toString(),
      '{{fecha}}': new Date().toLocaleDateString('es-ES'),
      '{{hora}}': new Date().toLocaleTimeString('es-ES')
    };
    
    let result = text;
    Object.entries(userVars).forEach(([key, val]) => {
      result = result.replaceAll(key, val);
    });
    Object.entries(variables).forEach(([key, val]) => {
      result = result.replaceAll(`{{${key}}}`, val?.toString() || '');
    });
    
    return result;
  }

  async delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  // ========== MÉTODO STOP MEJORADO PARA ERROR 409 ==========
  async stop() {
    try {
      console.log(`🛑 Deteniendo bot ${this.botId}...`);
      
      // 1. Detener el bot de forma graceful
      if (this.bot) {
        try {
          await this.bot.stop();
          console.log(`✅ Bot ${this.botId} detenido con stop()`);
        } catch (stopError) {
          console.log(`⚠️ Error al detener con stop(): ${stopError.message}`);
        }
        
        // 2. Forzar eliminación del webhook para liberar la conexión
        try {
          await this.bot.telegram.callApi('deleteWebhook', { 
            drop_pending_updates: true 
          });
          console.log(`✅ Webhook eliminado para bot ${this.botId}`);
        } catch (webhookError) {
          console.log(`⚠️ Error al eliminar webhook: ${webhookError.message}`);
        }
      }
      
      // 3. Marcar como no ejecutándose
      this.isRunning = false;
      
      // 4. Limpiar sesiones activas
      this.activeSessions.clear();
      console.log(`✅ Sesiones limpiadas para bot ${this.botId}`);
      
      // 5. Actualizar estado en base de datos
      try {
        await supabase
          .from('bots')
          .update({ status: 'inactive' })
          .eq('id', this.botId);
        console.log(`✅ Estado actualizado en BD para bot ${this.botId}`);
      } catch (dbError) {
        console.error('Error actualizando BD:', dbError);
      }
      
      console.log(`✅ Bot ${this.botId} detenido completamente`);
      return true;
      
    } catch (error) {
      console.error('❌ Error deteniendo bot:', error);
      
      // Intentar marcar como inactivo aunque falle
      try {
        await supabase
          .from('bots')
          .update({ status: 'inactive' })
          .eq('id', this.botId);
      } catch (dbError) {
        console.error('Error crítico actualizando BD:', dbError);
      }
      
      return false;
    }
  }
}

export default TelegramBotService;