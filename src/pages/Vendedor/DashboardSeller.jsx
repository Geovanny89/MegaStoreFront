import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function DashboardSeller() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/seller/dashboard");
        setData(res.data);
      } catch (error) {
        console.error("Error dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500 text-lg">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard de Ventas
        </h1>
        <p className="text-gray-500 mt-1">
          Resumen de rendimiento de tu tienda
        </p>
      </div>

      {/* ================= KPIs ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard
          title="Ventas hoy"
          value={`$${data.summary.today.toLocaleString()}`}
          icon={<DollarSign />}
          color="blue"
        />
        <KpiCard
          title="Últimos 7 días"
          value={`$${data.summary.week.toLocaleString()}`}
          icon={<TrendingUp />}
          color="emerald"
        />
        <KpiCard
          title="Este mes"
          value={`$${data.summary.month.toLocaleString()}`}
          icon={<Calendar />}
          color="violet"
        />
      </div>

      {/* ================= GRÁFICA ================= */}
      <div className="bg-white rounded-2xl shadow-sm border p-5 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ventas diarias
        </h3>

        <div className="w-full h-[280px] md:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  `$${value.toLocaleString()}`
                }
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ================= KPI CARD ================= */
function KpiCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600"
  };

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div
          className={`p-3 rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
