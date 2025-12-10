import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function EditarProducto() {
  const { id } = useParams(); // ID del producto
  const navigate = useNavigate();

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
  const [preview, setPreview] = useState([]); // preview de nuevas imágenes
  const [existingImages, setExistingImages] = useState([]); // imágenes ya existentes
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Traer tipos de productos
  const fetchTipos = async () => {
    try {
      const res = await api.get("/all/tipes");
      setTipos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Traer datos del producto
  const fetchProducto = async () => {
    try {
      const res = await api.get(`/seller/productos/${id}`);
      const producto = res.data;
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
    } catch (err) {
      console.error(err);
      setMessage("Error al cargar el producto");
    }
  };

  useEffect(() => {
    fetchTipos();
    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreview(urls);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

      // Agregar nuevas imágenes
      images.forEach((image) => formData.append("image", image));

      // Agregar info de imágenes existentes que no se eliminaron
      formData.append("existingImages", JSON.stringify(existingImages));

      await api.put(`/seller/productos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Producto actualizado correctamente!");
      setTimeout(() => navigate("/seller/productos"), 2000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error al actualizar producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">Editar Producto</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 space-y-4">
        <div>
          <label className="font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-gray-700">Precio</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg text-gray-800"
              required
            />
          </div>
          <div>
            <label className="font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg text-gray-800"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-medium text-gray-700">Marca</label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800"
          />
        </div>

        <div>
          <label className="font-medium text-gray-700">Tipo de Producto</label>
          <select
            name="tipoId"
            value={form.tipoId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800"
            required
          >
            <option value="">Selecciona un tipo</option>
            {tipos.map((tipo) => (
              <option key={tipo._id} value={tipo._id}>
                {tipo.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tallas si aplica */}
        {form.tipoId && (() => {
          const tipoSeleccionado = tipos.find((t) => t._id === form.tipoId);
          if (tipoSeleccionado?.usaTalla) {
            return (
              <div>
                <label className="font-medium text-gray-700">Tallas (separadas por coma)</label>
                <input
                  type="text"
                  name="sise"
                  value={form.sise}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg text-gray-800"
                />
              </div>
            );
          }
        })()}

        <div>
          <label className="font-medium text-gray-700">Colores (separados por coma)</label>
          <input
            type="text"
            name="color"
            value={form.color}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800"
          />
        </div>

        <div>
          <label className="font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800"
            rows={4}
          />
        </div>

        {/* Imágenes existentes */}
        {existingImages.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="existente" className="w-24 h-24 object-cover rounded-lg" />
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
              {preview.map((url, index) => (
                <img key={index} src={url} alt="preview" className="w-24 h-24 object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {loading ? "Actualizando..." : "Actualizar Producto"}
        </button>
      </form>
    </div>
  );
}
