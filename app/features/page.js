import NextLink from "next/link";
import { 
  Bot, 
  MessageSquare, 
  GitBranch, 
  Database, 
  Table2, 
  Clock, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  BarChart, 
  Smartphone,
  Sparkles,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Save,
  Download,
  Upload,
  Grid,
  Activity,
  HelpCircle,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  FileText as FileTextIcon,
  Key,
  Lock,
  Eye,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
  UserMinus,
  UserCheck,
  Bell,
  AlertCircle,
  Info,
  Plus,
  Minus,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Menu,
  Home,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Share,
  Link as LinkIcon,
  ExternalLink,
  DownloadCloud,
  UploadCloud,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  Volume1,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Image,
  File,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderTree,
  FilePlus,
  FileMinus,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileJson,
  FileSpreadsheet,
  FilePdf,
  FileZip,
  FileArchive,
  FileCheck,
  FileWarning,
  FileX,
  DollarSign,
  Send,
  Target,
  CalendarDays,
  MessageCircle,
  Webhook,
  Brain,
  PieChart,
  Slack,
  ShoppingCart
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      category: "Editor Visual",
      icon: <Grid className="w-6 h-6 text-blue-600" />,
      description: "Crea flujos de conversación complejos sin escribir una sola línea de código",
      items: [
        {
          title: "Drag & Drop Intuitivo",
          description: "Arrastra y suelta nodos para construir tu bot visualmente",
          icon: <Zap className="w-5 h-5 text-blue-500" />
        },
        {
          title: "Vista en tiempo real",
          description: "Visualiza los cambios instantáneamente mientras construyes",
          icon: <Eye className="w-5 h-5 text-blue-500" />
        },
        {
          title: "Múltiples tipos de nodo",
          description: "Más de 20 tipos de nodos para cada necesidad",
          icon: <GitBranch className="w-5 h-5 text-blue-500" />
        },
        {
          title: "Conexiones visuales",
          description: "Conecta nodos con flechas para definir el flujo de conversación",
          icon: <Activity className="w-5 h-5 text-blue-500" />
        }
      ]
    },
    {
      category: "Nodos Básicos",
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      description: "Los bloques fundamentales para cualquier bot",
      items: [
        {
          title: "Nodo de Texto",
          description: "Envía mensajes de texto con formato y variables dinámicas",
          icon: <MessageSquare className="w-5 h-5 text-purple-500" />
        },
        {
          title: "Nodo de Botones",
          description: "Crea menús interactivos con múltiples opciones",
          icon: <Grid className="w-5 h-5 text-purple-500" />
        },
        {
          title: "Nodo de Condición",
          description: "Toma decisiones basadas en las respuestas del usuario",
          icon: <GitBranch className="w-5 h-5 text-purple-500" />
        },
        {
          title: "Nodo de Variable",
          description: "Guarda y gestiona información del usuario",
          icon: <Database className="w-5 h-5 text-purple-500" />
        },
        {
          title: "Nodo de Google Sheets",
          description: "Guarda datos directamente en hojas de cálculo",
          icon: <Table2 className="w-5 h-5 text-purple-500" />
        },
        {
          title: "Nodo de Preguntar",
          description: "Solicita información al usuario y guárdala en variables",
          icon: <HelpCircle className="w-5 h-5 text-purple-500" />
        },
        {
          title: "Nodo de Temporizador",
          description: "Añade pausas entre mensajes para simular escritura",
          icon: <Clock className="w-5 h-5 text-purple-500" />
        }
      ]
    },
    {
      category: "Nodos Premium",
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
      description: "Integraciones avanzadas para emprendedores y negocios (Plan Premium)",
      badge: "PREMIUM",
      badgeColor: "amber",
      items: [
        {
          title: "Nodo de Pago",
          description: "Acepta pagos con Stripe, PayPal y MercadoPago directamente en Telegram",
          icon: <DollarSign className="w-5 h-5 text-amber-500" />
        },
        {
          title: "Email Marketing",
          description: "Conecta con Mailchimp, ActiveCampaign y ConvertKit para gestionar leads",
          icon: <Mail className="w-5 h-5 text-amber-500" />
        },
        {
          title: "Nodo de CRM",
          description: "Integración con HubSpot, Salesforce y Pipedrive para sincronizar contactos",
          icon: <Users className="w-5 h-5 text-amber-500" />
        },
        {
          title: "Recordatorios y Citas",
          description: "Crea eventos en Google Calendar y envía recordatorios automáticos",
          icon: <CalendarDays className="w-5 h-5 text-amber-500" />
        },
        {
          title: "Notificaciones SMS",
          description: "Envía mensajes de texto vía Twilio para alertas importantes",
          icon: <Smartphone className="w-5 h-5 text-amber-500" />
        }
      ]
    },
    {
      category: "Nodos Elite",
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      description: "Integraciones enterprise para empresas (Plan Elite)",
      badge: "ELITE",
      badgeColor: "purple",
      items: [
        {
          title: "WhatsApp Business API",
          description: "Integración oficial con WhatsApp para comunicación multicanal",
          icon: <MessageCircle className="w-5 h-5 text-purple-500" />
        },
        {
          title: "Base de Datos",
          description: "Conecta directamente con SQL (PostgreSQL, MySQL) y NoSQL (MongoDB)",
          icon: <Database className="w-5 h-5 text-purple-500" />
        },
        {
          title: "Webhook Personalizado",
          description: "Envía y recibe datos de cualquier API externa con webhooks configurables",
          icon: <Webhook className="w-5 h-5 text-purple-500" />
        },
        {
          title: "IA Avanzada",
          description: "Integración con GPT-4, Claude y Gemini para respuestas inteligentes",
          icon: <Brain className="w-5 h-5 text-purple-500" />
        },
        {
          title: "Análisis y Reporting",
          description: "Genera informes detallados y métricas avanzadas de tus bots",
          icon: <PieChart className="w-5 h-5 text-purple-500" />
        },
        {
          title: "Slack / Teams",
          description: "Notifica a tus equipos internos en Slack o Microsoft Teams",
          icon: <Slack className="w-5 h-5 text-purple-500" />
        },
        {
          title: "Shopify / WooCommerce",
          description: "Integración con tiendas online para gestionar productos y pedidos",
          icon: <ShoppingCart className="w-5 h-5 text-purple-500" />
        }
      ]
    },
    {
      category: "Gestión de Bots",
      icon: <Bot className="w-6 h-6 text-green-600" />,
      description: "Control total sobre tus bots desde un panel unificado",
      items: [
        {
          title: "Dashboard centralizado",
          description: "Visualiza todos tus bots y su estado en un solo lugar",
          icon: <Home className="w-5 h-5 text-green-500" />
        },
        {
          title: "Estadísticas en tiempo real",
          description: "Métricas de uso, conversaciones y rendimiento",
          icon: <BarChart className="w-5 h-5 text-green-500" />
        },
        {
          title: "Activación/Desactivación",
          description: "Controla cuándo están activos tus bots",
          icon: <Play className="w-5 h-5 text-green-500" />
        },
        {
          title: "Historial de versiones",
          description: "Guarda y recupera versiones anteriores de tus bots",
          icon: <Save className="w-5 h-5 text-green-500" />
        }
      ]
    },
    {
      category: "Seguridad",
      icon: <Shield className="w-6 h-6 text-indigo-600" />,
      description: "Tus datos y los de tus usuarios están protegidos",
      items: [
        {
          title: "Encriptación SSL/TLS",
          description: "Todos los datos en tránsito están encriptados",
          icon: <Lock className="w-5 h-5 text-indigo-500" />
        },
        {
          title: "Autenticación segura",
          description: "JWT con expiración para sesiones seguras",
          icon: <Key className="w-5 h-5 text-indigo-500" />
        },
        {
          title: "Backups automáticos",
          description: "Copia de seguridad diaria de tus bots",
          icon: <DownloadCloud className="w-5 h-5 text-indigo-500" />
        },
        {
          title: "Privacidad garantizada",
          description: "Nunca compartimos tus datos con terceros",
          icon: <Eye className="w-5 h-5 text-indigo-500" />
        }
      ]
    }
  ];

  const stats = [
    { label: "Bots creados", value: "10,000+", icon: <Bot className="w-6 h-6 text-blue-600" /> },
    { label: "Conversaciones", value: "1M+", icon: <MessageSquare className="w-6 h-6 text-purple-600" /> },
    { label: "Usuarios activos", value: "5,000+", icon: <Users className="w-6 h-6 text-green-600" /> },
    { label: "Tiempo activo", value: "99.9%", icon: <Activity className="w-6 h-6 text-orange-600" /> }
  ];

  const nodeTypes = [
    { name: "Texto", color: "blue", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "Botones", color: "green", icon: <Grid className="w-5 h-5" /> },
    { name: "Condición", color: "yellow", icon: <GitBranch className="w-5 h-5" /> },
    { name: "Variable", color: "indigo", icon: <Database className="w-5 h-5" /> },
    { name: "Google Sheets", color: "purple", icon: <Table2 className="w-5 h-5" /> },
    { name: "Preguntar", color: "orange", icon: <HelpCircle className="w-5 h-5" /> },
    { name: "Temporizador", color: "gray", icon: <Clock className="w-5 h-5" /> },
    { name: "Pagos", color: "amber", icon: <DollarSign className="w-5 h-5" />, premium: true },
    { name: "Email", color: "amber", icon: <Mail className="w-5 h-5" />, premium: true },
    { name: "CRM", color: "amber", icon: <Users className="w-5 h-5" />, premium: true },
    { name: "Calendario", color: "amber", icon: <CalendarDays className="w-5 h-5" />, premium: true },
    { name: "SMS", color: "amber", icon: <Smartphone className="w-5 h-5" />, premium: true },
    { name: "WhatsApp", color: "purple", icon: <MessageCircle className="w-5 h-5" />, elite: true },
    { name: "Base Datos", color: "purple", icon: <Database className="w-5 h-5" />, elite: true },
    { name: "Webhook", color: "purple", icon: <Webhook className="w-5 h-5" />, elite: true },
    { name: "IA", color: "purple", icon: <Brain className="w-5 h-5" />, elite: true },
    { name: "Reporting", color: "purple", icon: <PieChart className="w-5 h-5" />, elite: true },
    { name: "Slack", color: "purple", icon: <Slack className="w-5 h-5" />, elite: true },
    { name: "Shopify", color: "purple", icon: <ShoppingCart className="w-5 h-5" />, elite: true }
  ];

  const getColorClass = (color) => {
    const classes = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      green: "bg-green-50 border-green-200 text-green-600",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-600",
      purple: "bg-purple-50 border-purple-200 text-purple-600",
      orange: "bg-orange-50 border-orange-200 text-orange-600",
      gray: "bg-gray-50 border-gray-200 text-gray-600",
      amber: "bg-amber-50 border-amber-200 text-amber-600"
    };
    return classes[color] || classes.gray;
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Fondo con gradiente sutil */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none"></div>
      
      {/* Navbar */}
      <nav className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <NextLink href="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50 transform -rotate-3 hover:rotate-0 transition-transform">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  TelegramBot Builder
                </h1>
                <p className="text-xs text-slate-400">Creador de Bots Visual</p>
              </div>
            </NextLink>
            <div className="flex items-center space-x-4">
              <NextLink 
                href="/login" 
                className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition"
              >
                Iniciar Sesión
              </NextLink>
              <NextLink 
                href="/register" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-200/50 font-medium"
              >
                Comenzar Gratis
              </NextLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Encabezado de la página */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mb-6 border border-blue-100">
            <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Características del Producto</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Más de 20 tipos de nodos
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              para automatizar todo
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto">
            Desde nodos básicos hasta integraciones avanzadas con pagos, CRM, WhatsApp e IA. 
            Elige el plan que mejor se adapte a tus necesidades.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 text-center hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Demostración visual del editor */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative">
          {/* Efecto de borde brillante */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-xl opacity-70"></div>
          
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <Grid className="w-6 h-6 text-blue-600 mr-2" />
              Editor Visual por Nodos
            </h2>
            
            {/* Simulación del editor */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2">
                <div className="flex items-center space-x-2 bg-white rounded-lg p-2 border border-slate-200 flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Texto</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-2 border border-slate-200 flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Grid className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Botones</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-2 border border-slate-200 flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">Pagos</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-2 border border-slate-200 flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">WhatsApp</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-2 border border-slate-200 flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">IA</span>
                </div>
              </div>

              {/* Grid de nodos */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
                {nodeTypes.slice(0, 12).map((node, idx) => (
                  <div key={idx} className={`${getColorClass(node.color)} rounded-lg p-2 text-center border relative`}>
                    {node.premium && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>
                    )}
                    {node.elite && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full border-2 border-white"></div>
                    )}
                    <div className="flex justify-center mb-1">
                      {node.icon}
                    </div>
                    <span className="text-xs font-medium">{node.name}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-center text-sm text-slate-500">
                Más de 20 tipos de nodos disponibles. Los nodos marcados con <span className="w-2 h-2 bg-amber-500 rounded-full inline-block mx-1"></span> son Premium y <span className="w-2 h-2 bg-purple-600 rounded-full inline-block mx-1"></span> son Elite.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Características detalladas por categoría */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Todo lo que necesitas para crear
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              bots profesionales
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Desde nodos básicos hasta integraciones avanzadas. Escala según tus necesidades.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((category, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-100 overflow-hidden relative">
              {category.badge && (
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                  category.badgeColor === 'amber' 
                    ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                    : 'bg-purple-100 text-purple-700 border border-purple-200'
                }`}>
                  {category.badge}
                </div>
              )}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{category.category}</h3>
                </div>
                <p className="text-sm text-slate-500">{category.description}</p>
              </div>
              <div className="p-6 space-y-4">
                {category.items.map((item, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparativa de planes */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Elige el plan perfecto
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Todos los planes incluyen el editor visual completo. Escala según tus necesidades.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Plan Gratis */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Gratis</h3>
            <p className="text-3xl font-bold text-slate-900 mb-4">$0<span className="text-sm font-normal text-slate-500 ml-1">/mes</span></p>
            <p className="text-sm text-slate-500 mb-6">Perfecto para empezar</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>1 bot activo</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>10 nodos por bot</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>7 tipos de nodos básicos</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Editor visual completo</span>
              </li>
            </ul>
            <NextLink href="/register" className="block w-full text-center py-3 px-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition font-medium">
              Comenzar Gratis
            </NextLink>
          </div>

          {/* Plan Premium */}
          <div className="bg-gradient-to-b from-amber-50 to-orange-50 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-amber-200 p-8 hover:shadow-2xl transition-all transform scale-105 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-1 rounded-full text-xs font-medium">
              Más Popular
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Premium</h3>
            <p className="text-3xl font-bold text-slate-900 mb-4">$99<span className="text-sm font-normal text-slate-500 ml-1">/mes</span></p>
            <p className="text-sm text-slate-500 mb-6">Para emprendedores</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>3 bots activos</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>20 nodos por bot</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Nodos básicos + Premium</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Pagos, Email, CRM, Calendar, SMS</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Estadísticas avanzadas</span>
              </li>
            </ul>
            <NextLink href="/register?plan=premium" className="block w-full text-center py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition font-medium shadow-lg">
              Elegir Premium
            </NextLink>
          </div>

          {/* Plan Elite */}
          <div className="bg-gradient-to-b from-purple-50 to-pink-50 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 p-8 hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Elite</h3>
            <p className="text-3xl font-bold text-slate-900 mb-4">$249<span className="text-sm font-normal text-slate-500 ml-1">/mes</span></p>
            <p className="text-sm text-slate-500 mb-6">Para empresas</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>5 bots activos</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>30 nodos por bot</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Todos los nodos (Básicos + Premium + Elite)</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>WhatsApp API, IA, Webhooks, Base de datos</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>API personalizada y soporte 24/7</span>
              </li>
            </ul>
            <NextLink href="/register?plan=elite" className="block w-full text-center py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-medium">
              Elegir Elite
            </NextLink>
          </div>
        </div>
      </div>

      {/* Demo interactivo */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para crear tu primer bot?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Comienza gratis hoy mismo. No necesitas tarjeta de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NextLink 
              href="/register" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-slate-100 transition-all transform hover:scale-105 font-semibold text-lg shadow-xl"
            >
              <Zap className="w-5 h-5 mr-2" />
              Probar el Editor Gratis
            </NextLink>

          </div>
          <p className="text-sm text-blue-200 mt-4">
            Sin compromiso · Cancela cuando quieras
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-lg text-slate-900">TelegramBot Builder</span>
              </div>
              <p className="text-slate-500 text-sm">
                La plataforma más intuitiva para crear bots de Telegram sin programar.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Producto</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><NextLink href="/features" className="text-blue-600 font-medium">Características</NextLink></li>
                <li><NextLink href="/pricing" className="hover:text-blue-600 transition">Precios</NextLink></li>
                <li><NextLink href="/demo" className="hover:text-blue-600 transition">Demo</NextLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Compañía</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><NextLink href="/about" className="hover:text-blue-600 transition">Nosotros</NextLink></li>
                <li><NextLink href="/blog" className="hover:text-blue-600 transition">Blog</NextLink></li>
                <li><NextLink href="/contact" className="hover:text-blue-600 transition">Contacto</NextLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><NextLink href="/terms" className="hover:text-blue-600 transition">Términos</NextLink></li>
                <li><NextLink href="/privacy" className="hover:text-blue-600 transition">Privacidad</NextLink></li>
                <li><NextLink href="/cookies" className="hover:text-blue-600 transition">Cookies</NextLink></li>
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