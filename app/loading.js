export default function Loading() {
  return (
    `<div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando Telegram Bot Builder...</p>
      </div>
    </div>`
  )
}
