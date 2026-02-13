import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">
           Telegram Bot Builder
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma SaaS para crear chatbots de Telegram sin código
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2"> Rápido de configurar</h3>
            <p>Usando Supabase como backend</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2"> Autenticación incluida</h3>
            <p>NextAuth + Supabase Auth</p>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Iniciar Sesión
          </Link>
          
          <Link 
            href="/register" 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Registrarse
          </Link>
        </div>
        
        <div className="mt-12 text-left bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2"> Configuración actual:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Supabase conectado</li>
            <li>NextAuth configurado</li>
            <li>Prisma ORM listo</li>
            <li>App Router activado</li>
          </ul>
        </div>
      </div>
    </div>
  )
}