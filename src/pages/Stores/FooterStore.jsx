import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, ArrowRight } from "lucide-react";

export default function FooterStore() {
  const currentYear = new Date().getFullYear();
  const token = localStorage.getItem("token");

  // Definimos el prefijo de la ruta según si está logueado
  const pathPrefix = token ? "/user" : "";

  return (
    <footer className="bg-white border-t border-gray-100 mt-24">
      <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-10">
        
        {/* SECCIÓN SUPERIOR: BRAND & NEWSLETTER */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          <div className="max-w-sm space-y-6">
            <h4 className="text-2xl font-black text-gray-900 tracking-tighter">
              MARKETPLACE<span className="text-blue-600">.</span>
            </h4>
            <p className="text-gray-500 leading-relaxed text-sm">
              Conectando el comercio con el mundo digital. 
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a key={index} href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/50 p-8 rounded-2xl flex-1 max-w-xl">
            <h5 className="font-bold text-gray-900 mb-2">Únete a la comunidad</h5>
            <p className="text-sm text-gray-500 mb-6">Recibe novedades y ofertas exclusivas de las mejores tiendas.
</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="flex-1 px-4 py-3 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all bg-white"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                Suscribirme <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        <hr className="border-gray-100 mb-16" />

        {/* SECCIÓN MEDIA: LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          
          {/* PLATAFORMA */}
          

          {/* AYUDA - AQUÍ SE AGREGA SOBRE NOSOTROS */}
          <div>
            <h4 className="font-black text-gray-900 mb-6 text-xs uppercase tracking-[0.2em]">Ayuda</h4>
            <ul className="space-y-4">
  <li>
    <Link to="sobre-nosotros" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
      Sobre Nosotros
    </Link>
  </li>

  <li>
    <Link to="privacidad" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
      Privacidad
    </Link>
  </li>

  <li>
    <Link to="terminos-condiciones" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
      Términos y Condiciones
    </Link>
  </li>

  <li>
    <Link to="contacto" className="text-gray-500 hover:text-blue-600 text-sm font-medium flex items-center gap-2">
      <Mail size={14} /> Soporte Técnico
    </Link>
  </li>
</ul>

          </div>

          {/* UBICACIÓN */}
          <div className="col-span-1">
            <h4 className="font-black text-gray-900 mb-6 text-xs uppercase tracking-[0.2em]">Ubicación</h4>
            <div className="flex items-start gap-3 text-gray-500 text-sm leading-relaxed">
              <MapPin size={18} className="text-blue-600 shrink-0" />
              <p>
                Cúcuta, Norte de Santander <br />
                Colombia · CP 540001
              </p>
            </div>
          </div>

          {/* CONTACTO */}
          <div className="space-y-4">
            <h4 className="font-black text-gray-900 mb-6 text-xs uppercase tracking-[0.2em]">Contacto Directo</h4>
            <p className="text-gray-500 text-sm font-medium">¿Tienes dudas?</p>
            <p className="text-blue-600 font-bold text-lg">+57 (300) 000-0000</p>
          </div>
        </div>

        {/* SECCIÓN INFERIOR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-50 pt-10">
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">
            © {currentYear} MARKETPLACE · TODOS LOS DERECHOS RESERVADOS.
          </p>
          <p className="text-gray-400 text-sm font-medium italic">
            Hecho para el comercio.
          </p>
        </div>
      </div>
    </footer>
  );
}