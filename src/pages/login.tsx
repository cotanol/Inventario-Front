import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Un icono de carga popular
import { useAuth, type Credentials } from "@/context/auth-context";
import imageLogo from "../assets/logo-image.png";
import imageLogin from "../assets/login-image.png";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Credentials>({
    correoElectronico: "",
    clave: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await login(formData);
      navigate("/"); // Redirige a la página principal después del login
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Credenciales inválidas o error de red.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* --- Parte Izquierda: Imagen y Logo con Degradado --- */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-[#9747ff] to-[#584bdd] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <img src={imageLogo} alt="Logo de la Empresa" className="w-48 mb-8" />
          <img
            src={imageLogin}
            alt="Mueble decorativo"
            className="max-w-md w-full"
          />
        </div>
      </div>

      {/* --- Parte Derecha: Formulario de Login --- */}
      <div className="flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            ¡Bienvenido de Nuevo!
          </h1>
          <p className="text-gray-600 text-center mt-2 mb-8">
            Ingresa tus credenciales para acceder a tu cuenta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="correoElectronico"
                className="block text-sm font-medium text-gray-700"
              >
                Correo Electrónico
              </label>
              <input
                id="correoElectronico"
                name="correoElectronico"
                type="email"
                placeholder="tu@correo.com"
                value={formData.correoElectronico}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="clave"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="clave"
                name="clave"
                type="password"
                placeholder="••••••••"
                value={formData.clave}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Iniciando Sesión...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
