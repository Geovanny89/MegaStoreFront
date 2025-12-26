import { useState } from "react";
import Layout from "../components/layout/Layout.jsx";
import Products from "../components/Products/products.jsx";
import Tienda from "./Tienda.jsx";
import ProductosTienda from "./ProductosTienda.jsx"; // Componente reutilizable

export default function Home() {
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-md mb-10">
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold drop-shadow-lg">
            ¡Bienvenido a MiTienda!
          </h1>
        </div>
      </div>

      {/* Tiendas */}
      {!vendedorSeleccionado && (
        <div id="tiendas">
          
          <Tienda setVendedorSeleccionado={setVendedorSeleccionado} />
        </div>
      )}

      {/* Productos del vendedor seleccionado */}
      {vendedorSeleccionado && (
        <div id="productos-vendedor">
          <ProductosTienda
            vendedorId={vendedorSeleccionado._id}
            volver={() => setVendedorSeleccionado(null)}
          />
        </div>
      )}

      {/* Productos destacados */}
      {!vendedorSeleccionado && (
        <div id="productos">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Productos destacadosss
          </h2>
          <Products />
        </div>
      )}
    </Layout>
  );
}
