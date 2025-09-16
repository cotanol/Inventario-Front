import { useState } from "react";
import { useAuth } from "../context/auth-context";
import type { Credentials } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
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
      // Redirigir o mostrar mensaje de éxito
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Credenciales inválidas o error de red.";
      setError(errorMessage);
      console.error("Login failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Login Page</h1>
      <p>This is the login page.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Correo Electronico:
          <input
            type="text"
            name="correoElectronico"
            value={formData.correoElectronico}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </label>
        <label>
          Clave:
          <input
            type="password"
            name="clave"
            value={formData.clave}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </label>
        <br />

        <button type="submit">
          {isSubmitting ? "Iniciando Sesión..." : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </form>
    </main>
  );
};

export default LoginPage;
