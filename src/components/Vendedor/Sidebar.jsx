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
  MessageCircle,
  ShieldCheck
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Sidebar({ open, setOpen }) {
  const [productosOpen, setProductosOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [sellerData, setSellerData] = useState(null); // Nuevo estado para los datos del vendedor

  /* ===================== FETCH DATA ===================== */
  const fetchData = async () => {
    try {
      // 1. Notificaciones
      const resNotif = await api.get("/notifications/seller");
      const unread = resNotif.data.notifications.filter(n => !n.isRead).length;
      setUnreadNotifications(unread);

      // 2. Datos del Vendedor (Para ver el sellerStatus)
      const resSeller = await api.get("/seller/me"); 
      setSellerData(resSeller.data);
    } catch (error) {
      console.error("Error obteniendo datos del sidebar", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Lógica: Si el status NO es 'active', mostramos el botón de verificación
  const showVerification = sellerData && sellerData.sellerStatus !== "active";

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
          <h2 className="text-xl font-semibold text-gray-900">🛍️ Panel Vendedor</h2>
          <p className="text-sm text-gray-500">Administración general</p>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 flex flex-col gap-2 text-gray-700">
          <SidebarItem to="/HomeVendedor" label="Dashboard" icon={<LayoutDashboard size={18} />} />
          <SidebarItem to="/PerfilVendedor" label="Mi Perfil" icon={<User size={18} />} />

          <div className="pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase">Gestión</div>

          <SidebarItem to="/pedidosVendedor" label="Pedidos" icon={<Package size={18} />} />

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
                <SidebarItem to="/vendedorProductos" label="Ver Productos" icon={<Eye size={18} />} />
                <SidebarItem to="/crearProductos" label="Subir Producto" icon={<PlusCircle size={18} />} />
              </div>
            )}
          </div>

          <SidebarItem to="/questions" label="Preguntas de productos" icon={<MessageCircle size={18} />} />
          <SidebarItem to="/notificaciones" label="Notificaciones" icon={<Bell size={18} />} badge={unreadNotifications} />

          {/* ============================================================ */}
          {/* VERIFICACIÓN DE IDENTIDAD: Solo aparece si NO está activo */}
          {/* ============================================================ */}
          {showVerification && (
            <SidebarItem
              to="/verificar/documento"
              label="Verificar Identidad"
              icon={<ShieldCheck size={18} className="text-orange-500" />}
            />
          )}
          <SidebarItem
  to="/banners"
  label="Mis Banners"
  icon={<LayoutDashboard size={18} />} // Cambia el ícono si quieres uno más adecuado
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
        `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${isActive
          ? "bg-blue-600 text-white shadow-md"
          : "hover:bg-blue-50 hover:text-blue-600 text-gray-700"}
      `
      }
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>

      {badge > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
}