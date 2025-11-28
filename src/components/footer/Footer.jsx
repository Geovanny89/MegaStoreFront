export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        <div>
          <h2 className="text-xl font-bold text-white mb-3">MegaStore</h2>
          <p className="text-gray-400">
            La mejor tienda online para encontrar los mejores productos al mejor precio.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Secciones</h3>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">Inicio</li>
            <li className="hover:text-white cursor-pointer">Productos</li>
            <li className="hover:text-white cursor-pointer">Categorías</li>
            <li className="hover:text-white cursor-pointer">Contacto</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Contacto</h3>
          <ul className="space-y-2">
            <li>📍 Lima, Perú</li>
            <li>📞 +51 987 654 321</li>
            <li>📧 soporte@mitienda.com</li>
          </ul>
        </div>

      </div>

      <p className="text-center text-gray-500 mt-8">
        © {new Date().getFullYear()} MiTienda — Todos los derechos reservados.
      </p>
    </footer>
  );
}
