import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Trash2, MapPin, Store } from "lucide-react";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [loadingId, setLoadingId] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  /* ================== DATA ================== */
  const fetchCarrito = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/user/carAll", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCarrito(res.data.items || []);
  };

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/user/address", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const list = res.data.addresses || [];
    setAddresses(list);

    const defaultAddress = list.find((a) => a.isDefault);
    setSelectedAddress(defaultAddress || list[0] || null);
  };

  useEffect(() => {
    fetchCarrito();
    fetchAddresses();
  }, []);

  /* ================== DELETE ================== */
  const eliminarProducto = async (productId) => {
    setLoadingId(productId);
    const token = localStorage.getItem("token");

    await api.delete(`/user/car/delete/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchCarrito();
    setLoadingId(null);
  };

  /* ================== ORDER ================== */
  const handleCreateOrder = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío");

    if (deliveryMethod === "delivery" && !selectedAddress) {
      return alert("Selecciona una dirección de envío");
    }

    try {
      setLoadingOrder(true);
      const token = localStorage.getItem("token");

      const products = carrito.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const shippingAddress =
        deliveryMethod === "delivery"
          ? {
              street: selectedAddress.street,
              city: selectedAddress.city,
              state: selectedAddress.state,
              postalCode: selectedAddress.postalCode,
              reference: selectedAddress.reference,
            }
          : null;

      const orderRes = await api.post(
        "/order",
        {
          products,
          shippingAddress,
          deliveryMethod,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderId = orderRes.data.order._id;

      if (paymentMethod === "card" || paymentMethod === "pse") {
        const payRes = await api.post(
          "/stripe/checkout",
          { orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        window.location.href = payRes.data.url;
      } else {
        alert("Orden creada correctamente.");
        window.location.href = "/orders";
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error al procesar la compra");
    } finally {
      setLoadingOrder(false);
    }
  };

  /* ================== TOTAL ================== */
  const total = carrito.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  /* ================== SELLERS (PICKUP) ================== */
  const sellers = [
    ...new Map(
      carrito.map((item) => [
        item.product.vendedor?._id,
        item.product.vendedor,
      ])
    ).values(),
  ];

  /* ================== UI ================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-10">Mi Carrito</h2>

      {carrito.length === 0 ? (
        <p className="text-gray-500">No hay productos en el carrito.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* PRODUCTOS */}
          <div className="lg:col-span-2 space-y-6">
            {carrito.map((item) => (
              <div
                key={item.product._id}
                className="flex gap-5 bg-white p-4 rounded-xl border"
              >
                <img
                  src={item.product.image?.[0]}
                  className="w-28 h-28 object-contain"
                  alt={item.product.name}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p>Cantidad: {item.quantity}</p>
                  <p className="text-blue-600 font-bold">
                    ${item.product.price * item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => eliminarProducto(item.product._id)}
                  disabled={loadingId === item.product._id}
                  className="text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* RESUMEN */}
          <div className="bg-white border rounded-xl p-6 space-y-6">

            {/* MÉTODO ENTREGA */}
            <div>
              <h3 className="font-semibold mb-3">Método de entrega</h3>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  checked={deliveryMethod === "delivery"}
                  onChange={() => {
                    setDeliveryMethod("delivery");
                    setPaymentMethod("card");
                  }}
                />
                <MapPin size={16} /> Envío a domicilio
              </label>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  checked={deliveryMethod === "pickup"}
                  onChange={() => {
                    setDeliveryMethod("pickup");
                    setPaymentMethod("card");
                  }}
                />
                <Store size={16} /> Recoger en tienda
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={deliveryMethod === "cash_on_delivery"}
                  onChange={() => {
                    setDeliveryMethod("cash_on_delivery");
                    setPaymentMethod("cash");
                  }}
                />
                💵 Contraentrega
              </label>
            </div>

            {/* MÉTODO PAGO */}
            <div>
              <h3 className="font-semibold mb-3">Método de pago</h3>

              {(deliveryMethod === "delivery" ||
                deliveryMethod === "pickup") && (
                <>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    💳 Tarjeta
                  </label>

                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      checked={paymentMethod === "pse"}
                      onChange={() => setPaymentMethod("pse")}
                    />
                    🏦 PSE
                  </label>
                </>
              )}

              {deliveryMethod === "pickup" && (
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    checked={paymentMethod === "pay_in_store"}
                    onChange={() => setPaymentMethod("pay_in_store")}
                  />
                  🏪 Pagar en tienda
                </label>
              )}

              {deliveryMethod === "cash_on_delivery" && (
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />
                    💵 Efectivo
                </label>
              )}
            </div>

            {/* DIRECCIÓN USUARIO */}
            {deliveryMethod === "delivery" && (
              <div>
                <h3 className="font-semibold mb-3">Dirección de envío</h3>
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className="block border rounded-lg p-3 mb-2"
                  >
                    <input
                      type="radio"
                      checked={selectedAddress?._id === addr._id}
                      onChange={() => setSelectedAddress(addr)}
                      className="mr-2"
                    />
                    {addr.street}, {addr.city}
                  </label>
                ))}
              </div>
            )}

            {/* DIRECCIÓN TIENDA */}
            {deliveryMethod === "pickup" && (
              <div>
                <h3 className="font-semibold mb-3">Recoger en:</h3>
                {sellers.map((seller) => (
                  <div
                    key={seller?._id}
                    className="border rounded-lg p-3 mb-2 bg-gray-50"
                  >
                    <p className="font-semibold">
                      {seller?.storeName || "Tienda"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {seller?.storeAddress?.street},{" "}
                      {seller?.storeAddress?.city}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TOTAL */}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total}</span>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={loadingOrder}
                className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
              >
                {loadingOrder ? "Procesando..." : "Confirmar compra"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
