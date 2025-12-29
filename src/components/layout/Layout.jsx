import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* 1. mt-20 o mt-24 suele ser suficiente para saltar el Navbar.
        2. max-w-7xl y mx-auto centra el contenido del marketplace.
        3. Se quita el bg-white de aquí para que la Home maneje sus propios fondos.
      */}
      <main className="flex-1 mt-24 px-4 md:px-8 lg:px-12 w-full max-w-7xl mx-auto"> 
        <Outlet /> 
      </main>
    </div>
  );
}