import { useEffect, useState } from "react";
import api from "../api/axios";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoriteContext";

export default function ProductosTienda({ vendedorId, volver, user }) {
  const [vendedor, setVendedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [loadingProduct, setLoadingProduct] = useState(null);

  // Fetch vendedor y productos
  useEffect(() => {
    const fetchVendedor = async () => {
      try {
        const { data } = await api.get(`/vendedor/${vendedorId}`);
        setVendedor(data.vendedor);
        setProductos(data.productos || []);
        console.log(data.productos)
      } catch (error) {
        console.error(error);
        alert("Error al cargar productos del vendedor");
      }
    };
    fetchVendedor();
  }, [vendedorId]);

  // Filtrado por categorías
  const categorias = [...new Set(productos.map((p) => p.tipo?.name).filter(Boolean))];
  const productosFiltrados = categoriaFiltro
    ? productos.filter((p) => p.tipo?.name === categoriaFiltro)
    : productos;

  // Favoritos
  const handleToggleFavorite = async (product) => {
    if (!user) {
      alert("Debes iniciar sesión para agregar a favoritos");
      return;
    }
    try {
      const isFav = favorites.some((f) => f._id === product._id);
      if (isFav) {
        await api.delete(`/favoriteDelete/${product._id}`);
        removeFavorite(product._id);
      } else {
        await api.post(`/favorite/${product._id}`);
        addFavorite(product);
      }
    } catch (e) {
      console.error(e);
      alert("Error al actualizar favoritos");
    }
  };

  // Agregar al carrito
  const agregarAlCarrito = async (productId, quantity = 1) => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      return;
    }
    try {
      await api.post("/user/car", { productId, quantity });
      alert("Producto agregado al carrito ✔");
    } catch (error) {
      console.error(error);
      alert("Error al agregar al carrito ❌");
    }
  };

  // Ver producto individual (modal)
  const verProducto = async (productId) => {
    try {
      setLoadingProduct(productId);
      const { data } = await api.get(`/product/${productId}`);
      setSelectedProduct(data);
      setSelectedImg(data.image?.[0] || "");
      setCantidad(1);
      setModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("Error al cargar producto");
    } finally {
      setLoadingProduct(null);
    }
  };

  if (!vendedor) return <p>Cargando productos...</p>;

  return (
    <div className="p-4">
      {/* Botón volver */}
      <button
        onClick={volver}
        className="mb-4 bg-gray-700 text-white py-2 px-4 rounded"
      >
        Volver a tiendas
      </button>

      {/* Info del vendedor */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={vendedor.storeLogo}
          alt="logo"
          className="h-20 w-20 object-contain rounded-full border"
        />
        <h1 className="text-3xl font-bold">{vendedor.storeName}</h1>
      </div>

      {/* Filtro de categorías */}
      <div className="mb-6">
        <select
          className="border p-2 rounded"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productosFiltrados.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="relative">
              <div className="w-full h-48 bg-gray-50 flex justify-center items-center">
                <img
                  src={p.image?.[0]}
                  alt={p.name}
                  className="h-full object-contain p-2"
                />
              </div>

              {/* Favorito */}
              <button
                onClick={() => handleToggleFavorite(p)}
                className={`absolute top-3 right-3 rounded-full p-2 shadow transition 
                  ${favorites.some((f) => f._id === p._id)
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Heart
                  className="h-5 w-5"
                  fill={favorites.some((f) => f._id === p._id) ? "white" : "transparent"}
                />
              </button>
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
              <p className={`text-sm mt-1 ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                Stock: {p.stock != null ? p.stock : "N/A"}
              </p>
              <p className="text-blue-600 font-bold mt-3 text-xl">${p.price}</p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => verProducto(p._id)}
                  disabled={loadingProduct === p._id}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  {loadingProduct === p._id ? "Cargando..." : "Ver producto"}
                </button>
                <button
                  onClick={() => agregarAlCarrito(p._id, 1)}
                  className="flex-1 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal del producto */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-5xl w-full relative shadow-xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
            >
              ✖
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Miniaturas e imagen principal */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-3 w-24">
                  {selectedProduct.image?.slice(0, 5).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      onClick={() => setSelectedImg(img)}
                      className={`w-24 h-24 rounded-xl object-cover cursor-pointer border ${
                        selectedImg === img ? "border-blue-500" : "border-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <img
                    src={selectedImg}
                    className="w-full h-[400px] rounded-xl object-contain bg-gray-50 p-4 border"
                  />
                </div>
              </div>

              {/* Info del producto */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{selectedProduct.name}</h2>
                <p className="text-gray-600 mt-1">Marca: {selectedProduct.brand || "N/A"}</p>
                <p className="text-gray-600 mt-1">Categoría: {selectedProduct.tipo?.name || "N/A"}</p>
                <p className="text-gray-600 mt-1">Stock disponible: {selectedProduct.stock ?? "N/A"}</p>
                <p className="text-gray-700 mt-2">
                  Colores: {selectedProduct.color?.length > 0 ? selectedProduct.color.join(", ") : "N/A"}
                </p>
                <p className="text-gray-700 mt-1">
                  Tallas: {selectedProduct.sise?.length > 0 ? selectedProduct.sise.join(", ") : "N/A"}
                </p>
                <p className="text-gray-800 mt-2">Descripción: {selectedProduct.description || "Sin descripción"}</p>

                {/* Cantidad */}
                <div className="mt-4">
                  <label className="block text-gray-700 mb-1">Cantidad:</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                      className="w-20 text-center border rounded-lg py-2"
                    />
                    <button
                      onClick={() => setCantidad(cantidad + 1)}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => agregarAlCarrito(selectedProduct._id, cantidad)}
                  className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-lg"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
