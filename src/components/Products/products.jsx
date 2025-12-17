import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoriteContext";
import ProductQuestions from "../../components/Questions/ProductQuestions";


export default function Products() {
  const [productos, setProductos] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(null);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const productosPorPagina = 8;

  // FAVORITOS CONTEXT
  const { favorites, addFavorite, removeFavorite } = useFavorites();


  // MODAL
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // IMAGEN PRINCIPAL DEL MODAL
  const [selectedImg, setSelectedImg] = useState("");

  // CANTIDAD
  const [cantidad, setCantidad] = useState(1);

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

  const indexLast = currentPage * productosPorPagina;
  const indexFirst = indexLast - productosPorPagina;
  const productosActuales = productos.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(productos.length / productosPorPagina);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // AGREGAR AL CARRITO (con cantidad)
  const agregarAlCarrito = async (productId, quantity = 1) => {
    try {
      setLoadingId(productId);
      await api.post("/user/car", { productId, quantity });
      alert("Producto agregado al carrito ✔");
    } catch (error) {
      console.error(error);
      alert("Error al agregar al carrito ❌");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleFavorite = async (product) => {
    try {
      setLoadingId(product._id);
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
    } finally {
      setLoadingId(null);
    }
  };

  const verProducto = async (id) => {
    try {
      setLoadingProduct(id);

      const res = await api.get(`/product/${id}`);
      setSelectedProduct(res.data);
    
      if (res.data.image?.length > 0) {
        setSelectedImg(res.data.image[0]);
      }

      setCantidad(1);
      setModalOpen(true);

    } catch (error) {
      console.log(error);
      alert("Error al cargar producto");
    } finally {
      setLoadingProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-6">
        {productos.length === 0 ? (
          <p className="text-gray-500 text-lg">No hay productos disponibles.</p>
        ) : (
          <>
            {/* GRID PRODUCTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {productosActuales.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-50 flex justify-center items-center">
                      <img
                        src={p.image?.[1] || p.image?.[0]}
                        alt={p.name}
                        className="h-full object-contain p-2"
                      />
                    </div>

                    {/* FAVORITO */}
                    <button
                      onClick={() => handleToggleFavorite(p)}
                      disabled={loadingId === p._id}
                      className={`absolute top-3 right-3 rounded-full p-2 shadow transition 
            ${favorites.some((f) => f._id === p._id)
                          ? "bg-red-500 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <Heart
                        className="h-5 w-5"
                        fill={
                          favorites.some((f) => f._id === p._id)
                            ? "white"
                            : "transparent"
                        }
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    {/* NOMBRE */}
                    <h2 className="text-lg font-semibold text-gray-900">
                      {p.name}
                    </h2>

                    {/* MARCA */}
                    <p className="text-sm text-gray-500">Marca: {p.brand}</p>

                    {/* STOCK */}
                    <p className={`text-sm mt-1 ${p.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                      Stock: {p.stock}
                    </p>

                    {/* PRECIO EN COP */}
                    <p className="text-blue-600 font-bold mt-3 text-xl">
                      Precio: {p.price}
                    </p>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => verProducto(p._id)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        Ver producto
                      </button>

                      <button
                        onClick={() => agregarAlCarrito(p._id, 1)}
                        disabled={loadingId === p._id}
                        className={`flex-1 py-2 rounded-lg text-white transition 
              ${loadingId === p._id
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
            <div className="flex justify-center mt-10 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border ${currentPage === 1
                    ? "text-gray-400 bg-gray-200"
                    : "bg-white hover:bg-gray-100"
                  }`}
              >
                Anterior
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg border ${currentPage === page
                        ? "bg-blue-600 text-white"
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
                className={`px-4 py-2 rounded-lg border ${currentPage === totalPages
                    ? "text-gray-400 bg-gray-200"
                    : "bg-white hover:bg-gray-100"
                  }`}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>

      {/* MODAL PROFESIONAL */}
      {modalOpen && selectedProduct && (
        // Contenedor del modal: Centrado vertical y horizontal, fondo oscuro con blur.
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          {/* Contenido del modal: Fondo blanco, padding grande (p-8), ancho máximo, posición relativa para el botón de cierre. */}
          {/* Se añade max-h-full y overflow-y-auto en el div del modal para asegurar que si el contenido es muy largo, el modal pueda hacer scroll */}
          <div className="bg-white rounded-2xl p-8 max-w-5xl w-full relative shadow-xl max-h-[95vh] overflow-y-auto">
            
            {/* Botón de cierre: Posición absoluta, arriba a la derecha. */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
              aria-label="Cerrar ventana de detalle del producto"
            >
              ✖
            </button>

            {/* Cuerpo del Producto: Grid de 2 columnas en md y superior. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* COLUMNA IZQUIERDA: IMAGEN PRINCIPAL Y MINIATURAS (REORGANIZADAS) */}
              <div className="flex flex-col gap-4"> 
                {/* IMAGEN PRINCIPAL (ARRIBA) */}
                <div className="flex-1">
                  <img
                    src={selectedImg}
                    alt={`Imagen principal de ${selectedProduct.name}`}
                    // Altura y estilos originales para la imagen principal
                    className="w-full h-[400px] rounded-xl object-contain bg-gray-50 p-4 border"
                  />
                </div>
                
                {/* MINIATURAS (ABAJO) - Usando flex-row para carrusel horizontal */}
                {/* Se usa overflow-x-auto para que se pueda desplazar si hay muchas miniaturas */}
                <div className="flex gap-3 overflow-x-auto pb-2"> 
                  {selectedProduct.image.slice(0, 5).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Vista previa de producto ${i + 1}`}
                      onClick={() => setSelectedImg(img)}
                      // w-24 h-24 para mantener el tamaño original de las miniaturas
                      className={`flex-shrink-0 w-24 h-24 rounded-xl object-cover cursor-pointer border transition-all ${
                        selectedImg === img
                          ? "border-blue-500 ring-2 ring-blue-500"
                          : "border-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* COLUMNA DERECHA: INFO DEL PRODUCTO */}
              <div>
                {/* Nombre del Producto */}
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedProduct.name}
                </h2>

                {/* Detalles (Marca, Categoría, Vendedor) */}
                <p className="text-gray-500 mt-1">
                  Marca: {selectedProduct.brand}
                </p>

                <p className="text-gray-500">
                  Categoría: <span className="font-semibold">{selectedProduct?.tipo?.name}</span>
                </p>
                
                <p className="text-gray-600 mt-1">
                  Vendido por:{" "}
                  <span className="font-bold uppercase">
                    {selectedProduct?.vendedor?.storeName}
                  </span>
                </p>

                {/* Precio */}
                <p className="text-gray-500">
                  Precio : {selectedProduct.price}
                </p>

                {/* Stock */}
                <p className="text-gray-600 mt-2">
                  Stock disponible: {selectedProduct.stock}
                </p>

                {/* TALLAS */}
                {selectedProduct.sise?.length > 0 && (
                  <p className="mt-3 text-gray-700">
                    Tallas: {selectedProduct.sise.join(", ")}
                  </p>
                )}

                {/* COLORES */}
                {selectedProduct.color?.length > 0 && (
                  <p className="mt-1 text-gray-700">
                    Colores: {selectedProduct.color.join(", ")}
                  </p>
                )}

                {/* SELECTOR DE CANTIDAD */}
                <div className="mt-6">
                  <label htmlFor="cantidad-producto" className="block text-gray-700 font-medium mb-1">
                    Cantidad:
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>

                    <input
                      id="cantidad-producto"
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) =>
                        setCantidad(Math.max(1, Number(e.target.value)))
                      }
                      className="w-20 text-center border rounded-lg py-2"
                    />

                    <button
                      onClick={() => setCantidad(cantidad + 1)}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* BOTÓN AGREGAR */}
                <button
                  onClick={() => agregarAlCarrito(selectedProduct._id, cantidad)}
                  className="w-full mt-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-lg"
                >
                  Agregar al carrito
                </button>
                
                {/* PREGUNTAS DEL PRODUCTO */}
                {/* Se añade un margen superior para separarlo del botón */}
                <div className="mt-8">
                  <ProductQuestions productId={selectedProduct._id} />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}