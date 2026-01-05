import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";
import { Menu } from "lucide-react";

export default function LayoutAdmin() {
  // En móviles es mejor que empiece cerrado (false)
  const [open, setOpen] = useState(window.innerWidth > 768);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR - Ahora tiene un z-index alto para móviles */}
      <SidebarAdmin open={open} setOpen={setOpen} />

      {/* CONTENEDOR DE CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER MÓVIL: Solo se ve en pantallas pequeñas (md:hidden) */}
        <header className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between shadow-lg z-30">
          <span className="font-bold text-blue-400">ADMIN PANEL</span>
          <button 
            onClick={() => setOpen(true)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* ÁREA DE CONTENIDO PRINCIPAL */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Este div ayuda a que el contenido no se pegue a los bordes en móvil */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* OVERLAY: Fondo oscuro que cierra el menú al tocar fuera (solo en móvil) */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-[45] md:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}