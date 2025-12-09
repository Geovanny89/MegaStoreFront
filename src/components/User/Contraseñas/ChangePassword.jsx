import React, { useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";

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
console.log(res)
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
    <div className="min-h-screen bg-gray-100 pt-24 px-5">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Cambiar contraseña
        </h2>

        {msg && <p className="text-green-600 mb-4 text-center">{msg}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Contraseña actual */}
          <div>
            <label className="block font-semibold mb-1">Contraseña actual</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded-lg"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block font-semibold mb-1">Nueva contraseña</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirmar nueva contraseña */}
          <div>
            <label className="block font-semibold mb-1">Confirmar nueva contraseña</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>

        <button
          onClick={() => navigate("/perfil")}
          className="mt-4 w-full text-center text-blue-600 underline"
        >
          Volver al perfil
        </button>

      </div>
    </div>
  );
}
