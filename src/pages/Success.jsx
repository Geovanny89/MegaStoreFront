import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center">
        
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Pago realizado con éxito
        </h1>

        <p className="text-gray-600 mb-6">
          Gracias por tu compra. Tu pago ha sido confirmado.  
          Puedes revisar los detalles en la sección de órdenes.
        </p>

        <Link
          to="/homeUser"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
