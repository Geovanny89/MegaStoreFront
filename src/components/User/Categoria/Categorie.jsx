import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Heart } from "lucide-react";

export default function Categorie() {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const res = await api.get(`/user/categori/${id}`);
        setCategoria(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategoria();
  }, [id]);

  if (!categoria) return <p>Cargando...</p>;

  const agregarAlCarrito = async (productId) => {
    try {
      setLoadingId(productId);

      const body = {
        productId,
        quantity: 1,
      };

      await api.post("/user/car", body);
      alert("Producto agregado al carrito ✔");

    } catch (error) {
      alert("Error al agregar al carrito ❌");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">
          Categoría: {categoria.name}
        </h1>

        {categoria.productos?.length === 0 ? (
          <p className="text-gray-500 text-lg">No hay productos en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">

            {categoria.productos.map((p) => (
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

                  <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-blue-100 transition">
                    <Heart className="h-5 w-5 text-blue-500" />
                  </button>
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
                  <p className="text-sm text-gray-500">Código: {p.codigo || "Sin código"}</p>

                  <p className="text-blue-600 font-bold mt-3 text-xl">${p.price}</p>

                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">
                      Ver producto
                    </button>

                    <button
                      onClick={() => agregarAlCarrito(p._id)}
                      disabled={loadingId === p._id}
                      className={`flex-1 py-2 rounded-lg text-white transition 
                      ${loadingId === p._id ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                      {loadingId === p._id ? "Agregando..." : "Agregar al carrito"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
