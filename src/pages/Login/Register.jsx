import { useState } from "react";
import api from "../../api/axios";
import { Eye, EyeOff, MapPin, User, Mail, Phone, CreditCard, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo31.png";

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // 📝 Estado alineado con validatorRegisterUser del Backend
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    identity: "",
    email: "",
    password: "",
    phone: "",
    rol: "user",
    addresses: [{ 
      street: "", 
      city: "", 
      state: "", // Agregado: lo pide tu validador del back
      country: "Colombia" // Valor por defecto para facilitar el registro
    }]
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Manejador específico para la estructura anidada de direcciones
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const newAddresses = [...form.addresses];
    newAddresses[0][name] = value;
    setForm({ ...form, addresses: newAddresses });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Los nombres de las propiedades ya coinciden con tus check() de express-validator
      await api.post("/register", form);
      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      // Manejo de errores basado en tu validateResult
      const serverError = error.response?.data?.errors 
        ? error.response.data.errors[0].msg 
        : error.response?.data?.error || "Error en el registro";
      alert(serverError);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-[#374151] border border-[#4B5563] text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 placeholder-gray-400 outline-none transition-all";
  const labelStyle = "block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 md:p-10 font-sans text-gray-200">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-stretch gap-0 bg-[#1F2937] rounded-[2rem] overflow-hidden shadow-2xl border border-[#374151]">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="w-full md:w-7/12 p-8 md:p-14">
          <div className="mb-10">
           <div className="flex justify-center mb-6">
  <img
    src={Logo}
    alt="Logo"
    className="h-24 w-auto scale-350"
  />
</div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">Crear cuenta</h2>
            <p className="text-gray-400 mt-2">Completa tus datos para empezar a comprar.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Datos Personales */}
              <div>
                <label className={labelStyle}>Nombre</label>
                <input name="name" type="text" required placeholder="Ej. Jane" className={inputStyle} onChange={handleChange} />
              </div>
              <div>
                <label className={labelStyle}>Apellido</label>
                <input name="lastName" type="text" required placeholder="Ej. Doe" className={inputStyle} onChange={handleChange} />
              </div>

              <div className="md:col-span-2">
                <label className={labelStyle}>Correo Electrónico</label>
                <input name="email" type="email" required placeholder="nombre@correo.com" className={inputStyle} onChange={handleChange} />
              </div>

              <div>
                <label className={labelStyle}>Identificación</label>
                <input name="identity" type="text" required placeholder="Documento" className={inputStyle} onChange={handleChange} />
              </div>
              <div>
                <label className={labelStyle}>Teléfono</label>
                <input name="phone" type="text" required placeholder="Celular" className={inputStyle} onChange={handleChange} />
              </div>

              <div className="md:col-span-2 relative">
                <label className={labelStyle}>Contraseña (8-15 caracteres)</label>
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className={inputStyle}
                  onChange={handleChange}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-[36px] text-gray-500 hover:text-white">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Sección Dirección - Requerida por Backend */}
              <div className="md:col-span-2 flex items-center gap-3 py-2">
                <div className="h-px bg-[#374151] flex-1"></div>
                <span className="text-[10px] font-black text-gray-500 uppercase">Información de Envío</span>
                <div className="h-px bg-[#374151] flex-1"></div>
              </div>

              <div className="md:col-span-2">
                <label className={labelStyle}>Calle / Dirección</label>
                <input name="street" type="text" required placeholder="Calle, Carrera, Barrio..." className={inputStyle} onChange={handleAddressChange} />
              </div>

              <div>
                <label className={labelStyle}>Ciudad</label>
                <input name="city" type="text" required placeholder="Ciudad" className={inputStyle} onChange={handleAddressChange} />
              </div>
              <div>
                <label className={labelStyle}>Departamento / Estado</label>
                <input name="state" type="text" required placeholder="Estado" className={inputStyle} onChange={handleAddressChange} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20 disabled:opacity-50 mt-4"
            >
              {loading ? "Validando datos..." : (
                <> Finalizar Registro <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            ¿Ya tienes cuenta? <Link to="/login" className="text-blue-500 font-bold hover:underline">Inicia sesión</Link>
          </p>
        </div>

        {/* COLUMNA DERECHA: IMAGEN ALUSIVA */}
        <div className="hidden md:flex md:w-5/12 bg-[#111827] flex-col items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
          
          
          <div className="relative z-10 text-center mt-8">
            <h3 className="text-2xl font-bold text-white">Únete a K-DICE</h3>
            <p className="text-gray-400 mt-2 text-sm max-w-xs">
              Tu cuenta de usuario te permite realizar compras seguras y gestionar tus pedidos fácilmente.
            </p>
            <div className="mt-8 pt-8 border-t border-[#374151]">
              <Link to="/register-vendedor" className="text-xs text-gray-500 hover:text-blue-500 transition-colors uppercase font-black tracking-widest">
                ¿Quieres vender? Registra tu tienda aquí
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}