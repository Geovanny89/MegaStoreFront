import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Vendedor/Sidebar";
import NavbarVendedor from "../../components/Vendedor/NabvarVendedor";
import { useState } from "react";

export default function LayoutSeller() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* 🔵 NAVBAR ARRIBA - OCUPA TODO EL ANCHO */}
      <NavbarVendedor setOpenSidebar={setOpenSidebar} />

      {/* 🔵 CONTENEDOR PRINCIPAL DEBAJO DEL NAV */}
      <div className="flex flex-1">

        {/* 🟦 SIDEBAR (izquierda) */}
        <Sidebar open={openSidebar} setOpen={setOpenSidebar} />

        {/* 🟩 CONTENIDO */}
        <main className="flex-1 p-6">
          <div className="
            bg-white rounded-xl shadow-md 
            p-6 min-h-[calc(100vh-80px)]
            border border-gray-200
          ">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}
