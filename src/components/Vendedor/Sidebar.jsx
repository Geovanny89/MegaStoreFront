import { 
  Package, 
  Boxes, 
  X, 
  LayoutDashboard, 
  User, 
  Eye, 
  PlusCircle, 
  ChevronDown, 
  ChevronUp, 
  Bell 
} from "lucide-react"; // importamos el icono de campana
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios"; // para obtener las notificaciones

export default function Sidebar({ open, setOpen }) {
  const [productosOpen, setProductosOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ===================== FETCH NOTIFICATIONS =====================
  const fetchUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/seller/notificacion", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const unread = res.data.notifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 30000); // refresca cada 30s
    return () => clearInterval(interval);
  }, []);

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
          <SidebarItem to="/HomeVendedor" label="Dashboard" icon={<LayoutDashboard />} />
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
                <SidebarItem to="/vendedorProductos" label="Ver Productos" icon={<Eye />} />
                <SidebarItem to="/crearProductos" label="Subir Producto" icon={<PlusCircle />} />
              </div>
            )}
          </div>

          {/* Notificaciones */}
          <SidebarItem
  to="/notificaciones"
  label="Notificaciones"
  icon={<Bell />}
  badge={unreadCount}
/>
        </nav>
      </aside>
    </>
  );
}

// ===================== SidebarItem =====================
function SidebarItem({ to, label, icon, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${isActive 
          ? "bg-blue-600 text-white shadow-md" 
          : "hover:bg-blue-50 hover:text-blue-600 text-gray-700"
        }
      `
      }
    >
      <div className="flex items-center gap-3">
        <span className="text-[18px]">{icon}</span>
        {label}
      </div>
      {badge > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
}
