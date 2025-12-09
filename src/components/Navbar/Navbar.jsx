import { useState } from "react";
import logo from "../../assets/Logo3.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} className="h-10" />
        
          </Link>

          {/* MENÚ DESKTOP */}
          <div className="hidden md:flex items-center gap-8">
            <Link className="hover:text-red-600">Inicio</Link>
            <Link to="#productos" className="hover:text-red-600">Productos</Link>
            <Link className="hover:text-red-600">Categorías</Link>
            <Link className="hover:text-red-600">Contacto</Link>
          </div>

          {/* LOGIN DESKTOP */}
          <Link to="/login" className="hidden md:block">
            <button className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition">
              Iniciar sesión
            </button>
          </Link>

          {/* ICONO MOBILE */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setOpen(!open)}
          >
            <svg
              className="w-9 h-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h18M3 12h18M3 18h18"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* ========== MENÚ MOBILE PROFESIONAL ========== */}
      <div
        className={`
          md:hidden fixed top-0 left-0 w-full bg-white shadow-lg z-40 
          transition-all duration-300 ease-out 
          ${open ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="px-6 pt-24 pb-8 space-y-6">

          {/* BUSCADOR MOBILE */}
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
          />

          {/* LINKS */}
          <nav className="flex flex-col gap-4 text-lg text-gray-700">
            <Link onClick={() => setOpen(false)} className="hover:text-red-600">Inicio</Link>
            <Link to="/user/productos" onClick={() => setOpen(false)} className="hover:text-red-600">Productos</Link>
            <Link onClick={() => setOpen(false)} className="hover:text-red-600">Categorías</Link>
            <Link onClick={() => setOpen(false)} className="hover:text-red-600">Contacto</Link>
          </nav>

          {/* LOGIN BOTÓN */}
          <Link to="/login" onClick={() => setOpen(false)}>
            <button className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition">
              Iniciar sesión
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
