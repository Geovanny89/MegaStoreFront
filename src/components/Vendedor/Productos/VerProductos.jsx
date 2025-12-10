import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Trash2, Pencil, X } from "lucide-react";

export default function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState("");

  // Formulario dentro del modal
  const [form, setForm] = useState({
    name: "",
    price: "",
    brand: "",
    tipoId: "",
    color: "",
    sise: "",
    stock: "",
    description: "",
  });
  const [tipos, setTipos] = useState([]);
  const [images, setImages] = useState([]); // nuevas imágenes
  const [preview, setPreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [saving, setSaving] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Traer productos
  const fetchProductos = async () => {
    try {
      const res = await api.get("/seller/productos");
      setProductos(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error al cargar productos");
      setLoading(false);
    }
  };

  // Traer tipos
  const fetchTipos = async () => {
    try {
      const res = await api.get("/all/tipes");
      setTipos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchTipos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/seller/productos/${id}`);
      setProductos(productos.filter((p) => p._id !== id));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el producto");
      setDeletingId(null);
    }
  };

  // Abrir modal y cargar datos
  const handleEdit = (producto) => {
    setSelectedProduct(producto);
    setForm({
      name: producto.name,
      price: producto.price,
      brand: producto.brand,
      tipoId: producto.tipo?._id || "",
      color: producto.color?.join(", ") || "",
      sise: producto.sise?.join(", ") || "",
      stock: producto.stock,
      description: producto.description,
    });
    setExistingImages(producto.image || []);
    setPreview([]);
    setImages([]);
    setMessage("");
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreview([...preview, ...urls]);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreview(preview.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    setSaving(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("brand", form.brand);
      formData.append("tipoId", form.tipoId);
      formData.append("color", form.color);
      formData.append("sise", form.sise);
      formData.append("stock", form.stock);
      formData.append("description", form.description);
      images.forEach((img) => formData.append("image", img));
      formData.append("existingImages", JSON.stringify(existingImages));

      const response = await api.put(
        `/seller/productos/${selectedProduct._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Actualizar lista
      fetchProductos();
      setMessage(response.data.message);
      setTimeout(() => setModalOpen(false), 1500);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al actualizar producto");
    } finally {
      setSaving(false);
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = productos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages =
    productos.length > 0 ? Math.ceil(productos.length / itemsPerPage) : 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <p className="text-center mt-10">Cargando productos...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2">
      <h2 className="text-3xl font-bold mb-6">Mis Productos</h2>

      <div className="space-y-3">
        {currentProducts.map((producto) => (
          <div
            key={producto._id}
            className="flex items-center gap-3 bg-white shadow-sm rounded-lg p-3 hover:shadow-md transition-shadow text-sm"
          >
            <div className="w-16 h-16 flex-shrink-0">
              {producto.image && producto.image[0] ? (
                <img
                  src={producto.image[0]}
                  alt={producto.name}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md text-gray-500 text-xs">
                  Sin imagen
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{producto.name}</h3>
              <p className="text-gray-600">Precio: ${producto.price}</p>
              <p className="text-gray-600">Stock: {producto.stock}</p>
            </div>

            <div className="flex flex-col gap-1">
              <button
                className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
                onClick={() => handleEdit(producto)}
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                className={`flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs ${
                  deletingId === producto._id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleDelete(producto._id)}
                disabled={deletingId === producto._id}
              >
                <Trash2 size={14} />{" "}
                {deletingId === producto._id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        <button
          className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border rounded-md ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full relative overflow-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
              onClick={() => setModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Actualizar Producto</h2>

            {message && (
              <p className="mb-2 text-green-600 font-medium">{message}</p>
            )}

            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded-lg text-gray-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Precio</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg text-gray-800"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700">Marca</label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded-lg text-gray-800"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Colores (separados por coma)</label>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded-lg text-gray-800"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Tallas (separadas por coma)</label>
                <input
                  type="text"
                  name="sise"
                  value={form.sise}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded-lg text-gray-800"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded-lg text-gray-800"
                  rows={4}
                />
              </div>

              {/* Imágenes existentes */}
              {existingImages.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt="existente"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Nuevas imágenes */}
              <div>
                <label className="font-medium text-gray-700">Agregar nuevas imágenes</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="w-full border px-3 py-2 rounded-lg text-gray-800"
                />
                {preview.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {preview.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={url}
                          alt="preview"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(idx)}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {saving ? "Actualizando..." : "Actualizar Producto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
