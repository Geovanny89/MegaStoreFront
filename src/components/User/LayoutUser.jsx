import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavbarUser from "./NabvarUser/Nabvaruser.jsx";
import api from "../../api/axios";


export default function LayoutUser() {
  const [categorias, setCategorias] = useState([]);

const nombre = localStorage.getItem("userName") || "Usuario";


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get("/user/categorias");
        setCategorias(res.data);
        // console.log("Soy las respuestas",res);
      } catch (error) {
        console.log(error);
        setCategorias([]);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* NAVBAR */}
      <NavbarUser name={nombre} categorias={categorias} />


      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Aquí se renderiza HomeComprador o Carrito */}
          <Outlet />
        </div>
      </main>

     
    </div>
  );
}
