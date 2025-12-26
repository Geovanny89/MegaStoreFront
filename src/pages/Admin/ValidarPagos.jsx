import { useEffect, useState } from "react";
import api from "../../api/axios";
import { CheckCircle, XCircle } from "lucide-react";

export default function ValidarPagos() {
  const [suscripciones, setSuscripciones] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const res = await api.get("/admin/suscripciones/pending");
    console.log("la suscripcion", res)
    setSuscripciones(res.data);
  };

  const validate = async (suscripcionId, action) => {
    if (!window.confirm("¿Confirmar acción?")) return;

    await api.put(
      `/admin/suscripciones/${suscripcionId}/validate-payment`,
      { action }
    );

    fetchPending();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Validar Pagos</h1>

      {suscripciones.length === 0 && (
        <p className="text-gray-500">No hay pagos pendientes</p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {suscripciones.map((suscripcion) => (
          <div
            key={suscripcion._id}
            className="bg-white border rounded-xl shadow p-5"
          >
            <h2 className="font-semibold text-lg mb-1">
              {suscripcion.id_usuario?.storeName || "Sin tienda"}
            </h2>

            <p className="text-sm text-gray-600 mb-2">
              Email: {suscripcion.id_usuario?.email}
            </p>

            <p className="text-sm mb-3">
              Estado:{" "}
              <span className="text-yellow-600 font-semibold">
                {suscripcion.estado}
              </span>
            </p>

            {suscripcion.paymentProof && (
              <img
                src={suscripcion.paymentProof}
                alt="Comprobante"
                className="w-full h-48 object-contain border rounded mb-4 cursor-pointer"
                onClick={() =>
                  window.open(suscripcion.paymentProof, "_blank")
                }
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => validate(suscripcion._id, "approve")}
                className="flex-1 bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-green-700"
              >
                <CheckCircle size={18} /> Aprobar
              </button>

              <button
                onClick={() => validate(suscripcion._id, "reject")}
                className="flex-1 bg-red-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-red-700"
              >
                <XCircle size={18} /> Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
