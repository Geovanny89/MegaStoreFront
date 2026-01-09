import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NavbarUser from "./NabvarUser/Nabvaruser.jsx";
import api from "../../api/axios";
import FooterUser from "./FooterUser/FooterUser.jsx";

export default function LayoutUser() {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const nombre = localStorage.getItem("userName") || "Usuario";

  const isHome = location.pathname === "/homeUser";

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get("/user/categorias");
        setCategorias(res.data);
      } catch {
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, []);

  const handleGoHome = () => {
    navigate("/homeUser", { replace: true });
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-300">
      
      {/* NAVBAR */}
      <NavbarUser name={nombre} categorias={categorias} />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-[100px] pb-12">

        {/* BOTÓN VOLVER */}
        {!isHome && (
          <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <button
              onClick={handleGoHome}
              className="group flex items-center gap-3 relative"
            >
              {/* ICONO */}
              <div className="
                relative z-10
                p-2.5 bg-white dark:bg-gray-800
                border border-slate-200/60 dark:border-gray-700
                shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                group-hover:shadow-[0_8px_25px_rgba(59,130,246,0.15)]
                group-hover:border-blue-400/30
                group-active:scale-90
                transition-all duration-300
                flex items-center justify-center
                rounded-full
              ">
                <ArrowLeft
                  size={18}
                  className="text-slate-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                  strokeWidth={2.5}
                />
              </div>

              {/* TEXTO */}
              <div className="flex flex-col items-start">
                <span className="
                  text-[10px] font-black uppercase tracking-[0.2em]
                  text-slate-400 dark:text-gray-500
                  group-hover:text-blue-500 transition-colors duration-300
                ">
                  Regresar
                </span>
                <span className="
                  text-sm font-bold
                  text-slate-700 dark:text-gray-200
                  group-hover:text-slate-900 dark:group-hover:text-white
                  transition-colors duration-300
                  relative
                ">
                  Volver al Inicio
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </div>
            </button>
          </div>
        )}

        {/* CONTENEDOR DE PÁGINAS */}
        <div className="
          bg-white dark:bg-gray-900/40
          rounded-[2.5rem]
          shadow-[0_20px_50px_rgba(0,0,0,0.02)]
          border border-slate-100/80 dark:border-gray-800
          p-6 md:p-10
          min-h-[70vh]
          animate-in fade-in slide-in-from-bottom-4 duration-700
        ">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <FooterUser />
    </div>
  );
}
