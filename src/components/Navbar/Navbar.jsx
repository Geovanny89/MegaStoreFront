import { useState, useEffect } from "react";
import logo from "../../assets/Logo3.png";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Search, ChevronRight, Store } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Cambiar estilo al hacer scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => setOpen(false), [location]);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-white py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center transition-transform hover:scale-105">
            <img src={logo} alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
          </Link>

          {/* MENÚ DESKTOP - RUTAS CORREGIDAS SEGÚN TU APPROUTER */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/productos">Productos</NavLink>
            <NavLink to="/sobre-nosotros">Nosotros</NavLink>
            {/* Si no tienes ruta de contacto, apuntamos a sobre-nosotros o inicio para evitar el error 404 */}
            <NavLink to="/contacto">Contacto</NavLink>
          </div>

          {/* ACCIONES */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold hover:text-blue-600 transition-colors text-sm"
            >
              <User size={18} />
              Acceder
            </Link>
            <Link 
              to="/register-vendedor" 
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
            >
              <Store size={16} />
              Vender
            </Link>
          </div>

          {/* BOTÓN MOBILE */}
          <button className="lg:hidden p-2 text-gray-900" onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* MENÚ MOBILE LATERAL */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[110] transition-opacity lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[120] shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-end mb-8">
             <button onClick={() => setOpen(false)}><X size={28}/></button>
          </div>

          <nav className="flex flex-col gap-1">
            <MobileLink to="/">Inicio</MobileLink>
            <MobileLink to="/productos">Productos</MobileLink>
            <MobileLink to="/sobre-nosotros">Sobre nosotros</MobileLink>
          </nav>

          <div className="mt-auto space-y-3">
            <Link to="/login" className="flex items-center justify-center w-full py-3 rounded-xl bg-gray-100 font-bold text-gray-800">
              Iniciar Sesión
            </Link>
            <Link to="/register-vendedor" className="flex items-center justify-center w-full py-3 rounded-xl bg-blue-600 text-white font-bold">
              Vender ahora
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="text-[15px] font-semibold text-gray-600 hover:text-blue-600 transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
    </Link>
  );
}

function MobileLink({ to, children }) {
  return (
    <Link to={to} className="flex items-center justify-between py-4 text-gray-800 font-bold border-b border-gray-50">
      {children} <ChevronRight size={18} className="text-gray-400" />
    </Link>
  );
}