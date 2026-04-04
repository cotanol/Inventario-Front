import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {
  type IRol,
  updateUserFormSchema,
  type UpdateUserFormData,
} from "@/components/usuarios/user-schema";
import { UserForm } from "@/components/usuarios/user-form";
import type { User } from "@/context/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";

// Interfaz para la respuesta de la API al buscar un usuario

const EditUserPage = () => {
  const { id } = useParams<{ id: string }>(); // Obtenemos el ID del usuario de la URL

  const { get, patch } = useFetchApi();
  const navigate = useNavigate();

  const [roles, setRoles] = useState<IRol[]>([]);
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
      const [userResponse, rolesResponse] = await Promise.all([
        get<User>(`/auth/user/${id}`), // Asumiendo un endpoint GET /usuarios/:id
        get<IRol[]>("/auth/roles"),
      ]);

      const rolEncontrado = rolesResponse.find((rol) => rol.nombre === userResponse.rol);

      const rolesActivos = rolesResponse.filter((rol) => rol.estadoRegistro);

      form.reset({
        nombre: userResponse.nombre,
        apellido: userResponse.apellido,
        correoElectronico: userResponse.correoElectronico,
        rolId: rolEncontrado?.rolId,
      });
      setRoles(rolesActivos);
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

    const updateUserPromise = () => patch(`/auth/update-user/${id}`, values);

    toast.promise(updateUserPromise(), {
      loading: "Actualizando usuario...",
      success: () => {
        // Navegamos a la lista después de un pequeño delay para mostrar el toast
        setTimeout(() => navigate("/usuarios"), 1000);
        return "¡Usuario actualizado exitosamente! 🎉";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al actualizar el usuario");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  // --- RENDERIZADO ---
  if (isLoadingData) {
    return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Usuarios" />
        <div className="content-wrap" aria-busy="true">
          Cargando datos del usuario...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Usuarios" />
      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Editando Usuario
        </h2>
        <div className="form-shell">
          <UserForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            roles={roles}
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

