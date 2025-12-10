import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-5 rounded-full">
            <Lock className="text-red-600 w-12 h-12" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Acceso Denegado</h1>
        <p className="text-gray-600 mb-6">
          No tienes permisos para ver esta página. Por favor contacta al administrador si crees que esto es un error.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-red-700 transition"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
