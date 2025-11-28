import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);

      alert("Login exitoso");
    } catch (error) {
      alert("Error en login");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      Holaaaasss
      <input 
        type="email" 
        placeholder="Correo"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Ingresar</button>
    </form>
  );
}
