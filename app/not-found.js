export default function NotFound() {
  return (
    `<div class="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div class="max-w-md w-full text-center">
        <div class="text-6xl mb-4">🔍</div>
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Página no encontrada</h1>
        <p class="text-gray-600 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <a 
          href="/"
          class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Volver al inicio
        </a>
      </div>
    </div>`
  )
}
