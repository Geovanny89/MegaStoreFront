import { Menu, LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NavbarVendedor({ setOpenSidebar }) {
  const navigate = useNavigate();

  const nombre = localStorage.getItem("userName") || "Vendedor";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header
      className="
        h-20 bg-white shadow-sm border-b border-gray-200
        flex items-center justify-between 
        px-4 md:px-10
      "
    >
      {/* Botón menú (solo móvil) */}
      <button
        onClick={() => setOpenSidebar(true)}
        className="md:hidden text-gray-700"
      >
        <Menu size={28} />
      </button>

      {/* Información del vendedor */}
      <div className="flex items-center gap-4">
        <div className="
          bg-blue-100 text-blue-600 
          p-2 rounded-full shadow-sm
        ">
          <UserCircle size={34} />
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Bienvenido de vuelta 👋</span>

          <span className="text-xl font-semibold text-gray-900 tracking-tight">
            {nombre}
          </span>

         
        </div>
      </div>

      {/* Botón Logout */}
      <button
        onClick={handleLogout}
        className="
          flex items-center gap-2
          px-4 py-2 rounded-xl
          bg-red-50 text-red-600 border border-red-200
          hover:bg-red-100 hover:border-red-300
          font-medium transition-all
        "
      >
        <LogOut size={20} />
        Salir
      </button>
    </header>
  );
}
