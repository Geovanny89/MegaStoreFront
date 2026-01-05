import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await api.get("/admin/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Error cargando reportes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  /* ==============================
     👀 MARCAR COMO REVISADO
  ============================== */
  const handleReview = async (reportId) => {
    try {
      await api.put(`/admin/reports/${reportId}/review`);
      fetchReports();
    } catch (err) {
      console.error("Error marcando como revisado", err);
    }
  };

  /* ==============================
     ❌ DESCARTAR REPORTE
  ============================== */
  const handleDismiss = async (reportId) => {
    try {
      await api.put(`/admin/reports/${reportId}/dismiss`);
      fetchReports();
    } catch (err) {
      console.error("Error descartando reporte", err);
    }
  };

  if (loading) return <p className="text-center">Cargando reportes...</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-black flex items-center gap-2">
        <AlertTriangle className="text-rose-600" /> Reportes de Usuarios
      </h1>

      {reports.length === 0 ? (
        <p className="text-slate-400">No hay reportes</p>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r._id}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-black uppercase text-rose-600">
                    {r.reason.replaceAll("_", " ")}
                  </p>
                  <p className="text-sm mt-1">
                    Vendedor:{" "}
                    <strong>{r.seller?.storeName || "—"}</strong>
                  </p>
                  <p className="text-xs text-slate-400">
                    Reportado por {r.reporter?.email}
                  </p>
                </div>

                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    r.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : r.status === "reviewed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              {r.description && (
                <p className="text-sm mt-3 text-slate-600 italic">
                  “{r.description}”
                </p>
              )}

              {/* ACCIONES ADMIN */}
              {r.status === "pending" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleReview(r._id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1"
                  >
                    <CheckCircle size={14} /> Marcar revisado
                  </button>

                  <button
                    onClick={() => handleDismiss(r._id)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1"
                  >
                    <XCircle size={14} /> Descartar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
