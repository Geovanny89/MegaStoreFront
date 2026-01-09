import { Link } from "react-router-dom";
import { 
  Facebook, Instagram, Twitter, Mail, MapPin, 
  ShoppingBag, Heart, User, Bell
} from "lucide-react";

export default function FooterUser() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#020617] border-t border-gray-100 dark:border-gray-800 mt-12">
      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* BRAND */}
          <div className="space-y-6">
            <h4 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">
              MARKETPLACE<span className="text-green-600">.</span>
            </h4>

            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
              Tu espacio personal de compras. Gestiona tus pedidos y descubre productos.
            </p>

            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="
                    p-2 rounded-full transition-all
                    bg-gray-50 dark:bg-gray-900
                    text-gray-400 dark:text-gray-500
                    hover:bg-green-600 hover:text-white
                  "
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* MI ACTIVIDAD */}
          <div>
            <h4 className="font-black text-gray-900 dark:text-gray-100 mb-6 text-xs uppercase tracking-[0.2em]">
              Mi Actividad
            </h4>

            <ul className="space-y-4">
              <FooterLink to="/orders" icon={<ShoppingBag size={14} />}>
                Mis Compras
              </FooterLink>

              <FooterLink to="/favorito/all" icon={<Heart size={14} />}>
                Lista de Deseos
              </FooterLink>

              <FooterLink to="/user/notificaciones" icon={<Bell size={14} />}>
                Notificaciones
              </FooterLink>

              <FooterLink to="/perfil" icon={<User size={14} />}>
                Mi Perfil
              </FooterLink>
            </ul>
          </div>

          {/* AYUDA */}
          <div>
            <h4 className="font-black text-gray-900 dark:text-gray-100 mb-6 text-xs uppercase tracking-[0.2em]">
              Centro de Ayuda
            </h4>

            <ul className="space-y-4">
              <FooterTextLink to="/user/sobre-nosotros">
                Sobre Nosotros
              </FooterTextLink>

              <FooterTextLink to="/user/terminos-condiciones">
                Términos y Condiciones
              </FooterTextLink>

              <FooterTextLink to="/user/privacidad">
                Privacidad
              </FooterTextLink>

              <a
                href="mailto:soporte@cucuta.com"
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 text-sm font-medium transition-colors"
              >
                <Mail size={14} /> Soporte Técnico
              </a>
            </ul>
          </div>

          {/* UBICACIÓN */}
          <div className="space-y-4">
            <h4 className="font-black text-gray-900 dark:text-gray-100 mb-6 text-xs uppercase tracking-[0.2em]">
              Ubicación
            </h4>

            <div className="flex items-start gap-3 text-gray-500 dark:text-gray-400 text-sm">
              <MapPin size={18} className="text-green-600 shrink-0" />
              <p>Colombia</p>
            </div>

            <p className="text-green-600 font-bold text-lg pt-4">
              +57 (300) 000-0000
            </p>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-50 dark:border-gray-800 pt-10">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center">
            © {currentYear} MARKETPLACE · ÁREA DE USUARIO · COMPRAS SEGURAS
          </p>
        </div>
      </div>
    </footer>
  );
}

/* COMPONENTES REUTILIZABLES */
function FooterLink({ to, icon, children }) {
  return (
    <li>
      <Link
        to={to}
        className="
          flex items-center gap-2 text-sm font-medium
          text-gray-500 dark:text-gray-400
          hover:text-green-600 dark:hover:text-green-400
          transition-colors
        "
      >
        {icon} {children}
      </Link>
    </li>
  );
}

function FooterTextLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="
          text-gray-500 dark:text-gray-400
          hover:text-green-600 dark:hover:text-green-400
          text-sm font-medium transition-colors
        "
      >
        {children}
      </Link>
    </li>
  );
}
