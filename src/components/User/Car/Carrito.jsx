import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import {
  Trash2,
  MapPin,
  Store,
  ShoppingBag,
  ArrowRight,
  PlusCircle,
  X,
  Check,
  Info,
  QrCode,
  Copy,
  ShieldAlert,
  Truck,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Carrito() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("nequi");
  const [loadingId, setLoadingId] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [sellerPayments, setSellerPayments] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { slug } = useParams();

  // Estados para nueva dirección
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    reference: "",
    isDefault: false,
  });

  const token = localStorage.getItem("token");

 const fetchCarrito = async () => {
  try {
    const endpoint = slug
      ? `/user/car/tienda/${slug}`
      : "/user/carAll";

    const res = await api.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let items = [];

    if (slug) {
      // 🔹 carrito por tienda
      items = res.data.tiendas?.[0]?.items || [];
    } else {
      // 🔹 carrito completo
      items = res.data.items || [];
    }

    setCarrito(items);

    if (items.length > 0) {
      const primerProducto = items[0].product;
      if (primerProducto?.vendedor) {
        setSellerPayments(primerProducto.vendedor.paymentMethods || []);
      }
    }
  } catch (error) {
    console.error("Error al cargar carrito", error);
  }
};


  const fetchAddresses = async () => {
    try {
      const res = await api.get("/user/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data.addresses || [];
      setAddresses(list);
      setSelectedAddress(list.find((a) => a.isDefault) || list[0] || null);
    } catch (err) {
      console.error("Error al cargar direcciones");
    }
  };

  useEffect(() => {
    fetchCarrito();
    fetchAddresses();
  }, []);

  const eliminarProducto = async (productId) => {
    setLoadingId(productId);
    try {
      await api.delete(`/user/car/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCarrito((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      alert("No se pudo eliminar el producto");
    } finally {
      setLoadingId(null);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/createAdress", newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedAddresses = res.data.addresses;
      setAddresses(updatedAddresses);
      setSelectedAddress(updatedAddresses[updatedAddresses.length - 1]);
      setShowAddForm(false);
      setNewAddress({
        label: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        reference: "",
        isDefault: false,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error al guardar dirección");
    }
  };

  const handleCreateOrder = async () => {
    if (!acceptedTerms)
      return alert("Debes aceptar los términos y condiciones");
    if (carrito.length === 0) return alert("El carrito está vacío");
    if (deliveryMethod === "delivery" && !selectedAddress)
      return alert("Selecciona una dirección de envío");

    try {
      setLoadingOrder(true);
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

      await api.post(
        "/order",
        { products, deliveryMethod, paymentMethod, shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#16a34a", "#3b82f6", "#ffffff"],
      });

      setCarrito([]);
      window.dispatchEvent(new Event("cartUpdated"));

      setTimeout(() => {
        const shipParam =
          deliveryMethod === "delivery" ? "&shipping=seller" : "";
        navigate(
          paymentMethod === "cash_on_delivery"
            ? `/success?type=pickup${shipParam}`
            : `/success?type=mobile${shipParam}`
        );
      }, 800);
    } catch (err) {
      alert(err.response?.data?.message || "Error al crear la orden");
    } finally {
      setLoadingOrder(false);
    }
  };

  const total = carrito.reduce((acc, item) => {
    const price = item.hasDiscount ? item.finalPrice : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const currentSellerPayment = sellerPayments.find((m) => {
    if (paymentMethod === "nequi") return m.provider === "nequi" && m.active;
    if (paymentMethod === "daviplata")
      return m.provider === "llaves" && m.active;
    return false;
  });
  const shippingPolicyCarrito = carrito.every(
    (item) => item.product.shippingPolicy === "free"
  )
    ? "free"
    : "coordinar";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 py-12 px-4 md:px-6">

      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100">
        {/* HEADER */}
        <div className="flex items-end gap-4 mb-10">
          <div className="bg-green-600 p-3 rounded-2xl shadow-lg text-white">
            <ShoppingBag size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Mi Carrito
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">
              Tienes {carrito.length} artículos listos
            </p>
          </div>
        </div>

        {carrito.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-gray-600">
            <ShoppingBag
              size={48}
              className="text-slate-300 dark:text-slate-400 mb-6"
            />
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 uppercase">
              Tu carrito está vacío
            </h3>
            <p className="text-slate-400 dark:text-slate-300 text-sm font-bold italic">
              Agrega productos para continuar con tu pedido
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LISTA DE PRODUCTOS */}
            <div className="lg:col-span-7 space-y-4">
              {carrito.map((item) => (
                <div
                  key={item.product._id}
                  className="group bg-white dark:bg-gray-900 p-5 rounded-[32px] border border-slate-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-6 items-center hover:shadow-md transition-all"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-gray-800 p-2 text-center">
                    <img
                      src={
                        item.product.image?.[0]?.url ||
                        "/placeholder-product.png"
                      }
                      alt={item.product.name}
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg mb-1">
                      {item.product.name}
                    </h3>

                    <p className="text-slate-400 dark:text-slate-400 font-bold text-xs uppercase mb-3 tracking-tighter">
                      Cantidad: {item.quantity}
                    </p>
                    {item.hasDiscount ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-bold">
                          $
                          {(item.product.price * item.quantity).toLocaleString(
                            "es-CO"
                          )}
                        </span>
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-sm font-black">
                          $
                          {(item.finalPrice * item.quantity).toLocaleString(
                            "es-CO"
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-black">
                        $
                        {(item.product.price * item.quantity).toLocaleString(
                          "es-CO"
                        )}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => eliminarProducto(item.product._id)}
                    disabled={loadingId === item.product._id}
                    className="p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 hover:bg-rose-500 dark:hover:bg-rose-600 hover:text-white rounded-2xl transition-all disabled:opacity-30"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>

            {/* PANEL DE PAGO / CHECKOUT */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-950 border border-slate-100 dark:border-gray-700 rounded-[40px] p-8 shadow-2xl space-y-8 sticky top-28">
              {/* 1. MÉTODO ENTREGA */}
              <div>
                <h4 className="font-black text-slate-900 dark:text-gray-100 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 1.
                  Modo de Entrega
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${
                      deliveryMethod === "delivery"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-slate-100 dark:border-gray-700 text-slate-400 dark:text-gray-400"
                    }`}
                  >
                    <MapPin size={24} className="dark:text-blue-300" />
                    <span className="text-[10px] font-black uppercase tracking-tight">
                      Domicilio
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setDeliveryMethod("pickup");
                      setPaymentMethod("nequi");
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${
                      deliveryMethod === "pickup"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-slate-100 text-slate-400"
                    }`}
                  >
                    <Store size={24} />
                    <span className="text-[10px] font-black uppercase tracking-tight">
                      En tienda
                    </span>
                  </button>
                </div>
              </div>

              {/* INFO DE ENVÍO SEGÚN POLÍTICA DEL CARRITO */}
              {deliveryMethod === "delivery" && (
                <div
                  className={`p-4 rounded-2xl border flex items-center gap-3 ${
                    shippingPolicyCarrito === "free"
                      ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300"
                      : "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {shippingPolicyCarrito === "free" ? (
                    <>
                      <Truck size={18} className="dark:text-green-300" />
                      <p className="text-[11px] font-bold uppercase">
                        Envío Gratis en todos los productos
                      </p>
                    </>
                  ) : (
                    <>
                      <Info size={18} className="dark:text-amber-300" />
                      <p className="text-[11px] font-bold uppercase">
                        El costo del envío se coordina con el vendedor
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* 2. DIRECCIÓN */}
              {deliveryMethod === "delivery" && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-slate-900 dark:text-slate-100 text-xs uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></span>{" "}
                      2. Dirección
                    </h4>
                    {!showAddForm && (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase flex items-center gap-1"
                      >
                        <PlusCircle size={14} /> Añadir
                      </button>
                    )}
                  </div>

                  {showAddForm ? (
                    <form
  onSubmit={handleAddAddress}
  className="bg-slate-50 dark:bg-gray-900 p-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-gray-700 space-y-3"
>
  <input
    placeholder="Etiqueta (Casa, Trabajo...)"
    className="w-full p-3 rounded-xl text-xs border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 placeholder-slate-400 dark:placeholder-slate-500"
    value={newAddress.label}
    onChange={(e) =>
      setNewAddress({
        ...newAddress,
        label: e.target.value,
      })
    }
    required
  />

  <input
    placeholder="Dirección"
    className="w-full p-3 rounded-xl text-xs border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 placeholder-slate-400 dark:placeholder-slate-500"
    value={newAddress.street}
    onChange={(e) =>
      setNewAddress({
        ...newAddress,
        street: e.target.value,
      })
    }
    required
  />

  {/* 🔹 CAMPO QUE FALTABA */}
  <input
    placeholder="Ciudad"
    className="w-full p-3 rounded-xl text-xs border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 placeholder-slate-400 dark:placeholder-slate-500"
    value={newAddress.city}
    onChange={(e) =>
      setNewAddress({
        ...newAddress,
        city: e.target.value,
      })
    }
    required
  />

  <div className="flex gap-2">
    <button
      type="submit"
      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black py-3 rounded-xl uppercase transition-colors"
    >
      Guardar
    </button>

    <button
      type="button"
      onClick={() => setShowAddForm(false)}
      className="p-3 bg-slate-200 dark:bg-gray-700 rounded-xl transition-colors"
    >
      <X size={16} />
    </button>
  </div>
</form>

                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {addresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => setSelectedAddress(addr)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                            selectedAddress?._id === addr._id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                              : "border-slate-50 bg-slate-50/50 dark:border-gray-700 dark:bg-gray-800/50"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-4 ${
                              selectedAddress?._id === addr._id
                                ? "border-blue-500"
                                : "border-slate-300 dark:border-gray-500"
                            }`}
                          />
                          <div className="overflow-hidden">
                            <p className="text-[10px] font-black text-slate-800 dark:text-gray-100 uppercase leading-none mb-1">
                              {addr.label}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold truncate">
                              {addr.street}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. PAGO */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 dark:text-gray-100 text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 3.
                  Pago y Recaudo
                </h4>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all text-slate-900 dark:text-gray-100"
                >
                  {deliveryMethod === "delivery" ? (
                    <option value="cash_on_delivery">
                      Contraentrega (Efectivo al recibir)
                    </option>
                  ) : (
                    <option value="cash_on_delivery">
                      Pago en Tienda (Efectivo)
                    </option>
                  )}

                  {sellerPayments.some(
                    (m) => m.provider === "nequi" && m.active
                  ) && <option value="nequi">Transferencia Nequi</option>}
                  {sellerPayments.some(
                    (m) => m.provider === "llaves" && m.active
                  ) && <option value="daviplata">Transferencia Breb-B</option>}
                </select>

                {paymentMethod !== "cash_on_delivery" ? (
                  <div className="bg-blue-50/50 dark:bg-blue-900/30 border-2 border-blue-100 dark:border-blue-700 rounded-[2rem] p-6 animate-in zoom-in-95">
                    {currentSellerPayment ? (
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-700 flex justify-between items-center">
                          <div>
                            <p className="text-[9px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-tighter">
                              Cuenta / Llave
                            </p>
                            <p className="text-xl font-black text-blue-700 dark:text-blue-400">
                              {currentSellerPayment.value}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                currentSellerPayment.value
                              );
                              alert("Copiado al portapapeles");
                            }}
                            className="p-3 bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold italic text-center">
                          Realiza la transferencia y guarda el comprobante.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase italic">
                          Método no registrado por el vendedor.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl p-4 flex gap-3 items-center">
                    <div className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow-sm">
                      <Check className="text-green-600" size={18} />
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 dark:text-gray-300 leading-tight">
                      {deliveryMethod === "delivery"
                        ? "Pagarás el total en efectivo cuando el domiciliario llegue a tu ubicación."
                        : "Pagarás el total directamente en el establecimiento al recoger tu pedido."}
                    </p>
                  </div>
                )}
              </div>

              {/* TOTAL Y CONFIRMACIÓN */}
              <div className="pt-6 border-t-2 border-slate-50 space-y-4">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-900 dark:text-gray-100 font-black text-xs uppercase tracking-widest">
                    Total Orden
                  </span>
                  <span className="text-3xl font-black text-slate-900 dark:text-gray-100">
                    ${total.toLocaleString("es-CO")}
                  </span>
                </div>

                {/* CHECKBOX DE TÉRMINOS */}
                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700">
                  <div className="relative flex items-center pt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 dark:border-gray-600 checked:border-blue-600 checked:bg-blue-600 transition-all bg-white dark:bg-gray-800"
                    />
                    <Check
                      size={14}
                      className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5"
                    />
                  </div>
                  <label
                    htmlFor="terms"
                    className="text-[10px] font-bold text-slate-500 dark:text-gray-400 leading-tight uppercase cursor-pointer"
                  >
                    He leído y acepto los{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-2"
                    >
                      términos y condiciones
                    </button>{" "}
                    del marketplace.
                  </label>
                </div>

                <button
                  onClick={handleCreateOrder}
                  disabled={loadingOrder || !acceptedTerms} // <-- quitamos carrito.length === 0 para que no bloquee el estilo
                  className={`
    w-full group text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-xl
    ${
      carrito.length === 0
        ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600" // Azul aunque no haya items
        : "bg-slate-900 hover:bg-green-600 dark:bg-slate-900 dark:hover:bg-green-600"
    }
    ${loadingOrder || !acceptedTerms ? "opacity-50 cursor-not-allowed" : ""}
  `}
                >
                  {loadingOrder ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="tracking-widest uppercase text-sm">
                        Confirmar Pedido
                      </span>
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-2 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE TÉRMINOS Y CONDICIONES */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-600 hover:text-rose-500 dark:hover:text-rose-400 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              <header className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase">
                  Términos y{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    Condiciones
                  </span>
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold italic">
                  Última actualización: Diciembre 2025 | Marketplace
                </p>
              </header>

              <div className="space-y-6">
                {/* AVISO CRÍTICO: DESLINDE FINANCIERO */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-sm">
                  <div className="flex gap-4">
                    <ShieldAlert
                      className="text-amber-600 shrink-0"
                      size={24}
                    />
                    <div>
                      <h3 className="font-black text-amber-900 uppercase text-xs mb-1">
                        Deslinde de Responsabilidad Financiera
                      </h3>
                      <p className="text-amber-800 text-[11px] leading-relaxed font-medium">
                        Este marketplace{" "}
                        <strong>NO actúa como pasarela de pagos</strong> ni
                        capta dinero del público. Todas las transacciones
                        (Nequi, Daviplata o Efectivo) se realizan directamente
                        entre la cuenta del comprador y la cuenta del vendedor.
                        No nos hacemos responsables por errores en
                        transferencias o pérdidas de dinero.
                      </p>
                    </div>
                  </div>
                </div>

                <section>
                  <h3 className="font-black text-slate-800 dark:text-slate-200 uppercase text-xs mb-2 italic flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full"></span>{" "}
                    1. Naturaleza del Servicio
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed ml-3">
                    Actuamos exclusivamente como un{" "}
                    <strong className="dark:text-white">
                      facilitador tecnológico
                    </strong>
                    . Proporcionamos el catálogo y el canal de comunicación,
                    pero no formamos parte del contrato de compraventa entre las
                    partes.
                  </p>
                </section>

                <section>
                  <h3 className="font-black text-slate-800 dark:text-slate-200 uppercase text-xs mb-2 italic flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full"></span>{" "}
                    2. Calidad y Entrega de Productos
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed ml-3">
                    La calidad, el estado, la originalidad y la entrega efectiva
                    de los productos son{" "}
                    <strong className="dark:text-white">
                      responsabilidad única del vendedor
                    </strong>
                    . El marketplace no garantiza ni responde por productos
                    defectuosos o pedidos no entregados.
                  </p>
                </section>

                <section>
                  <h3 className="font-black text-slate-800 dark:text-slate-200 uppercase text-xs mb-2 italic flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full"></span>{" "}
                    3. Veracidad de Comprobantes
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed ml-3">
                    El comprador se compromete a adjuntar comprobantes de pago
                    legítimos. La falsificación de soportes de pago resultará en
                    la expulsión inmediata de la plataforma y reporte a las
                    autoridades competentes.
                  </p>
                </section>

                <section className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-300 text-[10px] leading-relaxed italic text-center font-bold uppercase tracking-tight">
                    Al confirmar tu pedido, exoneras a la plataforma de
                    cualquier reclamación legal vinculada a la negociación
                    directa con el vendedor.
                  </p>
                </section>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-3 rounded-2xl font-black uppercase text-[10px] text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-slate-100 transition-all"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowTermsModal(false);
                }}
                className="bg-slate-900 dark:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs hover:bg-green-600 dark:hover:bg-green-500 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Check size={16} /> Aceptar y Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
