import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tienda({ setVendedorSeleccionado }) {
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/vendedor/all");
        setVendedores(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {vendedores.map((v) => (
        <div
          key={v._id}
          className="p-5 bg-white shadow rounded-xl flex flex-col items-center"
        >
          <img
            src={v.storeLogo}
            className="w-full h-32 object-contain rounded"
          />
          <h3 className="font-semibold text-lg mt-2">{v.storeName}</h3>
          <button
            className="mt-3 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
            onClick={() => setVendedorSeleccionado(v)}
          >
            Ver productos
          </button>
        </div>
      ))}
    </div>
  );
}
