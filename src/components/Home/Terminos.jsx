import React from "react";
import { ArrowLeft, ShieldAlert, Scale, FileText, AlertCircle, UserCheck, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Terminos() {
  const navigate = useNavigate();
  const fechaActual = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 font-sans text-gray-800 dark:text-slate-200">
        
        {/* BOTÓN VOLVER */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-900 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Volver 
        </button>

        {/* ENCABEZADO LEGAL */}
        <header className="mb-12 border-b border-gray-100 dark:border-slate-800 pb-8">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight uppercase">
            Términos y <span className="text-blue-600 dark:text-blue-500">Condiciones</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium italic">
            Última actualización: {fechaActual} | Cúcuta, Colombia.
          </p>
        </header>

        {/* AVISO IMPORTANTE */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-6 mb-12 rounded-r-2xl shadow-sm">
          <div className="flex gap-4">
            <ShieldAlert className="text-blue-600 dark:text-blue-400 shrink-0" size={28} />
            <div>
              <h3 className="font-black text-blue-900 dark:text-blue-300 uppercase text-sm mb-1 tracking-wider text-left">Aviso de Naturaleza del Servicio</h3>
              <p className="text-blue-800 dark:text-blue-200/80 text-sm leading-relaxed text-left">
                La plataforma actúa únicamente como un **proveedor tecnológico (SaaS)**. NO somos una tienda, NO vendemos productos y NO procesamos pagos. La relación comercial ocurre exclusivamente entre el Comprador y el Vendedor.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          
          <Section icon={<FileText size={20}/>} title="1. Definiciones">
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-slate-400 text-left">
              <li><strong>Plataforma:</strong> El software web que ofrece servicios de publicación y gestión de pedidos.</li>
              <li><strong>Vendedor:</strong> Usuario que contrata una suscripción para publicar y gestionar sus ventas.</li>
              <li><strong>Comprador:</strong> Usuario que contacta vendedores para adquirir productos directamente.</li>
            </ul>
          </Section>

          <Section icon={<UserCheck size={20}/>} title="2. Verificación de Identidad del Vendedor">
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4 text-left">
              Para garantizar la seguridad de la comunidad y prevenir estafas, todo Vendedor debe completar un proceso de validación obligatoria:
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30">
              <ul className="space-y-4 text-gray-700 dark:text-slate-300 text-sm text-left">
                <li className="flex gap-2">
                  <span className="font-bold text-amber-600">A.</span> 
                  <span>El Vendedor autoriza el uso de su <strong>fotografía de documento de identidad (Cédula)</strong> y una <strong>fotografía tipo selfie</strong> con fines exclusivos de validación de identidad y prevención de fraudes.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-amber-600">B.</span> 
                  <span>Estos datos se utilizan para confirmar que el vendedor es una persona real y responsable de sus operaciones dentro del marketplace.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-amber-600">C.</span> 
                  <span>La plataforma se reserva el derecho de rechazar o dar de baja a cualquier vendedor cuya identidad no pueda ser plenamente verificada o presente inconsistencias.</span>
                </li>
              </ul>
            </div>
          </Section>

          <Section icon={<Scale size={20}/>} title="3. Suscripción y Pagos al Marketplace">
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-left">
              El acceso a las funciones de venta está sujeto al pago de una suscripción periódica. Esta otorga el derecho de uso de la herramienta técnica. El pago de la suscripción es independiente de las ventas realizadas por el usuario.
            </p>
          </Section>

          <Section icon={<Ban size={20}/>} title="4. Política de Reportes y Bloqueos">
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4 text-left">
              La integridad del marketplace es nuestra prioridad. Por ello, aplicamos una política estricta ante el incumplimiento:
            </p>
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
              <p className="text-red-900 dark:text-red-400 font-bold mb-3 flex items-center gap-2 text-left">
                <AlertCircle size={18} /> Regla de los 5 Reportes:
              </p>
              <p className="text-red-800 dark:text-red-300 text-sm leading-relaxed mb-4 text-left">
                Si un Vendedor acumula <strong>más de cinco (5) reportes</strong> de diferentes usuarios que, tras ser validados por nuestro equipo, resulten ser verídicos (estafas, incumplimiento de entrega, producto falso, etc.), se procederá con:
              </p>
              <ul className="space-y-3 text-red-800 dark:text-red-300 text-sm font-medium text-left">
                <li className="flex gap-2"><span>•</span> Bloqueo inmediato y permanente de la cuenta y la tienda.</li>
                <li className="flex gap-2"><span>•</span> Inclusión en nuestra base interna de vendedores no verificados.</li>
                <li className="flex gap-2">
                  <span>•</span> 
                  <span className="font-black italic underline decoration-red-300 dark:decoration-red-900">
                    El vendedor perderá todo derecho a devolución o reembolso de cualquier dinero pagado por concepto de suscripción o tiempo restante.
                  </span>
                </li>
              </ul>
            </div>
          </Section>

          <Section icon={<AlertCircle size={20}/>} title="5. Pagos Directos entre Usuarios">
            <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
              <p className="text-gray-700 dark:text-slate-300 font-medium mb-3 text-left">Usted entiende y acepta que:</p>
              <ul className="space-y-3 text-gray-600 dark:text-slate-400 text-sm text-left">
                <li className="flex gap-2"><span>•</span> El dinero de los productos se transfiere directamente de comprador a vendedor (Nequi, Daviplata, Efectivo, etc).</li>
                <li className="flex gap-2"><span>•</span> La plataforma **no recibe ni retiene fondos** derivados de la compraventa.</li>
                <li className="flex gap-2"><span>•</span> El vendedor es el único responsable de validar el ingreso del dinero antes de realizar el despacho.</li>
              </ul>
            </div>
          </Section>

          <Section title="6. Limitación de Responsabilidad">
            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed border-l-2 border-gray-200 dark:border-slate-800 pl-4 text-left">
              Al usar el servicio, usted exonera a la plataforma de cualquier reclamación vinculada a la compraventa. No respondemos por fraudes, ya que proporcionamos las herramientas de reporte para que la comunidad depure el sistema mediante el bloqueo de infractores comprobados.
            </p>
          </Section>

          <Section title="7. Ley Aplicable">
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-left">
              Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa será resuelta ante las autoridades competentes en la ciudad de Cúcuta, Norte de Santander.
            </p>
          </Section>

        </div>

        {/* PIE DE PÁGINA T&C */}
        <footer className="mt-20 pt-10 border-t border-gray-100 dark:border-slate-800 text-center">
          <p className="text-gray-400 dark:text-slate-500 text-xs leading-relaxed max-w-2xl mx-auto">
            Al registrarse como Vendedor y cargar sus documentos de identidad, usted confirma que ha leído, entendido y acepta íntegramente estos Términos y Condiciones.
          </p>
        </footer>
      </div>
    </div>
  );
}

// Sub-componente para organizar las secciones
function Section({ icon, title, children }) {
  return (
    <section className="animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        {icon && <span className="text-blue-600 dark:text-blue-400">{icon}</span>}
        <h2 className="text-xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight italic">
          {title}
        </h2>
      </div>
      <div className="pl-0 md:pl-8">
        {children}
      </div>
    </section>
  );
}