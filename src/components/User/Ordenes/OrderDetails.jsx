import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, Loader2 } from "lucide-react";
import api from "../../../api/axios";

export default function OrderDetails() {
  const { id } = useParams(); // viene de /order/:id
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [completing, setCompleting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (error) {
      console.error(error);
      alert("No se pudo cargar la orden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // ------------------------
  // 🔥 ACTUALIZAR CANTIDAD
  // ------------------------
  const updateQuantity = async (productId, newQty) => {
    try {
      setUpdating(true);

      const newProducts = order.products.map((item) =>
        item.product._id === productId
          ? { productId, quantity: newQty }
          : { productId: item.product._id, quantity: item.quantity }
      );

      await api.put(
        `/order/update/${id}`,
        { products: newProducts },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchOrder();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar la cantidad");
    } finally {
      setUpdating(false);
    }
  };

  // ------------------------
  // ❌ ELIMINAR PRODUCTO
  // ------------------------
  const removeProduct = async (productId) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      setDeletingProduct(productId);

      const newProducts = order.products
        .filter((item) => item.product._id !== productId)
        .map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        }));

      await api.put(
        `/order/update/${id}`,
        { products: newProducts },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchOrder();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el producto");
    } finally {
      setDeletingProduct(null);
    }
  };

  // ------------------------
  // ❌ CANCELAR ORDEN
  // ------------------------
  const cancelOrder = async () => {
    if (!confirm("¿Cancelar toda la orden?")) return;

    try {
      await api.delete(`/order/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Orden eliminada");
      navigate("/mis-ordenes");
    } catch (error) {
      console.error(error);
      alert("Error al cancelar la orden");
    }
  };

  // ------------------------
  // ⭐ COMPLETAR ORDEN (PAGAR)
  // ------------------------
  const completeOrder = async () => {
    try {
      setCompleting(true);

      await api.post(
        `/order/complete/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Pago completado ✔");
      fetchOrder();
    } catch (err) {
      console.error(err);
      alert("Error al completar pago");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <p>Cargando orden...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Orden #{id}</h1>

      <p className="font-medium mb-4">
        Estado:{" "}
        <span className="text-blue-600 font-semibold">
          {order.status.toUpperCase()}
        </span>
      </p>

      <div className="space-y-6">
        {order.products.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center bg-white p-4 rounded-xl shadow"
          >
            <img
              src={item.product.image?.[0]}
              alt=""
              className="w-28 h-28 object-cover rounded"
            />

            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-lg">{item.product.name}</h3>

              <p className="text-gray-600">
                Precio unitario: ${item.price}
              </p>

              <div className="flex items-center gap-3 mt-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  disabled={item.quantity <= 1 || updating}
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                >
                  -
                </button>

                <span className="font-semibold">{item.quantity}</span>

                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  disabled={updating}
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="text-red-600 hover:text-red-800 ml-4"
              onClick={() => removeProduct(item.product._id)}
              disabled={deletingProduct === item.product._id}
            >
              {deletingProduct === item.product._id ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Trash2 size={20} />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* ------- FOOTER DE OPCIONES ------- */}
      {order.status === "pending" && (
        <div className="mt-10 flex justify-between">
          <button
            onClick={cancelOrder}
            className="bg-red-600 text-white px-5 py-3 rounded-lg"
          >
            Cancelar orden
          </button>

          <button
            onClick={completeOrder}
            disabled={completing}
            className="bg-green-600 text-white px-5 py-3 rounded-lg"
          >
            {completing ? "Procesando..." : "Pagar ahora"}
          </button>
        </div>
      )}
    </div>
  );
}
