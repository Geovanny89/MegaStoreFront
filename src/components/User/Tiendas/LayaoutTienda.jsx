// src/components/layout/LayoutTienda.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import NavbarTienda from "../Tiendas/NabvarTienda"; // Importa el nuevo Navbar
import api from "../../../api/axios";

export default function LayoutTienda() {
  const { slug } = useParams();
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await api.get(`/store/${slug}`);
        setStoreName(res.data.seller.storeName);
      } catch (error) {
        console.error("Error cargando nombre de tienda:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchStoreData();
  }, [slug]);

  if (loading) return null; // O un spinner ligero

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Usamos el Navbar minimalista de tienda aquí */}
      <NavbarTienda storeName={storeName} />
    
      <main className="flex-1 w-full mx-auto">
        {/* Outlet renderizará Carrito, Favoritos o Storefront según la ruta */}
        <Outlet />
      </main>
    </div>
  );
}