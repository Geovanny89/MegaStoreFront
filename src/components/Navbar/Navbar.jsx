import { useState, useEffect } from "react";
import logo from "../../assets/Logo3.png";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, ChevronRight, Store } from "lucide-react";
import ThemeToggle from "../../utils/ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          background: rgba(168, 85, 247, 0.4);
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
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled 
            ? "bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-md shadow-lg py-1 border-b border-gray-100 dark:border-gray-800" 
            : "bg-white dark:bg-[#0b1120] py-3"
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
                className="h-16 md:h-20 w-auto object-contain transition-transform dark:brightness-110" 
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

          {/* ACCIONES DESKTOP */}
          <div className="hidden md:flex items-center gap-5">
            <ThemeToggle />
            
            <Link 
              to="/login" 
              className="text-gray-700 dark:text-gray-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-2"
            >
              <User size={18} />
              Acceder
            </Link>
            
            <Link 
              to="/register-vendedor" 
              className="bg-gray-900 dark:bg-blue-600 text-white px-6 py-3 rounded-full font-black text-xs uppercase hover:bg-blue-700 dark:hover:bg-blue-500 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Store size={16} />
              Vender
            </Link>
          </div>

          {/* BOTONES MÓVIL (Toggle + Hamburguesa) */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button 
              className="text-gray-900 dark:text-white p-2" 
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] lg:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ASIDE MOBILE */}
      <aside
        className={`fixed top-0 right-0 h-full w-[300px] bg-white dark:bg-[#0f172a] z-[120] shadow-2xl transition-transform duration-500 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
             <img src={logo} alt="Logo" className="h-14 w-auto dark:brightness-110" />
             <button 
               onClick={() => setOpen(false)}
               className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400"
             >
               <X size={24}/>
             </button>
          </div>

          <nav className="flex flex-col gap-1 mb-10">
            <MobileLink to="/">Inicio</MobileLink>
            <MobileLink to="/productos">Productos</MobileLink>
            <MobileLink to="/sobre-nosotros">Sobre nosotros</MobileLink>
            <MobileLink to="/contacto">Contacto</MobileLink>
          </nav>

          <div className="mt-auto space-y-4">
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">Mi Cuenta</p>
            
            <Link 
              to="/login" 
              className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-gray-800 dark:text-gray-200 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <User size={20} className="text-blue-600 dark:text-blue-400" />
                <span>Iniciar Sesión</span>
              </div>
              <ChevronRight size={18} />
            </Link>

            <Link 
              to="/register-vendedor" 
              className="flex items-center justify-center gap-3 w-full p-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-blue-200 dark:shadow-none active:scale-95 transition-all"
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

function NavLink({ to, children }) {
  return (
    <Link to={to} className="text-[15px] font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full"></span>
    </Link>
  );
}

function MobileLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="flex items-center justify-between py-4 px-2 text-gray-800 dark:text-gray-200 font-bold border-b border-gray-50 dark:border-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
    >
      {children} 
      <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
    </Link>
  );
}