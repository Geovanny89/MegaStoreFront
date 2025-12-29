import React from "react";
import Layout from "../layout/Layout";
import { ArrowLeft, ShieldAlert, Scale, FileText, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Terminos() {
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

        {/* ENCABEZADO LEGAL */}
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            Términos y <span className="text-blue-600">Condiciones</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium italic">
            Última actualización: {fechaActual} | Cúcuta, Colombia.
          </p>
        </header>

        {/* AVISO IMPORTANTE (SaaS Disclaimer) */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-12 rounded-r-2xl shadow-sm">
          <div className="flex gap-4">
            <ShieldAlert className="text-blue-600 shrink-0" size={28} />
            <div>
              <h3 className="font-black text-blue-900 uppercase text-sm mb-1 tracking-wider">Aviso de Naturaleza del Servicio</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                La plataforma actúa únicamente como un **proveedor tecnológico (SaaS)**. NO somos una tienda, NO vendemos productos y NO procesamos pagos. La relación comercial ocurre exclusivamente entre el Comprador y el Vendedor.
              </p>
            </div>
          </div>
        </div>

        {/* CUERPO LEGAL */}
        <div className="space-y-10">
          
          <Section icon={<FileText size={20}/>} title="1. Definiciones">
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>Plataforma:</strong> El software web que ofrece servicios de publicación y gestión de pedidos.</li>
              <li><strong>Vendedor:</strong> Usuario que contrata una suscripción para publicar y gestionar sus ventas.</li>
              <li><strong>Comprador:</strong> Usuario que contacta vendedores para adquirir productos directamente.</li>
              <li><strong>Orden:</strong> Registro digital de una intención de compra generada en la plataforma.</li>
            </ul>
          </Section>

          <Section icon={<Scale size={20}/>} title="2. Suscripción y Pagos al Marketplace">
            <p className="text-gray-600 leading-relaxed">
              El acceso a las funciones de venta está sujeto al pago de una <strong>suscripción periódica</strong>. Esta suscripción otorga el derecho de uso de la herramienta técnica, pero NO garantiza un volumen de ventas ni incluye la gestión financiera de los cobros de los productos.
            </p>
          </Section>

          <Section icon={<AlertCircle size={20}/>} title="3. Pagos Directos entre Usuarios">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <p className="text-gray-700 font-medium mb-3">
                Usted entiende y acepta que:
              </p>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-2"><span>•</span> El dinero de los productos se transfiere directamente de comprador a vendedor (Nequi, Daviplata, Efectivo, etc).</li>
                <li className="flex gap-2"><span>•</span> La plataforma **no recibe, retiene ni libera fondos** derivados de la compraventa.</li>
                <li className="flex gap-2"><span>•</span> El cargue de comprobantes de pago es una función informativa; el vendedor es el único responsable de validar el ingreso real del dinero antes de entregar el producto.</li>
              </ul>
            </div>
          </Section>

          <Section title="4. Obligaciones y Responsabilidades">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-black text-gray-900 text-xs uppercase mb-3 tracking-widest text-blue-600">Del Vendedor</h4>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  Responsable de la veracidad de su catálogo, de la recepción del pago, de la entrega efectiva del producto y de cumplir con las garantías legales ante el comprador.
                </p>
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-xs uppercase mb-3 tracking-widest text-blue-600">Del Comprador</h4>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  Se compromete a realizar pagos reales, adjuntar comprobantes auténticos y confirmar la recepción del pedido solo cuando tenga el producto en su poder.
                </p>
              </div>
            </div>
          </Section>

          <Section title="5. Limitación de Responsabilidad">
            <p className="text-gray-600 text-sm leading-relaxed border-l-2 border-gray-200 pl-4">
              En ningún caso la plataforma será responsable por fraudes, productos defectuosos, incumplimientos en la entrega o daños derivados de la transacción comercial. Al usar el servicio, usted exonera a la plataforma de cualquier reclamación civil, comercial o penal vinculada a la compraventa de productos.
            </p>
          </Section>

          <Section title="6. Suspensión de Servicio">
            <p className="text-gray-600 leading-relaxed">
              La plataforma se reserva el derecho de cancelar cuentas que incurran en prácticas fraudulentas, cargue de comprobantes falsos o incumplimiento de las políticas de uso, sin lugar a reembolso de la suscripción.
            </p>
          </Section>

          <Section title="7. Ley Aplicable">
            <p className="text-gray-600 leading-relaxed">
              Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa será resuelta ante las autoridades competentes en la ciudad de Cúcuta.
            </p>
          </Section>

        </div>

        {/* PIE DE PÁGINA T&C */}
        <footer className="mt-20 pt-10 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs">
            Al registrarse o utilizar nuestro marketplace, usted confirma que ha leído y acepta íntegramente estos Términos y Condiciones.
          </p>
        </footer>
      </div>
 
  );
}

// Sub-componente para organizar las secciones
function Section({ icon, title, children }) {
  return (
    <section className="animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        {icon && <span className="text-blue-600">{icon}</span>}
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">
          {title}
        </h2>
      </div>
      <div className="pl-0 md:pl-8">
        {children}
      </div>
    </section>
  );
}