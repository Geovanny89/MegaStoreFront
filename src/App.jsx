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
import Perfil from "./components/Vendedor/PerfilVendedor";
import EditarPerfil from "./components/Vendedor/EditarPerfil";
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

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />
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
          <Route path="/perfil/editar" element={<EditarPerfil />} />
          <Route path="/cambiar-password" element={<ChangePassword />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute rol={["seller"]} />}>
        <Route element={<LayoutSeller />}>
          <Route path="/HomeVendedor" element={<HomeVendedor />}/>
          <Route path="/PerfilVendedor" element={<PerfilVendedor />}/>
          <Route path="/editarVendedor" element={<EditarPerfilVendedor />}/>
          <Route path="/vendedorProductos" element={<VerProductos />}/>
          <Route path="/crearProductos" element={<CrearProductos />}/>
          <Route path="/actualizarProductos" element={<EditarProducto />}/>
          <Route path="/pedidosVendedor" element={<SellerOrders />}/>


          
          



          
        </Route>
      </Route>
      <Route element={<Layout />}></Route>
    </Routes>
  );
}
