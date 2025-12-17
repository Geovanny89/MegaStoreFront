import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import PrivateRoute from "./utils/PrivateRoute";
import Home from "./pages/Home";
import Register from "./pages/Login/Register";
import Layout from "./components/layout/Layout";
import Products from "./components/Products/products";
import HomeComprador from "./pages/User/HomeComprador";
import LayoutUser from "./components/User/LayoutUser";
import Carrito from "./components/User/Car/Carrito";
import Categorie from "./components/User/Categoria/Categorie";
import BuscarProducto from "./components/User/ProductoNombre/BuscarProducto";

import Favoritos from "./components/User/Favoritos/Favoritos";
// import OrderDetails from "./components/User/Ordenes/OrderDetails";
import Orders from "./components/User/Ordenes/Orders";
import Success from "./pages/Success";
import Perfil from "./components/User/Perfil/Perfil";

import ChangePassword from "./components/User/Contraseñas/ChangePassword";
import Unauthorized from "./utils/Unauthorized";
import LayoutSeller from "./components/Vendedor/LayautSeller";
import HomeVendedor from "./pages/Vendedor/HomeVendedor";
import EditarPerfilVendedor from "./components/Vendedor/EditarPerfil";
import PerfilVendedor from "./components/Vendedor/PerfilVendedor";
import VerProductos from "./components/Vendedor/Productos/VerProductos";
import CrearProductos from "./components/Vendedor/Productos/CrearProductos";
import EditarProducto from "./components/Vendedor/Productos/EditarProducto";
import SellerOrders from "./components/Vendedor/Ordenes/SellerOrdes";
import EditarPerfilUser from "./components/User/Perfil/EditarPerfilUser";
import LayoutAdmin from "./components/Admin/layaoutAdmin";
import HomeAdmin from "./pages/Admin/HomeAdmin";
import Dashboard from "./components/Admin/Dashboard";
import CategoriasAdmin from "./components/Admin/CategoriasAdmin";
import AdminUser from "./components/Admin/Users/AdminUser";
import ProductosTienda from "./pages/ProductosTienda";
import Productosvendedor from "./components/User/Tiendas/ProductoVendedor";
import RecuperarContraseña from "./pages/Login/RecuperarContraseña";
import RestablecerContraseña from "./pages/Login/RestablecerContraseña";
import SellerNotifications from "./pages/Vendedor/SellerNotifications";
import Notificacion from "./components/User/Notificaciones/Notificacion";
import SellerQuestions from "./components/Vendedor/Questions/SellerQuestions";
import DashboardSeller from "./pages/Vendedor/DashboardSeller";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/productos" element={<ProductosTienda />} />

      {/* --- RUTAS DE RECUPERAR CONTRASEÑA --- */}
      <Route path="/forgot-password" element={<RecuperarContraseña />} />
      <Route path="/reset-password/:token" element={<RestablecerContraseña />} />



      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* TODAS las rutas del admin dentro de un solo LayoutUser */}
      <Route element={<PrivateRoute rol={["admin"]} />}>
        <Route element={<LayoutAdmin />}>
          <Route path="/homeAdmin" element={<HomeAdmin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/usuarios" element={<HomeAdmin />} />
          <Route path="/admin/Categorias" element={<CategoriasAdmin />} />
          <Route path="/admin/editarUsuario" element={<AdminUser />} />

        </Route>
      </Route>


      {/* TODAS las rutas del usuario dentro de un solo LayoutUser */}
      <Route element={<PrivateRoute rol={["user"]} />}>
        <Route element={<LayoutUser />}>
          <Route path="/homeUser" element={<HomeComprador />} />
          <Route path="/user/carAll" element={<Carrito />} />
          <Route path="/user/productos" element={<Products />} />
          <Route path="/user/categorias/:id" element={<Categorie />} />
          <Route path="/user/product/:name" element={<BuscarProducto />} />
          <Route path="/favorito/all" element={<Favoritos />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/success" element={<Success />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/editar" element={<EditarPerfilUser />} />
          <Route path="/cambiar-password" element={<ChangePassword />} />
          <Route path="/user/tienda/:vendedorId" element={<Productosvendedor />} />
          <Route path="/user/notificaciones" element={<Notificacion />} />




        </Route>
      </Route>

      <Route element={<PrivateRoute rol={["seller"]} />}>
        <Route element={<LayoutSeller />}>
          <Route path="/HomeVendedor" element={<DashboardSeller />} />
          <Route path="/PerfilVendedor" element={<PerfilVendedor />} />
          <Route path="/editarVendedor" element={<EditarPerfilVendedor />} />
          <Route path="/vendedorProductos" element={<VerProductos />} />
          <Route path="/crearProductos" element={<CrearProductos />} />
          <Route path="/actualizarProductos" element={<EditarProducto />} />
          <Route path="/pedidosVendedor" element={<SellerOrders />} />
          <Route path="/notificaciones" element={<SellerNotifications />} />
          <Route path="/questions" element={<SellerQuestions />} />










        </Route>
      </Route>
      <Route element={<Layout />}></Route>
    </Routes>
  );
}
