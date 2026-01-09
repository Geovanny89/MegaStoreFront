import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const token = localStorage.getItem("token");

  // Definimos el prefijo de la ruta según si está logueado
  const pathPrefix = token ? "/user" : "";

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-24">

      <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-10">
        
        {/* SECCIÓN SUPERIOR: BRAND & NEWSLETTER */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          <div className="max-w-sm space-y-6">
            <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
              K-DICE<span className="text-blue-600">.</span>
            </h4>
           <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">

              Conectando el comercio con el mundo digital. 
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a
  key={index}
  href="#"
  className="p-2 bg-gray-50 dark:bg-gray-800 
             rounded-full text-gray-400 dark:text-gray-300
             hover:bg-blue-600 hover:text-white transition-all duration-300"
>

                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* SECCIÓN NEWSLETTER CORREGIDA */}
<div className="bg-blue-50/50 dark:bg-gray-800 p-6 md:p-8 rounded-2xl flex-1 max-w-xl">

  <h5 className="font-bold text-gray-900 dark:text-white mb-2">
Mantente al día</h5>
  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">

    Recibe novedades y ofertas exclusivas de las mejores tiendas.
  </p>
  
  {/* Agregamos flex-wrap para que en móviles el botón baje si no cabe */}
  <form 
    className="flex flex-col sm:flex-row gap-3" 
    onSubmit={(e) => e.preventDefault()}
  >
    <input 
      type="email" 
      placeholder="Tu correo electrónico" 
      className="flex-1 min-w-0 px-4 py-3 rounded-xl border-none 
ring-1 ring-gray-200 dark:ring-gray-700 
focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all 
bg-white dark:bg-gray-900 dark:text-white"

    />
    <button
  className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold 
             hover:bg-blue-700 transition-all duration-300
             flex items-center justify-center gap-2 whitespace-nowrap
             shadow-lg shadow-blue-100
             dark:shadow-none dark:ring-1 dark:ring-blue-500/30"
>
      Suscribirme <ArrowRight size={16} className="shrink-0" />
    </button>
  </form>
</div>
        </div>

        <hr className="border-gray-100 dark:border-gray-800 mb-16" />


        {/* SECCIÓN MEDIA: LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          
          {/* PLATAFORMA */}
          <div>
            <h4 className="font-black text-gray-900 dark:text-white mb-6 text-xs uppercase tracking-[0.2em]">
Plataforma</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/tiendas" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 text-sm font-medium transition-colors"
>
                   Directorio de Tiendas
                </Link>
              </li>
              {!token && (
                <li>
                  <Link to="/register-vendedor" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 text-sm font-medium transition-colors"
>
                     Panel de Vendedor
                  </Link>
                </li>
              )}
              <li>
                <Link to="/planes" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 text-sm font-medium transition-colors"
>
                   Planes y Precios
                </Link>
              </li>
            </ul>
          </div>

          {/* AYUDA - AQUÍ SE AGREGA SOBRE NOSOTROS */}
          <div>
            <h4 className="font-black text-gray-900 dark:text-white mb-6 text-xs uppercase tracking-[0.2em]">
Ayuda</h4>
            <ul className="space-y-4">
              <li>
                <Link to={`${pathPrefix}/sobre-nosotros`} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 text-sm font-medium transition-colors"
>
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to={`${pathPrefix}/privacidad`} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 text-sm font-medium transition-colors"
>
                  Privacidad
                </Link>
              </li>
              <li>
                <Link to={`${pathPrefix}/terminos-condiciones`} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 text-sm font-medium transition-colors"
>
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to={`${pathPrefix}/contacto`} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 text-sm font-medium transition-colors"
>
                  <Mail size={14} /> Soporte Técnico
                </Link>
              </li>
            </ul>
          </div>

          {/* UBICACIÓN */}
          <div className="col-span-1">
            <h4 className="font-black text-gray-900 dark:text-white mb-6 text-xs uppercase tracking-[0.2em]">
Ubicación</h4>
            <div className="flex items-start gap-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">

              <MapPin size={18} className="text-blue-600 shrink-0" />
              <p>
                Cúcuta, Norte de Santander <br />
                Colombia · CP 540001
              </p>
            </div>
          </div>

          {/* CONTACTO */}
          <div className="space-y-4">
            <h4 className="font-black text-gray-900 dark:text-white mb-6 text-xs uppercase tracking-[0.2em]">
Contacto Directo</h4>
            <p className="text-gray-500 text-sm font-medium">¿Tienes dudas?</p>
            <p className="text-blue-600 font-bold text-lg">+57 (300) 000-0000</p>
          </div>
        </div>

        {/* SECCIÓN INFERIOR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-50 dark:border-gray-800 pt-10">
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">
            © {currentYear} MARKETPLACE · TODOS LOS DERECHOS RESERVADOS.
          </p>
          <p className="dark:text-gray-500 text-sm font-medium italic">
            Hecho para el comercio .
          </p>
        </div>
      </div>
    </footer>
  );
}