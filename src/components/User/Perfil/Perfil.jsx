import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/user/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(res)
                setUser(res.data);
            } catch (error) {
                console.error("ERROR OBTENIENDO USUARIO:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading)
        return <p className="text-center mt-10 text-gray-600">Cargando...</p>;

    if (!user)
        return (
            <p className="text-center mt-10 text-red-500">No se encontró el usuario.</p>
        );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-10">
            <div className="max-w-5xl mx-auto px-6">

                {/* TÍTULO */}
                <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight">
                    Mi Perfil
                </h2>

                {/* CARD PRINCIPAL */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">

                    {/* INFO DEL USUARIO */}
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
                        Información General
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div>
                            <p className="text-sm font-medium text-gray-500">Nombre</p>
                            <p className="text-xl font-semibold text-gray-800">{user.name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Apellido</p>
                            <p className="text-xl font-semibold text-gray-800">{user.lastName}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Identificación</p>
                            <p className="text-xl font-semibold text-gray-800">{user.identity}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                            <p className="text-xl font-semibold text-gray-800">{user.email}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Teléfono</p>
                            <p className="text-xl font-semibold text-gray-800">{user.phone}</p>
                        </div>

                    </div>

                    {/* DIRECCIONES */}
                    <h3 className="text-2xl font-semibold text-gray-800 mt-12 mb-6 border-b pb-3">
                        Direcciones Registradas
                    </h3>

                    {user.addresses?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.addresses.map((addr, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 border border-gray-200 shadow-sm p-5 rounded-2xl hover:shadow-md transition"
                                >
                                    <p className="text-lg font-semibold text-gray-800 mb-1">
                                        {addr.label}
                                    </p>

                                    <p className="text-gray-600">{addr.street}</p>
                                    <p className="text-gray-600">{addr.city} - {addr.state}</p>

                                    {addr.postalCode && (
                                        <p className="text-gray-600">
                                            Código Postal: {addr.postalCode}
                                        </p>
                                    )}

                                    {addr.reference && (
                                        <p className="text-gray-600">
                                            Referencia: {addr.reference}
                                        </p>
                                    )}

                                    {addr.isDefault && (
                                        <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-lg">
                                            ✓ Dirección principal
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-lg">No tienes direcciones agregadas.</p>
                    )}

                    {/* BOTÓN */}
                    <button
                        onClick={() => navigate("/perfil/editar")}
                        className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold shadow-lg transition transform hover:scale-[1.01]"
                    >
                        Editar Perfil
                    </button>
                </div>
            </div>
        </div>
    );
}
