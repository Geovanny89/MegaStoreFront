import React from "react";
import { Menu, X, Home, User, Package, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function SidebarAdmin({ open, setOpen }) {
  return (
    <div
      className={`h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col border-r border-gray-700 ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {open && <h2 className="text-lg font-semibold">Admin</h2>}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded hover:bg-gray-700 transition"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* LINKS */}
      <nav className="flex-1 p-3 space-y-2">
        <SidebarItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" open={open} />
        <SidebarItem to="/admin/usuarios" icon={<User size={20} />} label="Usuarios" open={open} />
        <SidebarItem to="/admin/Categorias" icon={<Package size={20} />} label="Categorias" open={open} />
        <SidebarItem to="/admin/configuracion" icon={<Settings size={20} />} label="Configuración" open={open} />
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-700">
        {open && <p className="text-sm text-gray-400">Panel Administrativo</p>}
      </div>
    </div>
  );
}

function SidebarItem({ to, icon, label, open }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 transition"
    >
      {icon}
      {open && <span className="text-sm">{label}</span>}
    </Link>
  );
}
