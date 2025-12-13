import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";

export default function ListaVendedores() {
  const [vendedores, setVendedores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const { data } = await api.get("/vendedor/all");
     
        setVendedores(data);
        
      } catch (error) {
        console.error(error);
        alert("Error al cargar vendedores");
      }
    };
    fetchVendedores();
  }, []);

  const verProductos = (vendedorId) => {
    navigate(`/user/tienda/${vendedorId}`);

  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {vendedores.map((v) => (
        <div
          key={v._id}
          className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
        >
          <div className="flex flex-col items-center p-4">
            <img
              src={v.image || "https://via.placeholder.com/100"}
              alt={v.storeName}
              className="h-24 w-24 rounded-full mb-4 object-contain border-2 border-gray-200"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{v.storeName}</h3>
            <p className="text-gray-500 text-sm text-center mb-4">
              {v.email || ""} <br />
              {v.phone || ""}
            </p>
            <button
              onClick={() => verProductos(v._id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              Ver productos
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
