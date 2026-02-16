"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [stats, setStats] = useState({
    totalNodes: 0,
    activeBots: 0,
    totalBots: 0
  });

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Intentar cargar usuario, pero no fallar si da error
        try {
          const verifyRes = await fetch("/api/auth/verify", {
            signal: controller.signal,
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            if (isMounted) setUser(verifyData.user);
          }
        } catch (verifyErr) {
          console.warn("⚠️ Error en verify, continuando con bots:", verifyErr);
          // Usar email del token o mostrar "Usuario"
          const emailFromToken = localStorage.getItem("userEmail");
          if (emailFromToken && isMounted) {
            setUser({ email: emailFromToken });
          }
        }

        // Cargar bots
        const botsRes = await fetch("/api/bots", {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` }
        });

        clearTimeout(timeoutId);

        if (botsRes.ok) {
          const botsData = await botsRes.json();
          const botsList = botsData.bots || [];
          
          if (isMounted) {
            setBots(botsList);
            
            // Calcular estadísticas
            const totalNodes = botsList.reduce((acc, bot) => 
              acc + (bot.flow?.nodes?.length || 0), 0);
            const activeBots = botsList.filter(bot => bot.status === 'active').length;
            
            setStats({
              totalNodes,
              activeBots,
              totalBots: botsList.length
            });
            
            setError(null);
          }
        } else {
          throw new Error(`Error ${botsRes.status}: ${botsRes.statusText}`);
        }

      } catch (err) {
        console.error("❌ Error cargando dashboard:", err);
        if (isMounted) {
          if (err.name === 'AbortError') {
            setError("Tiempo de espera agotado. Intenta de nuevo.");
          } else {
            setError(err.message);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleDeleteBot = async (botId, botName, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`¿Estás seguro de que quieres eliminar el bot "${botName}"?`)) {
      return;
    }

    setDeletingId(botId);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/bots/${botId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedBots = bots.filter(bot => bot.id !== botId);
        setBots(updatedBots);
        
        // Actualizar estadísticas
        const totalNodes = updatedBots.reduce((acc, bot) => 
          acc + (bot.flow?.nodes?.length || 0), 0);
        const activeBots = updatedBots.filter(bot => bot.status === 'active').length;
        
        setStats({
          totalNodes,
          activeBots,
          totalBots: updatedBots.length
        });
      } else {
        const error = await response.json();
        alert(`Error al eliminar: ${error.message || 'Desconocido'}`);
      }
    } catch (err) {
      console.error('Error eliminando bot:', err);
      alert('Error al eliminar el bot. Intenta de nuevo.');
    } finally {
      setDeletingId(null);
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5"></div>
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-8"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-pulse opacity-75"></div>
              </div>
            </div>
            <h2 className="text-2xl font-light text-slate-700 mb-2">Cargando dashboard</h2>
            <p className="text-slate-400">Preparando tu espacio de trabajo</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-orange-600/5"></div>
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center border border-slate-100">
          <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-8 transform rotate-3">
            <span className="text-5xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Error de conexión</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-200"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fondo con gradiente sutil */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none"></div>
      
      {/* Header moderno */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo y branding */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200/50 transform -rotate-3 hover:rotate-0 transition-transform">
                  <span className="text-white text-2xl font-bold">B</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Bot Dashboard
                </h1>
                <p className="text-xs text-slate-400">Panel de control</p>
              </div>
            </div>

            {/* Perfil de usuario */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-slate-900">{user?.email || 'Usuario'}</p>
                  <p className="text-xs text-slate-400">Administrador</p>
                </div>
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-200/50 transform group-hover:scale-105 transition-all">
                    {getUserInitials()}
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        router.push('/login');
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <span>🚪</span>
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header con estadísticas */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Mis Bots</h2>
            <p className="text-slate-400">Gestiona y monitorea tus bots en tiempo real</p>
          </div>
          
          <Link
            href="/dashboard/bots/new"
            className="mt-4 md:mt-0 inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-2xl shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-200/50 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] group"
          >
            <span className="mr-3 text-xl group-hover:rotate-90 transition-transform">+</span>
            Crear nuevo bot
          </Link>
        </div>

        {/* Tarjetas de estadísticas */}
        {bots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">Total</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">{stats.totalBots}</p>
              <p className="text-sm text-slate-400">Bots creados</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">Activos</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">{stats.activeBots}</p>
              <p className="text-sm text-slate-400">Bots en funcionamiento</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <span className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full">Nodos</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">{stats.totalNodes}</p>
              <p className="text-sm text-slate-400">Nodos totales</p>
            </div>
          </div>
        )}

        {bots.length === 0 ? (
          <div className="relative bg-white rounded-3xl shadow-2xl p-16 text-center border border-slate-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
            <div className="relative">
              <div className="w-40 h-40 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-3 hover:rotate-0 transition-transform">
                <span className="text-7xl">🤖</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Comienza tu automatización</h3>
              <p className="text-slate-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                Crea tu primer bot y descubre cómo la automatización puede transformar tu forma de trabajar.
              </p>
              <Link
                href="/dashboard/bots/new"
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-2xl shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-200/50 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] text-lg group"
              >
                <span className="mr-3 text-2xl group-hover:rotate-90 transition-transform">+</span>
                Crear mi primer bot
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bots.map(bot => (
              <Link
                key={bot.id}
                href={`/dashboard/bots/${bot.id}`}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 overflow-hidden cursor-pointer"
              >
                {/* Barra de estado superior */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  bot.status === 'active' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                    : 'bg-gradient-to-r from-yellow-500 to-amber-400'
                }`}></div>
                
                <div className="p-8">
                  {/* Header del bot */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                          <span className="text-3xl">🤖</span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${
                          bot.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                        } rounded-full border-2 border-white`}></div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {bot.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          {bot.id.substring(0, 8)}...{bot.id.substring(bot.id.length - 4)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Solo el botón de eliminar */}
                    <button
                      onClick={(e) => handleDeleteBot(bot.id, bot.name, e)}
                      disabled={deletingId === bot.id}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Eliminar bot"
                    >
                      {deletingId === bot.id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-xl">🗑️</span>
                      )}
                    </button>
                  </div>

                  {/* Información del bot */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Token</span>
                      <span className="font-mono text-slate-600">
                        •••••{bot.token?.slice(-6)}
                      </span>
                    </div>
                    
                    {bot.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {bot.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Creado</span>
                      <span className="text-slate-600">{formatDate(bot.created_at)}</span>
                    </div>
                  </div>

                  {/* Estadísticas del flow */}
                  {bot.flow?.nodes && (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center text-xs text-slate-400 mb-1">
                          <span className="mr-1">📊</span>
                          Nodos
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                          {bot.flow.nodes.length}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center text-xs text-slate-400 mb-1">
                          <span className="mr-1">🔄</span>
                          Conexiones
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                          {bot.flow.edges?.length || 0}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Botón único de acción */}
                  <div className="w-full py-3.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-200/50 text-center">
                    Ver detalles y editar
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}