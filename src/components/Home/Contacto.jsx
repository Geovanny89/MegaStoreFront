import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Contacto() {
  return (
    <div className="py-12 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Estamos aquí para ayudarte</h1>
        <p className="text-gray-500 mt-4 text-lg">¿Tienes dudas? Nuestro equipo te responderá en menos de 24 horas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LADO IZQUIERDO: INFORMACIÓN */}
        <div className="space-y-6">
          <ContactCard 
            icon={<Mail className="text-blue-600" />} 
            title="Escríbenos" 
            detail="soporte@mitienda.com" 
          />
          <ContactCard 
            icon={<MessageCircle className="text-green-600" />} 
            title="WhatsApp Business" 
            detail="+57 300 000 0000" 
          />
          <ContactCard 
            icon={<MapPin className="text-red-600" />} 
            title="Ubicación" 
            detail="Cúcuta, Norte de Santander" 
          />
        </div>

        {/* LADO DERECHO: FORMULARIO */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Nombre</label>
              <input type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Correo</label>
              <input type="email" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="correo@ejemplo.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold mb-2">Asunto</label>
              <select className="w-full p-3 rounded-xl border border-gray-200 outline-none">
                <option>Soporte Técnico</option>
                <option>Dudas sobre Ventas</option>
                <option>Reportar un Vendedor</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold mb-2">Mensaje</label>
              <textarea rows="4" className="w-full p-3 rounded-xl border border-gray-200 outline-none" placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>
            <button className="sm:col-span-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, detail }) {
  return (
    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
      <div>
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="text-gray-500 text-sm">{detail}</p>
      </div>
    </div>
  );
}