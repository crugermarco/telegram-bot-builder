"use client"
import React, { useCallback, useState, useEffect } from 'react'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Save, Play, Square, Plus, MessageSquare, Mail, Webhook, Database, GitBranch, Clock, Settings, Trash2 } from 'lucide-react'

// Nodos personalizados
import TextMessageNode from './nodes/TextMessageNode'
import ConditionNode from './nodes/ConditionNode'
import WebhookNode from './nodes/WebhookNode'
import DelayNode from './nodes/DelayNode'

const nodeTypes = {
  textMessage: TextMessageNode,
  condition: ConditionNode,
  webhook: WebhookNode,
  delay: DelayNode,
}

export default function FlowEditor({ botId, initialNodes = [], initialEdges = [] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState(null)
  const [nodeLimit] = useState(10) // Límite para usuarios free
  const [isSaving, setIsSaving] = useState(false)

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds))
  }, [setEdges])

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const addNode = (type) => {
    // Verificar límite de nodos para usuarios free
    if (nodes.length >= nodeLimit) {
      alert(`Has alcanzado el límite de ${nodeLimit} nodos en el plan gratuito. Actualiza tu plan para crear bots más complejos.`)
      return
    }

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: getNodeLabel(type),
        content: '',
        config: {}
      }
    }
    setNodes((nds) => [...nds, newNode])
  }

  const getNodeLabel = (type) => {
    const labels = {
      textMessage: 'Mensaje de Texto',
      condition: 'Condición',
      webhook: 'Webhook',
      delay: 'Temporizador'
    }
    return labels[type] || type
  }

  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId))
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
    setSelectedNode(null)
  }

  const updateNodeData = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...newData } }
          : n
      )
    )
  }

  const saveFlow = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/bots/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId, nodes, edges })
      })
      if (response.ok) {
        alert('Flow guardado exitosamente')
      }
    } catch (error) {
      console.error('Error guardando flow:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-screen w-full flex">
      {/* Sidebar de nodos */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-bold text-gray-900 mb-4">Nodos Disponibles</h3>
        
        <div className="space-y-3">
          <div 
            onClick={() => addNode('textMessage')}
            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition group"
          >
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <span className="font-medium text-gray-900">Mensaje</span>
              <p className="text-xs text-gray-500">Texto, imagen, botones</p>
            </div>
          </div>

          <div 
            onClick={() => addNode('condition')}
            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-yellow-50 transition group"
          >
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 group-hover:bg-yellow-200">
              <GitBranch className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <span className="font-medium text-gray-900">Condición</span>
              <p className="text-xs text-gray-500">Si/Entonces/SiNo</p>
            </div>
          </div>

          <div 
            onClick={() => addNode('webhook')}
            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-purple-50 transition group"
          >
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-200">
              <Webhook className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <span className="font-medium text-gray-900">Webhook</span>
              <p className="text-xs text-gray-500">Integración API</p>
            </div>
          </div>

          <div 
            onClick={() => addNode('delay')}
            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 transition group"
          >
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-gray-200">
              <Clock className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <span className="font-medium text-gray-900">Temporizador</span>
              <p className="text-xs text-gray-500">Esperar X segundos</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nodos usados</span>
              <span className="font-bold text-gray-900">{nodes.length}/{nodeLimit}</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${(nodes.length / nodeLimit) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor de Flow */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
          
          <Panel position="top-right" className="bg-white p-2 rounded-lg shadow-lg">
            <div className="flex space-x-2">
              <button
                onClick={saveFlow}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Probar
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center">
                <Square className="w-4 h-4 mr-2" />
                Detener
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Panel de propiedades */}
      {selectedNode && (
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Propiedades del Nodo</h3>
            <button
              onClick={() => deleteNode(selectedNode.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <NodeProperties 
            node={selectedNode} 
            onUpdate={(data) => updateNodeData(selectedNode.id, data)}
          />
        </div>
      )}
    </div>
  )
}

function NodeProperties({ node, onUpdate }) {
  switch (node.type) {
    case 'textMessage':
      return <TextMessageProperties node={node} onUpdate={onUpdate} />
    case 'condition':
      return <ConditionProperties node={node} onUpdate={onUpdate} />
    case 'webhook':
      return <WebhookProperties node={node} onUpdate={onUpdate} />
    case 'delay':
      return <DelayProperties node={node} onUpdate={onUpdate} />
    default:
      return null
  }
}

function TextMessageProperties({ node, onUpdate }) {
  const [content, setContent] = useState(node.data.content || '')
  const [buttons, setButtons] = useState(node.data.buttons || [])
  const [showButtonForm, setShowButtonForm] = useState(false)

  const addButton = () => {
    setButtons([...buttons, { text: '', url: '', type: 'reply' }])
  }

  const updateButton = (index, field, value) => {
    const newButtons = [...buttons]
    newButtons[index][field] = value
    setButtons(newButtons)
    onUpdate({ ...node.data, buttons: newButtons })
  }

  const removeButton = (index) => {
    const newButtons = buttons.filter((_, i) => i !== index)
    setButtons(newButtons)
    onUpdate({ ...node.data, buttons: newButtons })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mensaje de Texto
        </label>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            onUpdate({ ...node.data, content: e.target.value })
          }}
          rows="6"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Escribe tu mensaje aquí... Puedes usar variables como {{nombre}}"
        />
        <p className="mt-1 text-xs text-gray-500">
          Variables disponibles: {'{nombre}'}, {'{email}'}, {'{fecha}'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Botones
        </label>
        
        {buttons.map((button, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={button.text}
              onChange={(e) => updateButton(index, 'text', e.target.value)}
              placeholder="Texto del botón"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <select
              value={button.type}
              onChange={(e) => updateButton(index, 'type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="reply">Responder</option>
              <option value="url">URL</option>
            </select>
            {button.type === 'url' && (
              <input
                type="url"
                value={button.url}
                onChange={(e) => updateButton(index, 'url', e.target.value)}
                placeholder="https://..."
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            )}
            <button
              onClick={() => removeButton(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={addButton}
          className="mt-2 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-1" />
          Agregar Botón
        </button>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={node.data.isTyping}
            onChange={(e) => onUpdate({ ...node.data, isTyping: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Simular escritura</span>
        </label>
      </div>
    </div>
  )
}

function ConditionProperties({ node, onUpdate }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Variable a evaluar
        </label>
        <input
          type="text"
          value={node.data.variable || ''}
          onChange={(e) => onUpdate({ ...node.data, variable: e.target.value })}
          placeholder="ej: {{respuesta}}"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Operador
        </label>
        <select
          value={node.data.operator || 'equals'}
          onChange={(e) => onUpdate({ ...node.data, operator: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="equals">Igual a</option>
          <option value="contains">Contiene</option>
          <option value="greater">Mayor que</option>
          <option value="less">Menor que</option>
          <option value="exists">Existe</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valor a comparar
        </label>
        <input
          type="text"
          value={node.data.value || ''}
          onChange={(e) => onUpdate({ ...node.data, value: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  )
}

function WebhookProperties({ node, onUpdate }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL del Webhook
        </label>
        <input
          type="url"
          value={node.data.url || ''}
          onChange={(e) => onUpdate({ ...node.data, url: e.target.value })}
          placeholder="https://api.ejemplo.com/webhook"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Método HTTP
        </label>
        <select
          value={node.data.method || 'POST'}
          onChange={(e) => onUpdate({ ...node.data, method: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Headers (JSON)
        </label>
        <textarea
          value={node.data.headers || ''}
          onChange={(e) => onUpdate({ ...node.data, headers: e.target.value })}
          rows="4"
          placeholder='{"Content-Type": "application/json"}'
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
        />
      </div>
    </div>
  )
}

function DelayProperties({ node, onUpdate }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tiempo de espera (segundos)
        </label>
        <input
          type="number"
          min="1"
          max="60"
          value={node.data.seconds || 1}
          onChange={(e) => onUpdate({ ...node.data, seconds: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  )
}
