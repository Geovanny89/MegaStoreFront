import React, { useState, useEffect } from "react";
import api from "../../../api/axios";

export default function CrearProductos() {
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
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
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

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    // Crear preview
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreview((prev) => [...prev, ...urls]);
  };

  // Eliminar imagen individual
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
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

      images.forEach((image) => {
        formData.append("image", image);
      });

      await api.post("/seller/productos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Producto creado correctamente!");
      setTimeout(() => setMessage(""), 5000);

      setForm({
        name: "",
        price: "",
        brand: "",
        tipoId: "",
        color: "",
        sise: "",
        stock: "",
        description: "",
      });
      setImages([]);
      setPreview([]);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">Subir Producto</h2>
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-400 text-green-700 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 space-y-4">

        {/* Nombre */}
        <div>
          <label className="font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-gray-700">Precio</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
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
              className="w-full border px-3 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Marca */}
        <div>
          <label className="font-medium text-gray-700">Marca</label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tipo de producto */}
        <div>
          <label className="font-medium text-gray-700">Tipo de Producto</label>
          <select
            name="tipoId"
            value={form.tipoId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
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

        {/* Tallas dinámicas */}
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
                  className="w-full border px-3 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            );
          }
        })()}

        {/* Colores */}
        <div>
          <label className="font-medium text-gray-700">Colores (separados por coma)</label>
          <input
            type="text"
            name="color"
            value={form.color}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Imágenes */}
        <div>
          <label className="font-medium text-gray-700">Imágenes</label>
         <input
  type="file"
  name="image"          // ✅ CLAVE
  multiple
  accept="image/*"
  onChange={handleImageChange}
  className="w-full border px-3 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
/>


          {preview.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {preview.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {loading ? "Subiendo..." : "Subir Producto"}
        </button>
      </form>
    </div>
  );
}
