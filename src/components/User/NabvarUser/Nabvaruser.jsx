import React, { useState, useRef, useEffect } from "react";
import logo from "../../../assets/Logo3.png";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LogOut,
  ChevronDown,
  Heart,
  Menu,
  X,
  Search,
  Bell,
  User,
  Package,
  ShieldCheck,
} from "lucide-react";
import api from "../../../api/axios";
import ThemeToggle from "../../../utils/ThemeToggle"; 

export default function NavbarUser({ name, categorias = [] }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openCat, setOpenCat] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [highlightNotification, setHighlightNotification] = useState(false);

  const userRef = useRef();
  const catRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setNotificationCount(0);
        return;
      }

      const res = await api.get("/notifications/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const unread = Array.isArray(res.data)
        ? res.data.filter((n) => !n.isRead).length
        : 0;

      setNotificationCount(unread);
    } catch (error) {
      console.error("Error obteniendo notificaciones:", error);
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    const onNotificationsUpdated = () => fetchNotificationCount();

    window.addEventListener(
      "notificationsUpdated",
      onNotificationsUpdated
    );

    return () => {
      window.removeEventListener(
        "notificationsUpdated",
        onNotificationsUpdated
      );
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount(0);
        return;
      }

      const res = await api.get("/user/carAll", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartCount(res.data.items?.length || 0);
    } catch (error) {
      console.error("Error obteniendo carrito:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
    fetchNotificationCount();
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "updateCart") fetchCartCount();
    };

    const onCartUpdated = () => fetchCartCount();

    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdated", onCartUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cartUpdated", onCartUpdated);
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setOpenCat(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (notificationCount > 0) {
      setHighlightNotification(true);

      const timer = setTimeout(() => {
        setHighlightNotification(false);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [notificationCount]);

  return (
    <>
      {/* NAVBAR */}
      <nav
  className="
    w-full fixed top-0 left-0 z-50
    bg-white dark:bg-[#020617]
    border-b border-gray-100 dark:border-gray-800
    shadow-sm dark:shadow-none
    transition-colors
  "
>

        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
          {/* LOGO */}
          <div
            className="flex items-center gap-3 flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/homeUser")}
          >
            <img src={logo} className="h-10 md:h-12 object-contain scale-180" alt="Logo" />
          </div>

          {/* SEARCH DESKTOP */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-6 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="¿Qué estás buscando para tu negocio?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim() !== "") {
                  navigate(`/user/product/${search.trim()}`);
                  setSearch("");
                }
              }}
              className="
  w-full pl-11 pr-4 py-2.5 
  bg-gray-100/50 dark:bg-gray-800
  border border-transparent
  rounded-full 
  text-sm
  text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:bg-white dark:focus:bg-gray-900
  focus:ring-2 
  focus:ring-green-500/20 
  focus:border-green-500
  outline-none
  transition-all
"

            />
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-6 text-gray-600 dark:text-gray-300 font-medium">

            <Link to="/homeUser" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm"
>
              Inicio
            </Link>

            <Link
              to="/user/productos"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm"

            >
              Productos
            </Link>

            {/* CATEGORÍAS */}
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setOpenCat(!openCat)}
                className="flex items-center gap-1 hover:text-green-600 transition-colors text-sm"
              >
                Categorías <ChevronDown size={16} className={`transition-transform ${openCat ? 'rotate-180' : ''}`} />
              </button>

              {openCat && (
                <div className="
  absolute left-0 mt-4 w-56
  bg-white dark:bg-[#020617]
  border border-gray-100 dark:border-gray-800
  rounded-xl shadow-xl z-50 py-2
"
>
                  {categorias.length > 0 ? (
                    categorias.map((cat) => (
                      <div
                        key={cat._id}
                        onClick={() => {
                          navigate(`/user/categorias/${cat._id}`);
                          setOpenCat(false);
                        }}
                        className="
  px-4 py-2.5 cursor-pointer text-sm transition-colors
  text-gray-700 dark:text-gray-300
  hover:bg-green-50 dark:hover:bg-gray-800
  hover:text-green-700 dark:hover:text-green-400
"

                      >
                        {cat.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400 text-xs italic">
                      Sin categorías disponibles
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 mx-2" />

            <div className="flex items-center gap-2">
              <Link
                to="/favorito/all"
               className="
  p-2 rounded-full transition-colors relative
  hover:bg-gray-100 dark:hover:bg-gray-800
"

                title="Favoritos"
              >
                <Heart size={22} />
              </Link>
<ThemeToggle />
              <Link
                to="/user/carAll"
                className="
  p-2 rounded-full transition-colors relative
  hover:bg-gray-100 dark:hover:bg-gray-800
"

                title="Carrito"
              >
                
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span
                    className="
                      absolute top-0 right-0
                      bg-green-600 text-white
                      text-[10px] font-bold
                      w-5 h-5 rounded-full
                      flex items-center justify-center
                      border-2 border-white
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* USER MENU */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setOpenUser(!openUser)}
                className="
  flex items-center gap-2 pl-2 pr-1 py-1
  bg-gray-50 dark:bg-gray-900
  border border-gray-100 dark:border-gray-800
  hover:border-green-200
  transition-all shadow-sm
"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full shadow-inner"
                />
                <span className="text-gray-800 dark:text-gray-100 text-sm font-bold max-w-[100px] truncate">{name}</span>
                <ChevronDown size={14} className="text-gray-400 mr-1" />
              </button>

              {openUser && (
                <div className="absolute right-0 mt-4 w-72 bg-white dark:bg-[#020617] rounded-2xl shadow-2xl border border-gray-50 dark:border-gray-800 z-50 overflow-hidden"
>
                  <div className="flex items-center gap-3 p-4 bg-gray-50/50 dark:bg-gray-900 border-b dark:border-gray-800">

                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {localStorage.getItem("email")}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setOpenUser(false);
                        navigate("/perfil");
                      }}
                      className="
  flex items-center gap-3 text-left
  p-2.5 rounded-xl transition-colors text-sm
  text-gray-700 dark:text-gray-300
  hover:bg-green-50 dark:hover:bg-gray-800
  hover:text-green-700 dark:hover:text-green-400
"

                    >
                      <User size={18} className="text-gray-400" /> Mi Perfil
                    </button>

                    <button
                      onClick={() => {
                        setOpenUser(false);
                        navigate("/orders");
                      }}
                      className="flex items-center gap-3 text-left hover:bg-green-50 hover:text-green-700 p-2.5 rounded-xl transition-colors text-sm text-gray-700"
                    >
                      <Package size={18} className="text-gray-400" /> Mis Órdenes
                    </button>

                    <button
                      onClick={() => {
                        setOpenUser(false);
                        navigate("/cambiar-password");
                      }}
                      className="
  flex items-center gap-3 text-left
  p-2.5 rounded-xl transition-colors text-sm
  text-gray-700 dark:text-gray-300
  hover:bg-green-50 dark:hover:bg-gray-800
  hover:text-green-700 dark:hover:text-green-400
"

                    >
                      <ShieldCheck size={18} className="text-gray-400" /> Seguridad
                    </button>

                    <Link
                      to="/user/notificaciones"
                      onClick={() => setOpenUser(false)}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all text-sm ${highlightNotification ? 'bg-yellow-50 text-yellow-700' : 'hover:bg-green-50 hover:text-green-700 text-gray-700'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Bell size={18} className={highlightNotification ? 'text-yellow-500 animate-bounce' : 'text-gray-400'} />
                        Notificaciones
                      </div>
                      {notificationCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {notificationCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  <div className="p-2 mt-1 bg-gray-50 dark:bg-gray-900">
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 rounded-xl py-2.5 hover:bg-red-500 hover:text-white transition-all text-sm font-semibold"
                    >
                      <LogOut size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOTÓN MOBILE */}
         {/* BOTÓN MOBILE */}
<div className="flex md:hidden items-center gap-2">
  {/* 🌙☀️ DARK MODE */}
  <ThemeToggle />

  <Link to="/user/carAll" className="p-2 relative text-gray-600 dark:text-gray-300">
    <ShoppingCart size={24} />
    {cartCount > 0 && (
      <span className="absolute top-1 right-1 bg-green-600 w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center border border-white dark:border-gray-900">
        {cartCount}
      </span>
    )}
  </Link>

  <button
    className="text-gray-800 dark:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
    onClick={() => setMobileMenu(true)}
  >
    <Menu size={28} />
  </button>
</div>

        </div>
      </nav>

      {/* SIDEBAR MOBILE */}
      <div
        className={`
    fixed top-0 right-0 h-full w-[85%] max-w-[320px]
    bg-white dark:bg-[#020617] 
    shadow-2xl z-[999]
    border-l dark:border-gray-800 
    transform transition-transform duration-500 ease-in-out
    ${mobileMenu ? "translate-x-0" : "translate-x-full"}
  `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-3">
       <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
          {name.charAt(0)}
       </div>
       <span className="font-bold text-gray-800 dark:text-gray-100">Menú Principal</span>
    </div>
          <button onClick={() => setMobileMenu(false)} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-85px)] justify-between overflow-y-auto">
          <div className="flex flex-col text-gray-600 mt-4 px-4 gap-1 font-medium">
            <Link to="/homeUser" onClick={() => setMobileMenu(false)} className="flex items-center gap-4 p-3 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all">
              Inicio
            </Link>

            <Link to="/user/productos" onClick={() => setMobileMenu(false)} className="flex items-center gap-4 p-3 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all">
              Productos
            </Link>

            {/* Categorías Mobile */}
            <div className="flex flex-col">
              <div
                className="flex items-center justify-between p-3 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all cursor-pointer"
                onClick={() => setOpenCat(!openCat)}
              >
                <span>Categorías</span>
                <ChevronDown size={18} className={`transition-transform duration-300 ${openCat ? 'rotate-180' : ''}`} />
              </div>

              {openCat && (
                <div className="flex flex-col gap-1 pl-6 mt-1 overflow-hidden animate-in slide-in-from-top-1">
                  {categorias.length ? (
                    categorias.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          navigate(`/user/categorias/${cat._id}`);
                          setOpenCat(false);
                          setMobileMenu(false);
                        }}
                        className="text-left py-2 px-3 text-sm text-gray-500 hover:text-green-600 transition-colors"
                      >
                        • {cat.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-400 text-xs p-2">Sin categorías</p>
                  )}
                </div>
              )}
            </div>

            <Link to="/favorito/all" onClick={() => setMobileMenu(false)} className="flex items-center justify-between p-3 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all">
              <span>Favoritos</span>
              <Heart size={18} className="text-gray-300" />
            </Link>

            <Link to="/orders" onClick={() => setMobileMenu(false)} className="flex items-center justify-between p-3 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all">
              <span>Mis Órdenes</span>
              <Package size={18} className="text-gray-300" />
            </Link>

            <hr className="my-4 border-gray-100 dark:border-gray-800" />


            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cuenta</p>

            <button
              onClick={() => {
                navigate("/perfil");
                setMobileMenu(false);
              }}
              className="flex items-center gap-4 p-3 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all text-left"
            >
              Mi Perfil
            </button>

            <button
              onClick={() => {
                navigate("/cambiar-password");
                setMobileMenu(false);
              }}
              className="flex items-center gap-4 p-3 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all text-left"
            >
              Seguridad
            </button>

            <Link
              to="/user/notificaciones"
              className="flex items-center justify-between p-3 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all"
              onClick={() => setMobileMenu(false)}
            >
              <div className="flex items-center gap-2">Notificaciones</div>
              {notificationCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {notificationCount}
                </span>
              )}
            </Link>
          </div>

          <div className="p-6">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full bg-red-500 text-white p-4 rounded-2xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-all"
            >
              <LogOut size={20} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[998] animate-in fade-in"
          onClick={() => setMobileMenu(false)}
        ></div>
      )}

      {/* Padding para que el contenido no quede bajo el navbar */}
      <div className="h-20 w-full" />
    </>
  );
}