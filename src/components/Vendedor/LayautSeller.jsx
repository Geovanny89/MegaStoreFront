import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Vendedor/Sidebar";
import NavbarVendedor from "../../components/Vendedor/NabvarVendedor";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import UploadPaymentProof from "../../utils/UploadPaymentProof";

export default function LayoutSeller() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await api.get("/seller/me");
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
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  /* ===============================
     🔴 DEBE SUBIR / RENOVAR PAGO
     (INICIAL, RECHAZADO O VENCIDO)
  =============================== */
  if (
    seller?.sellerStatus === "pending_payment" ||
    seller?.sellerStatus === "rejected" ||
    seller?.sellerStatus === "expired"
  ) {
    return <UploadPaymentProof />;
  }

  /* ===============================
     🟡 EN REVISIÓN
  =============================== */
  if (seller?.sellerStatus === "pending_review") {
    return (
      <div className="h-screen flex items-center justify-center bg-yellow-50">
        <div className="bg-white p-10 rounded-3xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            Pago en revisión
          </h2>
          <p className="text-slate-500 font-medium">
            Hemos recibido tu comprobante.  
            Tu tienda será activada tras validación.
          </p>
        </div>
      </div>
    );
  }

  /* ===============================
     🟢 ACTIVO
  =============================== */
  if (seller?.sellerStatus === "active") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <NavbarVendedor setOpenSidebar={setOpenSidebar} />
        <div className="flex flex-1">
          <Sidebar open={openSidebar} setOpen={setOpenSidebar} />
          <main className="flex-1 p-6">
            <div className="bg-white rounded-xl shadow-md p-6 min-h-[calc(100vh-80px)]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* ===============================
     ❗ FALLBACK
  =============================== */
  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-gray-500">
        Estado desconocido del vendedor
      </p>
    </div>
  );
}
