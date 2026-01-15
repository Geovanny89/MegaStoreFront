import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Rocket, Crown, ArrowRight, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import api from "../../api/axios";

export default function Planes() {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await api.get('/vendedor/planes');
        console.log("soy el plan",response)
        setPlanes(response.data);
      } catch (error) {
        console.error("Error cargando planes de la DB:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanes();
  }, []);

  // Configuración visual de cada plan
  const getPlanVisualConfig = (nombre, productos) => {
    if (nombre === "Emprendedor") {
      return {
        icon: <Rocket className="text-blue-500" size={32} />,
        color: "from-blue-500/10 to-transparent",
        border: "border-gray-700",
        btnClass: "bg-gray-800 hover:bg-gray-700 text-white",
        slug: "basico",
        popular: false,
        features: [
          `Hasta ${productos} productos activos`,
          "Panel de ventas básico",
          "Soporte por correo",
          "1 Sucursal física",
          "Visibilidad estándar"
        ]
      };
    }
    // Configuración Premium
    return {
      icon: <Crown className="text-amber-500" size={32} />,
      color: "from-blue-600/20 to-blue-900/10",
      border: "border-blue-500",
      btnClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/40",
      slug: "avanzado",
      popular: true,
      features: [
        `Hasta ${productos} productos activos`,
        "Estadísticas avanzadas",
        "Soporte prioritario 24/7",
        "Múltiples sucursales",
        "Visibilidad destacada",
        "Gestión de mensajes PRO"
      ]
    };
  };

  const seleccionarPlan = (planId) => {
    navigate(`/register-vendedor?plan=${planId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  // Solo mostrar planes que no sean "Emprendedor"
  const planesFiltrados = planes.filter(plan => plan.nombre !== "Emprendedor");

  return (
    <div className="min-h-screen bg-[#111827] text-gray-200 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">

        {/* Encabezado */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
            <Zap size={14} /> Membresías Marketplace
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Escala tu negocio en <span className="text-blue-500 text-shadow-blue"></span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Elige el plan ideal para mostrar tus productos. Comienza hoy y llega a miles de clientes locales.
          </p>
        </div>

        {/* Mostrar solo el plan Premium */}
        <div className="flex justify-center">
          {planesFiltrados.map((plan) => {
            const visual = getPlanVisualConfig(plan.nombre, plan.productos_permitidos);

            return (
              <div
                key={plan._id}
                className={`relative rounded-[2.5rem] p-10 border-2 transition-all duration-500 hover:-translate-y-2 bg-[#1F2937] ${visual.border} flex flex-col max-w-md w-full`}
              >
                {visual.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                    Más Recomendado
                  </div>
                )}

                <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${visual.color}`}>
                    {visual.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-white">
                      ${plan.precio.toLocaleString('de-DE')}
                    </span>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">COP / Mes</p>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-white mb-2">{plan.nombre}</h2>
                <p className="text-gray-400 text-sm mb-8">
                  Perfecto para negocios que buscan liderar el mercado digital.
                </p>

                <div className="space-y-4 mb-10 flex-grow">
                  {visual.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="bg-emerald-500/10 p-1 rounded-full">
                        <Check size={14} className="text-emerald-500" strokeWidth={3} />
                      </div>
                      <span className="text-gray-300 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => seleccionarPlan(plan._id)}
                  className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 group ${visual.btnClass}`}
                >
                  Elegir este plan
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer de confianza */}
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
