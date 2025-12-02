import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Trash2 } from "lucide-react";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchCarrito = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/user/carAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCarrito(res.data.items || []);
    } catch (error) {
      console.error(error);
      setCarrito([]);
    }
  };

  useEffect(() => {
    fetchCarrito();
  }, []);

  const eliminarProducto = async (productId) => {
    try {
      setLoadingId(productId);
      const token = localStorage.getItem("token");
      await api.delete(`/user/car/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // actualizar la lista
      fetchCarrito();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el producto");
    } finally {
      setLoadingId(null);
    }
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mi Carrito</h2>
      {carrito.length === 0 ? (
        <p className="text-gray-500">No hay productos en el carrito .</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {carrito.map((item) => (
            <div
              key={item.product._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="w-full h-48 bg-gray-50 flex justify-center items-center">
                <img
                  src={item.product.image?.[0]}
                  alt={item.product.name}
                  className="h-full object-contain p-2"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{item.product.name}</h2>
                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                <p className="text-blue-600 font-bold mt-3 text-xl">
                  ${item.product.price * item.quantity}
                </p>
                <button
                  onClick={() => eliminarProducto(item.product._id)}
                  disabled={loadingId === item.product._id}
                  className="mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                >
                  <Trash2 size={18} /> {loadingId === item.product._id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {carrito.length > 0 && (
        <div className="mt-10 flex justify-end items-center gap-4">
          <span className="text-xl font-bold text-gray-800">Total:</span>
          <span className="text-2xl font-bold text-red-600">${total}</span>
        </div>
      )}
    </div>
  );
}
