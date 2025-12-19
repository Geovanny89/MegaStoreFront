import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { 
  Trash2, MapPin, Store, ShoppingBag, 
  ArrowRight, PlusCircle, X, Check, Info 
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

  // Estados para nueva dirección
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    reference: "",
    isDefault: false
  });

  const token = localStorage.getItem("token");

  // --- CARGA DE DATOS ---
  const fetchCarrito = async () => {
    try {
      const res = await api.get("/user/carAll", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarrito(res.data.items || []);
    } catch (err) { console.error("Error al cargar carrito"); }
  };

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/user/address", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const list = res.data.addresses || [];
      setAddresses(list);
      setSelectedAddress(list.find(a => a.isDefault) || list[0] || null);
    } catch (err) { console.error("Error al cargar direcciones"); }
  };

  useEffect(() => {
    fetchCarrito();
    fetchAddresses();
  }, []);

  // --- ACCIONES DEL CARRITO ---
  const eliminarProducto = async (productId) => {
    setLoadingId(productId);
    try {
      await api.delete(`/user/car/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarrito(prev => prev.filter(item => item.product._id !== productId));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      alert("No se pudo eliminar el producto");
    } finally {
      setLoadingId(null);
    }
  };

  // --- LÓGICA DE DIRECCIÓN ---
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/createAdress", newAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedAddresses = res.data.addresses;
      setAddresses(updatedAddresses);
      setSelectedAddress(updatedAddresses[updatedAddresses.length - 1]);
      setShowAddForm(false);
      setNewAddress({ label: "", street: "", city: "", state: "", postalCode: "", reference: "", isDefault: false });
    } catch (err) {
      alert(err.response?.data?.message || "Error al guardar dirección");
    }
  };

  // --- CREAR ORDEN ---
  const handleCreateOrder = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío");
    if (deliveryMethod === "delivery" && !selectedAddress)
      return alert("Selecciona una dirección de envío");

    try {
      setLoadingOrder(true);
      const products = carrito.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }));

      const shippingAddress = deliveryMethod === "delivery" ? {
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        reference: selectedAddress.reference
      } : null;

      await api.post("/order", 
        { products, deliveryMethod, paymentMethod, shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#3b82f6', '#ffffff']
      });

      setCarrito([]); 
      window.dispatchEvent(new Event("cartUpdated"));

      setTimeout(() => {
        // Redirigir con parámetro extra para informar sobre el envío en el Success
        const shipParam = deliveryMethod === "delivery" ? "&shipping=seller" : "";
        navigate(paymentMethod === "cash_on_delivery" 
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

  const total = carrito.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-end gap-4 mb-10">
          <div className="bg-green-600 p-3 rounded-2xl shadow-lg text-white">
            <ShoppingBag size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Mi Carrito</h2>
            <p className="text-slate-500 font-medium italic">Tienes {carrito.length} artículos listos</p>
          </div>
        </div>

        {carrito.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <ShoppingBag size={48} className="text-slate-300 mb-6" />
            <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase">Tu carrito está vacío</h3>
            <button 
              onClick={() => navigate("/user/productos")}
              className="mt-6 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
            >
              Ir a la tienda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LISTA DE PRODUCTOS */}
            <div className="lg:col-span-7 space-y-4">
              {carrito.map(item => (
                <div key={item.product._id} className="group bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center hover:shadow-md transition-all">
                  <div className="relative overflow-hidden rounded-2xl bg-slate-50 p-2">
                    <img src={item.product.image?.[0]} className="w-24 h-24 object-contain group-hover:scale-105 transition-transform" alt={item.product.name} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-black text-slate-800 text-lg mb-1">{item.product.name}</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase mb-3 tracking-tighter">Cantidad: {item.quantity}</p>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-black">
                      ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                    </span>
                  </div>
                  <button 
                    onClick={() => eliminarProducto(item.product._id)} 
                    disabled={loadingId === item.product._id}
                    className="p-4 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all disabled:opacity-30"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>

            {/* PANEL DE PAGO / CHECKOUT */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[40px] p-8 shadow-2xl space-y-8 sticky top-28">
              
              {/* 1. MÉTODO ENTREGA */}
              <div>
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 1. Modo de Entrega
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${deliveryMethod === 'delivery' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400'}`}
                  >
                    <MapPin size={24} />
                    <span className="text-[10px] font-black uppercase tracking-tight">Domicilio</span>
                  </button>
                  <button 
                    onClick={() => { setDeliveryMethod("pickup"); setPaymentMethod("nequi"); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${deliveryMethod === 'pickup' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 text-slate-400'}`}
                  >
                    <Store size={24} />
                    <span className="text-[10px] font-black uppercase tracking-tight">En tienda</span>
                  </button>
                </div>
              </div>

              {/* AVISO DE ENVÍO ACORDADO CON VENDEDOR */}
              {deliveryMethod === "delivery" && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                  <Info className="text-amber-600 shrink-0" size={20} />
                  <p className="text-[10px] font-black text-amber-700 leading-tight uppercase italic">
                    Nota: El costo del envío no está incluido. Debes acordar el valor y el pago del domicilio directamente con el vendedor por el chat interno.
                  </p>
                </div>
              )}

              {/* 2. DIRECCIÓN */}
              {deliveryMethod === "delivery" && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 2. Dirección
                    </h4>
                    {!showAddForm && (
                      <button onClick={() => setShowAddForm(true)} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1">
                        <PlusCircle size={14}/> Añadir
                      </button>
                    )}
                  </div>

                  {showAddForm ? (
                    <form onSubmit={handleAddAddress} className="bg-slate-50 p-4 rounded-3xl border-2 border-dashed border-slate-200 space-y-3">
                      <input 
                        placeholder="Etiqueta (Ej: Casa, Trabajo)" 
                        className="w-full p-3 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newAddress.label}
                        onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                        required
                      />
                      <input 
                        placeholder="Dirección (Calle/Carrera/Número)" 
                        className="w-full p-3 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newAddress.street}
                        onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          placeholder="Ciudad" 
                          className="p-3 rounded-xl text-xs border border-slate-200"
                          value={newAddress.city}
                          onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                          required
                        />
                        <input 
                          placeholder="Barrio/Referencia" 
                          className="p-3 rounded-xl text-xs border border-slate-200"
                          value={newAddress.reference}
                          onChange={e => setNewAddress({...newAddress, reference: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-blue-600 text-white text-[10px] font-black py-3 rounded-xl uppercase tracking-widest">Guardar</button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="p-3 bg-slate-200 rounded-xl"><X size={16}/></button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {addresses.length > 0 ? (
                        addresses.map(addr => (
                          <div 
                            key={addr._id} 
                            onClick={() => setSelectedAddress(addr)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${selectedAddress?._id === addr._id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                          >
                            <div className={`w-5 h-5 rounded-full border-4 flex items-center justify-center ${selectedAddress?._id === addr._id ? 'border-blue-500' : 'border-slate-300'}`}>
                              {selectedAddress?._id === addr._id && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">{addr.label || 'Dirección'}</p>
                              <p className="text-[10px] text-slate-500 font-bold truncate">{addr.street}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <button onClick={() => setShowAddForm(true)} className="w-full py-6 border-2 border-dashed border-slate-200 rounded-3xl text-xs font-bold text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all">
                          Haz clic para añadir una dirección
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 3. PAGO */}
              <div>
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 3. Método de Pago
                </h4>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="nequi">Nequi</option>
                  <option value="daviplata">Daviplata</option>
                  {deliveryMethod === "pickup" && <option value="cash_on_delivery">Pago en Tienda (Efectivo)</option>}
                </select>
              </div>

              {/* TOTAL Y CONFIRMACIÓN */}
              <div className="pt-6 border-t-2 border-slate-50 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    <span>Subtotal Productos</span>
                    <span>${total.toLocaleString('es-CO')}</span>
                  </div>
                  
                  {deliveryMethod === "delivery" && (
                    <div className="flex justify-between items-center">
                      <span className="text-amber-600 font-black text-[10px] uppercase tracking-widest">Envío</span>
                      <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-1 rounded-lg uppercase">Por acordar</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-900 font-black text-xs uppercase tracking-widest">Total Orden</span>
                    <span className="text-3xl font-black text-slate-900">${total.toLocaleString('es-CO')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCreateOrder} 
                  disabled={loadingOrder || carrito.length === 0} 
                  className="w-full group bg-slate-900 hover:bg-green-600 disabled:bg-slate-200 text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  {loadingOrder ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="tracking-widest uppercase text-sm">Confirmar Pedido</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}