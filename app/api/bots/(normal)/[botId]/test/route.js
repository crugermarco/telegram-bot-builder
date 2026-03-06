import { NextResponse } from "next/server";

// Estado de la conversación (en producción deberías usar una base de datos)
const conversationState = new Map();

export async function POST(request, { params }) {
  try {
    const { message, nodes, edges, botId } = await request.json();
    
    // Obtener o crear estado de la conversación
    const sessionId = `user_${Date.now()}`; // En producción usar ID real del usuario
    let state = conversationState.get(sessionId) || { 
      currentNodeId: null,
      waitingFor: null 
    };

    let response = "";
    let currentNode = null;

    // Si no hay nodo actual, buscar el primer nodo que no sea condition ni googlesheets
    if (!state.currentNodeId) {
      currentNode = nodes.find(node => 
        node.type !== "condition" && node.type !== "googlesheets"
      );
      if (currentNode) {
        state.currentNodeId = currentNode.id;
      }
    } else {
      currentNode = nodes.find(node => node.id === state.currentNodeId);
    }

    if (!currentNode) {
      response = "No hay nodos configurados";
    } else {
      // Procesar según el tipo de nodo
      switch (currentNode.type) {
        case "text":
          response = currentNode.data.content || "Mensaje de texto";
          // Avanzar al siguiente nodo
          const nextEdge = edges.find(edge => edge.source === currentNode.id);
          if (nextEdge) {
            state.currentNodeId = nextEdge.target;
          }
          break;

        case "buttons":
          if (state.waitingFor === "button_response") {
            // El usuario respondió a los botones
            const selectedOption = message;
            response = `Seleccionaste: ${selectedOption}`;
            
            // Buscar el handle específico para esta opción
            const optionIndex = currentNode.data.options.findIndex(opt => opt === selectedOption);
            const nextEdgeForOption = edges.find(edge => 
              edge.source === currentNode.id && edge.sourceHandle === `opt${optionIndex}`
            );
            
            if (nextEdgeForOption) {
              state.currentNodeId = nextEdgeForOption.target;
            }
            state.waitingFor = null;
          } else {
            // Primera vez que se llega al nodo de botones
            response = currentNode.data.mensaje || "Selecciona una opción:";
            state.waitingFor = "button_response";
            // No avanzar, esperar respuesta
          }
          break;

        case "preguntar":
          if (state.waitingFor === "question_response") {
            // Guardar respuesta y mostrar confirmación
            const respuesta = message;
            let confirmacion = currentNode.data.mensajeConfirmacion || "¡Gracias!";
            // Reemplazar variables en el mensaje
            confirmacion = confirmacion.replace(/{{[^}]+}}/g, respuesta);
            response = confirmacion;
            
            // Avanzar al siguiente nodo
            const nextEdgeAfterQuestion = edges.find(edge => edge.source === currentNode.id);
            if (nextEdgeAfterQuestion) {
              state.currentNodeId = nextEdgeAfterQuestion.target;
            }
            state.waitingFor = null;
          } else {
            response = currentNode.data.pregunta || "¿Cuál es tu nombre?";
            state.waitingFor = "question_response";
          }
          break;

        case "delay":
          response = `Esperando ${currentNode.data.seconds || 1} segundos...`;
          // Simular delay y luego avanzar
          setTimeout(() => {
            const nextEdgeAfterDelay = edges.find(edge => edge.source === currentNode.id);
            if (nextEdgeAfterDelay) {
              state.currentNodeId = nextEdgeAfterDelay.target;
            }
          }, (currentNode.data.seconds || 1) * 1000);
          break;

        case "variable":
          response = `Variable ${currentNode.data.variableName} guardada con valor: ${currentNode.data.variableValue}`;
          // Avanzar al siguiente nodo
          const nextEdgeAfterVar = edges.find(edge => edge.source === currentNode.id);
          if (nextEdgeAfterVar) {
            state.currentNodeId = nextEdgeAfterVar.target;
          }
          break;

        default:
          response = "Tipo de nodo no soportado";
      }
    }

    // Guardar estado actualizado
    conversationState.set(sessionId, state);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error procesando mensaje" }, { status: 500 });
  }
}