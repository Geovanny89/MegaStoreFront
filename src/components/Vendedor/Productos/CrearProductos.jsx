import React, { useState, useEffect, useRef } from "react";
import api from "../../../api/axios";
import { Upload, ShieldAlert, CheckCircle, Camera, X, AlertCircle, Download } from "lucide-react";

export default function CrearProductos() {
  // Referencia para resetear el input de archivos manualmente
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    brand: "",
    tipoId: "",
    color: "",
    sise: "",
    stock: "",
    description: "",
    shippingPolicy: "coordinar", // 👈 NUEVO
    shippingNote: ""             // 👈 NUEVO
  });

  const [tipos, setTipos] = useState([]);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // --- ESTADOS PARA VERIFICACIÓN ---
  const [showVerify, setShowVerify] = useState(false);
  const [identityFiles, setIdentityFiles] = useState({ idDocument: null, selfie: null });
  const [idPreviews, setIdPreviews] = useState({ idDocument: null, selfie: null });

  // --- ESTADOS CARGA MASIVA ---
  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkError, setBulkError] = useState(false);


  /* ================== FETCH TIPOS ================== */
  const fetchTipos = async () => {
    try {
      const res = await api.get("/seller/tipos-productos");

      setTipos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  /* ================== HANDLERS PRODUCTOS ================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // 🔥 Ahora permitimos acumular todas para que el usuario las vea primero
    setImages((prev) => [...prev, ...files]);

    // Acumular URLs de previsualización
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreview((prev) => [...prev, ...urls]);

    // 🔥 IMPORTANTE: Limpiar el valor del input para que permita re-seleccionar
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Si había un mensaje de error previo, lo quitamos para evaluar el nuevo estado
    if (isError) {
      setIsError(false);
      setMessage("");
    }
  };
  /* ================== HANDLERS CARGA MASIVA ================== */
  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleZipChange = (e) => {
    setZipFile(e.target.files[0]);
  };

  const handleBulkUpload = async () => {
    if (!excelFile || !zipFile) {
      setBulkError(true);
      setBulkMessage("❌ Debes subir el Excel y el ZIP de imágenes");
      return;
    }

    setBulkLoading(true);
    setBulkError(false);
    setBulkMessage("");

    try {
      const formData = new FormData();
      formData.append("excel", excelFile);
      formData.append("images", zipFile);

      await api.post("/seller/productos/import", formData);

      setBulkMessage("✅ Productos cargados correctamente desde Excel");
      setExcelFile(null);
      setZipFile(null);
    } catch (err) {
      console.error(err);
      setBulkError(true);
      setBulkMessage("❌ Error en la carga masiva");
    } finally {
      setBulkLoading(false);
    }
  };

  const removeImage = (index) => {
    // Eliminar archivo del estado
    setImages((prev) => prev.filter((_, i) => i !== index));

    // Eliminar previsualización y liberar memoria
    setPreview((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });

    // Resetear el input por si acaso
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================== HANDLERS IDENTIDAD ================== */
  const handleIdFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setIdentityFiles(prev => ({ ...prev, [type]: file }));
      setIdPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleUploadIdentity = async () => {
    if (!identityFiles.idDocument || !identityFiles.selfie) {
      return alert("Debes subir ambos archivos para continuar");
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("idDocument", identityFiles.idDocument);
      formData.append("selfie", identityFiles.selfie);

      await api.post("/seller/verify-identity", formData);

      setMessage("✅ Documentos recibidos. Podrás subir productos cuando el administrador te apruebe.");
      setIsError(false);
      setShowVerify(false);
    } catch (err) {
      setMessage("❌ Error al subir documentos de identidad");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  /* ================== SUBMIT PRODUCTO ================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de seguridad antes de enviar
    if (images.length === 0) {
      setIsError(true);
      setMessage("❌ Debes subir al menos una imagen del producto");
      return;
    }

    if (images.length > 5) {
      setIsError(true);
      setMessage(`❌ Tienes ${images.length} imágenes. Debes dejar máximo 5.`);
      return;
    }

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      images.forEach((image) => formData.append("image", image));

      await api.post("/seller/productos", formData);

      setMessage("✅ Producto creado correctamente");
      setForm({ name: "", price: "", brand: "", tipoId: "", color: "", sise: "", stock: "", description: "" });
      setImages([]);
      setPreview([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      const data = err.response?.data;
      setIsError(true);

      if (data?.code === "IDENTITY_REQUIRED") {
        setMessage("⚠️ Verificación de Identidad Requerida");
        setShowVerify(true);
      } else if (data?.code === "IDENTITY_IN_REVIEW") {
        setMessage("⏳ Tu identidad está en revisión. No puedes publicar aún.");
      } else if (data?.code === "IDENTITY_REJECTED") {
        setMessage("❌ Identidad rechazada. Por favor sube los documentos nuevamente.");
        setShowVerify(true);
      } else {
        setMessage(data?.message || "Error al crear producto");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 pb-20 bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Panel de Vendedor</h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg font-medium border flex items-center gap-2 ${isError
              ? "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-700 dark:text-red-400"
              : "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400"
            }`}
        >
          {isError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          {message}
        </div>
      )}


      {/* Alerta dinámica si se pasa de 5 imágenes */}
      {images.length > 5 && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 rounded-lg flex items-center gap-2 font-bold animate-pulse">
          <AlertCircle size={20} />
          <span>Atención: Has seleccionado {images.length} fotos. Por favor elimina {images.length - 5} para poder publicar.</span>
        </div>
      )}

      {/* --- SECCIÓN DE VERIFICACIÓN --- */}
      {showVerify && (
        <div className="mb-8 bg-blue-900/5 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-blue-800 dark:text-blue-400">
            <ShieldAlert size={24} />
            <h3 className="text-xl font-black uppercase tracking-tight">Verificar tu Identidad</h3>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-6 font-medium">
            Para activar las ventas en el Marketplace, necesitamos validar tu identidad legal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Cédula Frontal</label>
              <div className="relative border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl p-4 hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors text-center">
                <input type="file" accept="image/*" onChange={(e) => handleIdFileChange(e, "idDocument")} className="absolute inset-0 opacity-0 cursor-pointer" />
                {idPreviews.idDocument ? (
                  <img src={idPreviews.idDocument} className="h-32 mx-auto rounded-lg object-cover" alt="Preview ID" />
                ) : (
                  <div className="py-4 text-blue-500 dark:text-blue-400 flex flex-col items-center gap-2">
                    <Upload size={30} />
                    <span className="text-xs font-bold">Subir Foto Cédula</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Selfie con el nombre de la tienda</label>
              <div className="relative border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl p-4 hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors text-center">
                <input type="file" accept="image/*" onChange={(e) => handleIdFileChange(e, "selfie")} className="absolute inset-0 opacity-0 cursor-pointer" />
                {idPreviews.selfie ? (
                  <img src={idPreviews.selfie} className="h-32 mx-auto rounded-lg object-cover" alt="Preview Selfie" />
                ) : (
                  <div className="py-4 text-blue-500 dark:text-blue-400 flex flex-col items-center gap-2">
                    <Camera size={30} />
                    <span className="text-xs font-bold">Tomar Selfie</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleUploadIdentity}
            disabled={loading}
            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-800 transition-all shadow-md disabled:bg-gray-400"
          >
            {loading ? "Procesando..." : "Enviar Documentos de Identidad"}
          </button>
        </div>
      )}

      {/* --- FORMULARIO DE PRODUCTOS --- */}

      <div className={`mt-10 ${showVerify ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          Detalles del Producto
        </h3>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-8 space-y-5">
          {/* Nombre del Producto */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Nombre del Producto</label>
            <input
              type="text" name="name" placeholder="Ej: Zapatillas Deportivas"
              value={form.name} onChange={handleChange} required
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Precio (COP)</label>
              <input
                type="number" name="price" placeholder="0.00"
                value={form.price} onChange={handleChange} required
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Unidades Stock</label>
              <input
                type="number" name="stock" placeholder="10"
                value={form.stock} onChange={handleChange} required
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Marca */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Marca</label>
            <input
              type="text" name="brand" placeholder="Ej: Nike, Sony, Genérico"
              value={form.brand} onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Categoría de Producto</label>
            <select
              name="tipoId" value={form.tipoId} onChange={handleChange} required
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
            >
              <option value="" className="text-gray-900 dark:text-gray-100">Selecciona un tipo</option>
              {tipos.map((tipo) => (
                <option key={tipo._id} value={tipo._id} className="text-gray-900 dark:text-gray-100">{tipo.name}</option>
              ))}
            </select>
          </div>

          {/* Tallas Dinámicas (RESTAURADO) */}
          {form.tipoId && tipos.find(t => t._id === form.tipoId)?.usaTalla && (
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Tallas Disponibles</label>
              <input
                type="text" name="sise" placeholder="Ej: S, M, L o 38, 40, 42"
                value={form.sise} onChange={handleChange}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          )}

          {/* Colores */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Colores</label>
            <input
              type="text" name="color" placeholder="Ej: Negro, Blanco, Rojo"
              value={form.color} onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Descripción del Producto</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} rows={4}
              placeholder="Describe las características principales..."
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Política de Envío */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase">Política de Envío</label>
            <div className="flex gap-6 mb-3">
              <label className="flex items-center gap-2 cursor-pointer text-gray-800 dark:text-gray-100">
                <input type="radio" name="shippingPolicy" value="free" checked={form.shippingPolicy === "free"} onChange={handleChange} className="accent-green-600" />
                <span className="font-medium">🚚 Envío gratis</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-800 dark:text-gray-100">
                <input type="radio" name="shippingPolicy" value="coordinar" checked={form.shippingPolicy === "coordinar"} onChange={handleChange} className="accent-green-600" />
                <span className="font-medium">📦 Coordinar con el vendedor</span>
              </label>
            </div>
            <textarea
              name="shippingNote" value={form.shippingNote} onChange={handleChange} rows={2}
              placeholder="Opcional: Ej. Envío gratis por promoción..."
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Fotos del Producto (RESTAURADO) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Fotos del Producto ({images.length}/5)</label>
            <input
              type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageChange}
              className="w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 dark:file:bg-green-700 file:text-green-700 dark:file:text-green-200 hover:file:bg-green-100 dark:hover:file:bg-green-600 cursor-pointer"
            />
          </div>

          {/* Preview Imágenes (RESTAURADO) */}
          <div className="flex gap-3 flex-wrap">
            {preview.map((url, i) => (
              <div key={i} className={`relative group ${i >= 5 ? 'opacity-50' : ''}`}>
                <img
                  src={url}
                  className={`w-20 h-20 object-cover rounded-xl border shadow-sm ${i >= 5 ? 'border-red-500 border-2' : 'border-gray-100 dark:border-gray-600'
                    }`}
                  alt="Preview product"
                />
                {i >= 5 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-red-600 dark:text-red-400 bg-white/60 dark:bg-gray-700/60 rounded-xl pointer-events-none">
                    EXCESO
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>


          {/* Botón de Publicar */}
          <button
            type="submit"
            disabled={loading || images.length > 5 || images.length === 0}
            className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2
    ${(loading || images.length > 5 || images.length === 0)
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 shadow-green-200"
              }`}
          >
            {loading
              ? "Subiendo..."
              : images.length > 5
                ? `Borra ${images.length - 5} para publicar`
                : "Publicar Producto Ahora"}
          </button>

        </form>
      </div>
      {/* ================== CARGA MASIVA DESDE EXCEL ================== */}
      <div className="mb-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
          Carga Masiva de Productos (Excel)
        </h3>

        <a
          href="/plantillas/plantilla_carga_masiva.xlsx"
          download="plantilla_carga_masiva.xlsx"
          className="flex items-center gap-2 text-xs font-bold bg-white dark:bg-gray-700 border border-purple-200 dark:border-purple-600 text-purple-600 dark:text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-700 transition-all shadow-sm"
        >
          <Download size={14} />
          DESCARGAR PLANTILLA EXCEL
        </a>

        {bulkMessage && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-semibold ${bulkError
                ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-600"
                : "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-600"
              }`}
          >
            {bulkMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Archivo Excel
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelChange}
              className="w-full text-sm text-gray-700 dark:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Imágenes (ZIP o RAR)
            </label>
            <input
              type="file"
              accept=".zip,.rar"
              onChange={handleZipChange}
              className="w-full text-sm text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        <button
          onClick={handleBulkUpload}
          disabled={bulkLoading}
          className={`w-full py-3 rounded-xl font-bold transition-all ${bulkLoading
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-800 text-white"
            }`}
        >
          {bulkLoading ? "Procesando Excel..." : "Subir Productos desde Excel"}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          📌 El Excel debe coincidir con los nombres de las imágenes dentro del ZIP.
        </p>
      </div>


    </div>
  );
}