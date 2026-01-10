import { Mail, MapPin, MessageCircle, AlertCircle, CheckCircle, ArrowUp } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Contacto() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    asunto: "",
    mensaje: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Manejar cambios de input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejar submit
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita recarga

    if (!form.nombre || !form.correo || !form.asunto || !form.mensaje) {
      setError("Todos los campos son obligatorios");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("✅ Mensaje enviado correctamente. Te responderemos pronto.");
    console.log("Formulario listo para enviar:", form);
    setForm({ nombre: "", correo: "", asunto: "", mensaje: "" });
  };

  return (
    <div className="py-12 max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Estamos aquí para ayudarte</h1>
        <p className="text-gray-500 dark:text-gray-300 mt-4 text-lg">¿Tienes dudas? Nuestro equipo te responderá en menos de 24 horas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LADO IZQUIERDO: CONTACTO */}
        <div className="space-y-6">
          <ContactCard
            icon={<Mail className="text-blue-600 dark:text-blue-400" />}
            title="Escríbenos"
            detail="notificaciones@k-dice.com"
          />
          <ContactCard
            icon={<MessageCircle className="text-green-600 dark:text-green-400" />}
            title="WhatsApp Business"
            detail="+57 300 315 9976"
          />
          <ContactCard
            icon={<MapPin className="text-red-600 dark:text-red-400" />}
            title="Ubicación"
            detail="Colombia"
          />
        </div>

        {/* LADO DERECHO: FORMULARIO */}
        <div className="md:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {error && (
              <div className="sm:col-span-2 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="sm:col-span-2 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2">
                <CheckCircle size={20} />
                <span>{success}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-gray-200">Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-gray-200">Correo</label>
              <input
                type="email"
                name="correo"
                placeholder="correo@ejemplo.com"
                value={form.correo}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-gray-200">Asunto</label>
              <select
                name="asunto"
                value={form.asunto}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 outline-none"
              >
                <option value="">Selecciona un asunto</option>
                <option>Soporte Técnico</option>
                <option>Dudas sobre Ventas</option>
                <option>Reportar un Vendedor</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-gray-200">Mensaje</label>
              <textarea
                name="mensaje"
                rows="4"
                placeholder="¿En qué podemos ayudarte?"
                value={form.mensaje}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 outline-none"
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900"
            >
              Enviar Mensaje
            </button>
          </form>

          {/* Botón Volver a "/" */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              <ArrowUp size={16} />
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, detail }) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">{icon}</div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-gray-200">{title}</h4>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{detail}</p>
      </div>
    </div>
  );
}
