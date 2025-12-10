import React, { useState, useRef, useEffect } from "react";
import logo from "../../../assets/Logo2.png";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LogOut,
  ChevronDown,
  Heart,
  Menu,
  X
} from "lucide-react";

export default function NavbarUser({ name, categorias = [] }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openCat, setOpenCat] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const userRef = useRef();
  const catRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Cerrar dropdown de usuario al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cerrar categorías al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setOpenCat(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* NAVBAR */}
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
        <div className="max-w-7xl mx-auto px-4 md:px-9 py-4 flex items-center justify-between">

          {/* LOGO */}
          <div
            className="flex items-center gap-3 flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/homeUser")}
          >
            <img src={logo} className="h-10" alt="Logo" />
          </div>

          {/* SEARCH DESKTOP */}
          <div className="hidden md:flex flex-1 mx-6">
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
          <div className="hidden md:flex items-center gap-10 text-white font-medium">

            <Link to="/homeUser" className="hover:text-yellow-200 transition">
              Inicio
            </Link>

            <Link to="/user/productos" className="hover:text-yellow-200 transition">
              Productos
            </Link>

            {/* CATEGORÍAS */}
            <div className="relative" ref={catRef}>
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
                    <div className="px-4 py-2 text-gray-500">
                      Sin categorías
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link to="/favorito/all" className="flex items-center gap-1 hover:text-yellow-200">
              <Heart size={20} /> Favoritos
            </Link>

            <Link to="/user/carAll" className="flex items-center gap-1 hover:text-yellow-200">
              <ShoppingCart size={20} /> Carrito
            </Link>

            <Link to="/orders" className="flex items-center gap-1 hover:text-yellow-200">
              <ShoppingCart size={20} /> Mis Órdenes
            </Link>

            {/* USER MENU */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setOpenUser(!openUser)}
                className="flex items-center gap-2 hover:bg-green-700/20 px-3 py-2 rounded-lg"
              >
                <img
                  src="https://ui-avatars.com/api/?name=User"
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-yellow-300 font-bold">{name}</span>
              </button>

              {openUser && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg p-5 z-50 animate-fadeIn">

                  <div className="flex items-center gap-3 pb-4 border-b">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-bold text-lg">{name}</p>
                      <p className="text-sm text-gray-500">
                        {localStorage.getItem("email")}
                      </p>
                    </div>
                  </div>

                  <div className="py-3 flex flex-col gap-3 text-gray-700">
                    <button
                      onClick={() => {
                        setOpenUser(false);
                        navigate("/perfil");
                      }}
                      className="text-left hover:bg-gray-100 p-2 rounded"
                    >
                      Mi Perfil
                    </button>

                    <button
                      onClick={() => {
                        setOpenUser(false);
                        navigate("/cambiar-password");
                      }}
                      className="text-left hover:bg-gray-100 p-2 rounded"
                    >
                      Cambiar Contraseña
                    </button>

                    <button className="text-left hover:bg-gray-100 p-2 rounded">
                      Preferencias
                    </button>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full bg-red-500 text-white rounded-lg py-2 hover:bg-red-600"
                  >
                    <LogOut size={18} className="inline-block mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BOTÓN MOBILE */}
          <button
            className="md:hidden text-white ml-3"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={30} />
          </button>

        </div>
      </nav>

      {/* SIDEBAR MOBILE */}
      <div
        className={`
          fixed top-0 right-0 h-full w-72
          bg-white shadow-lg z-[999]
          transform transition-transform duration-300
          ${mobileMenu ? "translate-x-0" : "translate-x-full"}
        `}
        onClick={(e) => e.stopPropagation()} // 🔥 Detiene clics entrando al backdrop
      >
        <div className="p-5 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Menú</h2>
          <button onClick={() => setMobileMenu(false)}>
            <X size={28} />
          </button>
        </div>

        <div className="flex flex-col text-gray-700 mt-5 px-4 gap-4">

          <Link to="/homeUser" onClick={() => setMobileMenu(false)}>
            Inicio
          </Link>

          <Link to="/user/productos" onClick={() => setMobileMenu(false)}>
            Productos
          </Link>

          {/* Categorías Mobile */}
          <div>
            <p
              className="font-semibold mb-2 cursor-pointer"
              onClick={() => setOpenCat(!openCat)}
            >
              Categorías <ChevronDown size={18} className="inline" />
            </p>

            {openCat && (
              <div className="flex flex-col gap-2 pl-3">
                {categorias.length ? (
                  categorias.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        navigate(`/user/categorias/${cat._id}`);
                        setOpenCat(false);
                        setMobileMenu(false);
                      }}
                      className="text-left hover:bg-gray-100 p-2 rounded"
                    >
                      {cat.name}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">Sin categorías</p>
                )}
              </div>
            )}
          </div>

          <Link to="/favorito/all" onClick={() => setMobileMenu(false)}>
            Favoritos
          </Link>

          <Link to="/user/carAll" onClick={() => setMobileMenu(false)}>
            Carrito
          </Link>

          <Link to="/orders" onClick={() => setMobileMenu(false)}>
            Mis Órdenes
          </Link>

          <hr />

          <button
            onClick={() => {
              navigate("/perfil");
              setMobileMenu(false);
            }}
            className="text-left hover:bg-gray-100 p-2 rounded"
          >
            Mi Perfil
          </button>

          <button
            onClick={() => {
              navigate("/cambiar-password");
              setMobileMenu(false);
            }}
            className="text-left hover:bg-gray-100 p-2 rounded"
          >
            Cambiar Contraseña
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded mt-4"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* BACKDROP */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998]"
          onClick={() => {
            console.log("BACKDROP CLOSE");
            setMobileMenu(false);
          }}
        ></div>
      )}
    </>
  );
}
