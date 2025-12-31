import { useState, useEffect } from "react";
import logo from "../../assets/Logo3.png";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, ChevronRight, Store } from "lucide-react";

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
        /* Onda que nace específicamente del punto de contacto (la mano) */
        @keyframes ripple-from-hand {
          0% { transform: scale(0.2); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        /* Movimiento de hundimiento del logo simula el clic físico */
        @keyframes logo-click-movement {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.95); }
        }

        .hand-ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(168, 85, 247, 0.5); /* Morado traslúcido */
          width: 40px;
          height: 40px;
          /* AJUSTE DE POSICIÓN SOBRE LA MANO */
          top: 50%; 
          left: 28px; /* Mueve la onda hacia la izquierda donde está el ícono */
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
          
          {/* CONTENEDOR DEL LOGO */}
          <Link to="/" className="relative flex items-center group overflow-visible">
            
            {/* EFECTO DE ONDA DESDE LA MANO */}
            <div className="hand-ripple"></div>
            <div className="hand-ripple" style={{ animationDelay: '1s' }}></div>

            {/* IMAGEN DEL LOGO (Más grande y centrada) */}
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

          {/* ACCIONES */}
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

          {/* MOBILE TOGGLE */}
          <button className="lg:hidden text-gray-900" onClick={() => setOpen(!open)}>
            {open ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </nav>

      {/* ASIDE MOBILE (Sigue tu lógica original) */}
      <aside
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[120] shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
             <img src={logo} alt="Logo" className="h-12 w-auto" />
             <button onClick={() => setOpen(false)}><X size={28}/></button>
          </div>
          <nav className="flex flex-col gap-2">
            <MobileLink to="/">Inicio</MobileLink>
            <MobileLink to="/productos">Productos</MobileLink>
            <MobileLink to="/sobre-nosotros">Sobre nosotros</MobileLink>
          </nav>
        </div>
      </aside>
    </>
  );
}

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
    <Link to={to} className="flex items-center justify-between py-4 text-gray-800 font-bold border-b border-gray-100">
      {children} <ChevronRight size={18} className="text-gray-400" />
    </Link>
  );
}