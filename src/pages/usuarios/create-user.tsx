import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {
  userFormSchema,
  type IRol,
  type UserFormData,
} from "@/components/usuarios/user-schema";
import { UserForm } from "@/components/usuarios/user-form";
import { getApiErrorMessage } from "@/lib/api-error";

const CreateUserPage = () => {
  const { get, post } = useFetchApi();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<IRol[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    mode: "onChange",
    defaultValues: {
      nombre: "",
      apellido: "",
      correoElectronico: "",
      clave: "",
      rolId: undefined,
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await get<IRol[]>("/auth/roles");

        const rolesActivos = response.filter(
          (rol) => rol.estadoRegistro
        );
        setRoles(rolesActivos);
      } catch (err) {
        console.error("Error al cargar los roles", err);
        setApiError("No se pudieron cargar los roles para seleccionar.");
      }
    };
    fetchRoles();
  }, [get]);

  async function onSubmit(values: UserFormData) {
    setApiError(null);

    const createUserPromise = () => post("/auth/register", values);

    toast.promise(createUserPromise(), {
      loading: "Creando usuario...",
      success: () => {
        // Reseteamos el formulario
        form.reset();
        // Navegamos a la lista después de un pequeño delay para mostrar el toast
        setTimeout(() => navigate("/usuarios"), 1000);
        return "¡Usuario creado exitosamente! 🎉";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al crear el usuario");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Usuarios" />
      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Crear Nuevo Usuario
        </h2>
        <div className="form-shell">
          <UserForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            roles={roles}
            onCancel={() => navigate("/usuarios")}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;

