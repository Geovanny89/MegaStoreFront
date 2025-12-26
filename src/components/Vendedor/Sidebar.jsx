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
  Bell,
  MessageCircle
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Sidebar({ open, setOpen }) {
  const [productosOpen, setProductosOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  /* ===================== NOTIFICATIONS ===================== */
  const fetchUnreadNotifications = async () => {
    try {
      const res = await api.get("/notifications/seller");
      const unread = res.data.notifications.filter(n => !n.isRead).length;
      
      setUnreadNotifications(unread);
    } catch (error) {
      console.error("Error obteniendo notificaciones", error);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 
          bg-white border-r border-gray-200 shadow-xl z-50
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close mobile */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={26} />
        </button>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            🛍️ Panel Vendedor
          </h2>
          <p className="text-sm text-gray-500">Administración general</p>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 flex flex-col gap-2 text-gray-700">

          {/* Dashboard */}
          <SidebarItem
            to="/HomeVendedor"
            label="Dashboard"
            icon={<LayoutDashboard />}
          />

          {/* Perfil */}
          <SidebarItem
            to="/PerfilVendedor"
            label="Mi Perfil"
            icon={<User />}
          />

          <div className="pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase">
            Gestión
          </div>

          {/* Pedidos */}
          <SidebarItem
            to="/pedidosVendedor"
            label="Pedidos"
            icon={<Package />}
          />

          {/* Productos submenu */}
          <div>
            <button
              onClick={() => setProductosOpen(!productosOpen)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <div className="flex items-center gap-3">
                <Boxes size={18} />
                Productos
              </div>
              {productosOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {productosOpen && (
              <div className="flex flex-col pl-8 mt-2 gap-1">
                <SidebarItem
                  to="/vendedorProductos"
                  label="Ver Productos"
                  icon={<Eye />}
                />
                <SidebarItem
                  to="/crearProductos"
                  label="Subir Producto"
                  icon={<PlusCircle />}
                />
              </div>
            )}
          </div>

          {/* ❓ PREGUNTAS DE PRODUCTOS (AQUÍ VA) */}
          <SidebarItem
            to="/questions"
            label="Preguntas de productos"
            icon={<MessageCircle />}
          />

          {/* 🔔 NOTIFICACIONES */}
          <SidebarItem
            to="/notificaciones"
            label="Notificaciones"
            icon={<Bell />}
            badge={unreadNotifications}
          />
        </nav>
      </aside>
    </>
  );
}

/* ===================== SidebarItem ===================== */
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
          : "hover:bg-blue-50 hover:text-blue-600 text-gray-700"}
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