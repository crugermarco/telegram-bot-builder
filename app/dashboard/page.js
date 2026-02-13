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

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        // 1. Verificar token
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // 2. Cargar usuario y bots en paralelo con timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

        const [verifyRes, botsRes] = await Promise.all([
          fetch("/api/auth/verify", {
            signal: controller.signal,
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("/api/bots", {
            signal: controller.signal,
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        clearTimeout(timeoutId);

        // 3. Procesar respuesta de verify
        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          if (isMounted) setUser(verifyData.user);
        }

        // 4. Procesar respuesta de bots
        if (botsRes.ok) {
          const botsData = await botsRes.json();
          console.log("✅ Bots cargados:", botsData);
          if (isMounted) {
            setBots(botsData.bots || []);
            setError(null);
          }
        } else {
          throw new Error(`Error ${botsRes.status}: ${botsRes.statusText}`);
        }

      } catch (err) {
        console.error("❌ Error cargando dashboard:", err);
        if (isMounted) {
          if (err.name === 'AbortError') {
            setError("⏱️ Tiempo de espera agotado. Intenta de nuevo.");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
          <p className="text-xs text-gray-400 mt-2">Esperando respuesta del servidor</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email || 'Usuario'}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Mis Bots</h2>
          <Link
            href="/dashboard/bots/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Nuevo Bot
          </Link>
        </div>

        {bots.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes bots</h3>
            <p className="text-gray-500 mb-6">Crea tu primer bot para empezar a automatizar</p>
            <Link
              href="/dashboard/bots/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear mi primer bot
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bots.map(bot => (
              <Link
                key={bot.id}
                href={`/dashboard/bots/${bot.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">🤖</span>
                      <h3 className="text-lg font-medium text-gray-900">{bot.name}</h3>
                    </div>
                    <p className="text-xs text-gray-400 font-mono mb-3">
                      {bot.id.substring(0, 8)}...
                    </p>
                    {bot.flow?.nodes && (
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          📊 {bot.flow.nodes.length} nodos
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}