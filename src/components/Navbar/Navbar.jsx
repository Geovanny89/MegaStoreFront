import { useState, useEffect } from "react";
import logo from "../../assets/Logo3.png";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, ChevronRight, Store, Mail } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar el menú automáticamente cuando cambie la ruta
  useEffect(() => setOpen(false), [location]);

  return (
    <>
      <style>{`
        @keyframes ripple-from-hand {
          0% { transform: scale(0.2); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        @keyframes logo-click-movement {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.95); }
        }

        .hand-ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(168, 85, 247, 0.5);
          width: 40px;
          height: 40px;
          top: 50%; 
          left: 28px;
          transform: translate(-50%, -50%);
          animation: ripple-from-hand 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
          pointer-events: none;
          z-index: 0;
        }

        .animate-logo-active {
          animation: logo-click-movement 2s ease-in-out infinite;
        }
      `}</style>

      <nav 
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-1" : "bg-white py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO SECTION */}
          <Link to="/" className="relative flex items-center group overflow-visible">
            <div className="hand-ripple"></div>
            <div className="hand-ripple" style={{ animationDelay: '1s' }}></div>
            <div className="relative z-10 animate-logo-active">
              <img 
                src={logo} 
                alt="Logo K-DICE" 
                className="h-16 md:h-20 w-auto object-contain transition-transform" 
              />
            </div>
          </Link>

          {/* MENÚ DESKTOP */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/productos">Productos</NavLink>
            <NavLink to="/sobre-nosotros">Nosotros</NavLink>
            <NavLink to="/contacto">Contacto</NavLink>
          </div>

          {/* ACCIONES DESKTOP (Se ocultan en móvil) */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-gray-700 font-bold hover:text-blue-600 transition-colors text-sm flex items-center gap-2"
            >
              <User size={18} />
              Acceder
            </Link>
            <Link 
              to="/register-vendedor" 
              className="bg-gray-900 text-white px-6 py-3 rounded-full font-black text-xs uppercase hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Store size={16} />
              Vender
            </Link>
          </div>

          {/* BOTÓN HAMBURGUESA MÓVIL */}
          <button className="lg:hidden text-gray-900 p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* OVERLAY PARA CERRAR EL MENÚ AL DAR CLIC FUERA */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ASIDE MOBILE COMPLETO */}
      <aside
        className={`fixed top-0 right-0 h-full w-[300px] bg-white z-[120] shadow-2xl transition-transform duration-500 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 flex flex-col h-full">
          {/* Cabecera del menú lateral */}
          <div className="flex justify-between items-center mb-10">
             <img src={logo} alt="Logo" className="h-14 w-auto" />
             <button 
               onClick={() => setOpen(false)}
               className="p-2 bg-gray-50 rounded-full text-gray-500"
             >
               <X size={24}/>
             </button>
          </div>

          {/* Links de navegación móviles */}
          <nav className="flex flex-col gap-1 mb-10">
            <MobileLink to="/">Inicio</MobileLink>
            <MobileLink to="/productos">Productos</MobileLink>
            <MobileLink to="/sobre-nosotros">Sobre nosotros</MobileLink>
            <MobileLink to="/contacto">Contacto</MobileLink>
          </nav>

          {/* SECCIÓN DE ACCIONES MÓVILES (Aquí aparecen el Login y Registro) */}
          <div className="mt-auto space-y-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Mi Cuenta</p>
            
            <Link 
              to="/login" 
              className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-2xl text-gray-800 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
              <div className="flex items-center gap-3">
                <User size={20} className="text-blue-600" />
                <span>Iniciar Sesión</span>
              </div>
              <ChevronRight size={18} />
            </Link>

            <Link 
              to="/register-vendedor" 
              className="flex items-center justify-center gap-3 w-full p-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-tighter shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              <Store size={20} />
              Vender en K-DICE
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

// Componentes auxiliares para limpieza de código
function NavLink({ to, children }) {
  return (
    <Link to={to} className="text-[15px] font-bold text-gray-500 hover:text-blue-600 transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
    </Link>
  );
}

function MobileLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="flex items-center justify-between py-4 px-2 text-gray-800 font-bold border-b border-gray-50 hover:text-blue-600 transition-all"
    >
      {children} 
      <ChevronRight size={18} className="text-gray-300" />
    </Link>
  );
}