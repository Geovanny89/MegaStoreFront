// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { Heart } from "lucide-react";

// export default function Products() {
//   const [productos, setProductos] = useState([]);
//   const [loadingId, setLoadingId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const productosPorPagina = 8; // Puedes cambiarlo

//   useEffect(() => {
//     const fetchProductos = async () => {
//       try {
//         const res = await api.get("/user/allProducts");
//         setProductos(res.data);
//       } catch (error) {
//         console.log(error);
//         alert("No existen productos");
//       }
//     };

//     fetchProductos();
//   }, []);

//   // ------- PAGINACIÓN -------
//   const indexLast = currentPage * productosPorPagina;
//   const indexFirst = indexLast - productosPorPagina;
//   const productosActuales = productos.slice(indexFirst, indexLast);

//   const totalPages = Math.ceil(productos.length / productosPorPagina);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" }); // subir arriba con animación
//   };

//   // ------- AGREGAR AL CARRITO -------
//   const agregarAlCarrito = async (productId) => {
//     try {
//       setLoadingId(productId);

//       const body = { productId, quantity: 1 };
//       await api.post("/user/car", body);

//       alert("Producto agregado al carrito ✔");
//     } catch (error) {
//       console.error(error);
//       alert("Error al agregar al carrito ❌");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-6">
//       <div className="max-w-7xl mx-auto px-6">
//         {productos.length === 0 ? (
//           <p className="text-gray-500 text-lg">No hay productos disponibles.</p>
//         ) : (
//           <>
//             {/* PRODUCT GRID */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
//               {productosActuales.map((p) => (
//                 <div
//                   key={p._id}
//                   className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
//                 >
//                   {/* Imagen + Favorito */}
//                   <div className="relative">
//                     <div className="w-full h-48 bg-gray-50 flex justify-center items-center">
//                       <img
//                         src={p.image?.[1] || p.image?.[0]}
//                         alt={p.name}
//                         className="h-full object-contain p-2"
//                       />
//                     </div>

//                     <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-blue-100 transition">
//                       <Heart className="h-5 w-5 text-blue-500" />
//                     </button>
//                   </div>

//                   {/* Contenido */}
//                   <div className="p-4">
//                     <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
//                     <p className="text-sm text-gray-500">Código: {p.codigo || "Sin código"}</p>

//                     <p className="text-blue-600 font-bold mt-3 text-xl">${p.price}</p>

//                     <div className="mt-4 flex gap-3">
//                       <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">
//                         Ver producto
//                       </button>

//                       <button
//                         onClick={() => agregarAlCarrito(p._id)}
//                         disabled={loadingId === p._id}
//                         className={`flex-1 py-2 rounded-lg text-white transition 
//                         ${loadingId === p._id ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
//                       >
//                         {loadingId === p._id ? "Agregando..." : "Agregar al carrito"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* PAGINACIÓN PROFESIONAL */}
//             <div className="flex justify-center mt-10">
//               <div className="flex items-center space-x-2">

//                 {/* Anterior */}
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className={`px-4 py-2 rounded-lg border 
//                     ${currentPage === 1 ? "text-gray-400 bg-gray-200" : "bg-white hover:bg-gray-100"}
//                   `}
//                 >
//                   Anterior
//                 </button>

//                 {/* Números */}
//                 {[...Array(totalPages)].map((_, i) => {
//                   const page = i + 1;
//                   return (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       className={`px-4 py-2 rounded-lg border 
//                         ${
//                           currentPage === page
//                             ? "bg-blue-600 text-white border-blue-600"
//                             : "bg-white hover:bg-gray-100"
//                         }
//                       `}
//                     >
//                       {page}
//                     </button>
//                   );
//                 })}

//                 {/* Siguiente */}
//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className={`px-4 py-2 rounded-lg border 
//                     ${
//                       currentPage === totalPages
//                         ? "text-gray-400 bg-gray-200"
//                         : "bg-white hover:bg-gray-100"
//                     }
//                   `}
//                 >
//                   Siguiente
//                 </button>

//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoriteContext";

export default function Products() {
  const [productos, setProductos] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const productosPorPagina = 8;

  // FAVORITOS CONTEXT
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/user/allProducts");
        setProductos(res.data);
      } catch (error) {
        console.log(error);
        alert("No existen productos");
      }
    };
    fetchProductos();
  }, []);

  // PAGINACIÓN
  const indexLast = currentPage * productosPorPagina;
  const indexFirst = indexLast - productosPorPagina;
  const productosActuales = productos.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(productos.length / productosPorPagina);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // AGREGAR AL CARRITO
  const agregarAlCarrito = async (productId) => {
    try {
      setLoadingId(productId);
      await api.post("/user/car", { productId, quantity: 1 });
      alert("Producto agregado al carrito ✔");
    } catch (error) {
      console.error(error);
      alert("Error al agregar al carrito ❌");
    } finally {
      setLoadingId(null);
    }
  };

  // TOGGLE FAVORITO CON BACKEND
  const handleToggleFavorite = async (product) => {
    try {
      setLoadingId(product._id);

      const isFav = favorites.some(f => f._id === product._id);
      if (isFav) {
        // eliminar favorito backend
        await api.delete(`/favoriteDelete/${product._id}`);
        removeFavorite(product._id);
      } else {
        // agregar favorito backend
        await api.post(`/favorite/${product._id}`);
        addFavorite(product);
      }
    } catch (e) {
      console.error(e);
      alert("Error al actualizar favoritos");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-6">
        {productos.length === 0 ? (
          <p className="text-gray-500 text-lg">No hay productos disponibles.</p>
        ) : (
          <>
            {/* GRID DE PRODUCTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {productosActuales.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Imagen + Favorito */}
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-50 flex justify-center items-center">
                      <img
                        src={p.image?.[1] || p.image?.[0]}
                        alt={p.name}
                        className="h-full object-contain p-2"
                      />
                    </div>

                    <button
                      onClick={() => handleToggleFavorite(p)}
                      disabled={loadingId === p._id}
                      className={`absolute top-3 right-3 rounded-full p-2 shadow transition 
                        ${
                          favorites.some(f => f._id === p._id)
                            ? "bg-red-500 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <Heart
                        className="h-5 w-5"
                        fill={favorites.some(f => f._id === p._id) ? "white" : "transparent"}
                      />
                    </button>
                  </div>

                  {/* Contenido */}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
                    <p className="text-sm text-gray-500">
                      Código: {p.codigo || "Sin código"}
                    </p>

                    <p className="text-blue-600 font-bold mt-3 text-xl">${p.price}</p>

                    <div className="mt-4 flex gap-3">
                      <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">
                        Ver producto
                      </button>

                      <button
                        onClick={() => agregarAlCarrito(p._id)}
                        disabled={loadingId === p._id}
                        className={`flex-1 py-2 rounded-lg text-white transition 
                          ${
                            loadingId === p._id
                              ? "bg-blue-300"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                      >
                        {loadingId === p._id ? "Agregando..." : "Agregar"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            <div className="flex justify-center mt-10">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border 
                    ${currentPage === 1 ? "text-gray-400 bg-gray-200" : "bg-white hover:bg-gray-100"}`}
                >
                  Anterior
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg border 
                        ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white hover:bg-gray-100"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border 
                    ${
                      currentPage === totalPages
                        ? "text-gray-400 bg-gray-200"
                        : "bg-white hover:bg-gray-100"
                    }`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
