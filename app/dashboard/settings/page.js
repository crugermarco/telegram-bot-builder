"use client"
import { useState } from 'react'
import { Check, Crown, Zap, Building2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [currentPlan] = useState('free')
  
  const plans = [
    {
      name: 'Gratis',
      price: '0',
      priceId: 'free',
      features: [
        '1 bot activo',
        '10 nodos por bot',
        '1,000 mensajes/mes',
        'Editor visual básico',
        'Soporte por email'
      ],
      color: 'gray',
      buttonText: 'Plan Actual',
      disabled: true
    },
    {
      name: 'Básico',
      price: '29',
      priceId: 'basic',
      features: [
        '5 bots activos',
        '50 nodos por bot',
        '10,000 mensajes/mes',
        'Editor visual completo',
        'Botones interactivos',
        'Variables dinámicas',
        'Soporte prioritario'
      ],
      color: 'blue',
      buttonText: 'Actualizar a Básico',
      disabled: false
    },
    {
      name: 'Pro',
      price: '79',
      priceId: 'pro',
      features: [
        '20 bots activos',
        '200 nodos por bot',
        '100,000 mensajes/mes',
        'Webhooks',
        'Analytics avanzado',
        'Exportación de datos',
        'API personalizada',
        'Soporte 24/7'
      ],
      color: 'purple',
      buttonText: 'Actualizar a Pro',
      disabled: false,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '299',
      priceId: 'enterprise',
      features: [
        'Bots ilimitados',
        'Nodos ilimitados',
        'Mensajes ilimitados',
        'SSO',
        'SLA garantizado',
        'Auditoría',
        'Implementación dedicada',
        'Gerente de cuenta'
      ],
      color: 'orange',
      buttonText: 'Contactar Ventas',
      disabled: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-600">Administra tu cuenta y plan de suscripción</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Planes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Planes y Precios</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-lg border ${
                      plan.popular
                        ? 'border-blue-500 shadow-lg'
                        : currentPlan === plan.priceId
                        ? 'border-green-500'
                        : 'border-gray-200'
                    } p-6`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Más Popular
                      </span>
                    )}
                    
                    {currentPlan === plan.priceId && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Plan Actual
                      </span>
                    )}
                    
                    <div className="text-center mb-4">
                      <div className={`inline-flex p-3 bg-${plan.color}-100 rounded-xl mb-3`}>
                        {plan.name === 'Gratis' && <Crown className={`w-6 h-6 text-${plan.color}-600`} />}
                        {plan.name === 'Básico' && <Zap className={`w-6 h-6 text-${plan.color}-600`} />}
                        {plan.name === 'Pro' && <Crown className={`w-6 h-6 text-${plan.color}-600`} />}
                        {plan.name === 'Enterprise' && <Building2 className={`w-6 h-6 text-${plan.color}-600`} />}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600">/mes</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      disabled={plan.disabled || currentPlan === plan.priceId}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                        plan.disabled || currentPlan === plan.priceId
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : plan.name === 'Enterprise'
                          ? 'bg-gray-900 text-white hover:bg-gray-800'
                          : `bg-${plan.color}-600 text-white hover:bg-${plan.color}-700`
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar de configuración */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Perfil</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value="Juan Pérez"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value="juan@ejemplo.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  Guardar Cambios
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Seguridad</h3>
              
              <div className="space-y-4">
                <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium">
                  Cambiar Contraseña
                </button>
                
                <button className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition font-medium">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
