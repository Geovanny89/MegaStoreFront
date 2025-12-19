import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  User,
  Mail,
  Phone,
  Store,
  Pencil,
  QrCode
} from "lucide-react";

export default function PerfilVendedor() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    phone: "",
    storeName: "",
    nequiPhone: "",
    daviplataPhone: ""
  });

  const [qrFiles, setQrFiles] = useState({
    nequi: null,
    daviplata: null
  });

  /* ================= OBTENER PERFIL ================= */
  const fetchPerfil = async () => {
    try {
      const res = await api.get("/vendedor/perfil");
      const data = res.data;

      setPerfil(data);
      setForm({
        name: data.name || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        storeName: data.storeName || "",
        nequiPhone: data.paymentMethods?.nequi?.phone || "",
        daviplataPhone: data.paymentMethods?.daviplata?.phone || ""
      });
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTUALIZAR PERFIL ================= */
  const updatePerfil = async () => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("lastName", form.lastName);
      formData.append("phone", form.phone);
      formData.append("storeName", form.storeName);

      // 📱 NÚMEROS DE PAGO
      formData.append("paymentMethods.nequi.phone", form.nequiPhone);
      formData.append("paymentMethods.daviplata.phone", form.daviplataPhone);

      // 📷 QR
      if (qrFiles.nequi) formData.append("nequiQR", qrFiles.nequi);
      if (qrFiles.daviplata) formData.append("daviplataQR", qrFiles.daviplata);

      const res = await api.put("/vendedor/update", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setPerfil(res.data.data);
      setEditing(false);
      setQrFiles({ nequi: null, daviplata: null });
    } catch (error) {
      console.error("Error actualizando perfil:", error);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Cargando perfil...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-2">
      <div className="bg-white shadow-xl rounded-3xl p-8">

        {/* HEADER */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold">
            {perfil.name?.charAt(0)}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {perfil.name} {perfil.lastName}
            </h1>
            <p className="text-gray-500">{perfil.storeName}</p>
            <p className="text-gray-400 text-sm">{perfil.email}</p>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl"
            >
              <Pencil size={16} /> Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-300 rounded-xl">
                Cancelar
              </button>
              <button onClick={updatePerfil} className="px-4 py-2 bg-green-600 text-white rounded-xl">
                Guardar
              </button>
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardItem label="Nombre" value={form.name} editable={editing} onChange={v => setForm({ ...form, name: v })} />
          <CardItem label="Apellido" value={form.lastName} editable={editing} onChange={v => setForm({ ...form, lastName: v })} />
          <CardItem label="Teléfono" value={form.phone} editable={editing} onChange={v => setForm({ ...form, phone: v })} />
          <CardItem label="Tienda" value={form.storeName} editable={editing} onChange={v => setForm({ ...form, storeName: v })} />
        </div>

        {/* PAGOS */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <QrCode className="text-blue-600" />
            Métodos de pago
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaymentCard
              title="Nequi"
              phone={form.nequiPhone}
              qr={perfil.paymentMethods?.nequi?.qr}
              editing={editing}
              onPhoneChange={v => setForm({ ...form, nequiPhone: v })}
              onQrChange={file => setQrFiles({ ...qrFiles, nequi: file })}
            />

            <PaymentCard
              title="Daviplata"
              phone={form.daviplataPhone}
              qr={perfil.paymentMethods?.daviplata?.qr}
              editing={editing}
              onPhoneChange={v => setForm({ ...form, daviplataPhone: v })}
              onQrChange={file => setQrFiles({ ...qrFiles, daviplata: file })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTES ================= */

function CardItem({ label, value, editable, onChange }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <p className="text-gray-400 text-sm">{label}</p>
      {editable ? (
        <input value={value} onChange={e => onChange(e.target.value)} className="w-full border px-3 py-1 rounded" />
      ) : (
        <p className="font-semibold">{value}</p>
      )}
    </div>
  );
}

function PaymentCard({ title, phone, qr, editing, onPhoneChange, onQrChange }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl text-center">
      <p className="font-semibold mb-2">{title}</p>

      {editing ? (
        <input
          type="text"
          placeholder={`Número ${title}`}
          value={phone}
          onChange={e => onPhoneChange(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />
      ) : (
        <p className="mb-3">{phone || "No registrado"}</p>
      )}

      {qr && <img src={qr} alt={`QR ${title}`} className="w-32 mx-auto mb-2" />}

      {editing && (
        <input type="file" accept="image/*,application/pdf" onChange={e => onQrChange(e.target.files[0])} />
      )}
    </div>
  );
}
