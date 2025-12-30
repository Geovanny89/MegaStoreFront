import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Home/Footer.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* NAVBAR GLOBAL */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 mt-24 px-4 md:px-8 lg:px-12 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* FOOTER GLOBAL */}
      <Footer />
    </div>
  );
}
