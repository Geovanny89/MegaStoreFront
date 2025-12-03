// import React, { useEffect, useState } from "react";
// import api from "../../../api/axios";

// export default function Datos() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         // Supongamos que guardaste el id al hacer login
//         const userId = localStorage.getItem("userId");
//         console.log("Hola soy el usuario",userId);
//         if (!userId) throw new Error("Usuario no logueado");

//         const res = await api.get(`/user/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         setUser(res.data);
//       } catch (error) {
//         console.error("Error al obtener datos del usuario:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   if (loading) return <p>Cargando...</p>;
//   if (!user) return <p>No se encontraron datos.</p>;

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
//       <h2 className="text-2xl font-bold mb-4">Mis Datos</h2>
//       <p><strong>Nombre:</strong> {user.name} {user.lastName}</p>
//       <p><strong>Correo:</strong> {user.email}</p>
//       <p><strong>Teléfono:</strong> {user.phone}</p>
//       <p><strong>Identidad:</strong> {user.identity}</p>

//       {user.addresses && user.addresses.length > 0 && (
//         <div className="mt-4">
//           <h3 className="font-semibold mb-2">Direcciones:</h3>
//           {user.addresses.map((a) => (
//             <div key={a._id} className="mb-2">
//               <p>{a.label}: {a.street}, {a.city}, {a.state}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
