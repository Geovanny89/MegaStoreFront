import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import { 
  Trash2, Pencil, X, Package, Tag, Layers, Palette, 
  ChevronLeft, ChevronRight, Image as ImageIcon, Plus 
} from "lucide-react";

export default function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ================= MODAL PRODUCTO (EDICIÓN) =================
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    brand: "",
    tipoId: "",
    color: "",
    sise: "",
    stock: "",
    description: "",
    shippingPolicy: "coordinar",
  shippingNote: "",
  });

  const [tipos, setTipos] = useState([]);
  const [images, setImages] = useState([]); 
  const [preview, setPreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [saving, setSaving] = useState(false);

  // ================= MODAL DESCUENTO =================
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discountProduct, setDiscountProduct] = useState(null);
  const [discountForm, setDiscountForm] = useState({
    type: "percentage",
    value: "",
    startDate: "",
    endDate: ""
  });

  // ================= PAGINACIÓN =================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ================= FETCH DATA =================
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

  // ================= MANEJADORES PRODUCTO =================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/seller/productos/${id}`);
      setProductos(productos.filter((p) => p._id !== id));
    } catch (err) {
      alert("Error al eliminar el producto");
    } finally {
      setDeletingId(null);
    }
  };

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
      shippingPolicy: producto.shippingPolicy || "coordinar",
    shippingNote: producto.shippingNote || "",

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
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      images.forEach((img) => formData.append("image", img));
      formData.append("existingImages", JSON.stringify(existingImages));

      const response = await api.put(
        `/seller/productos/${selectedProduct._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      fetchProductos();
      setMessage(response.data.message);
      setTimeout(() => setModalOpen(false), 1500);
    } catch (err) {
      alert(err.response?.data?.message || "Error al actualizar producto");
    } finally {
      setSaving(false);
    }
  };

  // ================= MANEJADORES DESCUENTO =================
  const handleCreateDiscount = async () => {
    try {
      await api.post("/descuentos", {
        name: `Descuento ${discountProduct.name}`,
        type: discountForm.type,
        value: Number(discountForm.value),
        productos: [discountProduct._id],
        startDate: discountForm.startDate,
        endDate: discountForm.endDate
      });
      alert("Descuento aplicado correctamente");
      setDiscountModalOpen(false);
      setDiscountForm({ type: "percentage", value: "", startDate: "", endDate: "" });
    } catch (err) {
      alert("Error creando descuento");
    }
  };

  // ================= PAGINACIÓN =================
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = productos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productos.length / itemsPerPage) || 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return <p className="text-center mt-10 text-red-500 font-bold">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 pb-10 font-sans text-gray-800">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Mis Productos</h2>
          <p className="text-gray-500 font-medium">Gestiona tu inventario y catálogo</p>
        </div>
        <div className="bg-white border border-gray-100 px-5 py-2 rounded-2xl shadow-sm text-sm font-bold text-blue-600">
          Total: {productos.length} items
        </div>
      </div>

      {/* LISTADO DE PRODUCTOS */}
      <div className="grid gap-4">
        {currentProducts.map((producto) => (
          <div
            key={producto._id}
            className="flex flex-col md:flex-row items-center gap-5 bg-white border border-gray-100 shadow-sm rounded-[2rem] p-4 hover:shadow-md transition-all group"
          >
            <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              {producto.image && producto.image[0] ? (
                <img
                  src={producto.image[0]?.url}
                  alt={producto.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon size={30} />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{producto.name}</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium">
                <span className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">{producto.brand}</span>
                <span className="flex items-center text-gray-500"><Tag size={14} className="mr-1" /> ${producto.price}</span>
                <span className={`flex items-center ${producto.stock < 5 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                  <Package size={14} className="mr-1" /> Stock: {producto.stock}
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-green-50 text-green-600 rounded-2xl font-bold hover:bg-green-100 transition-all text-xs"
                onClick={() => { setDiscountProduct(producto); setDiscountModalOpen(true); }}
              >
                <Tag size={14} /> Oferta
              </button>

              <button
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all text-xs"
                onClick={() => handleEdit(producto)}
              >
                <Pencil size={14} /> Editar
              </button>

              <button
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all text-xs ${
                  deletingId === producto._id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleDelete(producto._id)}
                disabled={deletingId === producto._id}
              >
                <Trash2 size={14} />
                {deletingId === producto._id ? "..." : "Eliminar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center items-center mt-10 gap-2">
        <button className="p-2 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`w-10 h-10 rounded-xl font-black ${currentPage === i + 1 ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-100"}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button className="p-2 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <ChevronRight />
        </button>
      </div>

      {/* ================= MODAL EDICIÓN PRODUCTO (RESTAURADO) ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Editar Producto</h2>
                <p className="text-gray-500 text-sm font-medium">Modifica los detalles del artículo seleccionado</p>
              </div>
              <button className="p-2 bg-gray-100 text-gray-500 hover:text-red-500 rounded-full transition-colors" onClick={() => setModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              {message && <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl font-bold text-center">{message}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna 1 */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre</label>
                    <input type="text" name="name" value={form.name} onChange={handleFormChange} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 transition-all font-semibold outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Precio ($)</label>
                      <input type="number" name="price" value={form.price} onChange={handleFormChange} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 font-semibold outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Stock</label>
                      <input type="number" name="stock" value={form.stock} onChange={handleFormChange} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 font-semibold outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Marca</label>
                    <input type="text" name="brand" value={form.brand} onChange={handleFormChange} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 font-semibold outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Descripción</label>
                    <textarea name="description" value={form.description} onChange={handleFormChange} rows={4} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 font-semibold outline-none resize-none" />
                  </div>
                </div>

                {/* Columna 2 */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Colores (coma)</label>
                    <div className="relative">
                      <Palette size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" name="color" value={form.color} onChange={handleFormChange} className="w-full bg-gray-50 border-none rounded-2xl pl-11 pr-5 py-3.5 focus:ring-2 focus:ring-blue-500 font-semibold outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tallas (coma)</label>
                    <div className="relative">
                      <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" name="sise" value={form.sise} onChange={handleFormChange} className="w-full bg-gray-50 border-none rounded-2xl pl-11 pr-5 py-3.5 focus:ring-2 focus:ring-blue-500 font-semibold outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Imágenes</label>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {existingImages.map((img, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100">
                          <img src={img.url} className="w-full h-full object-cover" alt="" />
                          <button onClick={() => handleRemoveExistingImage(i)} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold"><X size={16} /></button>
                        </div>
                      ))}
                      {preview.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-blue-400">
                          <img src={url} className="w-full h-full object-cover" alt="" />
                          <button onClick={() => handleRemoveNewImage(idx)} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold"><X size={16} /></button>
                        </div>
                      ))}
                      <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                        <Plus size={20} /><span className="text-[10px] font-black uppercase mt-1">Subir</span>
                        <input type="file" multiple onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                    {/* ================= ENVÍO ================= */}
<div className="space-y-5">
  <div>
    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
      Política de Envío
    </label>
    <select
      name="shippingPolicy"
      value={form.shippingPolicy}
      onChange={handleFormChange}
      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="coordinar">Coordinar con el vendedor</option>
      <option value="free">Envío gratis</option>
    </select>
  </div>

  {form.shippingPolicy === "free" && (
    <div>
      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
        Nota de envío
      </label>
      <input
        type="text"
        name="shippingNote"
        value={form.shippingNote}
        onChange={handleFormChange}
        placeholder="Ej: Envío gratis por compras mayores a $200.000"
        className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )}
</div>

                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-8 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setModalOpen(false)} className="px-8 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-200">Cerrar</button>
              <button onClick={handleUpdate} disabled={saving} className="px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-100 disabled:opacity-50 transition-all active:scale-95">
                {saving ? "Actualizando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DESCUENTO ================= */}
      {discountModalOpen && (
        <div className="fixed inset-0 z-[60] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-2xl font-black text-gray-900">Crear Oferta</h3>
              <p className="text-gray-500 text-sm font-medium">{discountProduct?.name}</p>
            </div>

            <div className="space-y-4">
              <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-semibold outline-none focus:ring-2 focus:ring-green-500" value={discountForm.type} onChange={(e) => setDiscountForm({ ...discountForm, type: e.target.value })}>
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Valor fijo ($)</option>
              </select>

              <input type="number" placeholder="Valor (ej: 20)" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-semibold outline-none focus:ring-2 focus:ring-green-500" value={discountForm.value} onChange={(e) => setDiscountForm({ ...discountForm, value: e.target.value })} />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Inicio</label>
                  <input type="date" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-semibold outline-none" onChange={(e) => setDiscountForm({ ...discountForm, startDate: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Fin</label>
                  <input type="date" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-semibold outline-none" onChange={(e) => setDiscountForm({ ...discountForm, endDate: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button onClick={handleCreateDiscount} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95">Aplicar Descuento</button>
              <button onClick={() => setDiscountModalOpen(false)} className="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}