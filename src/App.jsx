import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import ReactGA from "react-ga4";
import ReactPixel from "react-facebook-pixel";
import PrivateRoute from "./utils/PrivateRoute";


/* ================== CONFIGURACIÓN DE ANALÍTICA ================== */
const GA_ID = "G-EFRSBLFLV5"; // Tu ID de Google Analytics
const PIXEL_ID = "221452844542263"; // Reemplaza cuando lo tengas

/* ================== LAZY LOAD PAGES ================== */

// Públicas
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Login/Register"));
const RegisterSeller = lazy(() => import("./pages/Login/RegisterSeller"));
const RecuperarContraseña = lazy(() => import("./pages/Login/RecuperarContraseña"));
const RestablecerContraseña = lazy(() => import("./pages/Login/RestablecerContraseña"));
const Unauthorized = lazy(() => import("./utils/Unauthorized"));
const Success = lazy(() => import("./pages/Success"));

// Layouts
const Layout = lazy(() => import("./components/layout/Layout"));
const LayoutUser = lazy(() => import("./components/User/LayoutUser"));
const LayoutSeller = lazy(() => import("./components/Vendedor/LayautSeller"));
const LayoutAdmin = lazy(() => import("./components/Admin/layaoutAdmin"));

// Marketplace
const Products = lazy(() => import("./components/Products/products"));
const TodasTiendas = lazy(() => import("./components/Home/TodasTiendas"));
const Storefront = lazy(() => import("./pages/Stores/Storefront"));
const Productosvendedor = lazy(() => import("./components/User/Tiendas/ProductoVendedor"));

// Home sections
const AboutUs = lazy(() => import("./components/Home/AboutUs"));
const Terminos = lazy(() => import("./components/Home/Terminos"));
const Privacidad = lazy(() => import("./components/Home/Privacidad"));
const Contacto = lazy(() => import("./components/Home/Contacto"));
const Planes = lazy(() => import("./components/Planes/Planes"));

// Usuario
const HomeComprador = lazy(() => import("./pages/User/HomeComprador"));
const Carrito = lazy(() => import("./components/User/Car/Carrito"));
const Favoritos = lazy(() => import("./components/User/Favoritos/Favoritos"));
const Orders = lazy(() => import("./components/User/Ordenes/Orders"));
const Perfil = lazy(() => import("./components/User/Perfil/Perfil"));
const EditarPerfilUser = lazy(() => import("./components/User/Perfil/EditarPerfilUser"));
const ChangePassword = lazy(() => import("./components/User/Contraseñas/ChangePassword"));
const Categorie = lazy(() => import("./components/User/Categoria/Categorie"));
const BuscarProducto = lazy(() => import("./components/User/ProductoNombre/BuscarProducto"));
const Notificacion = lazy(() => import("./components/User/Notificaciones/Notificacion"));
const UserMessages = lazy(() => import("./components/User/messages/UserMessages"));

// Seller
const DashboardSeller = lazy(() => import("./pages/Vendedor/DashboardSeller"));
const PerfilVendedor = lazy(() => import("./components/Vendedor/PerfilVendedor"));
const EditarPerfilVendedor = lazy(() => import("./components/Vendedor/EditarPerfil"));
const VerProductos = lazy(() => import("./components/Vendedor/Productos/VerProductos"));
const CrearProductos = lazy(() => import("./components/Vendedor/Productos/CrearProductos"));
const EditarProducto = lazy(() => import("./components/Vendedor/Productos/EditarProducto"));
const SellerOrders = lazy(() => import("./components/Vendedor/Ordenes/SellerOrdes"));
const SellerNotifications = lazy(() => import("./pages/Vendedor/SellerNotifications"));
const SellerQuestions = lazy(() => import("./components/Vendedor/Questions/SellerQuestions"));
const SellerMessages = lazy(() => import("./components/Vendedor/messages/SellerMessages"));
const UploadIdentityDocuments = lazy(() => import("./components/Vendedor/ValidarIdentidad/UploadIdentityDocuments"));
const BannerManager = lazy(() => import("./components/Vendedor/banners/BannerManager"));

// Admin
const HomeAdmin = lazy(() => import("./pages/Admin/HomeAdmin"));
const Dashboard = lazy(() => import("./components/Admin/Dashboard"));
const CategoriasAdmin = lazy(() => import("./components/Admin/CategoriasAdmin"));
const AdminUser = lazy(() => import("./components/Admin/Users/AdminUser"));
const ValidarPagos = lazy(() => import("./pages/Admin/ValidarPagos"));
const ValidarIdentidad = lazy(() => import("./components/Admin/ValidarIdentidad"));
const Reports = lazy(() => import("./components/Admin/Reports"));

/* ================== ROUTER ================== */

export default function AppRouter() {
  const location = useLocation();

  // 1. Inicialización (Solo ocurre una vez al cargar la web)
 // 1. Inicialización (Solo ocurre una vez al cargar la web)
 useEffect(() => {
  // Inicializar Google Analytics
  ReactGA.initialize(GA_ID);
  
  // Inicializar Facebook Pixel
  if (PIXEL_ID) {
    // La librería ya se encarga de no duplicar si se llama correctamente
    ReactPixel.init(PIXEL_ID, { 
      autoConfig: true, 
      debug: false 
    });
    ReactPixel.pageView();
  }
}, []);

  // 2. Seguimiento de páginas (Ocurre cada vez que cambia la URL)
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    // Reportar a Google
    ReactGA.send({ hitType: "pageview", page: currentPath });
    
    // Reportar a Facebook
    if (PIXEL_ID) {
      ReactPixel.pageView();
    }
    
    console.log("Visitando página:", currentPath);
  }, [location]);
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Cargando…</div>}>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-vendedor" element={<RegisterSeller />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/sobre-nosotros" element={<AboutUs />} />
          <Route path="/terminos-condiciones" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/tiendas" element={<TodasTiendas />} />
          <Route path="/planes" element={<Planes />} />
        </Route>

        <Route path="/:slug" element={<Storefront />}>
          <Route element={<PrivateRoute rol={["user"]} />}>
            <Route path="carrito" element={<Carrito />} />
            <Route path="favoritos" element={<Favoritos />} />
            <Route path="ordenes" element={<Orders />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="perfil/editar" element={<EditarPerfilUser />} />
            <Route path="notificaciones" element={<Notificacion />} />
            <Route path="success" element={<Success />} />
          </Route>
        </Route>

        <Route path="/forgot-password" element={<RecuperarContraseña />} />
        <Route path="/reset-password/:token" element={<RestablecerContraseña />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ADMIN */}
        <Route element={<PrivateRoute rol={["admin"]} />}>
          <Route element={<LayoutAdmin />}>
            <Route path="/homeAdmin" element={<HomeAdmin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/Categorias" element={<CategoriasAdmin />} />
            <Route path="/admin/editarUsuario" element={<AdminUser />} />
            <Route path="/admin/sellers/pagos" element={<ValidarPagos />} />
            <Route path="/admin/sellers/verificar-identidad" element={<ValidarIdentidad />} />
            <Route path="/admin/reportes" element={<Reports />} />
          </Route>
        </Route>

        {/* USER */}
        <Route element={<PrivateRoute rol={["user"]} />}>
          <Route element={<LayoutUser />}>
            <Route path="/homeUser" element={<HomeComprador />} />
            <Route path="/user/productos" element={<Products />} />
            <Route path="/user/categorias/:id" element={<Categorie />} />
            <Route path="/user/product/:name" element={<BuscarProducto />} />
            <Route path="/orders/:orderId/messages" element={<UserMessages />} />
          </Route>
        </Route>

        {/* SELLER */}
        <Route element={<PrivateRoute rol={["seller"]} />}>
          <Route element={<LayoutSeller />}>
            <Route path="/HomeVendedor" element={<DashboardSeller />} />
            <Route path="/PerfilVendedor" element={<PerfilVendedor />} />
            <Route path="/editarVendedor" element={<EditarPerfilVendedor />} />
            <Route path="/vendedorProductos" element={<VerProductos />} />
            <Route path="/crearProductos" element={<CrearProductos />} />
            <Route path="/actualizarProductos" element={<EditarProducto />} />
            <Route path="/pedidosVendedor" element={<SellerOrders />} />
            <Route path="/questions" element={<SellerQuestions />} />
            <Route path="/pedidos/:orderId/messages" element={<SellerMessages />} />
            <Route path="/verificar/documento" element={<UploadIdentityDocuments />} />
            <Route path="/banners" element={<BannerManager />} />
          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}
