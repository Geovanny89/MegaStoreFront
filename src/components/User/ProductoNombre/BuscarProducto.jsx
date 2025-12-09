import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function BuscarProducto() {
  const { name } = useParams();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/user/product/${name}`);
      setProductos(res.data);
    };

    fetchData();
  }, [name]);

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-4">
        Resultados para: {name}
      </h2>

      {productos.length === 0 ? (
        <p>No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productos.map((p) => (
            <div key={p._id} className="border p-4 rounded-lg">
              <img src={p.image} className="h-32 w-full object-cover" />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
