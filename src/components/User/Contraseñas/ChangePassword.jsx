import React, { useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { Lock, Key, ShieldCheck, ArrowLeft } from "lucide-react";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await api.put(
        "/updateContrasenia",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/perfil"), 1500);
    } catch (error) {
      setError(
        error.response?.data?.message || "No se pudo actualizar la contraseña."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFDFF] dark:bg-slate-950 pt-24 px-5 transition-colors duration-300">
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        
        {/* ICONO Y TÍTULO */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white uppercase text-sm">
            Seguridad de la cuenta
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">
            Cambiar Contraseña
          </p>
        </div>

        {/* ALERTAS */}
        {msg && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-black text-center uppercase tracking-widest">
            {msg}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-black text-center uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Contraseña actual */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
              Contraseña actual
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-12 py-3.5 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all font-medium"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Nueva contraseña */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
              Nueva contraseña
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-12 py-3.5 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all font-medium"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Nueva contraseña"
              />
            </div>
          </div>

          {/* Confirmar nueva contraseña */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-12 py-3.5 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all font-medium"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirmar contraseña"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg ${
              loading 
                ? "bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500" 
                : "bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 shadow-blue-500/10"
            }`}
          >
            {loading ? "Procesando..." : "Actualizar contraseña"}
          </button>
        </form>

        <button
          onClick={() => navigate("/perfil")}
          className="mt-8 w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={14} /> Volver al perfil
        </button>

      </div>
    </div>
  );
}