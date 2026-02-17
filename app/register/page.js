"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Lock, 
  CheckCircle, 
  Sparkles,
  Zap,
  Users,
  ArrowRight,
  CreditCard
} from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("gratis");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const plans = [
    {
      id: "gratis",
      name: "Gratis",
      description: "Para comenzar sin compromiso",
      price: 0,
      features: [
        "1 bot activo",
        "10 nodos por bot",
        "Mensajes ilimitados",
        "Editor visual drag & drop",
        "Soporte por email"
      ],
      gradient: "from-gray-500 to-gray-600",
      popular: false
    },
    {
      id: "premium",
      name: "Premium",
      description: "Para emprendedores",
      price: 249,
      features: [
        "3 bots activos",
        "20 nodos por bot",
        "Estadísticas avanzadas",
        "Integración con Google Sheets",
        "Soporte prioritario"
      ],
      gradient: "from-blue-600 to-purple-600",
      popular: true
    },
    {
      id: "elite",
      name: "Elite",
      description: "Para negocios en crecimiento",
      price: 599,
      features: [
        "5 bots activos",
        "30 nodos por bot",
        "Integración con WhatsApp",
        "API personalizada",
        "Soporte 24/7 prioritario"
      ],
      gradient: "from-purple-600 to-pink-600",
      popular: false
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Primero registrar al usuario
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const registerData = await registerRes.json();

      if (registerRes.ok) {
        // Auto login después del registro
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          localStorage.setItem("token", loginData.token);
          
          // Si seleccionó un plan de pago, redirigir a checkout
          if (selectedPlan !== "gratis") {
            router.push(`/checkout?plan=${selectedPlan}`);
          } else {
            router.push("/dashboard");
          }
        } else {
          setError("Error al iniciar sesión automáticamente");
        }
      } else {
        setError(registerData.error || "Error al registrar");
      }
    } catch (err) {
      setError("Error de conexión. Verifica tu internet.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4 relative overflow-hidden flex items-center justify-center">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} />
      </div>

      <div className="relative w-full max-w-6xl">
        {/* Efecto de borde brillante */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-xl opacity-70 animate-pulse"></div>
        
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Crea tu cuenta
            </h1>
            <p className="text-gray-500 mt-2">Elige tu plan y comienza a crear bots</p>
          </div>

          {/* Selector de planes */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id ? 'transform scale-105' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} rounded-xl opacity-20 ${
                  selectedPlan === plan.id ? 'opacity-30' : ''
                }`}></div>
                
                <div className={`relative bg-white rounded-xl p-6 border-2 transition-all ${
                  selectedPlan === plan.id 
                    ? 'border-blue-500 shadow-xl' 
                    : 'border-gray-100 hover:border-gray-200'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      Más Popular
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedPlan === plan.id
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    } flex items-center justify-center`}>
                      {selectedPlan === plan.id && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Gratis' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 text-sm ml-1">/mes</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs">
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario de registro */}
          <div className="max-w-md mx-auto">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Nombre completo
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Correo electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 ml-1">
                  Debe tener al menos 6 caracteres
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 px-4 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                <span className="relative flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creando cuenta...</span>
                    </>
                  ) : (
                    <>
                      <span>Crear cuenta {selectedPlan !== 'gratis' && 'y continuar al pago'}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              {/* Mensaje para planes de pago */}
              {selectedPlan !== 'gratis' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Proceso de pago seguro
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Después de crear tu cuenta, te redirigiremos a la pasarela de pago para completar la suscripción al plan {plans.find(p => p.id === selectedPlan)?.name}.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Términos y condiciones */}
              <p className="text-center text-xs text-gray-400 mt-6">
                Al registrarte, aceptas nuestros{" "}
                <Link href="/terms" className="text-gray-500 hover:text-gray-700 underline underline-offset-2">
                  Términos y Condiciones
                </Link>{" "}
                y{" "}
                <Link href="/privacy" className="text-gray-500 hover:text-gray-700 underline underline-offset-2">
                  Política de Privacidad
                </Link>
              </p>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link 
                href="/login" 
                className="font-medium text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}