
import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Trash2 } from "lucide-react";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  // 📌 Obtener carrito
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

  // 🗑 Eliminar producto del carrito
  const eliminarProducto = async (productId) => {
    try {
      setLoadingId(productId);
      const token = localStorage.getItem("token");

      await api.delete(`/user/car/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchCarrito();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el producto");
    } finally {
      setLoadingId(null);
    }
  };

  // 💳 FINALIZAR COMPRA → Crear orden + Redirigir a Stripe
//   const handleCreateOrder = async () => {
//     if (carrito.length === 0) return alert("El carrito está vacío");

//     try {
//       setLoadingOrder(true);
//       const token = localStorage.getItem("token");

//       const productsToSend = carrito.map((item) => ({
//         productId: item.product._id,
//         quantity: item.quantity,
//       }));

//       const shippingAddress = {
//         street: "Calle falsa 123",
//         city: "Bogotá",
//         country: "Colombia",
//       };

//       // 1️⃣ Crear la orden
//       const orderRes = await api.post(
//         "/order",
//         { products: productsToSend, shippingAddress },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const orderId = orderRes.data._id;

//       // 2️⃣ Crear sesión de Stripe
//       const payRes = await api.post(
//         "/stripe/checkout",
//         { orderId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
// console.log(payRes);
//       // 3️⃣ Redirigir al checkout Stripe
//       window.location.href = payRes.data.url;
//     } catch (error) {
//       console.error(error);
//       alert(
//         error.response?.data?.message || "Error al procesar la compra"
//       );
//     } finally {
//       setLoadingOrder(false);
//     }
//     console.log(payRes);
//   };
const handleCreateOrder = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío");

    try {
      setLoadingOrder(true);
      const token = localStorage.getItem("token");

      const productsToSend = carrito.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const shippingAddress = {
        street: "Calle falsa 123",
        city: "Bogotá",
        country: "Colombia",
      };

      // 1️⃣ Crear la orden
      const orderRes = await api.post(
        "/order",
        { products: productsToSend, shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderId = orderRes.data.order?._id || orderRes.data._id;

      // 2️⃣ Crear sesión de Stripe
      const payRes = await api.post(
        "/stripe/checkout",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3️⃣ Redirigir al checkout Stripe
      window.location.href = payRes.data.url;

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al procesar la compra");

    } finally {
      setLoadingOrder(false);
    }
};


  const total = carrito.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-10 text-gray-900">Mi Carrito</h2>

      {carrito.length === 0 ? (
        <p className="text-gray-500">No hay productos en el carrito.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* 🛒 LISTA DE PRODUCTOS */}
          <div className="lg:col-span-2 space-y-6">
            {carrito.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-5 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.product.image?.[0]}
                  alt={item.product.name}
                  className="w-32 h-32 object-contain bg-gray-50 rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Cantidad: {item.quantity}
                  </p>
                  <p className="text-xl text-blue-600 font-bold mt-1">
                    ${item.product.price * item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => eliminarProducto(item.product._id)}
                  disabled={loadingId === item.product._id}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition"
                >
                  <Trash2 size={16} />
                  {loadingId === item.product._id ? "..." : "Eliminar"}
                </button>
              </div>
            ))}
          </div>

          {/* 📦 RESUMEN */}
          <div className="bg-white shadow-md rounded-xl border border-gray-200 p-6 h-fit">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h3>

            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>

            <div className="flex justify-between text-gray-700 mb-2">
              <span>Envío</span>
              <span className="text-green-600 font-medium">Gratis</span>
            </div>

            <div className="border-t border-gray-300 my-3"></div>

            <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span>${total}</span>
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={loadingOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition text-lg shadow-sm"
            >
              {loadingOrder ? "Procesando..." : "Finalizar compra"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
