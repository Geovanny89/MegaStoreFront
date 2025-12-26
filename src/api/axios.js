import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  // baseURL: "https://megastoreback.onrender.com/",
});

// 🔹 Interceptor de REQUEST (ya lo tienes)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor de RESPONSE (ALERTA TOKEN EXPIRADO)
api.interceptors.response.use(
  response => response,
  error => {
    // Si el token está expirado
    if (error.response?.data?.error === "TOKEN_EXPIRED") {
      alert("⚠️ Tu sesión ha expirado. Inicia sesión nuevamente.");
      
      // Limpiar el token expirado del localStorage
      localStorage.removeItem("token");
      
      // Redirigir al login (asegúrate de tener este path)
      window.location.href = "/login";
    }

    // Rechazar el error si no es de expiración
    return Promise.reject(error);
  }
);

export default api;
