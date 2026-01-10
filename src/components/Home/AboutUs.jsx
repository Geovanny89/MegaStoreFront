import { ShieldCheck, ArrowRight, Zap, ArrowLeft, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleBack = () => {
    if (token) {
      navigate("/homeUser");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f1a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 font-sans text-gray-800 dark:text-gray-200 relative">
        
        {/* BOTÓN VOLVER INTELIGENTE */}
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors mb-12 group"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Volver al inicio
        </button>

        {/* HERO SECTION */}
        <section className="text-center mb-24 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
            Marketplace para Emprendedores
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-none uppercase">
            La vitrina digital <br />
            <span className="text-blue-600 dark:text-blue-500 italic">para tu negocio.</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 font-medium">
            Potenciamos el COMERCIO conectando directamente a vendedores y compradores. Sin intermediarios, facilitamos un espacio para que acuerden sus ventas con total libertad a través de nuestro CHAT INTERNO.
          </p>
        </section>

        {/* VALORES - GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <ValueCard 
            icon={<Zap size={32} />}
            title="Trato Directo"
            text="Sin comisiones por venta. Habla directamente con los interesados y acuerda el método de pago que prefieras."
          />
          <ValueCard 
            icon={<MessageSquare size={32} />}
            title="Chat Interno"
            text="Cierra tus ventas de forma segura. Resuelve dudas y coordina entregas sin necesidad de compartir datos externos."
          />
          <ValueCard 
            icon={<ShieldCheck size={32} />}
            title="Control Total"
            text="Tú gestionas tus productos y tus tiempos. Nuestra plataforma es la herramienta técnica para que tu negocio crezca."
          />
        </div>

        {/* SECCIÓN FILOSOFÍA */}
        <section className="bg-gray-900 dark:bg-black rounded-[3.5rem] p-8 md:p-24 text-white relative overflow-hidden mb-32 shadow-2xl border border-gray-800">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Tecnología y Comercio</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 italic leading-tight uppercase text-white">Autonomía Real</h2>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                <p>Impulsamos la economía local ofreciendo una plataforma donde la comunicación entre usuario y vendedor es la prioridad.</p>
                <p>Nuestra vitrina está diseñada para ser intuitiva, permitiendo que el flujo de acuerdos sea manejado exclusivamente por las personas involucradas.</p>
                <div className="pt-6">
                  <ul className="grid grid-cols-1 gap-4 text-sm md:text-base text-gray-300">
                    <li className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold text-xs">✓</div>
                      <span>Acuerdos directos por chat interno.</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold text-xs">✓</div>
                      <span>Sin retenciones de dinero por venta.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <StatCard value="100%" label="Sin Comisiones" />
              <StatCard value="Directo" label="Chat Interno" mt="mt-12" />
            </div>
          </div>
        </section>

        {/* CTA FINAL CONDICIONAL */}
        {!token ? (
          <section className="text-center bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] p-12 md:p-20 border border-gray-100 dark:border-gray-800 mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-8 text-gray-900 dark:text-white tracking-tight italic uppercase">Forma parte del marketplace local</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Link 
                to="/register-vendedor" 
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/20 group"
              >
                Empezar a Vender <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/" 
                className="w-full md:w-auto bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-10 py-5 rounded-[1.5rem] font-black text-lg transition-all text-center"
              >
                Ver Productos
              </Link>
            </div>
          </section>
        ) : (
          <div className="text-center py-12 border-t border-gray-100 dark:border-gray-800 italic text-gray-400 dark:text-gray-600 text-xs uppercase tracking-widest">
            Gracias por ser parte de la comunidad de Marketplace Cúcuta
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ value, label, mt = "" }) {
  return (
    <div className={`bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-[2.5rem] border border-white/10 text-center hover:bg-white/10 transition-all flex flex-col justify-center items-center min-h-[120px] md:min-h-[160px] ${mt}`}>
      <h3 className="text-xl md:text-3xl font-black text-blue-500 mb-1 uppercase leading-none tracking-tighter">{value}</h3>
      <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-black text-gray-500 dark:text-gray-400 italic leading-tight">{label}</p>
    </div>
  );
}

function ValueCard({ icon, title, text }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-10 md:p-12 rounded-[3rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-transparent dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-900/50 transition-all duration-300 text-center group">
      <div className="bg-blue-50 dark:bg-blue-900/30 w-20 h-20 rounded-[1.8rem] flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight uppercase leading-tight">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed font-medium italic">{text}</p>
    </div>
  );
}