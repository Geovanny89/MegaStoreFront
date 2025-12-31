import { useState } from "react";
import api from "../../api/axios";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, ArrowRight, X, LogIn } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo31.png";

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

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("lastName", res.data.user.lastName);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("rol", res.data.user.rol);

      const role = res.data.user.rol;
      const from = location.state?.from;

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      if (role === "user") navigate("/homeUser");
      else if (role === "seller") navigate("/Homevendedor");
      else if (role === "admin") navigate("/HomeAdmin");
      else navigate("/unauthorized");

    } catch (error) {
      alert("Correo o contraseña incorrectos ❌");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  // Estilos consistentes con RegisterSeller
  const inputStyle = "w-full bg-[#374151] border border-[#4B5563] text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 placeholder-gray-400 outline-none transition-all";
  const labelStyle = "block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 md:p-10 font-sans text-gray-200">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-stretch bg-[#1F2937] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#374151] relative">

        {/* Botón Cerrar */}
        <Link to="/" className="absolute top-6 right-6 text-gray-400 hover:text-white z-20">
          <X size={28} />
        </Link>

        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="w-full md:w-1/2 p-8 md:p-12">

          {/* SECCIÓN DEL LOGO - Aumentada de h-10 a h-16/h-20 */}
          <div className="flex items-center gap-4 mb-10">
            <img
              src={Logo}
              alt="Logo"
              className="h-24 md:h-32 w-auto object-contain scale-175 "
            />

            <div className="h-10 w-px bg-gray-700 hidden sm:block"></div>
            <div className="hidden sm:flex flex-col">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">Acceso Seguro</span>
              <span className="text-gray-500 text-[9px] uppercase font-bold">K-Dice Marketplace</span>
            </div>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight mb-2">Bienvenido</h2>
          <p className="text-gray-400 mb-8 text-sm">Ingresa tus credenciales para continuar.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={labelStyle}>Correo Electrónico</label>
              <input
                type="email"
                required
                className={inputStyle}
                placeholder="ejemplo@correo.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label className={labelStyle}>Contraseña</label>
              <input
                type={showPass ? "text" : "password"}
                required
                className={inputStyle}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-[38px] text-gray-500 hover:text-gray-300"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" size="sm" className="text-xs text-blue-500 hover:underline font-semibold">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? "Verificando..." : <>Entrar a mi cuenta <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>


          <p className="mt-8 text-center text-gray-500 text-sm">
            ¿No tienes cuenta? <Link to="/register" className="text-blue-500 font-bold hover:underline">Regístrate gratis</Link>
          </p>
        </div>

        {/* COLUMNA DERECHA: DECORATIVA */}
        <div className="hidden md:flex md:w-1/2 bg-[#111827] flex-col items-center justify-center p-12 text-center relative overflow-hidden">
          {/* Efecto de luz azul de fondo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>

          <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20">
              <LogIn className="text-blue-500" size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">K-DICE Oficial</h3>
              <p className="text-gray-400 text-sm max-w-[250px] mx-auto leading-relaxed">
                Gestiona tus compras y ventas desde un solo lugar con la seguridad que necesitas.
              </p>
            </div>

            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest">
                Sesión Encriptada
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}