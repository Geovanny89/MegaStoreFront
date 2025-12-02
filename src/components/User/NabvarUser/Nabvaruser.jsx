import React, { useState } from "react";
import logo from "../../../assets/logo2.png";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, ChevronDown, Heart } from "lucide-react";

export default function NavbarUser({ name = "Usuario", categorias = [] }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openCat, setOpenCat] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav
      className="
        w-full fixed top-0 left-0 z-50 
        shadow-lg 
        bg-gradient-to-b 
        from-green-600 
        via-green-500 
        to-blue-300
      "
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer"
             onClick={() => navigate("/homeUser")}
        >
          <img src={logo} className="h-10" alt="Logo" />
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1 mx-6">
          <input
  type="text"
  placeholder="Buscar productos..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/user/product/${search.trim()}`);
      setSearch("");
    }
  }}
  className="
    w-full px-4 py-2 
    bg-white/90 
    rounded-xl 
    focus:ring-2 
    focus:ring-blue-300 
    outline-none
  "
/>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-6 text-white font-medium">

          {/* INICIO */}
          <Link to="/homeUser">
            <span className="hover:text-yellow-200 transition cursor-pointer">
              Inicio
            </span>
          </Link>

          {/* PRODUCTOS */}
          <Link to="/user/productos">
            <span className="hover:text-yellow-200 transition cursor-pointer">
              Productos
            </span>
          </Link>

          {/* CATEGORÍAS */}
          <div className="relative">
            <button
              onClick={() => setOpenCat(!openCat)}
              className="flex items-center gap-1 hover:text-yellow-200"
            >
              Categorías <ChevronDown size={18} />
            </button>

            {openCat && (
              <div className="absolute left-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                {categorias.length > 0 ? (
                  categorias.map((cat) => (
                    <div
                      key={cat._id}
                      onClick={() => {
                        navigate(`/user/categorias/${cat._id}`);
                        setOpenCat(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {cat.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Sin categorías</div>
                )}
              </div>
            )}
          </div>

          {/* FAVORITOS */}
          <Link
            to="/favorito/all"
            className="flex items-center gap-1 hover:text-yellow-200 transition"
          >
            <Heart size={20} /> Favoritos
          </Link>

          {/* CARRITO */}
          <Link
            to="/user/carAll"
            className="flex items-center gap-1 hover:text-yellow-200 transition"
          >
            <ShoppingCart size={20} /> Carrito
          </Link>

          {/* USER */}
          <span className="font-semibold">
            Bienvenido, <span className="text-yellow-300">{name}</span>
          </span>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2 
              bg-white 
              text-green-700 
              hover:bg-green-100 
              px-4 py-2 rounded-xl 
              transition
            "
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>

        {/* MENU MOBILE */}
        <button className="md:hidden text-white ml-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5h16.5M3.75 12h16.5M3.75 19h16.5"
            />
          </svg>
        </button>

      </div>
    </nav>
  );
}
