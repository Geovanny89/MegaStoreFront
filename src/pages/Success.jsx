import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, ArrowRight, ShoppingBag } from "lucide-react";

export default function Success() {
  const [params] = useSearchParams();
  const type = params.get("type");
  const slug = params.get("slug"); // Capturamos el slug de la tienda desde la URL

  const isPickup = type === "pickup";

  // Si existe un slug, redirigimos a /nombre-tienda, de lo contrario a la raíz
  const continueShoppingPath = slug ? `/${slug}` : "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFDFF] dark:bg-slate-950 px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[40px] p-10 max-w-md w-full text-center border border-slate-100 dark:border-slate-800 relative overflow-hidden">

        {/* Adorno visual de fondo */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* ICONOS DINÁMICOS */}
          <div className="flex justify-center mb-8">
            {isPickup ? (
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative bg-emerald-100 dark:bg-emerald-500/20 p-5 rounded-[2rem] text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={56} strokeWidth={2.5} />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative bg-amber-100 dark:bg-amber-500/20 p-5 rounded-[2rem] text-amber-600 dark:text-amber-400">
                  <Clock size={56} strokeWidth={2.5} />
                </div>
              </div>
            )}
          </div>

          {/* TEXTOS */}
          <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-4 leading-tight">
            {isPickup
              ? "¡Orden creada correctamente!"
              : "Orden registrada – Pendiente de pago"}
          </h1>

          <div className="space-y-4 px-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
              {isPickup ? (
                <>
                  Tu orden fue creada exitosamente.
                  <span className="block mt-2 font-bold text-emerald-600 dark:text-emerald-500">
                    Realiza el pago al mensajero una vez recibas tu producto.
                  </span>

                </>
              ) : (
                <>
                  Tu orden fue registrada en el sistema.
                  <span className="block mt-2 font-bold text-amber-600 dark:text-amber-500">
                    Escanea el QR para realizar el pago y adjunta tu comprobante en detalles de la orden.
                  </span>
                </>
              )}
            </p>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="mt-10 flex flex-col gap-3">
            <Link
              to="/orders"
              className="group flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10 active:scale-95"
            >
              Ver mis órdenes
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={continueShoppingPath}
              className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-transparent text-slate-400 dark:text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <ShoppingBag size={16} />
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}