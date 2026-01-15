import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

import Sidebar from "../../components/Vendedor/Sidebar";
import NavbarVendedor from "../../components/Vendedor/NabvarVendedor";

import UploadPaymentProof from "../../utils/UploadPaymentProof";
import ValidandoIdentidad from "../../pages/Admin/ValidandoIdentidad";
import SellerRejected from "../../pages/Admin/SellerRejected";

export default function LayoutSeller() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trialRemaining, setTrialRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // 1. Extraemos los datos según tu consola:
    const status = seller?.sellerStatus; // "trial"
    const expiresAt = seller?.subscription?.expiresAt; // "2026-01-16T..."

    // Si no es trial o no hay fecha, no hacemos nada
    if (status !== "trial" || !expiresAt) {
      console.log("Esperando datos válidos o el usuario no es trial...");
      return;
    }

    const endDate = new Date(expiresAt);

    const updateRemaining = () => {
      const now = new Date();
      const diff = endDate - now;

      if (diff <= 0) {
        setTrialRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Cálculos de tiempo
      setTrialRemaining({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, [seller]); // Se ejecuta cuando el objeto 'seller' llega de la API


  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await api.get("/seller/me");
        // console.log("soy el vendedor ", res.data);
        setSeller(res.data);
      } catch (error) {
        console.error("Error obteniendo seller:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, []);

  /* ===============================
      ⏳ LOADING
  =============================== */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="
      w-10 h-10
      border-4
      border-slate-200 dark:border-slate-700
      border-t-blue-600
      rounded-full
      animate-spin
    "></div>

          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            Cargando panel de vendedor...
          </p>
        </div>
      </div>

    );
  }

  /* ===============================
      💳 DETECTAR MÉTODOS DE PAGO
  =============================== */
  const hasCOD = Array.isArray(seller?.seller?.paymentMethods)
    ? seller.seller.paymentMethods.some(
      (m) => m.type === "cod" && m.active !== false
    )
    : false;


  /* ===============================
      🟢 TRIAL / ACTIVO → DASHBOARD
  =============================== */
  if (
    seller?.sellerStatus === "pending_identity" ||
    seller?.sellerStatus === "trial" ||
    seller?.sellerStatus === "active"
  ) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 overflow-x-hidden">
        <NavbarVendedor setOpenSidebar={setOpenSidebar} />

        <div className="flex flex-1 min-w-0 relative">
          <Sidebar open={openSidebar} setOpen={setOpenSidebar} />

          <main className="flex-1 p-2 sm:p-6 min-w-0 overflow-hidden box-border">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-6 min-h-[calc(100vh-100px)]">

              {/* ⚠️ AVISO IDENTIDAD */}
              {seller?.sellerStatus === "pending_identity" && (
                <div className=" mb-4 p-4 rounded-xl
              bg-blue-50 dark:bg-blue-900/30
              border border-blue-200 dark:border-blue-800
              text-blue-800 dark:text-blue-300
              font-semibold text-sm">
                  🔐 Debes verificar tu identidad para poder publicar productos.
                </div>
              )}

              {/* ⏳ AVISO TRIAL */}
              {seller?.sellerStatus === "trial" && (
                <div className="mb-4 p-4 rounded-xl
              bg-yellow-50 dark:bg-yellow-900/30
              border border-yellow-200 dark:border-yellow-800
              text-yellow-800 dark:text-yellow-300
              font-bold text-sm
              flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span>⏳</span>
                    <span>Estás usando el período gratuito</span>
                  </div>

                  <div className="flex gap-2 font-mono bg-white px-3 py-1 rounded-lg border border-yellow-200 shadow-sm">
                    <div className="text-center">
                      <span className="block text-xs text-yellow-600">Días</span>
                      {trialRemaining.days}
                    </div>
                    <span className="mt-4">:</span>
                    <div className="text-center">
                      <span className="block text-xs text-yellow-600">Hrs</span>
                      {trialRemaining.hours}
                    </div>
                    <span className="mt-4">:</span>
                    <div className="text-center">
                      <span className="block text-xs text-yellow-600">Min</span>
                      {trialRemaining.minutes}
                    </div>
                    <span className="mt-4">:</span>
                    <div className="text-center">
                      <span className="block text-xs text-yellow-600">Seg</span>
                      {trialRemaining.seconds}
                    </div>
                  </div>
                </div>
              )}

              {/* 💳 AVISO MÉTODOS DE PAGO */}
              {!hasCOD &&
                ["pending_identity", "trial", "active"].includes(
                  seller?.sellerStatus
                ) && (
                  <div className="mb-4 p-4 rounded-xl
                bg-amber-50 dark:bg-amber-900/30
                border border-amber-200 dark:border-amber-800
                text-amber-800 dark:text-amber-300
                font-semibold text-sm
                flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span>
                      💳 No olvides agregar los Métodos de Pago
                    </span>

                    <a
                      href="/editarVendedor"
                      className="shrink-0 px-4 py-2
                    bg-amber-600 hover:bg-amber-700
                    text-white rounded-lg
                    text-xs font-black transition"
                    >
                      Agregar COD
                    </a>
                  </div>
                )}
              <Outlet context={{ seller }} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* ===============================
      🟦 VALIDANDO IDENTIDAD
  =============================== */
  if (seller?.sellerStatus === "pending_identity") {
    return <ValidandoIdentidad />;
  }

  /* ===============================
      🔴 IDENTIDAD RECHAZADA
  =============================== */
  if (seller?.sellerStatus === "rejected_identity") {
    return (
      <SellerRejected rejectionReason={seller?.rejectionReason} />
    );
  }

  /* ===============================
      🟡 PAGO EN REVISIÓN
  =============================== */
  if (seller?.sellerStatus === "pending_review") {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 max-w-md text-center border border-slate-100">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl animate-pulse">⏳</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            Pago en revisión
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Hemos recibido tu comprobante.
            <br />
            Tu tienda será activada tras la validación manual.
          </p>
          <div className="mt-8 pt-6 border-t border-slate-50 text-xs text-slate-400 uppercase tracking-widest font-bold">
            Verificación Marketplace
          </div>
        </div>
      </div>
    );
  }

  /* ===============================
      🔴 PAGO RECHAZADO / PENDIENTE
  =============================== */
  if (
    seller?.sellerStatus === "pending_payment" ||
    seller?.sellerStatus === "expired" ||
    seller?.sellerStatus === "rejected"
  ) {
    return (
      <UploadPaymentProof
        rejected={seller?.sellerStatus === "rejected"}
      />
    );
  }

  /* ===============================
      ❗ FALLBACK
  =============================== */
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-gray-500 font-medium">
          Estado desconocido:{" "}
          <span className="text-red-500 font-bold">
            {seller?.sellerStatus}
          </span>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold"
        >
          Recargar Sistema
        </button>
      </div>
    </div>
  );
}
