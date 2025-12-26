import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ValidatePayments() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingSellers = async () => {
    try {
      const res = await api.get("/admin/sellers/pending");
      setSellers(res.data);
    } catch (error) {
      console.error("Error obteniendo sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const handleValidate = async (sellerId, action) => {
    try {
      await api.put(`/admin/seller/${sellerId}/validate-payment`, { action });
      fetchPendingSellers(); // refresca la lista
    } catch (error) {
      console.error(error);
      alert("Error al validar pago");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="space-y-4">
      {sellers.length === 0 && <p>No hay comprobantes pendientes</p>}
      {sellers.map(seller => (
        <div key={seller._id} className="border p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="font-bold">{seller.storeName}</p>
            {seller.paymentProof && (
              <a href={seller.paymentProof} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                Ver comprobante
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => handleValidate(seller._id, "approve")}>
              Aprobar
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleValidate(seller._id, "reject")}>
              Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
