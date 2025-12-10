import { 
  Package, 
  Boxes, 
  X, 
  LayoutDashboard, 
  User, 
  Eye, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ open, setOpen }) {
  const [productosOpen, setProductosOpen] = useState(false);

  return (
    <>
      {/* Fondo móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 
          bg-white shadow-xl border-r border-gray-200
          transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close Button - Mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={() => setOpen(false)}
        >
          <X size={26} />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            🛍️ Panel Vendedor
          </h2>
          <p className="text-sm text-gray-500">Administración general</p>
        </div>

        {/* Navegación */}
        <nav className="px-4 py-6 flex flex-col gap-2 text-gray-700">

          {/* ITEM REUTILIZABLE */}
          <SidebarItem to="/Homevendedor" label="Dashboard" icon={<LayoutDashboard />} />
          <SidebarItem to="/PerfilVendedor" label="Mi Perfil" icon={<User />} />

          <div className="pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Gestión
          </div>

          <SidebarItem to="/pedidosVendedor" label="Pedidos" icon={<Package />} />

          {/* Submenu Productos */}
          <div>
            <button
              onClick={() => setProductosOpen(!productosOpen)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Boxes size={18} />
                Productos
              </div>
              {productosOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {productosOpen && (
              <div className="flex flex-col pl-8 mt-2 gap-1">
                <SidebarItem to="vendedorProductos" label="Ver Productos" icon={<Eye />} />
                <SidebarItem to="/crearProductos" label="Subir Producto" icon={<PlusCircle />} />
                
              </div>
            )}
          </div>

        </nav>
      </aside>
    </>
  );
}

function SidebarItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${isActive 
          ? "bg-blue-600 text-white shadow-md" 
          : "hover:bg-blue-50 hover:text-blue-600 text-gray-700"
        }
      `
      }
    >
      <span className="text-[18px]">{icon}</span>
      {label}
    </NavLink>
  );
}
