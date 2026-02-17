// lib/telegram/activeBots.js
// Mapa global para mantener instancias activas de bots
// Esto persiste mientras el servidor esté corriendo

// Mapa único que se compartirá entre todos los endpoints
const activeBots = new Map();

// Función para obtener el mapa de bots activos
export function getActiveBots() {
  return activeBots;
}

// Función para agregar un bot activo
export function setActiveBot(botId, botService) {
  console.log(`📝 Registrando bot ${botId} en memoria...`);
  activeBots.set(botId, botService);
  console.log(`✅ Bot ${botId} registrado. Total activos: ${activeBots.size}`);
  
  // Listar todos los bots activos
  const botsList = [];
  for (const [id, bot] of activeBots.entries()) {
    botsList.push({ 
      id, 
      running: bot.isRunning || false,
      uptime: bot.uptime ? `${Math.floor((Date.now() - bot.uptime) / 1000)}s` : 'unknown'
    });
  }
  console.log("📊 Bots activos en memoria:", botsList);
}

// Función para eliminar un bot activo
export function removeActiveBot(botId) {
  console.log(`🗑️ Eliminando bot ${botId} de memoria...`);
  const removed = activeBots.delete(botId);
  console.log(`✅ Bot ${botId} eliminado. Total activos: ${activeBots.size}`);
  return removed;
}

// Función para verificar si un bot está activo
export function isBotActive(botId) {
  return activeBots.has(botId);
}

// Función para obtener un bot activo
export function getActiveBot(botId) {
  return activeBots.get(botId);
}

// Función para detener y eliminar un bot
export async function stopAndRemoveBot(botId) {
  console.log(`🛑 Intentando detener y eliminar bot ${botId}...`);
  const bot = activeBots.get(botId);
  if (bot) {
    try {
      await bot.stop();
      console.log(`✅ Bot ${botId} detenido correctamente`);
    } catch (error) {
      console.error(`❌ Error deteniendo bot ${botId}:`, error);
    }
    return activeBots.delete(botId);
  } else {
    console.log(`⚠️ No se encontró instancia del bot ${botId} en memoria`);
  }
  return false;
}

// Función para listar todos los bots activos
export function listActiveBots() {
  const bots = [];
  for (const [id, bot] of activeBots.entries()) {
    bots.push({
      id,
      uptime: bot.uptime ? `${Math.floor((Date.now() - bot.uptime) / 1000)}s` : 'unknown',
      running: bot.isRunning || false
    });
  }
  return bots;
}