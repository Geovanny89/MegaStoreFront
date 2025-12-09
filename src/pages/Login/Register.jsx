import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    identity: "",
    email: "",
    password: "",
    phone: "",
    rol: "user",
    storeName: "",
    planId: "",
    addresses: [
      {
        street: "",
        city: "",
        country: ""
      }
    ]
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planes, setPlanes] = useState([]);

  // Obtener planes
  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const res = await api.get("/user/planes");
        setPlanes(res.data);
      } catch (error) {
        console.log("Error cargando planes:", error);
      }
    };

    fetchPlanes();
  }, []);

  // Manejo de inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressChange = (e) => {
    setForm({
      ...form,
      addresses: [
        {
          ...form.addresses[0],
          [e.target.name]: e.target.value
        }
      ]
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/register", form);
      alert("Registro exitoso ✔");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Error en el registro ❌");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="w-full max-w-3xl p-10 bg-white shadow-lg rounded-2xl relative">

        {/* Botón cerrar */}
        <Link
          to="/"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          ✕
        </Link>

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Crear Cuenta
        </h2>
        <p className="text-center text-gray-500 mt-1">
          Completa tus datos para registrarte
        </p>

        {/* FORMULARIO */}
        <form onSubmit={handleRegister} className="mt-8">

          {/* GRID GENERAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nombre */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Nombre</label>
              <input
                name="name"
                type="text"
                required
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            {/* Apellido */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Apellido</label>
              <input
                name="lastName"
                type="text"
                required
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            {/* Documento */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Documento</label>
              <input
                name="identity"
                type="text"
                required
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Teléfono</label>
              <input
                name="phone"
                type="text"
                required
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Correo</label>
              <input
                name="email"
                type="email"
                required
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            {/* Contraseña */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Contraseña</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Dirección */}
            <div className="flex flex-col col-span-2">
              <label className="font-medium mb-1">Dirección</label>
              <input
                name="street"
                type="text"
                placeholder="Calle / Número"
                required
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={handleAddressChange}
              />
            </div>

            {/* Ciudad y País bonitos */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Ciudad</label>
              <input
                name="city"
                type="text"
                placeholder="Ej: Bogotá"
                required
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={handleAddressChange}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium mb-1">País</label>
              <input
                name="country"
                type="text"
                placeholder="Ej: Colombia"
                required
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={handleAddressChange}
              />
            </div>

            {/* Tipo de usuario */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Tipo de usuario</label>
              <select
                name="rol"
                className="p-3 border border-gray-300 rounded-xl"
                onChange={handleChange}
              >
                <option value="user">Cliente</option>
                <option value="seller">Vendedor</option>
              </select>
            </div>

            {/* Datos extra si es seller */}
            {form.rol === "seller" && (
              <>
                <div className="flex flex-col">
                  <label className="font-medium mb-1">Nombre de la tienda</label>
                  <input
                    name="storeName"
                    type="text"
                    required
                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-medium mb-1">Plan</label>
                  <select
                    name="planId"
                    required
                    className="p-3 border border-gray-300 rounded-xl"
                    onChange={handleChange}
                  >
                    <option value="">Selecciona un plan</option>
                    {planes.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} — {p.precio} USD
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-xl text-white font-semibold transition 
              ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500">o</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google */}
        <button
          onClick={loginWithGoogle}
          className="w-full py-3 flex items-center justify-center gap-3 border rounded-xl hover:bg-gray-100"
        >
          <FcGoogle size={24} />
          <span className="font-medium text-gray-700">Registrarse con Google</span>
        </button>

        {/* Iniciar sesión */}
        <p className="mt-5 text-center text-gray-600">
          ¿Ya tienes cuenta?
          <Link to="/login" className="text-blue-600 font-semibold ml-1 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
