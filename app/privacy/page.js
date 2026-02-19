import Link from "next/link";
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Cookie, 
  Mail, 
  FileText,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

export default function PrivacyPage() {
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
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  TelegramBot Builder
                </h1>
                <p className="text-xs text-slate-400">Política de Privacidad</p>
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
            <Shield className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Privacidad y Seguridad</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto">
            En TelegramBot Builder, nos tomamos muy en serio la privacidad de tus datos. 
            Esta política describe cómo recopilamos, usamos y protegemos tu información.
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
            
            {/* Índice / Tabla de contenido */}
            <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                Contenido
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Información que recopilamos",
                  "Cómo usamos tu información",
                  "Compartir información",
                  "Seguridad de datos",
                  "Tus derechos",
                  "Cookies y tecnologías similares",
                  "Menores de edad",
                  "Cambios a esta política",
                  "Contacto"
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

            {/* Sección 1 */}
            <section id="section-1" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    1. Información que recopilamos
                  </h2>
                  <p className="text-slate-600 mb-4">
                    Recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios:
                  </p>
                </div>
              </div>
              
              <div className="ml-14 space-y-4">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <Info className="w-4 h-4 text-blue-600 mr-2" />
                    Información de la cuenta
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Cuando te registras, recopilamos tu nombre, dirección de correo electrónico y contraseña (encriptada). 
                    Esta información es necesaria para crear y mantener tu cuenta.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <Info className="w-4 h-4 text-blue-600 mr-2" />
                    Información de los bots
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Almacenamos la configuración de tus bots, incluyendo tokens de Telegram, flujos de conversación 
                    y mensajes. Esta información es necesaria para el funcionamiento de nuestros servicios.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <Info className="w-4 h-4 text-blue-600 mr-2" />
                    Datos de uso
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Recopilamos información sobre cómo interactúas con nuestra plataforma, como las páginas que visitas, 
                    el tiempo que pasas en el sitio y las funciones que utilizas.
                  </p>
                </div>
              </div>
            </section>

            {/* Sección 2 */}
            <section id="section-2" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    2. Cómo usamos tu información
                  </h2>
                </div>
              </div>
              
              <div className="ml-14 space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-600">Proporcionar, mantener y mejorar nuestros servicios</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-600">Personalizar tu experiencia y ofrecer soporte técnico</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-600">Enviar actualizaciones, notificaciones y comunicaciones relacionadas con el servicio</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-600">Detectar y prevenir fraudes, abusos y problemas de seguridad</p>
                </div>
              </div>
            </section>

            {/* Sección 3 */}
            <section id="section-3" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    3. Compartir información
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  No vendemos tu información personal a terceros. Podemos compartir tu información en las siguientes circunstancias:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li className="ml-4">Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                  <li className="ml-4">Cuando sea requerido por ley o para proteger nuestros derechos legales</li>
                  <li className="ml-4">En caso de una fusión, adquisición o venta de activos</li>
                </ul>
              </div>
            </section>

            {/* Sección 4 */}
            <section id="section-4" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    4. Seguridad de datos
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">Encriptación SSL/TLS</span>
                    <span className="text-xs text-slate-500">Todos los datos en tránsito</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">Encriptación en reposo</span>
                    <span className="text-xs text-slate-500">Base de datos encriptada</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">Autenticación segura</span>
                    <span className="text-xs text-slate-500">JWT con expiración</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">Backups diarios</span>
                    <span className="text-xs text-slate-500">Recuperación ante desastres</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 5 */}
            <section id="section-5" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    5. Tus derechos
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Tienes derecho a:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <p className="text-slate-600">Acceder a tus datos personales</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <p className="text-slate-600">Rectificar información incorrecta</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <p className="text-slate-600">Solicitar la eliminación de tus datos</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <p className="text-slate-600">Exportar tus datos (portabilidad)</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mt-4">
                  Para ejercer estos derechos, contáctanos en <span className="font-mono text-blue-600">privacidad@telegrambotbuilder.com</span>
                </p>
              </div>
            </section>

            {/* Sección 6 - Cookies */}
            <section id="section-6" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    6. Cookies y tecnologías similares
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Utilizamos cookies para mejorar tu experiencia en nuestra plataforma:
                </p>
                <div className="overflow-hidden border border-slate-200 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Propósito</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Duración</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-900">Sesión</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Mantener tu sesión activa</td>
                        <td className="px-4 py-3 text-sm text-slate-500">Navegación</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-900">Preferencias</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Recordar configuración</td>
                        <td className="px-4 py-3 text-sm text-slate-500">1 año</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-900">Analíticas</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Mejorar el servicio</td>
                        <td className="px-4 py-3 text-sm text-slate-500">30 días</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Sección 7 - Menores */}
            <section id="section-7" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    7. Menores de edad
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600">
                  Nuestros servicios no están dirigidos a menores de 13 años. No recopilamos intencionalmente 
                  información de niños. Si descubrimos que hemos recopilado información de un menor, tomaremos 
                  medidas para eliminarla.
                </p>
              </div>
            </section>

            {/* Sección 8 - Cambios */}
            <section id="section-8" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    8. Cambios a esta política
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600">
                  Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos 
                  a través de la plataforma o por correo electrónico. Te recomendamos revisar esta página 
                  periódicamente para mantenerte informado.
                </p>
              </div>
            </section>

            {/* Sección 9 - Contacto */}
            <section id="section-9" className="scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    9. Contacto
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Si tienes preguntas sobre esta política de privacidad, contáctanos:
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <div className="space-y-3">
                    <p className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-slate-700">privacidad@telegrambotbuilder.com</span>
                    </p>
                    <p className="flex items-center">
                      <Shield className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-slate-700">TelegramBot Builder, Inc.</span>
                    </p>
                    <p className="flex items-center">
                      <Info className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-slate-700">123 Tech Street, San Francisco, CA 94105</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Línea de tiempo de actualizaciones */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Historial de actualizaciones</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <span className="w-24 text-slate-400">19 Feb 2026</span>
                  <span className="text-slate-600">Actualización de sección de cookies y derechos</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-24 text-slate-400">15 Ene 2026</span>
                  <span className="text-slate-600">Cambios en política de datos</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-24 text-slate-400">01 Dic 2025</span>
                  <span className="text-slate-600">Versión inicial</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer de la página */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Al usar TelegramBot Builder, aceptas esta política de privacidad. 
            Consulta también nuestros{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
              Términos y Condiciones
            </Link>.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
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
                <li><Link href="/privacy" className="text-blue-600 font-medium">Privacidad</Link></li>
                <li><Link href="/cookies" className="hover:text-blue-600 transition">Cookies</Link></li>
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