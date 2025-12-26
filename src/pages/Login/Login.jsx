import { useState } from "react";
import api from "../../api/axios";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo3.png";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", { email, password });

      // ===============================
      // GUARDAR SESIÓN
      // ===============================
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("lastName", res.data.user.lastName);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("rol", res.data.user.rol);

      const role = res.data.user.rol;

      // ===============================
      // 🔁 REDIRECCIÓN CORRECTA
      // ===============================
      const from = location.state?.from;

      // 👉 Si viene de una tienda (o cualquier ruta protegida)
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      // 👉 Flujo normal de la plataforma
      if (role === "user") {
        navigate("/homeUser");
      } else if (role === "seller") {
        navigate("/Homevendedor");
      } else if (role === "admin") {
        navigate("/HomeAdmin");
      } else {
        navigate("/unauthorized");
      }

      alert("Login exitoso ✅");

    } catch (error) {
      alert("Correo o contraseña incorrectos ❌");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    // Google también respeta el flujo (backend debe reenviar state si aplica)
    window.location.href = "http://localhost:3001/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="relative w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">

        {/* Botón cerrar */}
        <Link
          to="/"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center 
                     rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
        >
          ✕
        </Link>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={Logo}
            alt="Logo"
            className="h-24 w-auto sm:h-32 md:h-36 lg:h-40 object-contain"
          />
        </div>

        {/* FORMULARIO */}
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium">Correo</label>
            <input
              type="email"
              required
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium">Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu contraseña"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-500"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Recuperar contraseña */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition
              ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-gray-500">o</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google */}
        <button
          onClick={loginWithGoogle}
          className="w-full py-3 flex items-center justify-center gap-3 border rounded-lg hover:bg-gray-100 transition"
        >
          <FcGoogle size={24} />
          <span className="font-medium text-gray-700">Continuar con Google</span>
        </button>

        {/* Registro */}
        <p className="mt-5 text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
