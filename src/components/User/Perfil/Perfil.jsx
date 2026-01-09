import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { User, MapPin, Phone, Mail, IdCard, Edit3 } from "lucide-react";

export default function Perfil() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/user/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (error) {
                console.error("ERROR OBTENIENDO USUARIO:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const handleEditClick = () => {
        if (slug) {
            navigate(`/${slug}/perfil/editar`);
        } else {
            navigate("/perfil/editar");
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );

    if (!user)
        return (
            <div className="text-center py-20">
                <p className="text-red-500 font-bold">No se encontró la sesión del usuario.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">Volver al inicio</button>
            </div>
        );

    return (
        <div className={`${slug ? "bg-transparent" : "min-h-screen bg-gray-50/50 dark:bg-slate-900/50 py-10"}`}>
            <div className="max-w-5xl mx-auto px-4 md:px-6">


                {/* TÍTULO DINÁMICO */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                            Mi Perfil
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Gestiona tu información personal y direcciones.</p>
                    </div>
                    <button
                        onClick={handleEditClick}
                        className="
    flex items-center justify-center gap-2 
    px-6 py-3 rounded-2xl font-bold text-white
    bg-gradient-to-r from-blue-600 to-blue-500
    dark:from-blue-500 dark:to-blue-600
    hover:from-blue-700 hover:to-blue-600
    dark:hover:from-blue-600 dark:hover:to-blue-700
    transition-all duration-200
    shadow-md hover:shadow-lg
    active:scale-95
  "
                    >
                        <Edit3 size={18} />
                        Editar Datos
                    </button>

                </div>

                {/* CARD PRINCIPAL */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">

                    {/* SECCIÓN INFO GENERAL */}
                    <div className="p-8 md:p-10 border-b border-slate-50 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900 text-blue-600 rounded-lg">
                                <User size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Información General</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <InfoItem label="Nombre completo" value={`${user.name} ${user.lastName}`} icon={<User size={16} />} />
                            <InfoItem label="Identificación" value={user.identity} icon={<IdCard size={16} />} />
                            <InfoItem label="Correo Electrónico" value={user.email} icon={<Mail size={16} />} />
                            <InfoItem label="Teléfono" value={user.phone} icon={<Phone size={16} />} />
                        </div>
                    </div>

                    {/* SECCIÓN DIRECCIONES */}
                    <div className="p-8 md:p-10 bg-slate-50/30 dark:bg-slate-900/30">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-green-50 dark:bg-green-900 text-green-600 rounded-lg">
                                <MapPin size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Direcciones de Entrega</h3>
                        </div>

                        {user.addresses?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
  {user.addresses.map((addr, index) => (
    <div
      key={index}
      className={`relative p-5 md:p-6 rounded-[2rem] border transition-all duration-300 ${
        addr.isDefault
          ? "bg-white dark:bg-slate-800 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      {/* CABECERA: Título y Etiqueta Principal */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <p className="text-base md:text-lg font-black text-slate-800 dark:text-white leading-tight break-words min-w-0 flex-1">
          {addr.label}
        </p>
        
        {addr.isDefault && (
          <span className="shrink-0 bg-blue-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm shadow-blue-500/40">
            Principal
          </span>
        )}
      </div>

      {/* CUERPO: Detalles de la dirección */}
      <div className="space-y-1.5 text-slate-600 dark:text-slate-400 text-sm md:text-base">
        <p className="font-bold text-slate-700 dark:text-slate-300 break-words">
          {addr.street}
        </p>
        <p className="text-xs md:text-sm font-medium opacity-80">
          {addr.city}, {addr.state}
        </p>
        
        {addr.reference && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500 mb-1">
              Referencia
            </p>
            <p className="text-xs italic leading-relaxed break-words">
              {addr.reference}
            </p>
          </div>
        )}
      </div>
    </div>
  ))}
</div>
                        ) : (
                            <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400">No tienes direcciones registradas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value, icon }) {
    return (
        <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                {icon} {label}
            </p>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200 break-words">
                {value || "No especificado"}
            </p>
        </div>
    );
}
