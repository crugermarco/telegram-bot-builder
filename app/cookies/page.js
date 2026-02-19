import Link from "next/link";
import { 
  Cookie, 
  Info, 
  CheckCircle, 
  Settings, 
  Shield, 
  Mail, 
  Globe,
  ChevronRight,
  AlertCircle,
  Sliders,
  Eye,
  XCircle,
  Database,
  BarChart,
  Target,
  Lock
} from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Fondo con gradiente sutil */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none"></div>
      
      {/* Navbar */}
      <nav className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50 transform -rotate-3 hover:rotate-0 transition-transform">
                  <Cookie className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  TelegramBot Builder
                </h1>
                <p className="text-xs text-slate-400">Política de Cookies</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/register" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-200/50 font-medium"
              >
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Encabezado de la página */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mb-6 border border-blue-100">
            <Cookie className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Política de Cookies</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Uso de Cookies
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto">
            En TelegramBot Builder utilizamos cookies y tecnologías similares para mejorar tu experiencia, 
            personalizar el contenido y analizar nuestro tráfico.
          </p>
          <p className="text-sm text-slate-400 mt-4">
            Última actualización: 19 de febrero, 2026
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Tarjeta principal con efecto glassmorphism */}
        <div className="relative">
          {/* Efecto de borde brillante */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-xl opacity-70"></div>
          
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 border border-white/20">
            
            {/* Banner de consentimiento simulado */}
            <div className="mb-10 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 mb-1">Preferencias de cookies</h3>
                  <p className="text-sm text-amber-700 mb-4">
                    Puedes personalizar tus preferencias de cookies en cualquier momento. Las cookies estrictamente necesarias 
                    no pueden desactivarse ya que son esenciales para el funcionamiento de la plataforma.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium">
                      Aceptar todas
                    </button>
                    <button className="px-4 py-2 bg-white text-amber-700 rounded-lg hover:bg-amber-50 transition text-sm font-medium border border-amber-300">
                      Configurar preferencias
                    </button>
                    <button className="px-4 py-2 text-amber-700 hover:text-amber-900 transition text-sm font-medium">
                      Solo necesarias
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Índice / Tabla de contenido */}
            <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 text-blue-600 mr-2" />
                Contenido
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "¿Qué son las cookies?",
                  "Tipos de cookies que utilizamos",
                  "Cookies estrictamente necesarias",
                  "Cookies de rendimiento",
                  "Cookies de funcionalidad",
                  "Cookies de publicidad",
                  "Cookies de terceros",
                  "Cómo controlar las cookies",
                  "Consentimiento",
                  "Actualizaciones"
                ].map((item, index) => (
                  <a 
                    key={index}
                    href={`#section-${index + 1}`}
                    className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 text-blue-400 mr-1 group-hover:translate-x-1 transition-transform" />
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Sección 1 - ¿Qué son las cookies? */}
            <section id="section-1" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    1. ¿Qué son las cookies?
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600">
                  Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo (computadora, teléfono o tableta) 
                  cuando los visitas. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente, 
                  así como para proporcionar información a los propietarios del sitio.
                </p>
                <div className="bg-blue-50 rounded-xl p-4 mt-4">
                  <p className="text-sm text-blue-700 flex items-start">
                    <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    Las cookies no contienen información personal identificable como tu nombre o correo electrónico, 
                    a menos que tú mismo la hayas proporcionado a través de la plataforma.
                  </p>
                </div>
              </div>
            </section>

            {/* Sección 2 - Tipos de cookies */}
            <section id="section-2" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sliders className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    2. Tipos de cookies que utilizamos
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Clasificamos las cookies en las siguientes categorías según su finalidad y duración:
                </p>
                
                <div className="overflow-hidden border border-slate-200 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Duración</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">Necesarias</td>
                        <td className="px-4 py-3 text-sm text-slate-500">Sesión</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Imprescindibles para el funcionamiento básico</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">Preferencias</td>
                        <td className="px-4 py-3 text-sm text-slate-500">1 año</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Recuerdan tus configuraciones</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">Estadísticas</td>
                        <td className="px-4 py-3 text-sm text-slate-500">30 días</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Analizan cómo usas la plataforma</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">Marketing</td>
                        <td className="px-4 py-3 text-sm text-slate-500">90 días</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Personalizan la publicidad</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Sección 3 - Cookies necesarias */}
            <section id="section-3" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    3. Cookies estrictamente necesarias
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Estas cookies son esenciales para que puedas navegar por la plataforma y utilizar sus funciones. 
                  Sin estas cookies, no podemos ofrecer servicios como el inicio de sesión seguro o la gestión de tu cuenta.
                </p>
                
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Cookies necesarias que utilizamos:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-slate-900">session_id</span>
                        <p className="text-xs text-slate-500">Mantiene tu sesión iniciada mientras navegas</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-slate-900">csrf_token</span>
                        <p className="text-xs text-slate-500">Protege contra ataques de falsificación de solicitudes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-slate-900">auth_token</span>
                        <p className="text-xs text-slate-500">Token de autenticación para API requests</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-amber-600 text-sm mt-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Estas cookies no pueden desactivarse ya que son necesarias para el funcionamiento.
                </p>
              </div>
            </section>

            {/* Sección 4 - Cookies de rendimiento */}
            <section id="section-4" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BarChart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    4. Cookies de rendimiento
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Estas cookies nos permiten contar las visitas y fuentes de tráfico para poder medir y mejorar 
                  el rendimiento de nuestra plataforma. Nos ayudan a saber qué páginas son las más y menos populares.
                </p>
                
                <div className="grid gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">_ga (Google Analytics)</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">2 años</span>
                    </div>
                    <p className="text-sm text-slate-600">Utilizada para distinguir usuarios únicos</p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">_gid (Google Analytics)</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">24 horas</span>
                    </div>
                    <p className="text-sm text-slate-600">Utilizada para distinguir usuarios</p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">_gat (Google Analytics)</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">1 minuto</span>
                    </div>
                    <p className="text-sm text-slate-600">Utilizada para limitar el porcentaje de solicitudes</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 5 - Cookies de funcionalidad */}
            <section id="section-5" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    5. Cookies de funcionalidad
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Estas cookies permiten que la plataforma ofrezca una funcionalidad y personalización mejoradas. 
                  Pueden ser establecidas por nosotros o por proveedores externos.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">theme_preference</span>
                    <span className="text-xs text-slate-500">Recuerda tu tema preferido (claro/oscuro)</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">editor_layout</span>
                    <span className="text-xs text-slate-500">Guarda la configuración del editor visual</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">language</span>
                    <span className="text-xs text-slate-500">Idioma preferido</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">recent_bots</span>
                    <span className="text-xs text-slate-500">Lista de bots editados recientemente</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 6 - Cookies de publicidad */}
            <section id="section-6" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    6. Cookies de publicidad
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Estas cookies pueden ser establecidas a través de nuestra plataforma por nuestros socios publicitarios. 
                  Pueden ser utilizadas por esas empresas para crear un perfil de tus intereses y mostrarte anuncios relevantes.
                </p>
                
                <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                  <p className="text-sm text-pink-700 flex items-start">
                    <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    Actualmente no mostramos publicidad de terceros en nuestra plataforma, pero utilizamos cookies de marketing 
                    para campañas de remarketing en redes sociales y Google Ads.
                  </p>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-slate-900">_fbp (Facebook)</span>
                      <p className="text-xs text-slate-500">Utilizada para ofrecer publicidad en Facebook</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-slate-900">_gcl_au (Google Ads)</span>
                      <p className="text-xs text-slate-500">Utilizada para medir la eficacia de los anuncios</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 7 - Cookies de terceros */}
            <section id="section-7" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    7. Cookies de terceros
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Algunas cookies son colocadas por servicios de terceros que aparecen en nuestras páginas. 
                  No controlamos estas cookies y no tenemos acceso a los datos que recopilan.
                </p>
                
                <div className="overflow-hidden border border-slate-200 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Proveedor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Propósito</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Política</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">Google Analytics</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Análisis de tráfico</td>
                        <td className="px-4 py-3 text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Ver política</a>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">Stripe</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Procesamiento de pagos</td>
                        <td className="px-4 py-3 text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Ver política</a>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">Supabase</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Base de datos y autenticación</td>
                        <td className="px-4 py-3 text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Ver política</a>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">Vercel</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Alojamiento y analytics</td>
                        <td className="px-4 py-3 text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Ver política</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Sección 8 - Cómo controlar las cookies */}
            <section id="section-8" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    8. Cómo controlar las cookies
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las cookies que ya están 
                  en tu computadora y puedes configurar la mayoría de los navegadores para que no las acepten.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">Google Chrome</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                      <li>Haz clic en los tres puntos</li>
                      <li>Ve a Configuración</li>
                      <li>Privacidad y seguridad</li>
                      <li>Cookies y otros datos</li>
                    </ol>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">Firefox</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                      <li>Haz clic en el menú</li>
                      <li>Ve a Opciones</li>
                      <li>Privacidad y seguridad</li>
                      <li>Cookies y datos del sitio</li>
                    </ol>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">Safari</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                      <li>Ve a Preferencias</li>
                      <li>Privacidad</li>
                      <li>Gestionar datos del sitio web</li>
                    </ol>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">Edge</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                      <li>Haz clic en los tres puntos</li>
                      <li>Configuración</li>
                      <li>Cookies y permisos del sitio</li>
                    </ol>
                  </div>
                </div>
                
                <div className="bg-amber-50 rounded-xl p-4 mt-4">
                  <p className="text-sm text-amber-700 flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    Si bloqueas las cookies, es posible que algunas funciones de la plataforma no funcionen correctamente.
                  </p>
                </div>
              </div>
            </section>

            {/* Sección 9 - Consentimiento */}
            <section id="section-9" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    9. Consentimiento
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Al continuar navegando por nuestra plataforma, aceptas el uso de cookies de acuerdo con esta política. 
                  La primera vez que visitas nuestro sitio, mostramos un banner de cookies donde puedes configurar tus preferencias.
                </p>
                
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Registro de consentimiento:</h3>
                  <p className="text-sm text-slate-600 mb-2">
                    Guardamos un registro de tu consentimiento para futuras visitas:
                  </p>
                  <div className="bg-white rounded-lg p-3 font-mono text-xs border border-blue-100">
                    {`{
  "user_id": "xxx",
  "consent_date": "2026-02-19T10:30:00Z",
  "preferences": {
    "necessary": true,
    "performance": true,
    "functionality": true,
    "marketing": false
  },
  "ip_anonymized": "192.168.x.x"
}`}
                  </div>
                </div>
                
                <p className="text-slate-500 text-sm mt-3">
                  Puedes retirar tu consentimiento en cualquier momento cambiando la configuración de tu navegador 
                  o utilizando nuestro gestor de preferencias.
                </p>
              </div>
            </section>

            {/* Sección 10 - Actualizaciones */}
            <section id="section-10" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    10. Actualizaciones
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600">
                  Podemos actualizar esta política de cookies ocasionalmente para reflejar cambios en nuestras prácticas 
                  o por razones operativas, legales o regulatorias. Te notificaremos cualquier cambio significativo 
                  a través de la plataforma o por correo electrónico.
                </p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-24 text-slate-400">v2.1.0</span>
                    <span className="text-slate-600">19 Feb 2026 - Actualización de cookies de terceros</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-24 text-slate-400">v2.0.0</span>
                    <span className="text-slate-600">15 Ene 2026 - Nuevo gestor de preferencias</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-24 text-slate-400">v1.0.0</span>
                    <span className="text-slate-600">01 Dic 2025 - Versión inicial</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección de contacto */}
            <section className="mt-12 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    ¿Preguntas sobre cookies?
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Si tienes preguntas sobre nuestra política de cookies, contáctanos:
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <div className="space-y-3">
                    <p className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-slate-700">cookies@telegrambotbuilder.com</span>
                    </p>
                    <p className="flex items-center">
                      <Globe className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-slate-700">TelegramBot Builder, Inc.</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer de la página */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Consulta también nuestras{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
              Política de Privacidad
            </Link>{" "}
            y{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
              Términos y Condiciones
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Cookie className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-lg text-slate-900">TelegramBot Builder</span>
              </div>
              <p className="text-slate-500 text-sm">
                La plataforma más intuitiva para crear bots de Telegram sin programar.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Producto</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><Link href="/features" className="hover:text-blue-600 transition">Características</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-600 transition">Precios</Link></li>
                <li><Link href="/demo" className="hover:text-blue-600 transition">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Compañía</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><Link href="/about" className="hover:text-blue-600 transition">Nosotros</Link></li>
                <li><Link href="/blog" className="hover:text-blue-600 transition">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600 transition">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><Link href="/terms" className="hover:text-blue-600 transition">Términos</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-600 transition">Privacidad</Link></li>
                <li><Link href="/cookies" className="text-blue-600 font-medium">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-400 text-sm">
            © 2026 TelegramBot Builder. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}