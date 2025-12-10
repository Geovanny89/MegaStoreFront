// import { Navigate, Outlet } from "react-router-dom";

// export default function PrivateRoute() {
//   const token = localStorage.getItem("token"); // o desde tu contexto de auth

//   // Si no hay token, redirige al login
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

  
//   // Si hay token, renderiza los children de la ruta
//   return <Outlet />;
// }
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ rol = [] }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("rol"); // <- el rol del usuario almacenado

  // Si NO está logueado
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere roles y el usuario no tiene permiso
  if (rol.length > 0 && !rol.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todo OK => Renderiza la ruta
  return <Outlet />;
}
