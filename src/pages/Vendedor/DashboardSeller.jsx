import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import api from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Line, ComposedChart
} from "recharts";
import {
  DollarSign, TrendingUp, RefreshCcw, Store, Download, ShoppingBag,
  Clock, Package, Search, Bell, Settings, MoreVertical,
  CheckCircle2, Copy, ChevronLeft, ChevronRight
} from "lucide-react";

export default function DashboardSeller() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get("/seller/dashboard");
      console.log("soy la orden ",res.data)
      setData(res.data);
    } catch (error) {
      console.error("Error al cargar datos reales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // --- NUEVA FUNCIÓN DE EXPORTACIÓN PROFESIONAL CON EXCELJS ---
  const exportToExcel = async () => {
    if (!data?.recentOrders?.length) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte de Ventas");

    // 1. Título del Reporte
    worksheet.mergeCells("A1:E1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `Reporte de Ventas - ${data?.seller?.storeName || "Mi Tienda"}`;
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }; // Azul Blue-600
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // 2. Definir Encabezados de la Tabla
    const headerRow = worksheet.addRow(["ID Orden", "Cliente", "Fecha", "Estado", "Total"]);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }; // Slate-800
      cell.border = { bottom: { style: 'medium' } };
      cell.alignment = { horizontal: 'center' };
    });

    // 3. Agregar los Datos
    data.recentOrders.forEach(order => {
      const row = worksheet.addRow([
        `#${order._id.slice(-6)}`,
        order.user?.name || 'Cliente',
        new Date(order.createdAt).toLocaleDateString(),
        translateStatus(order.status),
        order.total
      ]);

      // Dar formato de moneda a la columna Total
      row.getCell(5).numFmt = '"$"#,##0.00';
    });

    // 4. Diseño: Ancho de columnas
    worksheet.getColumn(1).width = 15; // ID
    worksheet.getColumn(2).width = 25; // Cliente
    worksheet.getColumn(3).width = 15; // Fecha
    worksheet.getColumn(4).width = 18; // Estado
    worksheet.getColumn(5).width = 15; // Total

    // 5. Estilo de celdas (Cebra y bordes)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 2) { // Saltar título y encabezado
        row.eachCell(cell => {
          cell.border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
          if (rowNumber % 2 === 0) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
          }
        });
      }
    });

    // 6. Generar el archivo y descargar
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Reporte_Ventas_${data?.seller?.storeName}.xlsx`);
  };

  const handleCopy = () => {
    const storeUrl = `${window.location.origin}/${data?.seller?.slug}`;
    navigator.clipboard.writeText(storeUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-gray-950">
        <div
          className="
          w-16 h-16
          border-4
          border-blue-100 dark:border-gray-700
          border-t-blue-600
          rounded-full
          animate-spin
        "
        />
        <p className="mt-4 text-slate-600 dark:text-gray-400 font-semibold">
          Sincronizando con tu tienda...
        </p>
      </div>
    );
  }

  const planName = data?.seller?.subscriptionPlan?.name || data?.seller?.subscriptionPlan?.nombre || "Emprendedor";

  const translateStatus = (status) => {
    const statuses = {
      'delivered': 'Entregado',
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'cancelled': 'Cancelado',
      'paid': 'Pagado',
      'completed': 'Completado'
    };
    return statuses[status?.toLowerCase()] || status;
  };

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = data?.recentOrders?.slice(indexOfFirstOrder, indexOfLastOrder) || [];
  const totalPages = Math.ceil((data?.recentOrders?.length || 0) / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 text-slate-900 dark:text-gray-100 p-4 md:p-8">

      <div className="max-w-[1600px] mx-auto">

        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
              <Store size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-gray-100">Panel de {data?.seller?.storeName}</h1>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${planName.toLowerCase() === "premium"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    }`}
                >
                  Plan {planName}
                </span>
                <span className="text-slate-400 dark:text-gray-400 text-xs flex items-center gap-1">
                  <Clock size={12} /> Actualizado ahora
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-2 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm">
            <button onClick={fetchDashboard} className="p-2 rounded-xl text-slate-400 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors">
              <RefreshCcw size={20} />
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-700 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-lg">
              <Store size={20} />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-gray-300">Tu vitrina online:</p>
            <code className="text-blue-600 dark:text-blue-300 font-semibold text-sm bg-blue-50/50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
              {window.location.origin}/{data?.seller?.slug}
            </code>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${copied
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/40"
              : "bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-700"
              }`}
          >
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copied ? "¡Copiado!" : "Copiar Enlace"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Ventas Hoy"
            value={`$${data?.summary?.today?.toLocaleString() || '0'}`}
            trend="+20%"
            isPositive={true}
            icon={<DollarSign size={20} />}
            color="blue"
          />
          <StatCard
            title="Ventas del Mes"
            value={`$${data?.summary?.totalMonth?.toLocaleString() || '0'}`}
            trend={`${data?.summary?.salesTrend || '0'}%`}
            isPositive={data?.summary?.salesTrend >= 0}
            icon={<TrendingUp size={20} />}
            color="emerald"
          />
          <StatCard
            title="Productos Activos"
            value={data?.summary?.productCount || "0"}
            icon={<Package size={20} />}
            color="amber"
          />
          <StatCard
            title="Órdenes Totales"
            value={data?.summary?.orderCount || "0"}
            icon={<ShoppingBag size={20} />}
            color="indigo"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[24px] shadow-sm border border-slate-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-gray-100 text-lg">Tendencia de Ventas</h3>
                <p className="text-slate-400 dark:text-gray-400 text-xs font-medium">Ingresos brutos vs pedidos</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-xs bg-slate-900 dark:bg-blue-600 text-white rounded-lg font-bold">7 Días</button>
                <button className="px-4 py-1.5 text-xs text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg font-bold">Mes</button>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data?.dailySales || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
                  <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-gray-800">
            <h3 className="font-bold text-slate-800 dark:text-gray-100 mb-6">Top Productos</h3>
            <div className="space-y-6">
              {data?.topProducts?.map((product, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img src={product.image || "https://via.placeholder.com/50"} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-50 dark:bg-gray-800" />
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-gray-200 group-hover:text-blue-600 transition-colors">{product.name}</p>
                      <p className="text-[11px] text-yellow-500">★★★★★</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800 dark:text-gray-100">{product.sales}</p>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase">Vendidos</p>
                  </div>
                </div>
              )) || <p className="text-slate-400 dark:text-gray-500 text-center py-10 text-sm">No hay productos vendidos aún</p>}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-sm border border-slate-100 dark:border-gray-800 overflow-hidden mb-12">
          <div className="p-6 flex justify-between items-center border-b border-slate-50 dark:border-gray-800">
            <h3 className="font-bold text-slate-800 dark:text-gray-100">Órdenes Recientes</h3>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
            >
              <Download size={16} /> Exportar Excel Pro
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-gray-800 text-slate-400 dark:text-gray-400 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">ID Orden</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-600 dark:text-gray-300 divide-y divide-slate-50 dark:divide-gray-800">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/80 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-600 cursor-pointer">#{order._id.slice(-6)}</td>
                      <td className="px-6 py-4 font-medium">{order.user?.name || 'Cliente'}</td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-gray-100">${order.total?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
                          {translateStatus(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400 dark:text-gray-500">No hay órdenes para mostrar</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 flex items-center justify-between border-t border-slate-50 dark:border-gray-800 bg-slate-50/30 dark:bg-gray-900">
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                Página <span className="text-slate-900 dark:text-gray-100 font-bold">{currentPage}</span> de <span className="text-slate-900 dark:text-gray-100 font-bold">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <a
        href="https://wa.me/message/IKDCAF5OJT6XI1"
        target="_blank"
        rel="noopener noreferrer"
        className="
    fixed bottom-8 right-8 z-[100]
    flex items-center gap-2
    bg-white dark:bg-gray-900
    border border-slate-100 dark:border-gray-800
    rounded-full px-5 py-3
    shadow-2xl dark:shadow-none
    hover:scale-105 transition-all
    group
  "
      >

        <div className=" w-8 h-8 rounded-full 
  bg-emerald-500 dark:bg-emerald-600
  flex items-center justify-center 
  group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500
  transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-4 h-4 fill-white">
            <path d="M16.003 2.003c-7.732 0-14 6.268-14 14 0 2.47.646 4.878 1.873 7.012L2 30l7.18-1.85a13.91 13.91 0 006.823 1.754c7.732 0 14-6.268 14-14s-6.268-14-14-14z" />
          </svg>
        </div>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Soporte K-Dice</span>
      </a>
    </div>
  );
}

// ... Resto de componentes (StatCard, CustomTooltip, getStatusStyle) se mantienen igual ...
function StatCard({
  title,
  value,
  trend,
  isPositive,
  icon,
  color,
  onClick
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
  };

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="
        w-full text-left
        bg-white dark:bg-slate-900
        p-6 rounded-[24px]
        border border-slate-100 dark:border-slate-800
        shadow-sm dark:shadow-none
        flex flex-col justify-between h-full
        transition-all
        hover:-translate-y-0.5 hover:shadow-md
        active:scale-[0.98]
        disabled:cursor-default disabled:hover:translate-y-0
      "
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {title}
        </p>

        <div className={`p-2.5 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
          {value}
        </h2>

        {trend && (
          <div className="flex items-center gap-1">
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isPositive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                }`}
            >
              {isPositive ? "▲" : "▼"} {trend}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              vs mes anterior
            </span>
          </div>
        )}
      </div>
    </button>
  );
}


const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="
      bg-slate-900 text-white
      px-4 py-3
      rounded-2xl
      shadow-2xl
      border border-slate-700
      min-w-[160px]
    ">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
        {label}
      </p>

      <div className="space-y-1">
        {payload.map((item, i) => (
          <div key={i} className="flex justify-between items-center gap-4">
            <span className="text-xs font-semibold text-slate-300">
              {item.name || "Total"}
            </span>
            <span className="text-sm font-black" style={{ color: item.color }}>
              ${Number(item.value || 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
    case 'entregado':
    case 'enviada': return 'bg-emerald-100 text-emerald-700';
    case 'processing':
    case 'procesando': return 'bg-amber-100 text-amber-700';
    case 'pending':
    case 'pendiente': return 'bg-slate-100 text-slate-700';
    case 'cancelled':
    case 'cancelado': return 'bg-rose-100 text-rose-700';
    default: return 'bg-blue-100 text-blue-700';
  }
};