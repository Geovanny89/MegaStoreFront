import Layout from "../components/layout/Layout.jsx";
import Products from "../components/Products/products.jsx";

export default function Home() {
  return (
    <Layout>

      {/* Hero Banner */}
      <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-md mb-10">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold drop-shadow-lg">
            ¡Bienvenido a MiTienda!
          </h1>
        </div>
      </div>

      {/* Productos */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Productos destacados</h2>
      <Products />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
       
      </div>

    </Layout>
  );
}
