# 🤖 Telegram Bot Builder - Plataforma SaaS No-Code

Plataforma profesional para crear chatbots de Telegram mediante nodos visuales, sin necesidad de programar. **100% JavaScript** - sin TypeScript.

## 🚀 Características

- **Editor Visual**: Interfaz drag-and-drop con React Flow
- **Tres Tipos de Nodos**:
  - 📱 **Mensaje**: Envía texto al usuario con soporte para variables
  - ⌨️ **Entrada**: Captura respuestas y las guarda en variables
  - 🔀 **Condicional**: Lógica if/then para bifurcaciones
- **Integraciones**: Google Sheets y webhooks
- **Sistema de Planes**: Free, Starter, Pro, Business
- **Motor de Ejecución**: Procesa conversaciones en tiempo real
- **Variables Dinámicas**: Sistema {{nombre}} para personalización
- **JavaScript Puro**: Sin TypeScript, más sencillo de mantener

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- Cuenta de Google Cloud (para Sheets API)
- Cuenta de Stripe (para pagos)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/telegram-bot-builder.git
cd telegram-bot-builder
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
- `DATABASE_URL`: Conexión a PostgreSQL
- `NEXT_PUBLIC_APP_URL`: URL de tu aplicación
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Credenciales de Google Cloud

### 4. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npm run db:generate

# Aplicar las migraciones
npm run db:push
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🎯 Cómo Funciona

### 1. Crear un Bot de Telegram

1. Habla con [@BotFather](https://t.me/botfather) en Telegram
2. Ejecuta `/newbot` y sigue las instrucciones
3. Copia el token que te proporciona (ej: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### 2. Configurar el Bot en la Plataforma

```javascript
// En tu dashboard, crea un nuevo bot
const bot = await prisma.bot.create({
  data: {
    name: 'Mi Bot de Ventas',
    token: 'TU_TOKEN_DE_TELEGRAM',
    userId: 'user_id',
  }
});
```

### 3. Construir el Flujo

1. Arrastra nodos al canvas
2. Conecta los nodos para crear el flujo
3. Configura cada nodo:
   - **Mensaje**: Escribe el texto a enviar
   - **Entrada**: Define la pregunta y variable
   - **Condicional**: Establece las condiciones

### 4. Publicar

Haz clic en "Publicar Bot" y el webhook se configurará automáticamente.

## 🧩 Estructura del Motor de Ejecución

### Flujo de Conversación

```
Usuario envía mensaje
    ↓
Webhook recibe mensaje
    ↓
Buscar/crear Conversación
    ↓
Cargar Flow activo
    ↓
Ejecutar desde currentNodeId
    ↓
Procesar nodos secuencialmente
    ↓
¿Es InputNode?
  Sí → Guardar nextNodeId, esperar respuesta
  No → Continuar al siguiente nodo
    ↓
Enviar respuestas al usuario
    ↓
Actualizar variables y estado
```

### Ejemplo de Flujo

```
[Start]
   ↓
[Mensaje: "¡Hola! ¿Cómo te llamas?"]
   ↓
[Entrada: guardar en {{nombre}}]
   ↓
[Mensaje: "Encantado {{nombre}}! ¿Cuál es tu email?"]
   ↓
[Entrada: guardar en {{email}}]
   ↓
[Condicional: ¿{{email}} contiene "@"?]
   ↓                    ↓
  Sí                   No
   ↓                    ↓
[Google Sheets]    [Mensaje: "Email inválido"]
```

## 🔧 Sistema de Variables

Las variables se guardan en formato `{{nombre}}` y se pueden usar en:
- Mensajes de texto
- Condiciones
- Integraciones (Google Sheets)

Ejemplo:
```javascript
// Nodo de Entrada
variableName: "nombre"

// Nodo de Mensaje
message: "¡Hola {{nombre}}! Bienvenido."

// Resultado para usuario "cruger"
"¡Hola Marco Cruger! Bienvenido."
```

## 📊 Límites por Plan

| Plan      | Nodos | Bots | Conversaciones/Mes | Google Sheets | Webhooks |
|-----------|-------|------|-------------------|---------------|----------|
| FREE      | 10    | 1    | 100               | ❌            | ❌       |
| STARTER   | 10    | 3    | 500               | ✅            | ❌       |
| PRO       | 50    | 10   | 5,000             | ✅            | ✅       |
| BUSINESS  | 100   | ∞    | ∞                 | ✅            | ✅       |

## 🔌 Integraciones

### Google Sheets

```javascript
// Configurar en el flujo
await writeConversationToSheet(
  'SPREADSHEET_ID',
  'Hoja1',
  { nombre: 'Marco', email: 'cruger@example.com' },
  botId
);
```

Los headers de la hoja deben coincidir con los nombres de las variables.

### Webhooks (Plan Pro+)

Envía datos a URLs externas cuando se cumplan condiciones específicas.

## 🎨 Personalización de Nodos

Para añadir un nuevo tipo de nodo:

1. Crear componente en `src/components/flow/nodes/TuNodo.jsx`
2. Registrar en `FlowEditor.jsx`:
```javascript
const nodeTypes = {
  messageNode: MessageNode,
  inputNode: InputNode,
  conditionalNode: ConditionalNode,
  tuNodo: TuNodo, // Nuevo
};
```
3. Añadir lógica en `execution-engine.js`

## 🐛 Debugging

### Ver logs de ejecución

```bash
# En producción
tail -f /var/log/telegram-bot-builder.log

# En desarrollo
# Los logs aparecen en la consola
```

### Probar el motor localmente

```javascript
import { ExecutionEngine } from '@/lib/telegram/execution-engine.js';

const engine = new ExecutionEngine(nodes, edges, context);
const result = await engine.execute();
console.log('Respuestas:', result.responses);
```

## 🚀 Deploy en Producción

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Variables de entorno requeridas:
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_SERVICE_ACCOUNT_KEY`
- Credenciales de Stripe

### Webhook de Telegram

La URL será: `https://tu-dominio.com/api/webhook/[botId]`

## 📚 Próximos Pasos

1. **Añadir más nodos**:
   - Nodo de Botones
   - Nodo de Imagen
   - Nodo de Delay/Espera
   - Nodo de API externa

2. **Mejorar la UI**:
   - Plantillas predefinidas
   - Modo oscuro
   - Vista previa en tiempo real

3. **Analytics**:
   - Dashboard de conversaciones
   - Tasa de conversión
   - Embudo de usuario

4. **Integraciones adicionales**:
   - Zapier
   - Make.com
   - CRM (HubSpot, Salesforce)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 📧 Soporte

- 📖 Documentación: [docs.tu-dominio.com](https://docs.tu-dominio.com)
- 💬 Discord: [discord.gg/tu-servidor](https://discord.gg/tu-servidor)
- 📧 Email: support@tu-dominio.com

---

Hecho con ❤️ para la comunidad de desarrolladores
