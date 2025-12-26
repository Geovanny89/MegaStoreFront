import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  UploadCloud,
  AlertTriangle,
  Clock,
  Loader2
} from "lucide-react";

export default function UploadPaymentProof() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // estados provenientes del backend
  const [sellerStatus, setSellerStatus] = useState(null);     // acceso
  const [paymentStatus, setPaymentStatus] = useState(null);   // estado del pago
  const [loadingSeller, setLoadingSeller] = useState(true);

  /* ===============================
     🔹 OBTENER ESTADO DEL SELLER
  =============================== */
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await api.get("/seller/me");

        setSellerStatus(res.data.sellerStatus);
        setPaymentStatus(res.data.paymentStatus);
      } catch (err) {
        console.error("Error obteniendo seller:", err);
      } finally {
        setLoadingSeller(false);
      }
    };

    fetchSeller();
  }, []);

  const isExpired = sellerStatus === "expired";

  /* ===============================
     🔹 SUBIR / RENOVAR COMPROBANTE
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Debes subir un comprobante de pago");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("proof", file);

      await api.put("/seller/payment-proof", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // pasa a revisión (sin esperar nuevo fetch)
      setSellerStatus("pending_review");
      setPaymentStatus("en_revision");
    } catch (err) {
      setError(
        err.response?.data?.error || "Error al subir el comprobante"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     ⏳ CARGANDO
  =============================== */
  if (loadingSeller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-600" size={40} />
      </div>
    );
  }

  /* ===============================
     🟠 EN REVISIÓN
  =============================== */
  if (sellerStatus === "pending_review") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md text-center">
          <Clock size={56} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Pago en revisión
          </h2>
          <p className="text-slate-500 font-medium">
            Hemos recibido tu comprobante.  
            Tu tienda será activada tras la validación.
          </p>
        </div>
      </div>
    );
  }

  /* ===============================
     🟡 FORMULARIO
  =============================== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8">

        <h1 className="text-2xl font-black text-slate-900 mb-2">
          {isExpired ? "Renovar suscripción" : "Activar mi tienda"}
        </h1>

        <p className="text-slate-500 font-medium mb-6">
          {isExpired
            ? "Tu suscripción venció. Realiza el pago y sube el comprobante para renovarla."
            : "Realiza el pago del plan y sube el comprobante para activar tu tienda."}
        </p>

        {/* 🔴 PAGO RECHAZADO */}
        {paymentStatus === "rechazada" && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-bold p-4 rounded-xl mb-4">
            <AlertTriangle size={18} />
            El comprobante fue rechazado.  
            Por favor, sube el comprobante correcto.
          </div>
        )}

        {/* 🟠 SUSCRIPCIÓN VENCIDA */}
        {isExpired && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-bold p-4 rounded-xl mb-4">
            <AlertTriangle size={18} />
            Tu suscripción ha vencido.  
            Sube el comprobante para renovarla.
          </div>
        )}

        {/* INFO DE PAGO */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
          <p className="text-sm font-bold text-blue-700 mb-1">
            Datos de pago
          </p>
          <ul className="text-sm text-blue-600 font-medium space-y-1">
            <li>📱 Llave Nequi: <b>@NEQUI109040</b></li>
            <li>📱 Daviplata: <b>300 000 0000</b></li>
            <li>
              💰 Concepto:{" "}
              <b>
                {isExpired
                  ? "Renovación de suscripción"
                  : "Activación de tienda"}
              </b>
            </li>
          </ul>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-bold p-3 rounded-xl mb-4">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              Comprobante de pago
            </span>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-2 block w-full text-sm
                file:mr-4 file:py-2 file:px-4
                file:rounded-xl file:border-0
                file:text-sm file:font-bold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700 cursor-pointer"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
          >
            <UploadCloud size={20} />
            {loading ? "Enviando..." : "Enviar comprobante"}
          </button>
        </form>
      </div>
    </div>
  );
}
