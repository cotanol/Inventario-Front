import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {
  userFormSchema,
  type IPerfil,
  type UserFormData,
} from "@/components/usuarios/create-user/user-schema";
import { UserForm } from "@/components/usuarios/create-user/form-user";

const CreateUserPage = () => {
  const { get, post } = useFetchApi();
  const navigate = useNavigate();
  const [perfiles, setPerfiles] = useState<IPerfil[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    mode: "onChange",
    defaultValues: {
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: null,
      dni: "",
      correoElectronico: "",
      clave: "",
      celular: null,
      perfilesIds: [],
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const response = await get<IPerfil[]>("/auth/perfiles");
        setPerfiles(response);
      } catch (err) {
        console.error("Error al cargar los perfiles", err);
        setApiError("No se pudieron cargar los perfiles para seleccionar.");
      }
    };
    fetchPerfiles();
  }, [get]);

  async function onSubmit(values: UserFormData) {
    setApiError(null);

    const payload = { ...values };
    if (payload.apellidoMaterno === "") payload.apellidoMaterno = null;
    if (payload.celular === "") payload.celular = null;

    const createUserPromise = () => post("/auth/register", payload);

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
        const errorMessage =
          err.response?.data?.message || "Error al crear el usuario";
        const message = Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage;
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  // --- 4. PRESENTACIÓN: Renderizado de la página ---
  // La página renderiza el layout y pasa toda la lógica al UserForm.
  return (
    <div>
      <Header titulo="Usuarios" />
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Crear Nuevo Usuario
          </h2>
          <UserForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            perfiles={perfiles}
            onCancel={() => navigate("/usuarios")}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
