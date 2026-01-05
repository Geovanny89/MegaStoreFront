import React from "react";
import { Menu, X, Home, User, Package, AlertTriangle, LogOut, ShieldCheck, CreditCard } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function SidebarAdmin({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* OVERLAY PARA MÓVIL (Oscurece el fondo cuando el menú está abierto) */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/60 z-[40] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ASIDE PRINCIPAL */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen bg-gray-900 text-white z-[50] 
          transition-all duration-300 ease-in-out flex flex-col border-r border-gray-700
          ${open 
            ? "w-64 translate-x-0" 
            : "w-16 md:translate-x-0 -translate-x-full" // Se esconde totalmente a la izquierda en móvil si está cerrado
          }
        `}
      >
        {/* HEADER DEL SIDEBAR */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 min-h-[64px]">
          {open && (
            <h2 className="text-lg font-bold text-blue-400 animate-in fade-in zoom-in duration-300">
              Admin Panel
            </h2>
          )}
          <button
            onClick={() => setOpen(!open)}
            className={`p-2 rounded-lg hover:bg-gray-800 transition-colors ${!open && "mx-auto"}`}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700">
          <SidebarItem 
            to="/dashboard" 
            icon={<Home size={20} />} 
            label="Dashboard" 
            open={open} 
            active={location.pathname === "/dashboard"}
          />
          
          <div className="my-4 border-t border-gray-800" />
          
          {open && (
            <p className="text-[10px] font-black text-gray-500 uppercase px-3 mb-2 tracking-widest">
              Validaciones
            </p>
          )}

          <SidebarItem 
            to="/admin/sellers/verificar-identidad" 
            icon={<ShieldCheck size={20} className="text-emerald-400" />} 
            label="Validar Identidad" 
            open={open} 
            active={location.pathname === "/admin/sellers/verificar-identidad"}
          />

          <SidebarItem 
            to="/admin/sellers/pagos" 
            icon={<CreditCard size={20} className="text-amber-400" />} 
            label="Validar Pagos" 
            open={open} 
            active={location.pathname === "/admin/sellers/pagos"}
          />

          <div className="my-4 border-t border-gray-800" />

          <SidebarItem 
            to="/admin/usuarios" 
            icon={<User size={20} />} 
            label="Usuarios" 
            open={open} 
            active={location.pathname === "/admin/usuarios"}
          />
          <SidebarItem 
            to="/admin/Categorias" 
            icon={<Package size={20} />} 
            label="Categorias" 
            open={open} 
            active={location.pathname === "/admin/Categorias"}
          />
         <SidebarItem 
  to="/admin/reportes" 
  icon={<AlertTriangle size={20} className="text-rose-400" />} 
  label="Reportes" 
  open={open} 

/>
        </nav>

        {/* FOOTER - CERRAR SESIÓN */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 w-full p-3 rounded-xl transition-all
              text-red-400 hover:bg-red-500/10 group
              ${!open && "justify-center"}
            `}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {open && <span className="text-sm font-semibold">Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

/**
 * Sub-componente para los items del menú
 */
function SidebarItem({ to, icon, label, open, active }) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
        ${active 
          ? "bg-blue-600/20 text-blue-400 shadow-inner" 
          : "hover:bg-gray-800 text-gray-400 hover:text-white"
        }
        ${!open && "justify-center"}
      `}
    >
      <div className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
        {icon}
      </div>
      
      {open && (
        <span className="text-sm font-medium whitespace-nowrap animate-in slide-in-from-left-2 duration-300">
          {label}
        </span>
      )}

      {/* Tooltip pequeño cuando está colapsado (Opcional) */}
      {!open && (
        <div className="fixed left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity ml-2 z-[60] border border-gray-700">
          {label}
        </div>
      )}
    </Link>
  );
}