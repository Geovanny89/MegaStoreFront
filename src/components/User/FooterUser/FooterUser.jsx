import { Link } from "react-router-dom";
import { 
  Facebook, Instagram, Twitter, Mail, MapPin, 
  ShoppingBag, Heart, User, Bell, MessageSquare 
} from "lucide-react";

export default function FooterUser() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* BRAND SECTION */}
          <div className="space-y-6">
            <h4 className="text-2xl font-black text-gray-900 tracking-tighter">
              MARKETPLACE<span className="text-blue-600">.</span>
            </h4>
            <p className="text-gray-500 leading-relaxed text-sm">
              Tu espacio personal de compras en Cúcuta. Gestiona tus pedidos y descubre productos locales.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a key={index} href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* MI CUENTA (Reemplaza a "Plataforma") */}
          <div>
            <h4 className="font-black text-gray-900 mb-6 text-xs uppercase tracking-[0.2em]">Mi Actividad</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/orders" className="text-gray-500 hover:text-blue-600 text-sm font-medium flex items-center gap-2">
                   <ShoppingBag size={14} /> Mis Compras
                </Link>
              </li>
              <li>
                <Link to="/favorito/all" className="text-gray-500 hover:text-blue-600 text-sm font-medium flex items-center gap-2">
                   <Heart size={14} /> Lista de Deseos
                </Link>
              </li>
              <li>
                <Link to="/user/notificaciones" className="text-gray-500 hover:text-blue-600 text-sm font-medium flex items-center gap-2">
                   <Bell size={14} /> Notificaciones
                </Link>
              </li>
              <li>
                <Link to="/perfil" className="text-gray-500 hover:text-blue-600 text-sm font-medium flex items-center gap-2">
                   <User size={14} /> Mi Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* SOPORTE Y LEGAL (Rutas que creamos en AppRouter) */}
          <div>
            <h4 className="font-black text-gray-900 mb-6 text-xs uppercase tracking-[0.2em]">Centro de Ayuda</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/user/sobre-nosotros" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/user/terminos-condiciones" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/user/privacidad" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
                  Privacidad
                </Link>
              </li>
              <li>
                <a href="mailto:soporte@cucuta.com" className="text-gray-500 hover:text-blue-600 text-sm font-medium flex items-center gap-2">
                  <Mail size={14} /> Soporte Técnico
                </a>
              </li>
            </ul>
          </div>

          {/* CONTACTO */}
          <div className="space-y-4">
            <h4 className="font-black text-gray-900 mb-6 text-xs uppercase tracking-[0.2em]">Ubicación</h4>
            <div className="flex items-start gap-3 text-gray-500 text-sm leading-relaxed">
              <MapPin size={18} className="text-blue-600 shrink-0" />
              <p>Cúcuta, Norte de Santander<br />Colombia</p>
            </div>
            <p className="text-blue-600 font-bold text-lg pt-4">+57 (300) 000-0000</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-50 pt-10">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            © {currentYear} MARKETPLACE USER AREA · SISTEMA DE COMPRAS SEGURO.
          </p>
        </div>
      </div>
    </footer>
  );
}