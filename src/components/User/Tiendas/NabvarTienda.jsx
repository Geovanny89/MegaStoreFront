import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import {
  ShoppingCart, LogIn, User, LogOut, Heart, Bell, ChevronDown, Store, Search,
  ArrowLeft
} from "lucide-react";
import api from "../../../api/axios";
import ThemeToggle from "../../../utils/ThemeToggle"; 

export default function NavbarTienda({ storeName, fromMarketplace }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "Usuario";
  const [search, setSearch] = useState("");

  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [openUser, setOpenUser] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userRef = useRef();

  // Efecto de scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToMirror = (path) => {
    setOpenUser(false);
    if (slug) navigate(`/${slug}/${path}`);
    else navigate(`/user/${path}`);
  };

  const fetchCounts = async () => {
    if (!token) return;
    try {
      const [cartRes, notifRes] = await Promise.all([
        api.get("/user/carAll"),
        api.get("/notifications/seller")
      ]);

      setCartCount(cartRes.data.items?.length || 0);

      const unread = Array.isArray(notifRes.data)
        ? notifRes.data.filter(n => !n.isRead).length
        : 0;

      setNotificationCount(unread);
    } catch (error) {
      console.error("Error obteniendo contadores:", error);
      setCartCount(0);
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    fetchCounts();
    const onUpdate = () => fetchCounts();
    window.addEventListener("cartUpdated", onUpdate);
    window.addEventListener("notificationsUpdated", onUpdate);
    return () => {
      window.removeEventListener("cartUpdated", onUpdate);
      window.removeEventListener("notificationsUpdated", onUpdate);
    };
  }, [token]);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
      scrolled
        ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg py-2 border-b dark:border-slate-800"
        : "bg-white dark:bg-slate-900 py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* IZQUIERDA: Identidad */}
        <div className="flex items-center gap-6">
          {fromMarketplace && (
            <button
              onClick={() => window.history.length > 1 ? window.history.back() : navigate("/")}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={16} />
              Volver al marketplace
            </button>
          )}

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          <div className="hidden lg:flex items-center gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-2 rounded-2xl group transition-all hover:bg-white dark:hover:bg-slate-700">
            <Store size={18} className="text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none">Oficial</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                {storeName || slug}
              </span>
            </div>
          </div>
        </div>

        {/* CENTRO: Barra de búsqueda */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar en esta tienda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/${slug}?q=${encodeURIComponent(search)}`);
                }
              }}
              className="w-full bg-slate-100 dark:bg-slate-800 dark:text-white border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* DERECHA: Navegación de Usuario y Toggle */}
        <div className="flex items-center gap-3">
          
          {/* El toggle lo dejamos fuera para que siempre esté disponible */}
          <ThemeToggle />

          {token ? (
            <>
              {/* Botones de Acción */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => goToMirror("favoritos")}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
                  title="Favoritos"
                >
                  <Heart size={20} />
                </button>

                <button
                  onClick={() => goToMirror("carrito")}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all relative"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-black w-4 h-4 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 border-2 border-white dark:border-slate-800">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => goToMirror("notificaciones")}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all relative"
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 bg-amber-500 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800"></span>
                  )}
                </button>
              </div>

              {/* Perfil de Usuario */}
              <div className="relative ml-2" ref={userRef}>
                <button
                  onClick={() => setOpenUser(!openUser)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:shadow-md transition-all active:scale-95 shadow-sm"
                >
                  <div className="relative">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff&bold=true`}
                      className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-600 shadow-sm"
                      alt="avatar"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${openUser ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {openUser && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-[110] animate-in fade-in slide-in-from-top-5 duration-200">
                    <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 mb-1">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Cuenta</p>
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{userName}</p>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => navigate(`/${slug}/perfil`)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors"
                      >
                        <User size={18} /> Mi Perfil
                      </button>
                      <button onClick={() => navigate(`/${slug}/ordenes`)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors">
                        <ShoppingCart size={18} /> Mis Pedidos
                      </button>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                        <LogOut size={18} /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate("/login", { state: { from: location.pathname } })}
              className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black text-sm hover:opacity-90 shadow-lg transition-all active:scale-95"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}