import {  Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Productos from "../pages/Productos";

export default function AppRouter() {
  return (
  
      <Routes>
        <Route path="/" element={<Productos />} />
        <Route path="/login" element={<Login />} />
      </Routes>
   
  );
}
