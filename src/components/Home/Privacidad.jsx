import React from "react";
import { ArrowLeft, Lock, EyeOff, UserCheck, ShieldCheck, FileWarning } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Privacidad() {
  const navigate = useNavigate();
  const fechaActual = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 font-sans text-gray-800">
        
        {/* BOTÓN VOLVER */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Volver
        </button>

        {/* ENCABEZADO */}
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase text-left">
            Política de <span className="text-blue-600">Privacidad</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium italic text-left">
            Tratamiento de Datos Personales | Ley 1581 de 2012 | Actualizado: {fechaActual}
          </p>
        </header>

        {/* RESUMEN DE SEGURIDAD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-green-50 p-6 rounded-2xl flex flex-col items-center text-center border border-green-100">
            <Lock className="text-green-600 mb-2" size={28} />
            <span className="text-xs font-black uppercase text-green-900">Encriptación SSL</span>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center text-center border border-blue-100">
            <EyeOff className="text-blue-600 mb-2" size={28} />
            <span className="text-xs font-black uppercase text-blue-900">Uso No Comercial</span>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl flex flex-col items-center text-center border border-purple-100">
            <UserCheck className="text-purple-600 mb-2" size={28} />
            <span className="text-xs font-black uppercase text-purple-900">Control Total ARCO</span>
          </div>
        </div>

        {/* CONTENIDO LEGAL */}
        <div className="space-y-12">
          
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase italic text-left">1. Autorización de Tratamiento</h2>
            <p className="text-gray-600 leading-relaxed text-left">
              Al registrarse en nuestra plataforma, usted autoriza de manera libre, previa y voluntaria al Marketplace (responsable del tratamiento domiciliado en Cúcuta) para recolectar, almacenar y utilizar sus datos personales conforme a la <strong>Ley 1581 de 2012</strong> y el <strong>Decreto 1377 de 2013</strong>.
            </p>
          </section>

          <section className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
            <h2 className="text-xl font-black text-amber-900 mb-4 uppercase italic flex items-center gap-2 text-left">
              <FileWarning size={24} className="text-amber-600" /> 2. Datos Sensibles (Biometría y Documentos)
            </h2>
            <p className="text-amber-900 text-sm leading-relaxed text-left">
              Para los <strong>Vendedores</strong>, recolectamos datos sensibles como fotografías de la cédula de ciudadanía y selfies (biometría facial). 
              <br /><br />
              Conforme al Artículo 6 de la Ley 1581, se informa que por tratarse de datos sensibles, <strong>usted no está obligado a autorizar su tratamiento</strong>; sin embargo, su recolección es un requisito indispensable de seguridad para validar la identidad del vendedor y prevenir fraudes en el marketplace. Estos datos se manejan con niveles reforzados de seguridad y no se comparten con terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase italic text-left">3. Datos que Recolectamos</h2>
            <ul className="list-disc pl-5 space-y-3 text-gray-600 text-sm text-left">
              <li><strong>Datos de Identificación:</strong> Nombre, apellido y número de documento.</li>
              <li><strong>Datos de Contacto:</strong> Correo electrónico, teléfono celular y direcciones de envío.</li>
              <li><strong>Contenido de Usuario:</strong> Mensajes en el chat interno, fotos de productos y comprobantes de pago.</li>
              <li><strong>Datos de Navegación:</strong> Dirección IP, cookies y registros de actividad para seguridad.</li>
            </ul>
          </section>

          <section className="bg-gray-900 text-white p-8 rounded-[2.5rem]">
            <h2 className="text-xl font-black mb-4 uppercase italic flex items-center gap-2 text-left">
              <ShieldCheck size={24} className="text-blue-500" /> 4. Finalidad del Tratamiento
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed text-left">
              Sus datos se utilizarán para:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-400 text-sm text-left">
              <li>Validar la identidad del usuario y prevenir la suplantación.</li>
              <li>Permitir el contacto directo entre comprador y vendedor para concretar la venta.</li>
              <li>Enviar notificaciones de pedidos, actualizaciones de cuenta y alertas de seguridad.</li>
              <li>Gestionar el cobro de membresías y soporte técnico.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase italic text-left">5. Derechos de los Titulares (Derechos ARCO)</h2>
            <p className="text-gray-600 leading-relaxed text-left">
              Usted tiene derecho a conocer, actualizar y rectificar sus datos personales frente a los Responsables del Tratamiento. Puede ejercer sus derechos de:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {['Acceso', 'Rectificación', 'Cancelación', 'Oposición'].map((derecho) => (
                <div key={derecho} className="border border-gray-100 p-3 rounded-xl text-center font-bold text-xs text-blue-600 bg-gray-50 uppercase">
                  {derecho}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase italic text-left">6. Procedimiento de Reclamaciones</h2>
            <p className="text-gray-600 leading-relaxed text-left">
              Si considera que su información debe ser corregida o eliminada, puede enviar una solicitud al correo oficial de soporte o mediante el botón de "Eliminar Cuenta" en su panel de configuración. Las consultas serán atendidas en un término máximo de diez (10) días hábiles.
            </p>
          </section>

        </div>

        <footer className="mt-20 pt-10 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
            Comprometidos con la protección de datos en Norte de Santander.
          </p>
        </footer>
      </div>
    </div>
  );
}

// Nota: No incluí el componente Section aquí para enviarte el archivo directo y limpio, 
// pero recuerda que puedes usar el mismo que usamos en Terminos.jsx si deseas unificar el estilo.