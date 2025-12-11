import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";

export default function LayoutAdmin() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <SidebarAdmin open={open} setOpen={setOpen} />

      {/* Contenido principal ajustado según el ancho del sidebar */}
      <div
        className={`transition-all duration-300 p-6 flex-1`}
      >
        <Outlet />
      </div>
    </div>
  );
}
