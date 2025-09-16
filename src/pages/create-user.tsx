import { useEffect, useState } from "react";
import useFetchApi from "../hooks/use-fetch";
import { useNavigate } from "react-router-dom";

interface IPerfil {
  id: string;
  nombre: string;
}

interface IFormData {
  correoElectronico: string;
  clave: string;
  nombres: string;
  apellidoPaterno: string;
  dni: string;
  apellidoMaterno?: string;
  celular?: string;
  perfilesIds: string[];
}

const CreateUserPage = () => {
  // --- 1. Hooks y Estado ---
  const { get, post } = useFetchApi(); // Usamos el hook simple
  const navigate = useNavigate();

  // Estados locales para manejar la petición
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<any | null>(null);

  const [perfiles, setPerfiles] = useState<IPerfil[]>([]);
  const [formData, setFormData] = useState<IFormData>({
    correoElectronico: "",
    clave: "",
    nombres: "",
    apellidoPaterno: "",
    dni: "",
    apellidoMaterno: "",
    celular: "",
    perfilesIds: [],
  });

  // --- 2. Carga de Datos Inicial ---
  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const response = await get<IPerfil[]>("/auth/perfiles");
        setPerfiles(response);
      } catch (err) {
        console.error("Error al cargar los perfiles", err);
        setApiError(err);
      }
    };
    fetchPerfiles();
  }, [get]);

  // --- 3. Manejadores de Lógica ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "perfilesIds") {
      const options = (e.target as HTMLSelectElement).options;
      const selectedValues: string[] = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setFormData((prev) => ({ ...prev, perfilesIds: selectedValues }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);
    try {
      const payload = { ...formData };
      if (!payload.apellidoMaterno) {
        delete payload.apellidoMaterno;
      }
      if (!payload.celular) {
        delete payload.celular;
      }
      await post("/auth/register", payload);
      alert("¡Usuario creado exitosamente!");
      navigate("/admin/view-users");
    } catch (err: any) {
      console.error("Error al crear el usuario:", err);
      setApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. Renderizado del Componente ---
  return (
    <main>
      <article>
        <header>
          <h2>Crear Nuevo Usuario</h2>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <label>
              Nombres*
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </label>
            <label>
              Apellido Paterno*
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </label>
          </div>

          <div className="grid">
            <label>
              Apellido Materno
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </label>
            <label>
              DNI*
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </label>
          </div>

          <label>
            Correo Electrónico*
            <input
              type="email"
              name="correoElectronico"
              value={formData.correoElectronico}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </label>

          <label>
            Contraseña*
            <input
              type="password"
              name="clave"
              value={formData.clave}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </label>

          <label>
            Celular
            <input
              type="tel"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </label>

          <label>
            Perfiles/Roles*
            <select
              name="perfilesIds"
              value={formData.perfilesIds}
              onChange={handleChange}
              multiple
              required
              disabled={isSubmitting}
            >
              {perfiles.map((perfil) => (
                <option key={perfil.id} value={perfil.id}>
                  {perfil.nombre}
                </option>
              ))}
            </select>
            <small>
              Mantén presionado Ctrl (o Cmd en Mac) para seleccionar varios
              roles.
            </small>
          </label>

          <button type="submit" aria-busy={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Usuario"}
          </button>

          {apiError && (
            <p style={{ color: "red" }}>
              Error:{" "}
              {apiError.response?.data?.message ||
                "Ocurrió un error al crear el usuario."}
            </p>
          )}
        </form>
      </article>
    </main>
  );
};

export default CreateUserPage;
