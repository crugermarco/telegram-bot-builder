"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  ReactFlowProvider
} from "reactflow";
import "reactflow/dist/style.css";
import { 
  ArrowLeft, 
  Bot, 
  Save, 
  Square, 
  Send,
  MessageSquare, 
  CheckCircle, 
  GitBranch, 
  Clock,
  Plus, 
  Trash2, 
  Copy, 
  Zap, 
  Play, 
  Edit, 
  X, 
  Database, 
  Table2, 
  CheckCircle as CheckCircleIcon, 
  Flag, 
  HelpCircle,
  Activity,
  Grid,
  Key,
  AlertCircle,
  Info,
  Settings,
  Power,
  Loader2,
  Moon,
  Sun,
  Trash,
  AlertTriangle,
  Image
} from "lucide-react";

const AVAILABLE_VARIABLES = [
  { id: "fecha", label: "Fecha", ejemplo: "13/2/2026", desc: "Fecha actual", icon: "📅" },
  { id: "nombre", label: "Nombre", ejemplo: "Juan Pérez", desc: "Nombre completo del usuario", icon: "👤" },
  { id: "respuesta", label: "Respuesta", ejemplo: "Sí, me gusta", desc: "Última respuesta del usuario", icon: "💬" },
  { id: "id", label: "ID", ejemplo: "123456789", desc: "ID de Telegram del usuario", icon: "🆔" },
  { id: "hora", label: "Hora", ejemplo: "15:30", desc: "Hora actual", icon: "⏰" },
  { id: "ultimo_mensaje", label: "Último mensaje", ejemplo: "Hola bot", desc: "Último mensaje enviado", icon: "📨" },
  { id: "username", label: "Username", ejemplo: "@usuario123", desc: "Nombre de usuario de Telegram", icon: "🔤" },
  { id: "email", label: "Email", ejemplo: "cliente@email.com", desc: "Correo electrónico", icon: "📧" },
  { id: "telefono", label: "Teléfono", ejemplo: "5512345678", desc: "Número de teléfono", icon: "📱" },
  { id: "direccion", label: "Dirección", ejemplo: "Calle 123 #45-67", desc: "Dirección física", icon: "🏠" },
  { id: "ciudad", label: "Ciudad", ejemplo: "Ciudad de México", desc: "Ciudad", icon: "🌆" },
  { id: "edad", label: "Edad", ejemplo: "25", desc: "Edad del usuario", icon: "🎂" },
  { id: "fecha_nacimiento", label: "Fecha nacimiento", ejemplo: "15/05/1990", desc: "Fecha de nacimiento", icon: "📅" },
  { id: "comentario", label: "Comentario", ejemplo: "Me encanta el servicio", desc: "Comentario adicional", icon: "💭" },
  { id: "callback_data", label: "Callback", ejemplo: "opcion_1", desc: "Datos del botón presionado", icon: "🔄" }
];

const TextMessageNode = ({ id, data, isConnectable, onUpdate, darkMode }) => {
  const [localContent, setLocalContent] = useState(data.content || "");

  const handleBlur = () => {
    if (localContent !== data.content) {
      onUpdate?.({ content: localContent });
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("¿Eliminar este nodo?")) {
      onUpdate?.({ __delete: true });
    }
  };

  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl backdrop-blur-sm border-2 border-blue-500 min-w-[300px] group hover:shadow-2xl transition-all duration-300 ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg mr-2 ${darkMode ? 'bg-blue-900/30' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
            <MessageSquare className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Mensaje</span>
        </div>
        <button
          onClick={handleDelete}
          className={`p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition ${darkMode ? 'hover:bg-red-900/30' : ''}`}
        >
          <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
        </button>
      </div>

      <textarea
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        rows="4"
        className={`w-full text-sm border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'}`}
        placeholder="Escribe tu mensaje..."
      />
      
      <div className="mt-2 flex items-center">
        <label className={`flex items-center text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <input
            type="checkbox"
            checked={data.typing || false}
            onChange={(e) => onUpdate?.({ typing: e.target.checked })}
            onClick={(e) => e.stopPropagation()}
            className="mr-1.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Simular escritura
        </label>
      </div>
    </div>
  );
};

// ========== NODO: IMAGEN + TEXTO (VERSIÓN CORREGIDA) ==========
const ImageTextNode = ({ id, data, isConnectable, onUpdate, darkMode }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [imageUrl, setImageUrl] = useState(data.imageUrl || "");
  const [caption, setCaption] = useState(data.caption || "");

  const handleSave = useCallback(() => {
    onUpdate?.({ imageUrl, caption });
    setShowEditor(false);
  }, [imageUrl, caption, onUpdate]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    if (window.confirm("¿Eliminar este nodo?")) {
      onUpdate?.({ __delete: true });
    }
  }, [onUpdate]);

  const handleImagePreview = useCallback((url) => {
    if (url && (url.startsWith('http') || url.startsWith('https'))) {
      window.open(url, '_blank');
    }
  }, []);

  const handleCloseEditor = useCallback((e) => {
    e.stopPropagation();
    setShowEditor(false);
  }, []);

  // Verificación de datos para depuración
  useEffect(() => {
    console.log(`🖼️ ImageTextNode montado con data:`, data);
  }, [data]);

  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl backdrop-blur-sm border-2 border-pink-500 min-w-[350px] group hover:shadow-2xl transition-all duration-300 ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-pink-500" />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-pink-500" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg mr-2 ${darkMode ? 'bg-pink-900/30' : 'bg-gradient-to-br from-pink-50 to-pink-100'}`}>
            <Image className={`w-5 h-5 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
          </div>
          <span className={`font-semibold ${darkMode ? 'text-pink-400' : 'text-pink-700'}`}>Imagen + Texto</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowEditor(true)}
            className={`p-1.5 rounded-lg transition ${darkMode ? 'hover:bg-pink-900/30' : 'hover:bg-pink-100'}`}
          >
            <Edit className={`w-4 h-4 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition ${darkMode ? 'hover:bg-red-900/30' : ''}`}
          >
            <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </button>
        </div>
      </div>

      {!showEditor ? (
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          {imageUrl ? (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>URL de imagen:</span>
                <button
                  onClick={() => handleImagePreview(imageUrl)}
                  className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}
                >
                  Ver imagen
                </button>
              </div>
              <div className={`text-xs truncate p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                {imageUrl}
              </div>
            </div>
          ) : (
            <div className={`mb-3 text-center py-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Sin imagen configurada
            </div>
          )}
          
          {caption ? (
            <div>
              <span className={`text-xs font-medium block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Texto:</span>
              <div className={`text-sm p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                {caption}
              </div>
            </div>
          ) : (
            <div className={`text-center py-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Sin texto
            </div>
          )}
        </div>
      ) : (
        <div className={`p-3 rounded-lg space-y-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`flex items-center justify-between sticky top-0 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>EDITAR IMAGEN + TEXTO</span>
            <button
              onClick={handleCloseEditor}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
            >
              <X className={`w-3 h-3 ${darkMode ? 'text-gray-300' : ''}`} />
            </button>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              URL de la imagen <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-pink-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'}`}
            />
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              URL pública de la imagen (JPG, PNG, GIF)
            </p>
            {imageUrl && (
              <button
                onClick={() => handleImagePreview(imageUrl)}
                className={`mt-2 text-xs px-3 py-1.5 rounded-lg flex items-center ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}
              >
                <Image className="w-3 h-3 mr-1" />
                Probar URL
              </button>
            )}
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Texto de la imagen (opcional)
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows="3"
              placeholder="Texto que acompañará a la imagen..."
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-pink-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'}`}
            />
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Puedes usar variables como {`{{nombre}}`}, {`{{fecha}}`}, etc.
            </p>
          </div>

          <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
              <strong>NOTA:</strong> La imagen debe ser accesible públicamente. Telegram muestra imágenes de hasta 10MB.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-2 px-4 py-2 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 flex items-center justify-center font-medium"
          >
            <Save className="w-4 h-4 mr-1" />
            Guardar nodo
          </button>
        </div>
      )}
    </div>
  );
};

// ========== NODO: IMAGEN + TEXTO + BOTONES (CORREGIDO) ==========
const ImageButtonsNode = ({ id, data, isConnectable, onUpdate, darkMode }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [imageUrl, setImageUrl] = useState(data.imageUrl || "");
  const [caption, setCaption] = useState(data.caption || "Selecciona una opción:");
  const [options, setOptions] = useState(data.options || ["Sí", "No"]);

  const addOption = () => {
    const newOptions = [...options, `Opción ${options.length + 1}`];
    setOptions(newOptions);
    onUpdate?.({ imageUrl, caption, options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onUpdate?.({ imageUrl, caption, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onUpdate?.({ imageUrl, caption, options: newOptions });
  };

  const handleSave = () => {
    onUpdate?.({ imageUrl, caption, options });
    setShowEditor(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("¿Eliminar este nodo?")) {
      onUpdate?.({ __delete: true });
    }
  };

  const handleImagePreview = (url) => {
    if (url && (url.startsWith('http') || url.startsWith('https'))) {
      window.open(url, '_blank');
    }
  };

  const renderSourceHandles = () => {
    if (options.length === 0) {
      return (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          isConnectable={isConnectable} 
          className="w-3 h-3 bg-purple-500" 
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        />
      );
    }

    return options.map((option, index) => {
      const leftPosition = ((index + 1) / (options.length + 1)) * 100;
      return (
        <div key={`handle-${index}`} className="relative">
          <Handle
            type="source"
            id={`opt${index}`}
            position={Position.Bottom}
            isConnectable={isConnectable}
            className="w-3 h-3 bg-purple-500 hover:scale-150 transition-transform"
            style={{ left: `${leftPosition}%`, bottom: '-8px' }}
          />
          <div 
            className={`absolute text-[10px] font-medium whitespace-nowrap px-2 py-0.5 rounded-full border ${darkMode ? 'bg-purple-900/50 text-purple-300 border-purple-700' : 'bg-purple-50 text-purple-700 border-purple-200'}`}
            style={{ 
              left: `${leftPosition}%`, 
              bottom: '-24px', 
              transform: 'translateX(-50%)' 
            }}
          >
            {option}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl backdrop-blur-sm border-2 border-purple-500 min-w-[380px] group hover:shadow-2xl transition-all duration-300 ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg mr-2 ${darkMode ? 'bg-purple-900/30' : 'bg-gradient-to-br from-purple-50 to-purple-100'}`}>
            <Image className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <span className={`font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>Imagen + Botones</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditor(!showEditor);
            }}
            className={`p-1.5 rounded-lg transition ${darkMode ? 'hover:bg-purple-900/30' : 'hover:bg-purple-100'}`}
          >
            <Edit className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition ${darkMode ? 'hover:bg-red-900/30' : ''}`}
          >
            <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </button>
        </div>
      </div>

      {!showEditor ? (
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          {imageUrl ? (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Imagen:</span>
                <button
                  onClick={() => handleImagePreview(imageUrl)}
                  className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}
                >
                  Ver imagen
                </button>
              </div>
              <div className={`text-xs truncate p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                {imageUrl}
              </div>
            </div>
          ) : (
            <div className={`mb-3 text-center py-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Sin imagen configurada
            </div>
          )}
          
          <div className={`mb-3 font-medium border-b pb-2 ${darkMode ? 'text-gray-200 border-gray-600' : 'text-gray-800'}`}>
            <span className={`text-xs uppercase tracking-wider block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Texto:</span>
            {caption}
          </div>
          
          <div className="space-y-2">
            <span className={`text-xs uppercase tracking-wider block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Opciones:</span>
            {options.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {options.map((opt, i) => (
                  <div key={i} className={`px-3 py-2 rounded-lg border shadow-sm ${darkMode ? 'bg-gray-800 border-purple-800 text-gray-200' : 'bg-white border-purple-200'}`}>
                    <span className="font-medium text-sm">{opt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3">
                <span className={`italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Sin opciones</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={`p-3 rounded-lg space-y-4 max-h-96 overflow-y-auto ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`flex items-center justify-between sticky top-0 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>EDITAR IMAGEN + BOTONES</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditor(false);
              }}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
            >
              <X className={`w-3 h-3 ${darkMode ? 'text-gray-300' : ''}`} />
            </button>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              URL de la imagen <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'}`}
            />
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              URL pública de la imagen
            </p>
            {imageUrl && (
              <button
                onClick={() => handleImagePreview(imageUrl)}
                className={`mt-2 text-xs px-3 py-1.5 rounded-lg flex items-center ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}
              >
                <Image className="w-3 h-3 mr-1" />
                Probar URL
              </button>
            )}
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Texto de la imagen
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows="2"
              placeholder="Texto que acompañará a la imagen..."
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'}`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`block text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Opciones de botones
              </label>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {options.length} configuradas
              </span>
            </div>
            
            {options.map((opt, idx) => (
              <div key={idx} className={`p-3 rounded-lg border space-y-2 mb-2 shadow-sm ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Botón #{idx + 1}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(idx);
                    }}
                    className={`p-1 rounded ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder="Texto del botón"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
                />
              </div>
            ))}
            
            <button
              onClick={addOption}
              className="w-full mt-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Botón
            </button>
          </div>

          <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
              <strong>NOTA:</strong> El texto del botón ES el valor que se envía. La condición compara directamente con este texto.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center justify-center font-medium"
          >
            <Save className="w-4 h-4 mr-1" />
            Guardar nodo
          </button>
        </div>
      )}
      
      <div className="relative h-8 mt-2">
        {renderSourceHandles()}
      </div>
    </div>
  );
};

const ButtonsNode = ({ id, data, isConnectable, onUpdate, darkMode }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [mensaje, setMensaje] = useState(data.mensaje || "Selecciona una opción:");
  const [options, setOptions] = useState(data.options || ["Sí", "No"]);

  const addOption = () => {
    const newOptions = [...options, `Opción ${options.length + 1}`];
    setOptions(newOptions);
    onUpdate?.({ mensaje, options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onUpdate?.({ mensaje, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onUpdate?.({ mensaje, options: newOptions });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("¿Eliminar este nodo?")) {
      onUpdate?.({ __delete: true });
    }
  };

  const renderSourceHandles = () => {
    if (options.length === 0) {
      return (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          isConnectable={isConnectable} 
          className="w-3 h-3 bg-green-500" 
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        />
      );
    }

    return options.map((option, index) => {
      const leftPosition = ((index + 1) / (options.length + 1)) * 100;
      return (
        <div key={`handle-${index}`} className="relative">
          <Handle
            type="source"
            id={`opt${index}`}
            position={Position.Bottom}
            isConnectable={isConnectable}
            className="w-3 h-3 bg-green-500 hover:scale-150 transition-transform"
            style={{ left: `${leftPosition}%`, bottom: '-8px' }}
          />
          <div 
            className={`absolute text-[10px] font-medium whitespace-nowrap px-2 py-0.5 rounded-full border ${darkMode ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-green-50 text-green-700 border-green-200'}`}
            style={{ 
              left: `${leftPosition}%`, 
              bottom: '-24px', 
              transform: 'translateX(-50%)' 
            }}
          >
            {option}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl backdrop-blur-sm border-2 border-green-500 min-w-[350px] group hover:shadow-2xl transition-all duration-300 ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-green-500" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg mr-2 ${darkMode ? 'bg-green-900/30' : 'bg-gradient-to-br from-green-50 to-green-100'}`}>
            <CheckCircle className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <span className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Botones</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditor(!showEditor);
            }}
            className={`p-1.5 rounded-lg transition ${darkMode ? 'hover:bg-green-900/30' : 'hover:bg-green-100'}`}
          >
            <Edit className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition ${darkMode ? 'hover:bg-red-900/30' : ''}`}
          >
            <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </button>
        </div>
      </div>

      {!showEditor ? (
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`mb-3 font-medium border-b pb-2 ${darkMode ? 'text-gray-200 border-gray-600' : 'text-gray-800'}`}>
            <span className={`text-xs uppercase tracking-wider block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mensaje:</span>
            {mensaje}
          </div>
          
          <div className="space-y-2">
            <span className={`text-xs uppercase tracking-wider block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Opciones:</span>
            {options.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {options.map((opt, i) => (
                  <div key={i} className={`px-3 py-2 rounded-lg border shadow-sm ${darkMode ? 'bg-gray-800 border-green-800 text-gray-200' : 'bg-white border-green-200'}`}>
                    <span className="font-medium text-sm">{opt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3">
                <span className={`italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Sin opciones</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={`p-3 rounded-lg space-y-4 max-h-96 overflow-y-auto ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`flex items-center justify-between sticky top-0 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>EDITAR BOTONES</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditor(false);
              }}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
            >
              <X className={`w-3 h-3 ${darkMode ? 'text-gray-300' : ''}`} />
            </button>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Mensaje a mostrar
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => {
                setMensaje(e.target.value);
                onUpdate?.({ mensaje, options });
              }}
              rows="2"
              placeholder="Ej: ¿Qué opción prefieres?"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'}`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`block text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Opciones de botones
              </label>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {options.length} configuradas
              </span>
            </div>
            
            {options.map((opt, idx) => (
              <div key={idx} className={`p-3 rounded-lg border space-y-2 mb-2 shadow-sm ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Botón #{idx + 1}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(idx);
                    }}
                    className={`p-1 rounded ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder="Texto del botón"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
                />
              </div>
            ))}
            
            <button
              onClick={addOption}
              className="w-full mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Botón
            </button>
          </div>

          <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
              <strong>NOTA:</strong> El texto del botón ES el valor que se envía. La condición compara directamente con este texto.
            </p>
          </div>
        </div>
      )}
      
      <div className="relative h-8 mt-2">
        {renderSourceHandles()}
      </div>
    </div>
  );
};

const ConditionNode = ({ id, data, isConnectable, onUpdate, darkMode }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [variable, setVariable] = useState(data.variable || "respuesta");
  const [operator, setOperator] = useState(data.operator || "equals");
  const [value, setValue] = useState(data.value || "si");

  const handleSave = () => {
    onUpdate?.({ variable, operator, value });
    setShowEditor(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("¿Eliminar este nodo?")) {
      onUpdate?.({ __delete: true });
    }
  };

  const getOperatorSymbol = (op) => {
    switch(op) {
      case "equals": return "=";
      case "contains": return "∋";
      case "greater": return ">";
      case "less": return "<";
      default: return "=";
    }
  };

  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl backdrop-blur-sm border-2 border-yellow-500 min-w-[280px] group hover:shadow-2xl transition-all duration-300 ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-yellow-500" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg mr-2 ${darkMode ? 'bg-yellow-900/30' : 'bg-gradient-to-br from-yellow-50 to-yellow-100'}`}>
            <GitBranch className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          </div>
          <span className={`font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>Condición</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditor(!showEditor);
            }}
            className={`p-1.5 rounded-lg transition ${darkMode ? 'hover:bg-yellow-900/30' : 'hover:bg-yellow-100'}`}
          >
            <Edit className={`w-4 h-4 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition ${darkMode ? 'hover:bg-red-900/30' : ''}`}
          >
            <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </button>
        </div>
      </div>

      {!showEditor ? (
        <div className={`p-3 rounded-lg font-mono text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <span className={`px-2 py-1 rounded ${darkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100'}`}>{variable || "variable"}</span>
          <span className="mx-2 font-bold">{getOperatorSymbol(operator)}</span>
          <span className={`px-2 py-1 rounded ${darkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100'}`}>{value || "valor"}</span>
        </div>
      ) : (
        <div className={`p-3 rounded-lg space-y-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>EDITAR CONDICIÓN</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditor(false);
              }}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
            >
              <X className={`w-3 h-3 ${darkMode ? 'text-gray-300' : ''}`} />
            </button>
          </div>

          <div>
            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Variable</label>
            <select
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
            >
              {AVAILABLE_VARIABLES.map(v => (
                <option key={v.id} value={v.id}>
                  {v.label} - {v.desc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Operador</label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
            >
              <option value="equals">Igual a (=)</option>
              <option value="contains">Contiene</option>
              <option value="greater">Mayor que ({'>'})</option>
              <option value="less">Menor que ({'<'})</option>
            </select>
          </div>

          <div>
            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Valor a comparar</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="ej: si, aprobado, confirmado"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : ''}`}
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-2 px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-1" />
            Guardar condición
          </button>
        </div>
      )}
      
      <div className="flex justify-between mt-3">
        <div className="flex items-center text-xs">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Verdadero
          <Handle 
            type="source" 
            id="true" 
            position={Position.Bottom} 
            style={{ left: "30%", bottom: "-8px" }} 
            isConnectable={isConnectable} 
            className="w-3 h-3 bg-green-500" 
          />
        </div>
        <div className="flex items-center text-xs">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
          Falso
          <Handle 
            type="source" 
            id="false" 
            position={Position.Bottom} 
            style={{ left: "70%", bottom: "-8px" }} 
            isConnectable={isConnectable} 
            className="w-3 h-3 bg-red-500" />
        </div>
      </div>
    </div>
  );
};

const GoogleSheetsNode = ({ id, data, isConnectable, onUpdate, darkMode }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [showHelp, setShowHelp] = useState(data.showHelp !== false);
  const [copied, setCopied] = useState(false);
  
  const [appsScriptUrl, setAppsScriptUrl] = useState(data.appsScriptUrl || "");
  const [sheetName, setSheetName] = useState(data.sheetName || "Hoja1");
  
  const [columns, setColumns] = useState(data.columns || [
    { column: "A", variable: "fecha", activa: true },
    { column: "B", variable: "nombre", activa: true },
    { column: "C", variable: "respuesta", activa: true },
    { column: "D", variable: "id", activa: true }
  ]);

  useEffect(() => {
    if (!data.appsScriptUrl && !data.columns) {
      setShowHelp(true);
    }
  }, []);

  const toggleColumn = (index) => {
    const newColumns = [...columns];
    newColumns[index].activa = !newColumns[index].activa;
    setColumns(newColumns);
  };

  const changeVariable = (index, variableId) => {
    const newColumns = [...columns];
    newColumns[index].variable = variableId;
    setColumns(newColumns);
  };

  const updateColumn = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const addColumn = () => {
    const nextLetter = String.fromCharCode(65 + columns.length);
    setColumns([...columns, { 
      column: nextLetter, 
      variable: "", 
      activa: false 
    }]);
  };

  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onUpdate?.({ 
      appsScriptUrl, 
      sheetName,
      columns,
      showHelp: false
    });
    setShowEditor(false);
    setShowHelp(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("¿Eliminar este nodo?")) {
      onUpdate?.({ __delete: true });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateAppsScriptCode = () => {
    const activeColumns = columns.filter(col => col.activa && col.variable);
    
    const columnasConfig = activeColumns.map((col, index) => {
      const varInfo = AVAILABLE_VARIABLES.find(v => v.id === col.variable) || { label: col.variable };
      return `      { columna: "${col.column}", variable: "${col.variable}", descripcion: "${varInfo.label}" }`;
    }).join(',\n');

    return `// ============================================
// CÓDIGO PARA GOOGLE APPS SCRIPT
// ============================================
// 1. COPIA TODO ESTE CÓDIGO
// 2. VE A https://script.google.com
// 3. PEGA Y REEMPLAZA TODO
// 4. IMPLEMENTA COMO WEB APP
// 5. USA LA URL GENERADA EN EL NODO
// ============================================

function doPost(e) {
  try {
    // ========================================
    // CONFIGURACIÓN - EDITAR SEGÚN TUS NECESIDADES
    // ========================================
    const NOMBRE_HOJA = "${sheetName}";
    const COLUMNAS = [
${columnasConfig}
    ];
    
    // ========================================
    // PROCESAR DATOS (NO MODIFICAR)
    // ========================================
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(NOMBRE_HOJA);
    
    if (!sheet) {
      sheet = ss.insertSheet(NOMBRE_HOJA);
      const headers = COLUMNAS.map(c => c.descripcion);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    const data = JSON.parse(e.postData.contents);
    
    const nuevaFila = COLUMNAS.map(col => {
      return data[col.variable] || "";
    });
    
    sheet.appendRow(nuevaFila);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: "✅ Datos guardados correctamente",
        fila: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      success: true, 
      message: "✅ Webhook activo",
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}`;
  };

  if (showHelp) {
    const appsScriptCode = generateAppsScriptCode();
    const activeCount = columns.filter(c => c.activa && c.variable).length;
    
    return (
      <div className={`px-4 py-3 shadow-xl rounded-xl backdrop-blur-sm border-2 border-purple-500 min-w-[500px] group relative hover:shadow-2xl transition-all duration-300 ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className={`p-1.5 rounded-lg mr-2 ${darkMode ? 'bg-purple-900/30' : 'bg-gradient-to-br from-purple-50 to-purple-100'}`}>
              <Table2 className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <span className={`font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>Guardar en Sheets</span>
          </div>
          <button
            onClick={handleDelete}
            className={`p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition ${darkMode ? 'hover:bg-red-900/30' : ''}`}
          >
            <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-lg p-4 -mt-1 -mx-1 mb-3">
          <div className="flex items-center">
            <span className="bg-white text-purple-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">📋</span>
            <div>
              <h4 className="font-bold text-white">Configura tu hoja de cálculo</h4>
              <p className="text-xs text-purple-100 mt-0.5">Selecciona qué datos quieres guardar y en qué columnas</p>
            </div>
          </div>
        </div>

        <div className={`border rounded-lg p-4 mb-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
          <div className="flex items-start">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5 ${darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>1</span>
            <div className="flex-1">
              <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Nombre de tu hoja</p>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="Ej: Registros, Ventas, Citas, Clientes..."
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : ''}`}
                onClick={(e) => e.stopPropagation()}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>La hoja se creará automáticamente si no existe</p>
            </div>
          </div>
        </div>

        <div className={`border rounded-lg p-4 mb-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
          <div className="flex items-start mb-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5 ${darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>2</span>
            <div className="flex-1">
              <p className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>¿Qué datos quieres guardar?</p>
              <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Activa las columnas y elige la variable para cada una</p>
              
              <div className={`space-y-2 max-h-60 overflow-y-auto pr-1 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                {columns.map((col, idx) => {
                  const varInfo = AVAILABLE_VARIABLES.find(v => v.id === col.variable);
                  return (
                    <div key={idx} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} hover:shadow-sm transition`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={col.activa}
                            onChange={() => toggleColumn(idx)}
                            className="w-4 h-4 text-purple-600 rounded mr-2"
                          />
                          <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Columna {col.column}</span>
                        </div>
                        <button
                          onClick={() => removeColumn(idx)}
                          className={`p-1 rounded ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}
                          disabled={columns.length <= 1}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <select
                        value={col.variable}
                        onChange={(e) => changeVariable(idx, e.target.value)}
                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
                        disabled={!col.activa}
                      >
                        <option value="">-- Seleccionar dato --</option>
                        {AVAILABLE_VARIABLES.map(v => (
                          <option key={v.id} value={v.id} title={v.desc}>
                            {v.label} - {v.desc}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addColumn}
                className={`w-full mt-3 px-3 py-2 text-xs rounded-lg flex items-center justify-center transition font-medium ${darkMode ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Agregar columna
              </button>
            </div>
          </div>
        </div>

        <div className={`border rounded-lg p-4 mb-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
          <div className="flex items-start mb-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5 ${darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>3</span>
            <div className="flex-1">
              <p className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Código para Google Apps Script</p>
              <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Copia este código personalizado con tus columnas</p>
            </div>
          </div>
          
          <div className="relative bg-gray-900 rounded-lg">
            <div className="p-3 overflow-x-auto max-h-80 overflow-y-auto">
              <pre className="text-[11px] text-green-400 font-mono whitespace-pre-wrap">
                {appsScriptCode}
              </pre>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(appsScriptCode);
              }}
              className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg flex items-center transition"
            >
              {copied ? (
                <>
                  <CheckCircleIcon className="w-3.5 h-3.5 mr-1.5" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copiar código
                </>
              )}
            </button>
          </div>
          <p className={`text-[11px] mt-2 flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className={`px-2 py-0.5 rounded-full mr-2 ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>✅ {activeCount} columnas activas</span>
            El código incluye solo las columnas que activaste
          </p>
        </div>

        <div className={`border rounded-lg p-4 mb-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
          <div className="flex items-start">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5 ${darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>4</span>
            <div className="flex-1">
              <p className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Implementar Web App</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                En Apps Script: <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>Implementar → Nueva implementación → Web App</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-[10px] ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>Ejecutar como: Yo</span>
                <span className={`px-2 py-1 rounded text-[10px] ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>Acceso: Cualquiera</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`border rounded-lg p-4 mb-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            URL de tu Web App <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="url"
              value={appsScriptUrl}
              onChange={(e) => setAppsScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/abcdef123456/exec"
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 font-mono pr-10 ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : ''}`}
              onClick={(e) => e.stopPropagation()}
            />
            {appsScriptUrl && (
              <button
                onClick={() => copyToClipboard(appsScriptUrl)}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                title="Copiar URL"
              >
                <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            )}
          </div>
        </div>

        <div className="flex space-x-3 mt-3">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition flex items-center justify-center font-medium shadow-sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar configuración
          </button>
          <button
            onClick={() => {
              setShowHelp(false);
              onUpdate?.({ showHelp: false });
            }}
            className={`px-4 py-2.5 text-sm rounded-lg transition font-medium ${darkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Descartar
          </button>
        </div>
        
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500 mt-3" />
      </div>
    );
  }

  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl backdrop-blur-sm border-2 border-purple-500 min-w-[320px] group hover:shadow-2xl transition-all duration-300 ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500" />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg mr-2 ${darkMode ? 'bg-purple-900/30' : 'bg-gradient-to-br from-purple-50 to-purple-100'}`}>
            <Table2 className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <span className={`font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>Guardar en Sheets</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowHelp(true)}
            className={`p-1.5 rounded-lg transition ${darkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-100'}`}
            title="Ver instrucciones"
          >
            <Info className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </button>
          <button
            onClick={() => setShowEditor(true)}
            className={`p-1.5 rounded-lg transition ${darkMode ? 'hover:bg-purple-900/30' : 'hover:bg-purple-100'}`}
          >
            <Edit className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition ${darkMode ? 'hover:bg-red-900/30' : ''}`}
          >
            <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </button>
        </div>
      </div>

      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        {appsScriptUrl ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className={`px-2 py-0.5 rounded text-xs font-mono mr-2 ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
                  CONFIGURADO
                </span>
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {sheetName}
                </span>
              </div>
            </div>
            
            <div className={`mt-2 border-t pt-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <p className={`text-[10px] uppercase font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Datos que se guardarán:</p>
              <div className="grid grid-cols-2 gap-1">
                {columns.filter(c => c.activa && c.variable).slice(0, 4).map((col, i) => {
                  const varInfo = AVAILABLE_VARIABLES.find(v => v.id === col.variable);
                  return (
                    <div key={i} className={`flex items-center text-[10px] p-1.5 rounded border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                      <span className={`font-mono font-bold mr-1 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>{col.column}:</span>
                      <span className={`truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{varInfo?.label || col.variable}</span>
                    </div>
                  );
                })}
                {columns.filter(c => c.activa && c.variable).length > 4 && (
                  <div className={`text-[10px] flex items-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    +{columns.filter(c => c.activa && c.variable).length - 4} más
                  </div>
                )}
              </div>
            </div>

            <div className={`text-xs truncate flex items-center mt-2 p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <span className="truncate text-[10px] font-mono">{appsScriptUrl}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(appsScriptUrl);
                }}
                className={`ml-1 p-1 rounded flex-shrink-0 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                title="Copiar URL"
              >
                <Copy className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
          </>
        ) : (
          <div className={`text-xs italic text-center py-3 flex flex-col items-center ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-medium mb-2 flex items-center ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
              <Info className="w-3 h-3 mr-1" />
              Sin configurar
            </span>
            Haz clic en <Info className={`w-3 h-3 mx-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'} inline`} /> para conectar con Sheets
          </div>
        )}
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditor(false)}>
          <div className={`rounded-xl p-6 max-w-lg w-full shadow-2xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Configurar Google Sheets</h3>
              <button
                onClick={() => {
                  setShowEditor(false);
                  setShowHelp(true);
                }}
                className={`text-xs flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
              >
                <Info className="w-4 h-4 mr-1" />
                Ayuda
              </button>
            </div>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  URL del Web App
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={appsScriptUrl}
                    onChange={(e) => setAppsScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className={`w-full px-3 py-2 border rounded-lg text-sm font-mono pr-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
                  />
                  {appsScriptUrl && (
                    <button
                      onClick={() => copyToClipboard(appsScriptUrl)}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                    >
                      <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre de la hoja
                </label>
                <input
                  type="text"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="Hoja1"
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Columnas
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {columns.map((col, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Columna {col.column}</span>
                        <button
                          onClick={() => removeColumn(idx)}
                          className={`p-1 rounded ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}
                          disabled={columns.length <= 1}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div>
                          <label className={`block text-[10px] mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Columna</label>
                          <input
                            type="text"
                            value={col.column}
                            onChange={(e) => updateColumn(idx, "column", e.target.value.toUpperCase())}
                            className={`w-full px-2 py-1.5 text-xs border rounded uppercase ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
                            maxLength="2"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className={`block text-[10px] mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Variable</label>
                          <select
                            value={col.variable}
                            onChange={(e) => updateColumn(idx, "variable", e.target.value)}
                            className={`w-full px-2 py-1.5 text-xs border rounded ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
                          >
                            <option value="">Seleccionar</option>
                            {AVAILABLE_VARIABLES.map(v => (
                              <option key={v.id} value={v.id}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addColumn}
                  className={`w-full mt-2 px-3 py-2 text-xs rounded-lg flex items-center justify-center ${darkMode ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Agregar columna
                </button>
              </div>
            </div>

            <div className={`flex justify-end space-x-3 pt-4 mt-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowEditor(false)}
                className={`px-4 py-2 border rounded-lg text-sm ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PreguntarGuardarNode = ({ id, data, isConnectable, onUpdate, darkMode }) => {
  const [showEditor, setShowEditor] = useState(false);
  
  const [pregunta, setPregunta] = useState(data.pregunta || "¿Cuál es tu nombre?");
  const [variableGuardar, setVariableGuardar] = useState(data.variableGuardar || "nombre");
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(
    data.mensajeConfirmacion || "¡Gracias {{nombre}}! Tu respuesta ha sido guardada."
  );

  const handleSave = () => {
    onUpdate?.({ 
      pregunta, 
      variableGuardar, 
      mensajeConfirmacion 
    });
    setShowEditor(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("¿Eliminar este nodo?")) {
      onUpdate?.({ __delete: true });
    }
  };

  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl backdrop-blur-sm border-2 border-orange-500 min-w-[320px] group hover:shadow-2xl transition-all duration-300 ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-orange-500" />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-orange-500" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg mr-2 ${darkMode ? 'bg-orange-900/30' : 'bg-gradient-to-br from-orange-50 to-orange-100'}`}>
            <HelpCircle className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          </div>
          <span className={`font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>Preguntar y Guardar</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowEditor(true)}
            className={`p-1.5 rounded-lg transition ${darkMode ? 'hover:bg-orange-900/30' : 'hover:bg-orange-100'}`}
          >
            <Edit className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition ${darkMode ? 'hover:bg-red-900/30' : ''}`}
          >
            <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </button>
        </div>
      </div>

      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-center mb-2">
          <span className={`px-2 py-0.5 rounded text-xs font-mono mr-2 ${darkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>
            PREGUNTA
          </span>
        </div>
        <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {pregunta}
        </div>
        <div className={`flex items-center justify-between text-xs p-2 rounded border ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
          <span className={`font-mono px-1.5 py-0.5 rounded ${darkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'}`}>
            {variableGuardar}
          </span>
          <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>→ se guardará aquí</span>
        </div>
        <div className={`text-xs mt-2 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          "{mensajeConfirmacion.replace(/{{nombre}}/g, '[nombre]')}"
        </div>
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditor(false)}>
          <div className={`rounded-xl p-6 max-w-md w-full shadow-2xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-lg font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <HelpCircle className={`w-5 h-5 mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              Preguntar y Guardar
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Pregunta <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                  rows="2"
                  placeholder="Ej: ¿Cuál es tu correo electrónico?"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Guardar respuesta en variable <span className="text-red-500">*</span>
                </label>
                <select
                  value={variableGuardar}
                  onChange={(e) => setVariableGuardar(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                >
                  {AVAILABLE_VARIABLES.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.label} - {v.desc} (ej: {v.ejemplo})
                    </option>
                  ))}
                </select>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Esta variable podrás usarla luego en Google Sheets
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Mensaje de confirmación
                </label>
                <textarea
                  value={mensajeConfirmacion}
                  onChange={(e) => setMensajeConfirmacion(e.target.value)}
                  rows="2"
                  placeholder="Ej: ¡Gracias {{nombre}}! Tu respuesta ha sido guardada."
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Usa {'{{'}{variableGuardar}{'}}'} para mostrar el valor guardado
                </p>
              </div>

              <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                <p className={`text-xs flex items-start ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  <span className="font-bold mr-1">📌</span>
                  <span>
                    <strong>Consejo:</strong> En el nodo de Google Sheets, selecciona la variable{' '}
                    <span className={`font-mono px-1 py-0.5 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>{variableGuardar}</span>{' '}
                    para que estos datos lleguen a tu hoja.
                  </span>
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowEditor(false)}
                  className={`px-4 py-2 border rounded-lg text-sm ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 flex items-center"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Guardar nodo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const VariableNode = ({ id, data, isConnectable, onUpdate, darkMode }) => {
  const [showEditor, setShowEditor] = useState(false);

  const [variableName, setVariableName] = useState(data.variableName || "fecha");
  const [variableValue, setVariableValue] = useState(data.variableValue || "{{fecha}}");
  const [storageType, setStorageType] = useState(data.storageType || "temporal");

  const addPredefinedVar = (varName, varValue) => {
    setVariableName(varName);
    setVariableValue(varValue);
    onUpdate?.({ 
      variableName: varName, 
      variableValue: varValue, 
      operation: "set",
      storageType 
    });
  };

  const handleSave = () => {
    onUpdate?.({ 
      variableName, 
      variableValue, 
      operation: "set",
      storageType 
    });
    setShowEditor(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("¿Eliminar este nodo?")) {
      onUpdate?.({ __delete: true });
    }
  };

  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl backdrop-blur-sm border-2 border-indigo-500 min-w-[320px] group hover:shadow-2xl transition-all duration-300 ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-indigo-500" />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-indigo-500" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg mr-2 ${darkMode ? 'bg-indigo-900/30' : 'bg-gradient-to-br from-indigo-50 to-indigo-100'}`}>
            <Database className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <span className={`font-semibold ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Guardar Dato</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditor(!showEditor);
            }}
            className={`p-1.5 rounded-lg transition ${darkMode ? 'hover:bg-indigo-900/30' : 'hover:bg-indigo-100'}`}
          >
            <Edit className={`w-4 h-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition ${darkMode ? 'hover:bg-red-900/30' : ''}`}
          >
            <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </button>
        </div>
      </div>

      {!showEditor ? (
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className={`font-mono px-2 py-1 rounded ${darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                {variableName}
              </span>
              <span className={`mx-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>=</span>
              <span className={`font-mono px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200'}`}>
                {variableValue.replace(/{{|}}/g, '')}
              </span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
              Sheets
            </span>
          </div>
          <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Se enviará a Google Sheets
          </div>
        </div>
      ) : (
        <div className={`p-3 rounded-lg space-y-3 max-h-96 overflow-y-auto ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`flex items-center justify-between sticky top-0 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>CONFIGURAR VARIABLE</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditor(false);
              }}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
            >
              <X className={`w-3 h-3 ${darkMode ? 'text-gray-300' : ''}`} />
            </button>
          </div>

          <div className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
            <p className={`text-xs flex items-center ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
              <span className="font-bold mr-1">📌</span>
              El nombre DEBE coincidir con la columna en Google Sheets
            </p>
          </div>

          <div>
            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Nombre de variable <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
              placeholder="ej: fecha, nombre, respuesta, id"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : ''}`}
            />
          </div>

          <div>
            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Valor a guardar <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={variableValue}
              onChange={(e) => setVariableValue(e.target.value)}
              placeholder="{{fecha}} / {{nombre}} / {{respuesta}}"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : ''}`}
            />
          </div>

          <div>
            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Variables predefinidas</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_VARIABLES.slice(0, 8).map((v, i) => (
                <button
                  key={i}
                  onClick={() => addPredefinedVar(v.id, `{{${v.id}}}`)}
                  className={`px-2 py-1 text-xs rounded hover:bg-indigo-200 transition flex items-center ${darkMode ? 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/50' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                >
                  <span className="font-mono mr-1">{v.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Almacenamiento</label>
            <select
              value={storageType}
              onChange={(e) => setStorageType(e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
            >
              <option value="temporal">Solo sesión</option>
              <option value="permanente">Base de datos</option>
            </select>
          </div>

          <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              <span className="font-bold">MODO SHEETS:</span> La operación es siempre "Guardar"
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 flex items-center justify-center font-medium"
          >
            <Save className="w-4 h-4 mr-1" />
            Guardar variable
          </button>
        </div>
      )}
    </div>
  );
};

const DelayNode = ({ id, data, isConnectable, onUpdate, darkMode }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [seconds, setSeconds] = useState(data.seconds || 1);

  const handleSave = () => {
    onUpdate?.({ seconds });
    setShowEditor(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("¿Eliminar este nodo?")) {
      onUpdate?.({ __delete: true });
    }
  };

  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl backdrop-blur-sm border-2 border-gray-500 min-w-[280px] group hover:shadow-2xl transition-all duration-300 ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-gray-500" />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-gray-500" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg mr-2 ${darkMode ? 'bg-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
            <Clock className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </div>
          <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Temporizador</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditor(!showEditor);
            }}
            className={`p-1.5 rounded-lg transition ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
          >
            <Edit className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition ${darkMode ? 'hover:bg-red-900/30' : ''}`}
          >
            <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </button>
        </div>
      </div>

      {!showEditor ? (
        <div className={`text-sm p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          Esperar {seconds} segundo(s)
        </div>
      ) : (
        <div className={`p-3 rounded-lg space-y-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>CONFIGURAR TIEMPO</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditor(false);
              }}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
            >
              <X className={`w-3 h-3 ${darkMode ? 'text-gray-300' : ''}`} />
            </button>
          </div>

          <input
            type="number"
            min="1"
            max="60"
            value={seconds}
            onChange={(e) => setSeconds(parseInt(e.target.value))}
            className={`w-full px-3 py-2 text-sm border rounded-lg ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
          />

          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
};

function BotBuilder() {
  const params = useParams();
  const router = useRouter();
  const [bot, setBot] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [botStatus, setBotStatus] = useState("inactive");
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [syncingStatus, setSyncingStatus] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("botBuilderDarkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("botBuilderDarkMode", newMode.toString());
  };

  const nodeTypes = useMemo(() => ({
    text: (props) => (
      <TextMessageNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
        darkMode={darkMode}
      />
    ),
    buttons: (props) => (
      <ButtonsNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
        darkMode={darkMode}
      />
    ),
    condition: (props) => (
      <ConditionNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
        darkMode={darkMode}
      />
    ),
    googlesheets: (props) => (
      <GoogleSheetsNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
        darkMode={darkMode}
      />
    ),
    delay: (props) => (
      <DelayNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
        darkMode={darkMode}
      />
    ),
    variable: (props) => (
      <VariableNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
        darkMode={darkMode}
      />
    ),
    preguntar: (props) => (
      <PreguntarGuardarNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
        darkMode={darkMode}
      />
    ),
    imagetext: (props) => (
      <ImageTextNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
        darkMode={darkMode}
      />
    ),
    imagebuttons: (props) => (
      <ImageButtonsNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
        darkMode={darkMode}
      />
    )
  }), [darkMode]);

  useEffect(() => {
    const loadBot = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const botRes = await fetch(`/api/bots/${params.botId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (botRes.ok) {
          const botData = await botRes.json();
          
          if (botData.bot) {
            setBot(botData.bot);
            setBotStatus(botData.bot.status || "inactive");
          }
        }

        const flowRes = await fetch(`/api/bots/${params.botId}/flow`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (flowRes.ok) {
          const flowData = await flowRes.json();
          
          if (flowData.flow?.nodes && flowData.flow.nodes.length > 0) {
            setNodes(flowData.flow.nodes);
            setEdges(flowData.flow.edges || []);
          } else {
            setNodes([]);
            setEdges([]);
          }
        }
      } catch (error) {
        console.error("Error general:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.botId) {
      loadBot();
    }
  }, [params.botId, router]);

  const checkRealStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/bots/${params.botId}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        
        if (botStatus === 'active') {
          return;
        }
        
        if (data.realStatus === 'active' || data.databaseStatus === 'active') {
          setBotStatus('active');
        } else if (data.realStatus === 'inactive' && data.databaseStatus === 'inactive') {
          setBotStatus('inactive');
        }
      }
    } catch (error) {
      console.error("Error verificando estado:", error);
    }
  };

  const toggleBotStatus = async () => {
    setSyncingStatus(true);
    try {
      const token = localStorage.getItem("token");
      const action = botStatus === "active" ? "stop" : "start";
      
      const res = await fetch(`/api/bots/${params.botId}/${action}`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setBotStatus(action === "start" ? "active" : "inactive");
        setTimeout(() => {
          setSyncingStatus(false);
        }, 2000);
        alert(`✅ Bot ${action === "start" ? "iniciado" : "detenido"} correctamente`);
      } else {
        alert(`❌ Error: ${data.error || 'Error desconocido'}`);
        setSyncingStatus(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
      setSyncingStatus(false);
    }
  };

  const saveFlow = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/bots/${params.botId}/flow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nodes, edges })
      });

      if (res.ok) {
        alert("✅ Flow guardado");
      } else {
        const error = await res.json();
        alert(`❌ Error: ${error.error || 'Error desconocido'}`);
      }
    } catch (error) {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const clearFlow = () => {
    if (nodes.length === 0) {
      alert("No hay nodos para limpiar");
      return;
    }
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    setNodes([]);
    setEdges([]);
    setShowClearConfirm(false);
    alert("✅ Flujo limpiado completamente");
  };

  const testBot = async () => {
    if (!testMessage.trim()) return;
    
    setTestResponse("Procesando...");
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/bots/${params.botId}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message: testMessage,
          nodes: nodes,
          edges: edges,
          botId: params.botId
        })
      });
  
      if (res.ok) {
        const data = await res.json();
        setTestResponse(data.response || "✅ Mensaje recibido");
      } else {
        const error = await res.json();
        setTestResponse(`❌ Error: ${error.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setTestResponse("❌ Error de conexión");
    }
    
    setTestMessage("");
  };

  const addNode = (type) => {
    if (nodes.length >= 10) {
      alert("⚠️ Límite de 10 nodos en plan gratuito");
      return;
    }

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: type === "text" ? { content: "Nuevo mensaje", typing: false } :
            type === "buttons" ? { 
              mensaje: "Selecciona una opción:", 
              options: ["Sí", "No"]
            } :
            type === "condition" ? { 
              variable: "respuesta", 
              operator: "equals", 
              value: "si" 
            } :
            type === "googlesheets" ? { 
              appsScriptUrl: "",
              sheetName: "Mi hoja",
              columns: [
                { column: "A", variable: "fecha", activa: true },
                { column: "B", variable: "nombre", activa: true },
                { column: "C", variable: "respuesta", activa: true },
                { column: "D", variable: "id", activa: true }
              ],
              showHelp: true
            } :
            type === "delay" ? { seconds: 2 } :
            type === "variable" ? { 
              variableName: "fecha", 
              variableValue: "{{fecha}}", 
              operation: "set", 
              storageType: "temporal" 
            } :
            type === "preguntar" ? {
              pregunta: "¿Cuál es tu nombre?",
              variableGuardar: "nombre",
              mensajeConfirmacion: "¡Gracias {{nombre}}! Tu respuesta ha sido guardada."
            } :
            type === "imagetext" ? {
              imageUrl: "",
              caption: ""
            } :
            type === "imagebuttons" ? {
              imageUrl: "",
              caption: "Selecciona una opción:",
              options: ["Sí", "No"]
            } : {}
    };
    
    setNodes((nds) => [...nds, newNode]);
  };

  const updateNodeData = (nodeId, newData) => {
    if (newData.__delete) {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      return;
    }

    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n
      )
    );
  };

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
        <div className={`fixed inset-0 pointer-events-none ${darkMode ? 'bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20' : 'bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5'}`}></div>
        <div className="text-center">
          <div className="relative">
            <div className={`w-24 h-24 border-4 rounded-full animate-spin mx-auto mb-8 ${darkMode ? 'border-gray-700 border-t-blue-500' : 'border-slate-200 border-t-blue-600'}`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-pulse opacity-75"></div>
            </div>
          </div>
          <h2 className={`text-2xl font-light mb-2 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Cargando editor</h2>
          <p className={darkMode ? 'text-gray-500' : 'text-slate-400'}>Preparando tu espacio de trabajo</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      <div className={`fixed inset-0 pointer-events-none ${darkMode ? 'bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20' : 'bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5'}`}></div>
      
      <header className={`relative backdrop-blur-xl border-b sticky top-0 z-50 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-slate-200/60'}`}>
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'}`}
            >
              <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`} />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200/50 transform -rotate-3 hover:rotate-0 transition-transform">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className={`absolute -top-1 -right-1 w-3 h-3 ${
                  botStatus === 'active' ? 'bg-green-500' : 'bg-slate-400'
                } rounded-full border-2 border-white`}></div>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'}`}>
                  {bot?.name || "Mi Bot"}
                </h1>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${
                    botStatus === 'active' ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-slate-400'
                  }`}>
                    {botStatus === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                  {syncingStatus && (
                    <span className={`text-xs ml-2 flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Sincronizando...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              title={darkMode ? "Modo claro" : "Modo oscuro"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={clearFlow}
              className={`px-4 py-2 rounded-xl flex items-center transition-all shadow-lg ${
                darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              title="Limpiar todo el flujo"
            >
              <Trash className="w-4 h-4 mr-2" />
              Limpiar todo
            </button>
            <button 
              onClick={saveFlow} 
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-200/50 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button 
              onClick={toggleBotStatus}
              disabled={syncingStatus}
              className={`px-4 py-2 rounded-xl flex items-center transition-all shadow-lg ${
                botStatus === "active" 
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-red-200/50" 
                  : "bg-green-600 hover:bg-green-700 text-white shadow-green-200/50"
              } ${syncingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {syncingStatus ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando...</>
              ) : botStatus === "active" ? (
                <><Square className="w-4 h-4 mr-2" /> Detener</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Iniciar</>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={`mx-6 my-2 px-4 py-3 rounded-xl flex items-center justify-between backdrop-blur-sm ${
        botStatus === 'active' 
          ? darkMode ? 'bg-green-900/30 border border-green-800' : 'bg-green-50/80 border border-green-200'
          : darkMode ? 'bg-yellow-900/30 border border-yellow-800' : 'bg-yellow-50/80 border border-yellow-200'
      }`}>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${
            botStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
          }`}></div>
          <span className={`text-sm font-medium ${
            botStatus === 'active' 
              ? darkMode ? 'text-green-400' : 'text-green-700'
              : darkMode ? 'text-yellow-400' : 'text-yellow-700'
          }`}>
            {botStatus === 'active' ? 'Bot activo en Telegram' : 'Bot inactivo'}
          </span>
        </div>
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Cualquier nodo puede iniciar el ciclo excepto Condición y Google Sheets
        </span>
      </div>

      <div className="flex-1 flex">
        <div className={`w-64 backdrop-blur-xl border-r p-4 overflow-y-auto ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-slate-200/60'}`}>
          <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-white' : ''}`}>
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            Nodos
          </h3>
          <div className="space-y-2">
            <button onClick={() => addNode("text")} 
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${darkMode ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-blue-50 hover:bg-blue-100'}`}>
              <MessageSquare className={`w-5 h-5 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Mensaje</span>
            </button>
            <button onClick={() => addNode("buttons")}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${darkMode ? 'bg-green-900/30 hover:bg-green-900/50' : 'bg-green-50 hover:bg-green-100'}`}>
              <CheckCircle className={`w-5 h-5 mr-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Botones</span>
            </button>
            <button onClick={() => addNode("imagetext")}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${darkMode ? 'bg-pink-900/30 hover:bg-pink-900/50' : 'bg-pink-50 hover:bg-pink-100'}`}>
              <Image className={`w-5 h-5 mr-3 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-pink-400' : 'text-pink-700'}`}>Imagen + Texto</span>
            </button>
            <button onClick={() => addNode("imagebuttons")}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${darkMode ? 'bg-purple-900/30 hover:bg-purple-900/50' : 'bg-purple-50 hover:bg-purple-100'}`}>
              <Image className={`w-5 h-5 mr-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>Imagen + Botones</span>
            </button>
            <button onClick={() => addNode("condition")}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${darkMode ? 'bg-yellow-900/30 hover:bg-yellow-900/50' : 'bg-yellow-50 hover:bg-yellow-100'}`}>
              <GitBranch className={`w-5 h-5 mr-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>Condición</span>
            </button>
            <button onClick={() => addNode("preguntar")}
                    className={`w-full flex items-center p-3 rounded-xl border-2 transition-all ${darkMode ? 'bg-orange-900/30 border-orange-800 hover:bg-orange-900/50' : 'bg-orange-50 border-orange-200 hover:bg-orange-100'}`}>
              <HelpCircle className={`w-5 h-5 mr-3 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>Preguntar y Guardar</span>
            </button>
            <button onClick={() => addNode("variable")}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${darkMode ? 'bg-indigo-900/30 hover:bg-indigo-900/50' : 'bg-indigo-50 hover:bg-indigo-100'}`}>
              <Database className={`w-5 h-5 mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Guardar Dato</span>
            </button>
            <button onClick={() => addNode("googlesheets")}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${darkMode ? 'bg-purple-900/30 hover:bg-purple-900/50' : 'bg-purple-50 hover:bg-purple-100'}`}>
              <Table2 className={`w-5 h-5 mr-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>Google Sheets</span>
            </button>
            <button onClick={() => addNode("delay")}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <Clock className={`w-5 h-5 mr-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Temporizador</span>
            </button>
          </div>
          <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-slate-200'}`}>
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-slate-50'}`}>
              <div className="flex justify-between text-sm mb-1">
                <span className={darkMode ? 'text-gray-300' : 'text-slate-600'}>Nodos usados</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{nodes.length}/10</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-slate-200'}`}>
                <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all" 
                     style={{ width: `${(nodes.length / 10) * 100}%` }} />
              </div>
              <p className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Plan gratuito: 10 nodos máximos
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color={darkMode ? "#374151" : "#aaa"} gap={16} />
            <Controls className={darkMode ? "bg-gray-800 border-gray-700" : ""} />
            <MiniMap className={darkMode ? "bg-gray-800 border-gray-700" : ""} />
          </ReactFlow>
        </div>
      </div>

      <div className={`fixed bottom-6 right-6 w-96 backdrop-blur-xl rounded-2xl shadow-2xl border p-4 ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-slate-200'}`}>
        <div className="flex items-center mb-3">
          <Send className={`w-4 h-4 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Probar Bot</h4>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && testBot()}
            placeholder="Escribe un mensaje..."
            className={`flex-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white/50 border-slate-200'}`}
          />
          <button onClick={testBot}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-sm shadow-lg shadow-blue-200/50">
            Enviar
          </button>
        </div>
        {testResponse && (
          <div className={`mt-3 p-3 rounded-xl text-sm ${darkMode ? 'bg-gray-700' : 'bg-slate-50'}`}>
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Respuesta:</span>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{testResponse}</p>
          </div>
        )}
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 max-w-md w-full shadow-2xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-bold">¿Limpiar todo el flujo?</h3>
            </div>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Esta acción eliminará todos los nodos y conexiones. No se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className={`px-4 py-2 border rounded-lg text-sm ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmClear}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Sí, limpiar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BotBuilderPage() {
  return (
    <ReactFlowProvider>
      <BotBuilder />
    </ReactFlowProvider>
  );
}