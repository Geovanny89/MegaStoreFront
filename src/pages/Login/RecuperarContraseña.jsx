import { useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

export default function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/forgot-password", { email });
      setMsg(res.data.message);
    } catch (error) {
      setMsg("El correo no existe.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-semibold text-center mb-4">
          Recuperar contraseña
        </h2>

        <p className="text-gray-600 text-center mb-4">
          Ingresa tu correo y te enviaremos un enlace.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-medium text-gray-700">Correo:</label>
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Enviar enlace
          </button>
        </form>

        {msg && (
          <p className="mt-4 text-center text-green-600 font-medium">{msg}</p>
        )}

        <p className="mt-6 text-center">
          <Link to="/login" className="text-blue-600">
            Volver al login
          </Link>
        </p>
      </div>
    </div>
  );
}
