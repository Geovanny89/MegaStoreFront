
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {


  
  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} className="h-10" />
          <span className="text-2xl font-bold text-red-600 tracking-wide">
            MiTienda
          </span>
        </div>

        {/* Buscador */}
        <div className="hidden md:flex w-full max-w-md ml-6">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-6 text-gray-700">
          <li className="hover:text-red-600 cursor-pointer">Inicio</li>
           <Link to="/productos">
    <li className="hover:text-red-600 cursor-pointer">Productos</li>
  </Link>
          <li className="hover:text-red-600 cursor-pointer">Categorías</li>
          <li className="hover:text-red-600 cursor-pointer">Contacto</li>
        </ul>

        {/* Login */}
        <button className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 hidden md:block">
          Iniciar sesión
        </button>

        {/* Menu mobile */}
        <button className="md:hidden text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5h16.5M3.75 12h16.5M3.75 19h16.5" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
