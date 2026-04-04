import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, type Credentials } from "../context/auth-context";
import imageLogo from "../assets/logo-image.png";
import imageLogin from "../assets/login-image.png";
import { getApiErrorMessage } from "@/lib/api-error";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Credentials>({
    correoElectronico: "",
    clave: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

    const loginPromise = login(formData);

    try {
      await toast.promise(loginPromise, {
        loading: "Iniciando sesión...",
        success: "¡Bienvenido! Sesión iniciada correctamente 🎉",
        error: (err) => {
          const errorMessage = getApiErrorMessage(
            err,
            "Credenciales inválidas o error de red.",
          );
          setError(errorMessage);
          return errorMessage;
        },
      });
      navigate("/"); // Redirige a la página principal después del login
    } catch (error) {
      // El error ya fue manejado en el toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-[color:var(--sidebar-background)] p-12 text-white lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(245,158,11,0.22),transparent_46%),radial-gradient(circle_at_78%_8%,rgba(14,165,233,0.16),transparent_42%)]" />
        
        <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-10">
          <img src={imageLogo} alt="Logo de la Empresa" className="h-20 w-auto object-contain drop-shadow-md" />

          <div className="w-full rounded-3xl border border-white/12 bg-white/6 p-8 backdrop-blur-sm shadow-2xl">
            <img src={imageLogin} alt="Ilustracion de acceso" className="w-full object-contain" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
        <div className="w-full max-w-[470px] rounded-3xl border border-slate-200/70 bg-white/92 p-6 shadow-[0_24px_45px_-28px_rgba(15,23,42,0.55)] backdrop-blur-sm sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900">Bienvenido</h1>
            <p className="mt-2 text-sm text-slate-600">
              Inicia sesion para administrar tus modulos de inventario.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="correoElectronico" className="text-sm font-medium text-slate-700">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  id="correoElectronico"
                  name="correoElectronico"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-[color:var(--accent-strong)] focus:outline-none focus:ring-4 focus:ring-orange-100"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="clave" className="text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  id="clave"
                  name="clave"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.clave}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-[color:var(--accent-strong)] focus:outline-none focus:ring-4 focus:ring-orange-100"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--accent-strong)] px-4 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-orange-100 disabled:opacity-65"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Iniciando Sesión...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
