import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { User, MapPin, Phone, Mail, IdCard, Edit3 } from "lucide-react";

export default function Perfil() {
    const navigate = useNavigate();
    const { slug } = useParams(); // Detecta si estamos en /[slug]/perfil
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

    // Función de navegación inteligente
    const handleEditClick = () => {
        if (slug) {
            // Si hay slug, navega a /[slug]/perfil/editar
            navigate(`/${slug}/perfil/editar`);
        } else {
            // Si no hay slug, navega al perfil global
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
        /* Si hay slug, quitamos el min-h-screen y los fondos grises para que se integre a la tienda */
        <div className={`${slug ? "bg-transparent" : "min-h-screen bg-gray-50/50 py-10"}`}>
            <div className="max-w-5xl mx-auto px-4 md:px-6">

                {/* TÍTULO DINÁMICO */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                            Mi Perfil
                        </h2>
                        <p className="text-slate-500 font-medium">Gestiona tu información personal y direcciones.</p>
                    </div>
                    
                    <button
                        onClick={handleEditClick}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        <Edit3 size={18} />
                        Editar Datos
                    </button>
                </div>

                {/* CARD PRINCIPAL */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    
                    {/* SECCIÓN INFO GENERAL */}
                    <div className="p-8 md:p-10 border-b border-slate-50">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <User size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Información General</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <InfoItem label="Nombre completo" value={`${user.name} ${user.lastName}`} icon={<User size={16}/>} />
                            <InfoItem label="Identificación" value={user.identity} icon={<IdCard size={16}/>} />
                            <InfoItem label="Correo Electrónico" value={user.email} icon={<Mail size={16}/>} />
                            <InfoItem label="Teléfono" value={user.phone} icon={<Phone size={16}/>} />
                        </div>
                    </div>

                    {/* SECCIÓN DIRECCIONES */}
                    <div className="p-8 md:p-10 bg-slate-50/30">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <MapPin size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Direcciones de Entrega</h3>
                        </div>

                        {user.addresses?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {user.addresses.map((addr, index) => (
                                    <div
                                        key={index}
                                        className={`relative p-6 rounded-3xl border transition-all ${
                                            addr.isDefault 
                                            ? "bg-white border-blue-200 shadow-md ring-1 ring-blue-50" 
                                            : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
                                        }`}
                                    >
                                        {addr.isDefault && (
                                            <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                                                Principal
                                            </span>
                                        )}
                                        <p className="text-lg font-bold text-slate-800 mb-2">{addr.label}</p>
                                        <div className="space-y-1 text-slate-600 text-sm">
                                            <p className="font-medium">{addr.street}</p>
                                            <p>{addr.city}, {addr.state}</p>
                                            {addr.reference && (
                                                <p className="italic text-slate-400 mt-2">Ref: {addr.reference}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-500">No tienes direcciones registradas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-componente para organizar la info
function InfoItem({ label, value, icon }) {
    return (
        <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                {icon} {label}
            </p>
            <p className="text-lg font-bold text-slate-700 break-words">
                {value || "No especificado"}
            </p>
        </div>
    );
}