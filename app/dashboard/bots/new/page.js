"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Bot, 
  Key, 
  AlertCircle, 
  CheckCircle,
  Info,
  HelpCircle
} from "lucide-react";

export default function NewBotPage() {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTokenHelp, setShowTokenHelp] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token_storage = localStorage.getItem("token");
      const res = await fetch("/api/bots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token_storage}`,
        },
        body: JSON.stringify({ name, token }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/dashboard/bots/${data.bot.id}`);
      } else {
        setError(data.error || "Error al crear el bot");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Fondo con gradiente sutil */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none"></div>
      
      <div className="relative max-w-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Botón de volver */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 group transition-colors"
        >
          <div className="w-8 h-8 bg-white rounded-xl shadow-md flex items-center justify-center mr-2 group-hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </div>
          <span className="text-sm font-medium">Volver al dashboard</span>
        </Link>

        {/* Tarjeta principal */}
        <div className="relative">
          {/* Efecto de borde brillante */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-xl opacity-70"></div>
          
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Header con icono */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200/50 transform -rotate-3">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Crear Nuevo Bot
                </h1>
                <p className="text-slate-400 mt-1">
                  Conecta tu bot de Telegram con nuestra plataforma
                </p>
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error al crear el bot</p>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nombre */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 ml-1">
                  Nombre del Bot
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bot className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all group-hover:border-slate-300"
                    placeholder="Ej: Mi Bot de Soporte"
                    required
                  />
                </div>
                <p className="text-xs text-slate-400 ml-1">
                  Elige un nombre descriptivo para identificar tu bot fácilmente
                </p>
              </div>

              {/* Campo Token */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700 ml-1">
                    Token de Telegram
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTokenHelp(!showTokenHelp)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>¿Cómo obtenerlo?</span>
                  </button>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all group-hover:border-slate-300 font-mono text-sm"
                    placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                    required
                  />
                </div>

                {/* Ayuda para obtener token */}
                {showTokenHelp && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-3">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-blue-900">Cómo obtener tu token de Telegram:</p>
                        <ol className="list-decimal list-inside space-y-1 text-blue-800">
                          <li>Abre Telegram y busca <span className="font-mono bg-blue-100 px-1 py-0.5 rounded">@BotFather</span></li>
                          <li>Envía el comando <span className="font-mono bg-blue-100 px-1 py-0.5 rounded">/newbot</span></li>
                          <li>Sigue las instrucciones para crear tu bot</li>
                          <li>¡Copia el token que te proporciona BotFather!</li>
                        </ol>
                        <p className="text-xs text-blue-600 mt-2">
                          El token tiene este formato: <span className="font-mono">1234567890:ABCdefGHIjklMNOpqrsTUVwxyz</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-400 ml-1 flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  El token es sensible y único para cada bot
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 px-4 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="relative flex items-center justify-center space-x-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creando bot...</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-5 h-5" />
                        <span>Crear Bot</span>
                      </>
                    )}
                  </span>
                </button>

                <Link
                  href="/dashboard"
                  className="px-8 py-3.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all font-medium bg-white/50 backdrop-blur-sm hover:border-slate-300"
                >
                  Cancelar
                </Link>
              </div>
            </form>

            {/* Nota de seguridad */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Key className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-800">
                    Tu token está seguro con nosotros
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Lo almacenamos de forma segura y encriptada. Nunca compartimos tu token con terceros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de ayuda adicional */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            ¿Necesitas ayuda?{" "}
            <Link href="/support" className="text-blue-600 hover:text-blue-800 font-medium">
              Contacta a soporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}