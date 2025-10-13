import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// --- CORRECCIÓN: Se han ajustado las rutas de importación. ---
// Por favor, asegúrate de que estas rutas coincidan con la estructura de carpetas de tu proyecto.
// Es una práctica común omitir las extensiones de archivo (.ts/.tsx).

import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header"; // Se ha cambiado el alias '@' por una ruta relativa
import type { IPerfil } from "@/components/usuarios/create-user/user-schema";
import {
  updateUserFormSchema,
  type UpdateUserFormData,
} from "@/components/usuarios/update-user/user-update-schema";
import { UserForm } from "@/components/usuarios/create-user/form-user";
import type { User } from "@/context/auth-context";

// Interfaz para la respuesta de la API al buscar un usuario

const EditUserPage = () => {
  const { id } = useParams<{ id: string }>(); // Obtenemos el ID del usuario de la URL

  const { get, patch } = useFetchApi();
  const navigate = useNavigate();

  const [perfiles, setPerfiles] = useState<IPerfil[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserFormSchema),
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  // --- LÓGICA DE CARGA DE DATOS ---
  // Usamos useCallback para memoizar la función de carga
  const loadInitialData = useCallback(async () => {
    if (!id) return;
    setIsLoadingData(true);
    try {
      // Hacemos las dos peticiones en paralelo para más eficiencia
      const [userResponse, perfilesResponse] = await Promise.all([
        get<User>(`/auth/user/${id}`), // Asumiendo un endpoint GET /usuarios/:id
        get<IPerfil[]>("/auth/perfiles"),
      ]);

      // Poblamos el formulario con los datos del usuario
      // Encontrar el ID del perfil basado en el nombre del primer perfil del usuario
      const perfilNombre = userResponse.perfiles[0]; // Tomamos el primer perfil
      const perfilEncontrado = perfilesResponse.find(
        (p) => p.nombre === perfilNombre
      );

      form.reset({
        ...userResponse,
        perfilesIds: perfilEncontrado?.perfilId,
      });
      setPerfiles(perfilesResponse);
    } catch (err) {
      console.error("Error al cargar datos para editar", err);
      setApiError("No se pudieron cargar los datos del usuario.");
    } finally {
      setIsLoadingData(false);
    }
  }, [id, get, form]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // --- LÓGICA DE ENVÍO ---
  async function onSubmit(values: UpdateUserFormData) {
    if (!id) return;
    setApiError(null);

    const payload: any = { ...values };
    if (payload.apellidoMaterno === "") payload.apellidoMaterno = null;
    if (payload.celular === "") payload.celular = null;

    // Convertir perfilesIds (número) a array para el backend
    if (payload.perfilesIds !== undefined) {
      payload.perfilesIds = [payload.perfilesIds];
    }

    const updateUserPromise = () => patch(`/auth/update-user/${id}`, payload);

    toast.promise(updateUserPromise(), {
      loading: "Actualizando usuario...",
      success: () => {
        // Navegamos a la lista después de un pequeño delay para mostrar el toast
        setTimeout(() => navigate("/usuarios"), 1000);
        return "¡Usuario actualizado exitosamente! 🎉";
      },
      error: (err) => {
        const errorMessage =
          err.response?.data?.message || "Error al actualizar el usuario";
        const message = Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage;
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  // --- RENDERIZADO ---
  if (isLoadingData) {
    return (
      <div>
        <Header titulo="Usuarios" />
        <div className="p-6" aria-busy="true">
          Cargando datos del usuario...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header titulo="Usuarios" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Editando Usuario
        </h2>
        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
          <UserForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            perfiles={perfiles}
            onCancel={() => navigate("/usuarios")}
            submitButtonText="Actualizar Usuario"
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
