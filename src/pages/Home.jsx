import Layout from "../components/layout/Layout.jsx";
import Products from "../components/Products/products.jsx";

export default function Home() {
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

      {/* Productos */}
      <div id="productos">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Productos destacados</h2>
        <Products />
      </div>
    </Layout>
  );
}
