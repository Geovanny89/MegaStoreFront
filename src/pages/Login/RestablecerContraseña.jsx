import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function RestablecerContraseña() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/reset-password", { token, password });
      setMsg("Contraseña actualizada correctamente");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMsg("El enlace expiró o es inválido.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-semibold text-center mb-4">
          Restablecer contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="font-medium text-gray-700">Nueva contraseña:</label>
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Guardar
          </button>
        </form>

        {msg && <p className="mt-4 text-center text-green-600">{msg}</p>}
      </div>
    </div>
  );
}
