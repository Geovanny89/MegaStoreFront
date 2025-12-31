import React from "react";

import { ArrowLeft, Lock, EyeOff, UserCheck, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Privacidad() {
  const navigate = useNavigate();
  const fechaActual = new Date().toLocaleDateString();

  return (
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 font-sans text-gray-800">
        
        {/* BOTÓN VOLVER */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Volver
        </button>

        {/* ENCABEZADO */}
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            Política de <span className="text-blue-600">Privacidad</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium italic">
            Cumplimiento Ley 1581 de 2012 (Habeas Data) | Actualizado: {fechaActual}
          </p>
        </header>

        {/* RESUMEN DE SEGURIDAD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-green-50 p-4 rounded-2xl flex flex-col items-center text-center">
            <Lock className="text-green-600 mb-2" size={24} />
            <span className="text-xs font-black uppercase text-green-900">Datos Seguros</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl flex flex-col items-center text-center">
            <EyeOff className="text-blue-600 mb-2" size={24} />
            <span className="text-xs font-black uppercase text-blue-900">No Vendemos Datos</span>
          </div>
          <div className="bg-purple-50 p-4 rounded-2xl flex flex-col items-center text-center">
            <UserCheck className="text-purple-600 mb-2" size={24} />
            <span className="text-xs font-black uppercase text-purple-900">Tú Tienes el Control</span>
          </div>
        </div>

        {/* CONTENIDO LEGAL */}
        <div className="space-y-10">
          
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase italic">1. Identificación del Responsable</h2>
            <p className="text-gray-600 leading-relaxed">
              El Marketplace, con domicilio en la ciudad de Cúcuta, Colombia, es el responsable del tratamiento de sus datos personales. Para cualquier duda, puede contactarnos a través de los canales oficiales habilitados en la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase italic">2. Datos que Recolectamos</h2>
            <p className="text-gray-600 mb-4">Para el correcto funcionamiento de la vitrina digital, recolectamos:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              <li><strong>Información de Registro:</strong> Nombre completo, correo electrónico y número de teléfono.</li>
              <li><strong>Datos de Comercio:</strong> Dirección de entrega o despacho (proporcionada en el chat).</li>
              <li><strong>Evidencias de Pago:</strong> Imágenes de comprobantes cargadas voluntariamente por el comprador.</li>
              <li><strong>Datos Técnicos:</strong> Dirección IP y cookies para mejorar la seguridad de la sesión.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase italic">3. Finalidad del Tratamiento</h2>
            <p className="text-gray-600 leading-relaxed">
              Sus datos se utilizarán exclusivamente para:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-gray-600 text-sm">
              <li>Facilitar la comunicación directa entre compradores y vendedores mediante el <strong>chat interno</strong>.</li>
              <li>Gestionar el sistema de suscripciones para los vendedores.</li>
              <li>Notificar sobre el estado de las órdenes y actualizaciones de la cuenta.</li>
              <li>Prevenir fraudes y asegurar la integridad de la comunidad local.</li>
            </ul>
          </section>

          <section className="bg-gray-900 text-white p-8 rounded-[2.5rem]">
            <h2 className="text-xl font-black mb-4 uppercase italic flex items-center gap-2">
              <ShieldCheck size={24} className="text-blue-500" /> 4. Intercambio de Información
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Al ser un marketplace de trato directo, usted acepta que la plataforma comparta su información de contacto y detalles de la orden con la contraparte (Vendedor o Comprador) una vez se inicie una intención de compra. 
              <br /><br />
              <strong className="text-white">IMPORTANTE:</strong> La plataforma prohíbe el uso de estos datos para fines distintos a la concreción de la venta específica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase italic">5. Sus Derechos (ARCO)</h2>
            <p className="text-gray-600 leading-relaxed">
              Como titular de los datos, usted tiene derecho a: 
              <strong> Acceder, Rectificar, Cancelar u Oponerse</strong> al tratamiento de su información. Puede solicitar la eliminación de su cuenta y sus datos personales en cualquier momento escribiendo a nuestro soporte técnico.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase italic">6. Seguridad</h2>
            <p className="text-gray-600 leading-relaxed italic border-l-4 border-blue-600 pl-4">
              Implementamos medidas técnicas y administrativas para proteger sus datos. Sin embargo, no nos hacemos responsables por la información que usted decida compartir de forma voluntaria fuera del chat interno o con terceros no autorizados.
            </p>
          </section>

        </div>

        <footer className="mt-20 pt-10 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
            Tu privacidad es nuestra prioridad en el comercio local.
          </p>
        </footer>
      </div>
    
  );
}