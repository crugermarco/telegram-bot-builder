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
  ArrowLeft, Bot, Save, Power, Square, Send,
  MessageSquare, CheckCircle, GitBranch, Webhook, Clock,
  Plus, Trash2, Copy, Zap, Play, Edit, X, Database, Trash, ChevronDown, ChevronUp,
  Table2, CheckCircle as CheckCircleIcon, Flag, HelpCircle
} from "lucide-react";

// ========== LISTA DE VARIABLES UNIFICADA ==========
// Esta misma lista se usa en TODOS los nodos que manejan variables
const AVAILABLE_VARIABLES = [
  { id: "fecha", label: "📅 Fecha", ejemplo: "13/2/2026", desc: "Fecha actual" },
  { id: "nombre", label: "👤 Nombre", ejemplo: "Juan Pérez", desc: "Nombre completo del usuario" },
  { id: "respuesta", label: "💬 Respuesta", ejemplo: "Sí, me gusta", desc: "Última respuesta del usuario" },
  { id: "id", label: "🆔 ID", ejemplo: "123456789", desc: "ID de Telegram del usuario" },
  { id: "hora", label: "⏰ Hora", ejemplo: "15:30", desc: "Hora actual" },
  { id: "ultimo_mensaje", label: "📨 Último mensaje", ejemplo: "Hola bot", desc: "Último mensaje enviado" },
  { id: "username", label: "🔤 Username", ejemplo: "@usuario123", desc: "Nombre de usuario de Telegram" },
  { id: "email", label: "📧 Email", ejemplo: "cliente@email.com", desc: "Correo electrónico" },
  { id: "telefono", label: "📱 Teléfono", ejemplo: "5512345678", desc: "Número de teléfono" },
  { id: "direccion", label: "🏠 Dirección", ejemplo: "Calle 123 #45-67", desc: "Dirección física" },
  { id: "ciudad", label: "🌆 Ciudad", ejemplo: "Ciudad de México", desc: "Ciudad" },
  { id: "edad", label: "🎂 Edad", ejemplo: "25", desc: "Edad del usuario" },
  { id: "fecha_nacimiento", label: "📅 Fecha nacimiento", ejemplo: "15/05/1990", desc: "Fecha de nacimiento" },
  { id: "comentario", label: "💭 Comentario", ejemplo: "Me encanta el servicio", desc: "Comentario adicional" },
  { id: "callback_data", label: "🔄 Callback", ejemplo: "opcion_1", desc: "Datos del botón presionado" }
];

// ========== NODO DE TEXTO ==========
const TextMessageNode = ({ id, data, isConnectable, onUpdate }) => {
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
    <div className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-blue-500 min-w-[300px] group">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-1.5 bg-blue-100 rounded-lg mr-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-semibold text-blue-700">Mensaje</span>
        </div>
        <button
          onClick={handleDelete}
          className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>

      <textarea
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        rows="4"
        className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        placeholder="Escribe tu mensaje..."
      />
      
      <div className="mt-2 flex items-center">
        <label className="flex items-center text-xs text-gray-600">
          <input
            type="checkbox"
            checked={data.typing || false}
            onChange={(e) => onUpdate?.({ typing: e.target.checked })}
            onClick={(e) => e.stopPropagation()}
            className="mr-1.5 rounded border-gray-300"
          />
          Simular escritura
        </label>
      </div>
      
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
    </div>
  );
};

// ========== NODO DE BOTONES - SIMPLIFICADO ==========
const ButtonsNode = ({ id, data, isConnectable, onUpdate }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [question, setQuestion] = useState(data.question || "¿Qué opción prefieres?");
  const [options, setOptions] = useState(data.options || ["Sí", "No"]);

  const addOption = () => {
    const newOptions = [...options, `Opción ${options.length + 1}`];
    setOptions(newOptions);
    onUpdate?.({ question, options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onUpdate?.({ question, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onUpdate?.({ question, options: newOptions });
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
            className="absolute text-[10px] text-green-700 font-medium whitespace-nowrap bg-green-50 px-2 py-0.5 rounded-full"
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
    <div className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-green-500 min-w-[350px] group">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-green-500" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="p-1.5 bg-green-100 rounded-lg mr-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <span className="font-semibold text-green-700">Botones</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditor(!showEditor);
            }}
            className="p-1.5 hover:bg-green-100 rounded-lg transition"
          >
            <Edit className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {!showEditor ? (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="mb-3 font-medium text-gray-800 border-b pb-2">
            <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">📢 PREGUNTA:</span>
            {question}
          </div>
          
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">🔘 OPCIONES:</span>
            {options.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {options.map((opt, i) => (
                  <div key={i} className="bg-white px-3 py-2 rounded-lg border border-green-200 shadow-sm">
                    <span className="font-medium text-sm">{opt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3">
                <span className="text-gray-400 italic">Sin opciones</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded-lg space-y-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between sticky top-0 bg-gray-50 py-2">
            <span className="text-xs font-semibold text-gray-700">EDITAR BOTONES</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditor(false);
              }}
              className="p-1 hover:bg-gray-200 rounded-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              📢 Pregunta
            </label>
            <textarea
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                onUpdate?.({ question, options });
              }}
              rows="2"
              placeholder="Ej: ¿Deseas continuar?"
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                🔘 Opciones
              </label>
              <span className="text-xs text-gray-500">
                {options.length} configuradas
              </span>
            </div>
            
            {options.map((opt, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border space-y-2 mb-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Opción #{idx + 1}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(idx);
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder="Texto del botón"
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400">
                  El usuario verá este texto y el bot enviará ESTE MISMO TEXTO como respuesta
                </p>
              </div>
            ))}
            
            <button
              onClick={addOption}
              className="w-full mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Opción
            </button>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs text-yellow-700">
              <strong>⚡ SIMPLIFICADO:</strong><br />
              • El texto del botón ES el valor que se envía<br />
              • No más confusión entre "texto" y "valor"<br />
              • La condición compara directamente con el texto del botón
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

// ========== NODO DE CONDICIÓN ==========
const ConditionNode = ({ id, data, isConnectable, onUpdate }) => {
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
    <div className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-yellow-500 min-w-[280px] group">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-yellow-500" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="p-1.5 bg-yellow-100 rounded-lg mr-2">
            <GitBranch className="w-5 h-5 text-yellow-600" />
          </div>
          <span className="font-semibold text-yellow-700">Condición</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditor(!showEditor);
            }}
            className="p-1.5 hover:bg-yellow-100 rounded-lg transition"
          >
            <Edit className="w-4 h-4 text-yellow-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {!showEditor ? (
        <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
          <span className="bg-yellow-100 px-2 py-1 rounded">{variable || "variable"}</span>
          <span className="mx-2 font-bold">{getOperatorSymbol(operator)}</span>
          <span className="bg-yellow-100 px-2 py-1 rounded">{value || "valor"}</span>
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">EDITAR CONDICIÓN</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditor(false);
              }}
              className="p-1 hover:bg-gray-200 rounded-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Variable</label>
            <select
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              {AVAILABLE_VARIABLES.map(v => (
                <option key={v.id} value={v.id}>
                  {v.label} - {v.desc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Operador</label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="equals">Igual a (=)</option>
              <option value="contains">Contiene</option>
              <option value="greater">Mayor que ({'>'})</option>
              <option value="less">Menor que ({'<'})</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Valor a comparar</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="ej: si, aprobado, confirmado"
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              ⚠️ El valor debe coincidir EXACTAMENTE con la opción del botón
            </p>
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

// ========== NODO DE GOOGLE SHEETS - CON LISTA UNIFICADA ==========
const GoogleSheetsNode = ({ id, data, isConnectable, onUpdate }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [showHelp, setShowHelp] = useState(data.showHelp !== false);
  const [copied, setCopied] = useState(false);
  
  const [appsScriptUrl, setAppsScriptUrl] = useState(data.appsScriptUrl || "");
  const [sheetName, setSheetName] = useState(data.sheetName || "Hoja1");
  
  // Columnas seleccionadas por el usuario
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
      <div className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-purple-500 min-w-[500px] group relative">
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-purple-100 rounded-lg mr-2">
              <Table2 className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-semibold text-purple-700">📊 Guardar en Sheets</span>
          </div>
          <button
            onClick={handleDelete}
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
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

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
          <div className="flex items-start">
            <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-800 mb-1">Nombre de tu hoja</p>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="Ej: Registros, Ventas, Citas, Clientes..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                onClick={(e) => e.stopPropagation()}
              />
              <p className="text-xs text-gray-500 mt-1">La hoja se creará automáticamente si no existe</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
          <div className="flex items-start mb-3">
            <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-800">¿Qué datos quieres guardar?</p>
              <p className="text-xs text-gray-500 mb-3">Activa las columnas y elige la variable para cada una</p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 bg-gray-50 p-3 rounded-lg">
                {columns.map((col, idx) => {
                  const varInfo = AVAILABLE_VARIABLES.find(v => v.id === col.variable);
                  return (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-sm transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={col.activa}
                            onChange={() => toggleColumn(idx)}
                            className="w-4 h-4 text-purple-600 rounded mr-2"
                          />
                          <span className="text-xs font-medium text-gray-700">Columna {col.column}</span>
                        </div>
                        <button
                          onClick={() => removeColumn(idx)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          disabled={columns.length <= 1}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <select
                        value={col.variable}
                        onChange={(e) => changeVariable(idx, e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                className="w-full mt-3 px-3 py-2 bg-purple-100 text-purple-700 text-xs rounded-lg hover:bg-purple-200 flex items-center justify-center transition font-medium"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Agregar columna
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
          <div className="flex items-start mb-3">
            <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-800">Código para Google Apps Script</p>
              <p className="text-xs text-gray-500 mb-2">Copia este código personalizado con tus columnas</p>
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
          <p className="text-[11px] text-gray-500 mt-2 flex items-center">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full mr-2">✅ {activeCount} columnas activas</span>
            El código incluye solo las columnas que activaste
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
          <div className="flex items-start">
            <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">4</span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-800">Implementar Web App</p>
              <p className="text-xs text-gray-600 mt-1">
                En Apps Script: <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-mono">Implementar → Nueva implementación → Web App</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px]">Ejecutar como: Yo</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px]">Acceso: Cualquiera</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            URL de tu Web App <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="url"
              value={appsScriptUrl}
              onChange={(e) => setAppsScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/abcdef123456/exec"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono pr-10"
              onClick={(e) => e.stopPropagation()}
            />
            {appsScriptUrl && (
              <button
                onClick={() => copyToClipboard(appsScriptUrl)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded"
                title="Copiar URL"
              >
                <Copy className="w-4 h-4 text-gray-500" />
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
            className="px-4 py-2.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Descartar
          </button>
        </div>
        
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500 mt-3" />
      </div>
    );
  }

  return (
    <div className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-purple-500 min-w-[320px] group">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-1.5 bg-purple-100 rounded-lg mr-2">
            <Table2 className="w-5 h-5 text-purple-600" />
          </div>
          <span className="font-semibold text-purple-700">📊 Guardar en Sheets</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 hover:bg-blue-100 rounded-lg transition"
            title="Ver instrucciones"
          >
            <span className="text-xs font-bold text-blue-600 w-4 h-4 flex items-center justify-center">?</span>
          </button>
          <button
            onClick={() => setShowEditor(true)}
            className="p-1.5 hover:bg-purple-100 rounded-lg transition"
          >
            <Edit className="w-4 h-4 text-purple-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        {appsScriptUrl ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-mono mr-2">
                  ✅ CONFIGURADO
                </span>
                <span className="text-xs font-medium text-gray-700">
                  {sheetName}
                </span>
              </div>
            </div>
            
            <div className="mt-2 border-t border-gray-200 pt-2">
              <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Datos que se guardarán:</p>
              <div className="grid grid-cols-2 gap-1">
                {columns.filter(c => c.activa && c.variable).slice(0, 4).map((col, i) => {
                  const varInfo = AVAILABLE_VARIABLES.find(v => v.id === col.variable);
                  return (
                    <div key={i} className="flex items-center text-[10px] bg-white p-1.5 rounded border border-gray-200">
                      <span className="font-mono font-bold text-purple-700 mr-1">{col.column}:</span>
                      <span className="text-gray-600 truncate">{varInfo?.label || col.variable}</span>
                    </div>
                  );
                })}
                {columns.filter(c => c.activa && c.variable).length > 4 && (
                  <div className="text-[10px] text-gray-400 flex items-center">
                    +{columns.filter(c => c.activa && c.variable).length - 4} más
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-500 truncate flex items-center mt-2 bg-gray-100 p-2 rounded">
              <span className="truncate text-[10px] font-mono">{appsScriptUrl}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(appsScriptUrl);
                }}
                className="ml-1 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                title="Copiar URL"
              >
                <Copy className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-xs text-gray-400 italic text-center py-3 flex flex-col items-center">
            <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-[10px] font-medium mb-2 flex items-center">
              <span className="mr-1">📋</span> Sin configurar
            </span>
            Haz clic en <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded mx-1">?</span> para conectar con Sheets
          </div>
        )}
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditor(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Configurar Google Sheets</h3>
              <button
                onClick={() => {
                  setShowEditor(false);
                  setShowHelp(true);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <span className="bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center mr-1">?</span>
                Ayuda
              </button>
            </div>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL del Web App
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={appsScriptUrl}
                    onChange={(e) => setAppsScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full px-3 py-2 border rounded-lg text-sm font-mono pr-10"
                  />
                  {appsScriptUrl && (
                    <button
                      onClick={() => copyToClipboard(appsScriptUrl)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la hoja
                </label>
                <input
                  type="text"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="Hoja1"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Columnas
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {columns.map((col, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">Columna {col.column}</span>
                        <button
                          onClick={() => removeColumn(idx)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          disabled={columns.length <= 1}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">Columna</label>
                          <input
                            type="text"
                            value={col.column}
                            onChange={(e) => updateColumn(idx, "column", e.target.value.toUpperCase())}
                            className="w-full px-2 py-1.5 text-xs border rounded uppercase"
                            maxLength="2"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] text-gray-500 mb-1">Variable</label>
                          <select
                            value={col.variable}
                            onChange={(e) => updateColumn(idx, "variable", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border rounded"
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
                  className="w-full mt-2 px-3 py-2 bg-purple-100 text-purple-700 text-xs rounded-lg hover:bg-purple-200 flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Agregar columna
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 mt-2 border-t">
              <button
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
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
      
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500 mt-2" />
    </div>
  );
};

// ========== NODO DE PREGUNTAR Y GUARDAR - CON LISTA UNIFICADA ==========
const PreguntarGuardarNode = ({ id, data, isConnectable, onUpdate }) => {
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
    <div className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-orange-500 min-w-[320px] group">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-orange-500" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-1.5 bg-orange-100 rounded-lg mr-2">
            <HelpCircle className="w-5 h-5 text-orange-600" />
          </div>
          <span className="font-semibold text-orange-700">❓ Preguntar y Guardar</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowEditor(true)}
            className="p-1.5 hover:bg-orange-100 rounded-lg transition"
          >
            <Edit className="w-4 h-4 text-orange-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* VISTA PREVIA */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center mb-2">
          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-mono mr-2">
            ❓ PREGUNTA
          </span>
        </div>
        <div className="text-sm font-medium text-gray-800 mb-2">
          {pregunta}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
          <span className="font-mono bg-orange-50 px-1.5 py-0.5 rounded text-orange-700">
            {variableGuardar}
          </span>
          <span className="text-gray-400">→ se guardará aquí</span>
        </div>
        <div className="text-xs text-gray-500 mt-2 italic">
          "{mensajeConfirmacion.replace(/{{nombre}}/g, '[nombre]')}"
        </div>
      </div>

      {/* EDITOR */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditor(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <HelpCircle className="w-5 h-5 text-orange-600 mr-2" />
              Preguntar y Guardar
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pregunta <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                  rows="2"
                  placeholder="Ej: ¿Cuál es tu correo electrónico?"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardar respuesta en variable <span className="text-red-500">*</span>
                </label>
                <select
                  value={variableGuardar}
                  onChange={(e) => setVariableGuardar(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                >
                  {AVAILABLE_VARIABLES.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.label} - {v.desc} (ej: {v.ejemplo})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Esta variable podrás usarla luego en Google Sheets
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje de confirmación
                </label>
                <textarea
                  value={mensajeConfirmacion}
                  onChange={(e) => setMensajeConfirmacion(e.target.value)}
                  rows="2"
                  placeholder="Ej: ¡Gracias {{nombre}}! Tu respuesta ha sido guardada."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa {'{{'}{variableGuardar}{'}}'} para mostrar el valor guardado
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-800 flex items-start">
                  <span className="font-bold mr-1">📌</span>
                  <span>
                    <strong>Consejo:</strong> En el nodo de Google Sheets, selecciona la variable{' '}
                    <span className="font-mono bg-white px-1 py-0.5 rounded">{variableGuardar}</span>{' '}
                    para que estos datos lleguen a tu hoja.
                  </span>
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
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
      
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-orange-500 mt-2" />
    </div>
  );
};

// ========== NODO DE VARIABLE - CORREGIDO ==========
const VariableNode = ({ id, data, isConnectable, onUpdate }) => {
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
    <div className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-indigo-500 min-w-[320px] group">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-indigo-500" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="p-1.5 bg-indigo-100 rounded-lg mr-2">
            <Database className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="font-semibold text-indigo-700">Guardar Dato</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditor(!showEditor);
            }}
            className="p-1.5 hover:bg-indigo-100 rounded-lg transition"
          >
            <Edit className="w-4 h-4 text-indigo-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {!showEditor ? (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-mono bg-indigo-100 px-2 py-1 rounded text-indigo-700">
                {variableName}
              </span>
              <span className="mx-2 text-gray-600">=</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                {variableValue.replace(/{{|}}/g, '')}
              </span>
            </div>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Sheets
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            📤 Se enviará a Google Sheets
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded-lg space-y-3 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between sticky top-0 bg-gray-50 py-2">
            <span className="text-xs font-semibold text-gray-700">CONFIGURAR VARIABLE</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditor(false);
              }}
              className="p-1 hover:bg-gray-200 rounded-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-yellow-50 p-2 rounded-lg">
            <p className="text-xs text-yellow-700 flex items-center">
              <span className="font-bold mr-1">📌</span>
              El nombre DEBE coincidir con la columna en Google Sheets
            </p>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Nombre de variable <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
              placeholder="ej: fecha, nombre, respuesta, id"
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Valor a guardar <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={variableValue}
              onChange={(e) => setVariableValue(e.target.value)}
              placeholder="{{fecha}} / {{nombre}} / {{respuesta}}"
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">⚡ Variables predefinidas</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_VARIABLES.slice(0, 8).map((v, i) => (
                <button
                  key={i}
                  onClick={() => addPredefinedVar(v.id, `{{${v.id}}}`)}
                  className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded hover:bg-indigo-200 transition flex items-center"
                >
                  <span className="font-mono mr-1">{v.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Almacenamiento</label>
            <select
              value={storageType}
              onChange={(e) => setStorageType(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="temporal">💾 Solo sesión</option>
              <option value="permanente">☁️ Base de datos</option>
            </select>
          </div>

          <div className="bg-purple-50 p-2 rounded-lg">
            <p className="text-xs text-purple-700">
              <span className="font-bold">✅ MODO SHEETS:</span> La operación es siempre "Guardar"
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
      
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-indigo-500" />
    </div>
  );
};

// ========== NODO DE DELAY ==========
const DelayNode = ({ id, data, isConnectable, onUpdate }) => {
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
    <div className="px-4 py-3 shadow-md rounded-xl bg-white border-2 border-gray-500 min-w-[280px] group">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-gray-500" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="p-1.5 bg-gray-100 rounded-lg mr-2">
            <Clock className="w-5 h-5 text-gray-600" />
          </div>
          <span className="font-semibold text-gray-700">Temporizador</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditor(!showEditor);
            }}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {!showEditor ? (
        <div className="text-sm bg-gray-50 p-3 rounded-lg">
          ⏱️ Esperar {seconds} segundo(s)
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">CONFIGURAR TIEMPO</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditor(false);
              }}
              className="p-1 hover:bg-gray-200 rounded-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <input
            type="number"
            min="1"
            max="60"
            value={seconds}
            onChange={(e) => setSeconds(parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          />

          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
          >
            Guardar
          </button>
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-gray-500" />
    </div>
  );
};

// ========== COMPONENTE PRINCIPAL ==========
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

  const nodeTypes = useMemo(() => ({
    text: (props) => (
      <TextMessageNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
      />
    ),
    buttons: (props) => (
      <ButtonsNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
      />
    ),
    condition: (props) => (
      <ConditionNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
      />
    ),
    googlesheets: (props) => (
      <GoogleSheetsNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
      />
    ),
    delay: (props) => (
      <DelayNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
      />
    ),
    variable: (props) => (
      <VariableNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
      />
    ),
    preguntar: (props) => (
      <PreguntarGuardarNode 
        {...props} 
        onUpdate={(newData) => updateNodeData(props.id, newData)} 
      />
    )
  }), []);

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
          setBot(botData.bot);
          setBotStatus(botData.bot.status || "inactive");
        }

        const flowRes = await fetch(`/api/bots/${params.botId}/flow`);
        if (flowRes.ok) {
          const flowData = await flowRes.json();
          if (flowData.flow?.nodes) setNodes(flowData.flow.nodes);
          if (flowData.flow?.edges) setEdges(flowData.flow.edges);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.botId) {
      loadBot();
    }
  }, [params.botId, router]);

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
      }
    } catch (error) {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const toggleBotStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const action = botStatus === "active" ? "stop" : "start";
      
      const res = await fetch(`/api/bots/${params.botId}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setBotStatus(botStatus === "active" ? "inactive" : "active");
        alert(`✅ Bot ${botStatus === "active" ? "detenido" : "iniciado"}`);
      }
    } catch (error) {
      alert("Error al cambiar estado");
    }
  };

  const testBot = async () => {
    if (!testMessage.trim()) return;
    try {
      const res = await fetch(`/api/bots/${params.botId}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testMessage })
      });
      const data = await res.json();
      setTestResponse(data.response || "✅ Mensaje recibido");
    } catch (error) {
      setTestResponse("❌ Error");
    }
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
              question: "¿Deseas continuar?", 
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
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{bot?.name || "Mi Bot"}</h1>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${botStatus === "active" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></span>
                <span className="text-sm text-gray-600">{botStatus === "active" ? "Activo" : "Inactivo"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={saveFlow} disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button onClick={toggleBotStatus}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    botStatus === "active" 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}>
            {botStatus === "active" ? (
              <><Square className="w-4 h-4 mr-2" /> Detener</>
            ) : (
              <><Play className="w-4 h-4 mr-2" /> Publicar</>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <h3 className="font-bold mb-4 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            Nodos
          </h3>
          <div className="space-y-2">
            <button onClick={() => addNode("text")} 
                    className="w-full flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100">
              <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
              <span className="font-medium text-blue-700">Mensaje</span>
            </button>
            <button onClick={() => addNode("buttons")}
                    className="w-full flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium text-green-700">Botones</span>
            </button>
            <button onClick={() => addNode("condition")}
                    className="w-full flex items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100">
              <GitBranch className="w-5 h-5 text-yellow-600 mr-3" />
              <span className="font-medium text-yellow-700">Condición</span>
            </button>
            <button onClick={() => addNode("preguntar")}
                    className="w-full flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 border-2 border-orange-200">
              <HelpCircle className="w-5 h-5 text-orange-600 mr-3" />
              <span className="font-medium text-orange-700">Preguntar y Guardar</span>
            </button>
            <button onClick={() => addNode("variable")}
                    className="w-full flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100">
              <Database className="w-5 h-5 text-indigo-600 mr-3" />
              <span className="font-medium text-indigo-700">Guardar Dato</span>
            </button>
            <button onClick={() => addNode("googlesheets")}
                    className="w-full flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100">
              <Table2 className="w-5 h-5 text-purple-600 mr-3" />
              <span className="font-medium text-purple-700">📊 Google Sheets</span>
            </button>
            <button onClick={() => addNode("delay")}
                    className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <Clock className="w-5 h-5 text-gray-600 mr-3" />
              <span className="font-medium text-gray-700">Temporizador</span>
            </button>
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span>Nodos usados</span>
                <span className="font-bold">{nodes.length}/10</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" 
                     style={{ width: `${(nodes.length / 10) * 100}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
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
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border p-4">
        <div className="flex items-center mb-3">
          <Send className="w-4 h-4 mr-2 text-blue-600" />
          <h4 className="font-semibold">Probar Bot</h4>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && testBot()}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
          <button onClick={testBot}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Enviar
          </button>
        </div>
        {testResponse && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
            <span className="font-medium">Respuesta:</span>
            <p className="mt-1">{testResponse}</p>
          </div>
        )}
      </div>
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