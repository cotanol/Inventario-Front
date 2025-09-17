import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useFetchApi from "../hooks/use-fetch";
import Header from "../components/header";
import {
  userFormSchema,
  type IPerfil,
  type UserFormData,
} from "@/components/create-user/user-schema";
import { UserForm } from "@/components/create-user/form-user";

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
    try {
      const payload = { ...values };
      if (payload.apellidoMaterno === "") payload.apellidoMaterno = null;
      if (payload.celular === "") payload.celular = null;

      await post("/auth/register", payload);
      alert("¡Usuario creado exitosamente!");
      navigate("/usuarios"); // Redirige a la lista de usuarios
    } catch (err: any) {
      console.error("Error al crear el usuario:", err);
      setApiError(
        err.response?.data?.message || "Ocurrió un error al crear el usuario."
      );
    }
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
