import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Rocket, Crown, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Planes() {
  const navigate = useNavigate();

  // Estos IDs deben coincidir con los que genera tu base de datos (Seed)
  // En un entorno real, podrías hacer un fetch a /user/planes para obtenerlos
  const planesData = [
    {
      id: "id_del_plan_basico", // Reemplaza con un ID real o deja que el fetch lo llene
      nombre: "Emprendedor",
      slug: "basico",
      precio: "39.900",
      productos: 20,
      icon: <Rocket className="text-blue-500" size={32} />,
      features: [
        "Hasta 20 productos activos",
        "Panel de ventas básico",
        "Soporte por correo",
        "1 Sucursal física",
        "Visibilidad estándar"
      ],
      color: "from-blue-500/10 to-transparent",
      border: "border-gray-700",
      btnClass: "bg-gray-800 hover:bg-gray-700 text-white"
    },
    {
      id: "id_del_plan_avanzado", 
      nombre: "Empresarial",
      slug: "avanzado",
      precio: "79.900",
      productos: 80,
      popular: true,
      icon: <Crown className="text-amber-500" size={32} />,
      features: [
        "Hasta 80 productos activos",
        "Estadísticas avanzadas",
        "Soporte prioritario 24/7",
        "Múltiples sucursales",
        "Visibilidad destacada",
        "Gestión de mensajes PRO"
      ],
      color: "from-blue-600/20 to-blue-900/10",
      border: "border-blue-500",
      btnClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/40"
    }
  ];

  const seleccionarPlan = (planId) => {
    // Redirige al registro pasando el ID del plan por la URL
    navigate(`/register-vendedor?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-gray-200 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
            <Zap size={14} /> Membresías Marketplace
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Escala tu negocio en <span className="text-blue-500 text-shadow-blue">Cúcuta</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Elige el plan ideal para mostrar tus productos. Comienza hoy y llega a miles de clientes locales.
          </p>
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {planesData.map((plan) => (
            <div
              key={plan.slug}
              className={`relative rounded-[2.5rem] p-10 border-2 transition-all duration-500 hover:-translate-y-2 bg-[#1F2937] ${plan.border} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                  Más Recomendado
                </div>
              )}

              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${plan.color}`}>
                  {plan.icon}
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-white">${plan.precio}</span>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">COP / Mes</p>
                </div>
              </div>

              <h2 className="text-2xl font-black text-white mb-2">{plan.nombre}</h2>
              <p className="text-gray-400 text-sm mb-8">Perfecto para negocios que buscan {plan.slug === 'basico' ? 'iniciarse' : 'liderar'} el mercado digital.</p>

              {/* Lista de Características */}
              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-1 rounded-full">
                      <Check size={14} className="text-emerald-500" strokeWidth={3} />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Botón de Acción */}
              <button
                onClick={() => seleccionarPlan(plan.id)}
                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 group ${plan.btnClass}`}
              >
                Elegir este plan
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer de Confianza */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-10 opacity-60">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
            <ShieldCheck className="text-blue-500" />
            Pagos 100% Seguros
          </div>
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest border-l border-gray-700 md:pl-10">
            <Check className="text-emerald-500" />
            Sin contratos de permanencia
          </div>
        </div>

      </div>
    </div>
  );
}