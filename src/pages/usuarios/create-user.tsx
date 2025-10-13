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
} from "@/components/usuarios/user-schema";
import { UserForm } from "@/components/usuarios/user-form";

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
      perfilesIds: undefined,
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

    const payload: any = { ...values };
    if (payload.apellidoMaterno === "") payload.apellidoMaterno = null;
    if (payload.celular === "") payload.celular = null;

    // Convertir perfilesIds (número) a array para el backend
    payload.perfilesIds = [payload.perfilesIds];

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

  return (
    <div>
      <Header titulo="Usuarios" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Crear Nuevo Usuario
        </h2>
        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
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
