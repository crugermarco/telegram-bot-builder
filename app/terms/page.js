import Link from "next/link";
import { 
  FileText, 
  Scale, 
  AlertCircle, 
  CheckCircle, 
  Shield, 
  Mail, 
  Lock,
  Ban,
  CreditCard,
  RefreshCw,
  Globe,
  Users,
  MessageSquare,
  ChevronRight,
  Info,
  Gavel
} from "lucide-react";

export default function TermsPage() {
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
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  TelegramBot Builder
                </h1>
                <p className="text-xs text-slate-400">Términos y Condiciones</p>
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
            <Gavel className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Términos Legales</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto">
            Al utilizar TelegramBot Builder, aceptas estos términos. Te recomendamos leerlos detenidamente antes de usar nuestros servicios.
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
            
            {/* Advertencia inicial */}
            <div className="mb-10 p-6 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">Aceptación de los términos</h3>
                  <p className="text-sm text-amber-700">
                    Al acceder o utilizar la plataforma TelegramBot Builder, aceptas estar legalmente vinculado por estos términos. 
                    Si no estás de acuerdo con alguna parte, no puedes acceder al servicio.
                  </p>
                </div>
              </div>
            </div>

            {/* Índice / Tabla de contenido */}
            <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                Contenido
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Descripción del servicio",
                  "Registro y cuentas",
                  "Planes y pagos",
                  "Propiedad intelectual",
                  "Uso aceptable",
                  "Limitación de responsabilidad",
                  "Cancelación y terminación",
                  "Cambios en el servicio",
                  "Legislación aplicable",
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

            {/* Sección 1 - Descripción del servicio */}
            <section id="section-1" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    1. Descripción del servicio
                  </h2>
                </div>
              </div>
              
              <div className="ml-14 space-y-4">
                <p className="text-slate-600">
                  TelegramBot Builder es una plataforma que permite a los usuarios crear, configurar y gestionar bots para Telegram 
                  mediante un editor visual sin necesidad de programación. Nuestro servicio incluye:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                  <li>Editor visual drag & drop para crear flujos de conversación</li>
                  <li>Alojamiento y ejecución de bots en nuestros servidores</li>
                  <li>Estadísticas y análisis de rendimiento</li>
                  <li>Integraciones con servicios de terceros (según el plan contratado)</li>
                  <li>Soporte técnico según el nivel de suscripción</li>
                </ul>
              </div>
            </section>

            {/* Sección 2 - Registro y cuentas */}
            <section id="section-2" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    2. Registro y cuentas
                  </h2>
                </div>
              </div>
              
              <div className="ml-14 space-y-4">
                <p className="text-slate-600">
                  Para utilizar nuestros servicios, debes crear una cuenta proporcionando información precisa y completa. 
                  Eres responsable de:
                </p>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">Mantener la confidencialidad de tu contraseña</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">Todas las actividades que ocurran en tu cuenta</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">Notificarnos inmediatamente sobre cualquier uso no autorizado</span>
                    </li>
                  </ul>
                </div>
                <p className="text-slate-600">
                  No nos hacemos responsables por pérdidas derivadas del uso no autorizado de tu cuenta.
                </p>
              </div>
            </section>

            {/* Sección 3 - Planes y pagos */}
            <section id="section-3" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    3. Planes y pagos
                  </h2>
                </div>
              </div>
              
              <div className="ml-14 space-y-4">
                <h3 className="font-semibold text-slate-800">Planes disponibles:</h3>
                
                <div className="grid gap-4">
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900">Plan Gratis</span>
                      <span className="text-sm text-slate-500">$0/mes</span>
                    </div>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• 1 bot activo</li>
                      <li>• 10 nodos por bot</li>
                      <li>• Mensajes ilimitados</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900">Plan Premium</span>
                      <span className="text-sm text-purple-600 font-semibold">$99/mes</span>
                    </div>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• 3 bots activos</li>
                      <li>• 20 nodos por bot</li>
                      <li>• Estadísticas avanzadas</li>
                      <li>• Integraciones premium</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900">Plan Elite</span>
                      <span className="text-sm text-pink-600 font-semibold">$249/mes</span>
                    </div>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• 5 bots activos</li>
                      <li>• 30 nodos por bot</li>
                      <li>• Integración WhatsApp</li>
                      <li>• API personalizada</li>
                      <li>• Soporte 24/7 prioritario</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 mt-4">
                  <p className="text-sm text-amber-700 flex items-start">
                    <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    Los pagos se procesan de forma segura a través de Stripe. Las suscripciones se renuevan automáticamente. 
                    Puedes cancelar en cualquier momento desde tu panel de control.
                  </p>
                </div>
              </div>
            </section>

            {/* Sección 4 - Propiedad intelectual */}
            <section id="section-4" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    4. Propiedad intelectual
                  </h2>
                </div>
              </div>
              
              <div className="ml-14 space-y-4">
                <p className="text-slate-600">
                  <span className="font-semibold">Nuestra propiedad:</span> La plataforma, el código, el diseño, los logotipos 
                  y todos los elementos visuales son propiedad exclusiva de TelegramBot Builder.
                </p>
                <p className="text-slate-600">
                  <span className="font-semibold">Tu propiedad:</span> Tú conservas todos los derechos sobre los bots que creas, 
                  incluyendo los flujos de conversación, contenido y lógica de negocio. Nosotros no reclamamos propiedad 
                  sobre tu trabajo.
                </p>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-700 flex items-start">
                    <Shield className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    No utilizamos tus bots ni su contenido para entrenar modelos de IA ni para ningún otro propósito sin tu consentimiento explícito.
                  </p>
                </div>
              </div>
            </section>

            {/* Sección 5 - Uso aceptable */}
            <section id="section-5" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Ban className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    5. Uso aceptable
                  </h2>
                </div>
              </div>
              
              <div className="ml-14 space-y-4">
                <p className="text-slate-600 font-medium">No puedes utilizar nuestra plataforma para:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">Actividades ilegales</span>
                    <span className="text-xs text-slate-500">Cualquier actividad que viole leyes locales o internacionales</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">Spam</span>
                    <span className="text-xs text-slate-500">Envío masivo de mensajes no solicitados</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">Contenido dañino</span>
                    <span className="text-xs text-slate-500">Discurso de odio, acoso, contenido violento</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-medium text-slate-900 block mb-1">Ingeniería inversa</span>
                    <span className="text-xs text-slate-500">Intentar replicar o descompilar nuestra plataforma</span>
                  </div>
                </div>
                <p className="text-slate-600 mt-2">
                  Nos reservamos el derecho de suspender cuentas que violen estas políticas sin previo aviso.
                </p>
              </div>
            </section>

            {/* Sección 6 - Limitación de responsabilidad */}
            <section id="section-6" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    6. Limitación de responsabilidad
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Hasta el máximo permitido por la ley, TelegramBot Builder no será responsable por:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                  <li>Daños indirectos, incidentales o consecuentes</li>
                  <li>Pérdida de datos o interrupción del negocio</li>
                  <li>Fallos en servicios de terceros (Telegram, proveedores de pago, etc.)</li>
                  <li>Contenido generado por bots que violen derechos de terceros</li>
                </ul>
                <p className="text-slate-500 text-sm mt-4">
                  Nuestra responsabilidad total no excederá el monto pagado por el servicio en los 12 meses anteriores al reclamo.
                </p>
              </div>
            </section>

            {/* Sección 7 - Cancelación y terminación */}
            <section id="section-7" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    7. Cancelación y terminación
                  </h2>
                </div>
              </div>
              
              <div className="ml-14 space-y-4">
                <h3 className="font-semibold text-slate-800">Por tu parte:</h3>
                <p className="text-slate-600">
                  Puedes cancelar tu suscripción en cualquier momento desde el panel de control. 
                  La cancelación será efectiva al final del período de facturación actual.
                </p>
                
                <h3 className="font-semibold text-slate-800 mt-4">Por nuestra parte:</h3>
                <p className="text-slate-600">
                  Podemos suspender o terminar tu acceso inmediatamente si violas estos términos, 
                  sin responsabilidad adicional. Te notificaremos siempre que sea posible.
                </p>

                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Datos después de la cancelación:</span> Puedes exportar tus bots hasta 30 días después de la cancelación. 
                    Después de ese período, tus datos serán eliminados permanentemente.
                  </p>
                </div>
              </div>
            </section>

            {/* Sección 8 - Cambios en el servicio */}
            <section id="section-8" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    8. Cambios en el servicio
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600">
                  Podemos modificar o descontinuar funcionalidades del servicio en cualquier momento. 
                  En caso de cambios significativos que afecten tu uso, te notificaremos con al menos 30 días de anticipación.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Para cambios en estos términos, publicaremos la nueva versión en esta página con la fecha de actualización correspondiente.
                </p>
              </div>
            </section>

            {/* Sección 9 - Legislación aplicable */}
            <section id="section-9" className="mb-10 scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gavel className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    9. Legislación aplicable
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600">
                  Estos términos se rigen por las leyes de los Estados Unidos y del estado de California. 
                  Cualquier disputa relacionada con el servicio será resuelta en los tribunales de San Francisco, California.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Para usuarios internacionales, aceptas someterte a la jurisdicción de estos tribunales.
                </p>
              </div>
            </section>

            {/* Sección 10 - Contacto */}
            <section id="section-10" className="scroll-mt-24">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    10. Contacto
                  </h2>
                </div>
              </div>
              
              <div className="ml-14">
                <p className="text-slate-600 mb-4">
                  Para preguntas sobre estos términos, contáctanos:
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <div className="space-y-3">
                    <p className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-slate-700">legal@telegrambotbuilder.com</span>
                    </p>
                    <p className="flex items-center">
                      <Scale className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-slate-700">TelegramBot Builder, Inc.</span>
                    </p>
                    <p className="flex items-center">
                      <Globe className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-slate-700">123 Tech Street, San Francisco, CA 94105</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Línea de tiempo de actualizaciones */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Historial de versiones</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <span className="w-24 text-slate-400">v2.1.0</span>
                  <span className="text-slate-600">19 Feb 2026 - Actualización de planes y pagos</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-24 text-slate-400">v2.0.0</span>
                  <span className="text-slate-600">15 Ene 2026 - Nueva estructura de términos</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-24 text-slate-400">v1.0.0</span>
                  <span className="text-slate-600">01 Dic 2025 - Versión inicial</span>
                </div>
              </div>
            </div>

            {/* Aceptación */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl border border-blue-100 text-center">
              <p className="text-slate-600 text-sm">
                Al hacer clic en "Comenzar Gratis" o al utilizar nuestros servicios, 
                confirmas que has leído, entendido y aceptado estos términos y condiciones.
              </p>
              <div className="flex items-center justify-center space-x-2 mt-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-slate-700">Aceptado por defecto al registrarse</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer de la página */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Consulta también nuestra{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
              Política de Privacidad
            </Link>{" "}
            para más información sobre cómo manejamos tus datos.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
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
                <li><Link href="/terms" className="text-blue-600 font-medium">Términos</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-600 transition">Privacidad</Link></li>
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