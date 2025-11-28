import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/Navbar/Navbar.jsx";

export default function products() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/user/allProducts");
        console.log("soy el producto ", res);
        setProductos(res.data);
      } catch (error) {
        console.log(error);
        alert("No existen productos");
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Productos
        </h1>

        {/* Si no hay productos */}
        {productos.length === 0 ? (
          <p className="text-gray-500 text-lg">No hay productos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((p) => (
              <div
                key={p._id}
                className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
              >
                {/* Imagen */}
                <div className="w-full h-40 flex justify-center items-center overflow-hidden rounded-lg mb-4 bg-gray-50">
                  <img
                    src={p.image?.[1]}
                    alt={p.name}
                    className="h-full object-contain"
                  />
                </div>

                {/* Datos */}
                <h2 className="text-lg font-semibold text-gray-800">
                  {p.name}
                </h2>

                <p className="text-sm text-gray-500">
                  Código: {p.codigo || "Sin código"}
                </p>

                <p className="text-red-600 font-bold mt-2 text-lg">
                  ${p.price}
                </p>

                {/* Botón */}
                <button className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                  Ver detalles
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
