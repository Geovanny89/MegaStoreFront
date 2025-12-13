import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tienda({ setVendedorSeleccionado }) {
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/vendedor/all");
        setVendedores(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  // Nota: El grid original de ListaVendedores era 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'.
  // He mantenido la estructura de 3 columnas para tablet/desktop por consistencia,
  // pero puedes ajustar el "lg:grid-cols-4" si es necesario.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> 
      {vendedores.map((v) => (
        <div
          key={v._id}
          // ✨ Estilos de la tarjeta: fondo blanco, redondeado, sombra, transición y efecto hover
          className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
        >
          <div className="flex flex-col items-center p-4">
            {/* Logo de la tienda */}
            <img
              src={v.image || "https://via.placeholder.com/100"}
              alt={v.storeName}
              // ✨ Estilos de la imagen: tamaño, redondeo, object-contain y borde
              className="h-24 w-24 rounded-full mb-4 object-contain border-2 border-gray-200"
            />
            {/* Nombre de la tienda */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              {v.storeName}
            </h3>
            
            {/* Botón */}
            <button
              onClick={() => setVendedorSeleccionado(v)}
              // ✨ Estilos del botón: color, hover, padding, redondeado
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              Ver productos
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}