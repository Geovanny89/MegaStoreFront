import { useEffect, useState } from "react";
import api from "../../../api/axios";
import UploadForm from "./UploadForm";
import BannerItem from "./BannerItem";
import { FiLayers, FiImage, FiLoader, FiAlertCircle } from "react-icons/fi";

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/seller/allBanners", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBanners(data);
    } catch (err) {
      console.error("Error fetching banners:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = (id) => {
    setBanners(banners.filter((b) => b._id !== id));
  };

  const handleToggle = (updatedBanner) => {
    setBanners(banners.map((b) => (b._id === updatedBanner._id ? updatedBanner : b)));
  };

  const handleAdd = (newBanner) => {
    setBanners([newBanner, ...banners]);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header del Panel */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiLayers className="text-blue-600" />
              Gestión de Banners
            </h1>
            <p className="text-gray-500 text-sm">
              Administra las campañas visuales de tu tienda y aumenta tus ventas.
            </p>
          </div>
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200">
            Total: {banners.length} Banners
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Formulario */}
          <section className="lg:col-span-1">
            <div className="sticky top-8">
              <UploadForm onAdd={handleAdd} />
            </div>
          </section>

          {/* Columna Derecha: Lista de Banners */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
              <div className="p-4 border-b border-gray-50 flex items-center gap-2 font-semibold text-gray-700">
                <FiImage />
                Tus Banners Publicados
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <FiLoader className="animate-spin h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-gray-400 text-sm">Cargando galería...</p>
                  </div>
                ) : banners.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {banners.map((b) => (
                      <BannerItem
                        key={b._id}
                        banner={b}
                        onDelete={handleDelete}
                        onToggle={handleToggle}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 rounded-xl">
                    <FiAlertCircle className="h-10 w-10 text-gray-300 mb-3" />
                    <h3 className="text-gray-900 font-medium">No hay banners activos</h3>
                    <p className="text-gray-500 text-sm max-w-[250px] mx-auto">
                      Sube tu primera imagen publicitaria para empezar a destacar tus productos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}