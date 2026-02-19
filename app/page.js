import Link from "next/link";
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  TrendingUp,
  Globe,
  Smartphone,
  BarChart,
  Shield,
  Clock,
  HeadphonesIcon
} from "lucide-react";

export default function Home() {
  const plans = [
    {
      name: "Gratis",
      description: "Perfecto para empezar a crear tu primer bot",
      price: "0",
      period: "mes",
      features: [
        "1 bot activo",
        "10 nodos por bot",
        "Mensajes ilimitados",
        "Editor visual drag & drop",
        "Soporte por email",
        "Actualizaciones básicas"
      ],
      buttonText: "Comenzar Gratis",
      buttonLink: "/register",
      popular: false,
      gradient: "from-gray-500 to-gray-600"
    },
    {
      name: "Premium",
      description: "Ideal para emprendedores y pequeñas empresas",
      price: "99",
      period: "mes",
      features: [
        "3 bots activos",
        "20 nodos por bot",
        "Estadísticas avanzadas",
        "Integración con Google Sheets",
        "Soporte prioritario",
        "Exportación de datos"
      ],
      buttonText: "Elegir Premium",
      buttonLink: "/register?plan=premium",
      popular: true,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      name: "Elite",
      description: "La solución completa para negocios en crecimiento",
      price: "249",
      period: "mes",
      features: [
        "5 bots activos",
        "30 nodos por bot",
        "Integración con WhatsApp",
        "API personalizada",
        "Soporte 24/7 prioritario",
        "Capacitación personalizada"
      ],
      buttonText: "Elegir Elite",
      buttonLink: "/register?plan=elite",
      popular: false,
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      title: "Editor Visual",
      description: "Arrastra y suelta bloques para crear conversaciones complejas sin escribir una sola línea de código"
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Respuestas Instantáneas",
      description: "Tus bots responden en milisegundos, ofreciendo una experiencia fluida a tus usuarios"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Múltiples Usuarios",
      description: "Gestiona conversaciones simultáneas sin límite, ideal para atención al cliente"
    },
    {
      icon: <BarChart className="w-8 h-8 text-blue-600" />,
      title: "Estadísticas en Tiempo Real",
      description: "Monitorea el rendimiento de tus bots con métricas detalladas y análisis avanzados"
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: "Multiplataforma",
      description: "Tus bots funcionan en Telegram, WhatsApp y otras plataformas con un solo clic"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Seguridad Garantizada",
      description: "Tus datos y los de tus usuarios están protegidos con encriptación de grado empresarial"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar mejorada */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50 transform -rotate-3 hover:rotate-0 transition-transform">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  TelegramBot Builder
                </h1>
                <p className="text-xs text-gray-400">Crea bots sin código</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Características
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Precios
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Nosotros
              </Link>
              <div className="flex items-center space-x-4 ml-4">
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
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
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mb-8 border border-blue-100">
              <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600">Más de 10,000 bots creados</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Crea Bots de Telegram
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sin Escribir Código
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Editor visual drag & drop para construir chatbots profesionales en minutos. 
              Automatiza tu atención al cliente, ventas y más.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/register" 
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-xl shadow-blue-200/50"
              >
                Comenzar Gratis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-500 mt-1">Bots creados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">1M+</div>
                <div className="text-sm text-gray-500 mt-1">Conversaciones</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-500 mt-1">Tiempo activo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para crear
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                chatbots profesionales
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas intuitivas y potentes para automatizar tus conversaciones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planes para cada
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                etapa de crecimiento
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a tus necesidades. Todos incluyen actualizaciones gratuitas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  plan.popular ? 'border-2 border-blue-200 transform scale-105' : 'border border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                    Más Popular
                  </div>
                )}
                
                <div className={`h-2 bg-gradient-to-r ${plan.gradient}`}></div>
                
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-500 text-sm">{plan.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 ml-2">/{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={plan.buttonLink}
                    className={`block w-full text-center py-3 px-4 rounded-xl font-medium transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-200/50'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comienza a crear tus bots hoy mismo
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están automatizando sus conversaciones
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 font-semibold text-lg shadow-xl"
          >
            Crear mi primer bot gratis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <p className="text-sm text-blue-200 mt-4">
            Sin tarjeta de crédito · Cancela cuando quieras
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-lg">TelegramBot Builder</span>
              </div>
              <p className="text-gray-400 text-sm">
                La plataforma más intuitiva para crear bots de Telegram sin programar.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/features" className="hover:text-white transition">Características</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Precios</Link></li>
                <li><Link href="/demo" className="hover:text-white transition">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Compañía</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition">Nosotros</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/terms" className="hover:text-white transition">Términos</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacidad</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 TelegramBot Builder. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}