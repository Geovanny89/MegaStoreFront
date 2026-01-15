import { useState, useRef } from "react";
import api from "../../../api/axios";
import { FiUploadCloud, FiX, FiCheckCircle } from "react-icons/fi"; // Instala react-icons

export default function UploadForm({ onAdd }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Crear preview local
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Por favor, selecciona una imagen");

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);

    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post("/create/banners", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      
      onAdd(data.banner);
      // Resetear formulario
      setFile(null);
      setPreview(null);
      setTitle("");
      alert("¡Banner subido con éxito!");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Error al subir el banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">Nuevo Banner</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Promociona tus productos en la tienda</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input de Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título del Banner
            </label>
            <input
              type="text"
              placeholder="Ej: Ofertas de Verano 50%"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 outline-none transition-all"
              required
            />
          </div>

          {/* Área de Carga de Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Imagen Publicitaria
            </label>
            
            {!preview ? (
              <div 
                onClick={() => fileInputRef.current.click()}
                 className="group relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 transition-all hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer text-center"
          >
                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300 group-hover:text-blue-500 transition-colors" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">Haz clic para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">PNG, JPG o WEBP (Recomendado: 1200x400px)</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={loading}
           className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all shadow-md ${
          loading 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Subiendo...
              </>
            ) : (
              <>
                <FiCheckCircle size={18} />
                Publicar Banner
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}