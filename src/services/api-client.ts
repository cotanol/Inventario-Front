import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:6040/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/auth/login"
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirige al login
    }
    return Promise.reject(error);
  }
);
// TODO: Agregar manejo de errores globales si es necesario

export default axiosInstance;
