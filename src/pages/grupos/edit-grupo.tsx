import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { GrupoForm } from "../../components/grupos/create-grupo";
import type { Grupo, Linea } from "@/context/auth-context";

const updateGrupoFormSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido.")
    .max(50, "El nombre no puede exceder 50 caracteres."),
  lineaId: z.number().min(1, "Debe seleccionar una línea."),
});

export type UpdateGrupoFormData = z.infer<typeof updateGrupoFormSchema>;

const EditGrupoPage = () => {
  const { id } = useParams<{ id: string }>(); // Obtenemos el ID del grupo de la URL

  const { get, patch } = useFetchApi();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [isLoadingLineas, setIsLoadingLineas] = useState(true);

  const form = useForm<UpdateGrupoFormData>({
    resolver: zodResolver(updateGrupoFormSchema),
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  // Cargar líneas
  useEffect(() => {
    const loadLineas = async () => {
      try {
        const lineasResponse = await get<Linea[]>("/catalogo/lineas");
        // Filtrar solo líneas activas
        const lineasActivas = lineasResponse.filter(
          (linea) => linea.estadoRegistro
        );
        setLineas(lineasActivas);
      } catch (error) {
        toast.error("Error al cargar las líneas");
        setLineas([]);
      } finally {
        setIsLoadingLineas(false);
      }
    };

    loadLineas();
  }, [get]);

  // --- LÓGICA DE CARGA DE DATOS ---
  // Usamos useCallback para memoizar la función de carga
  const loadInitialData = useCallback(async () => {
    if (!id) return;
    setIsLoadingData(true);
    try {
      const grupoResponse = await get<Grupo>(`/catalogo/grupos/${id}`);

      console.log("Grupo response:", grupoResponse); // Debug log

      // Verificar que tenemos la estructura esperada
      if (!grupoResponse || !grupoResponse.linea) {
        throw new Error("Estructura de datos del grupo no válida");
      }

      // Poblamos el formulario con los datos del grupo
      form.reset({
        nombre: grupoResponse.nombre,
        lineaId: grupoResponse.linea.lineaId,
      });
    } catch (err) {
      console.error("Error loading grupo data:", err); // Debug log
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar los datos del grupo";
      toast.error(errorMessage);
      setApiError(errorMessage);
    } finally {
      setIsLoadingData(false);
    }
  }, [id, get, form]);

  // Cargamos los datos iniciales cuando se monta el componente
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // --- LÓGICA DE ENVÍO ---
  const onSubmit = async (values: UpdateGrupoFormData) => {
    if (!id) return;

    setApiError(null);

    const updateGrupoPromise = () => patch(`/catalogo/grupos/${id}`, values);

    toast.promise(updateGrupoPromise(), {
      loading: "Actualizando grupo...",
      success: () => {
        // Navegamos a la lista después de un pequeño delay para mostrar el toast
        setTimeout(() => navigate("/grupos"), 1000);
        return "¡Grupo actualizado exitosamente! 🎉";
      },
      error: (err) => {
        const errorMessage =
          err.response?.data?.message || "Error al actualizar el grupo";
        const message = Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage;
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  };

  const handleCancel = () => {
    navigate("/grupos");
  };

  // Si estamos cargando los datos, mostramos un indicador
  if (isLoadingData) {
    return (
      <div>
        <Header titulo="Editar Grupo" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Cargando datos...
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-10 text-gray-500">
              Cargando información del grupo...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header titulo="Editar Grupo" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Editar Grupo</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <GrupoForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            submitButtonText="Actualizar Grupo"
            onCancel={handleCancel}
            lineas={lineas}
            isLoadingLineas={isLoadingLineas}
          />
        </div>
      </div>
    </div>
  );
};

export default EditGrupoPage;
