import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { LineaForm } from "@/components/lineas/linea-form";
import {
  updateLineaFormSchema,
  type UpdateLineaFormData,
} from "@/components/lineas/linea-schema";
import type { Linea } from "@/components/catalogo/catalogo-types";
import { getApiErrorMessage } from "@/lib/api-error";

const EditLineaPage = () => {
  const { id } = useParams<{ id: string }>(); // Obtenemos el ID de la línea de la URL

  const { get, patch } = useFetchApi();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<UpdateLineaFormData>({
    resolver: zodResolver(updateLineaFormSchema),
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  // --- LÓGICA DE CARGA DE DATOS ---
  // Usamos useCallback para memoizar la función de carga
  const loadInitialData = useCallback(async () => {
    if (!id) return;
    setIsLoadingData(true);
    try {
      const lineaResponse = await get<Linea>(`/catalogo/lineas/${id}`);

      // Poblamos el formulario con los datos de la línea
      form.reset({
        nombre: lineaResponse.nombre,
      });
    } catch (err) {
      const errorMessage = "Error al cargar los datos de la línea";
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
  const onSubmit = async (values: UpdateLineaFormData) => {
    if (!id) return;

    setApiError(null);

    const updateLineaPromise = () => patch(`/catalogo/lineas/${id}`, values);

    toast.promise(updateLineaPromise(), {
      loading: "Actualizando línea...",
      success: () => {
        // Navegamos a la lista después de un pequeño delay para mostrar el toast
        setTimeout(() => navigate("/lineas"), 1000);
        return "¡Línea actualizada exitosamente! 🎉";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al actualizar la línea");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  };

  const handleCancel = () => {
    navigate("/lineas");
  };

  // Si estamos cargando los datos, mostramos un indicador
  if (isLoadingData) {
    return (
      <div>
        <Header titulo="Editar Línea" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Cargando datos...
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-10 text-gray-500">
              Cargando información de la línea...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header titulo="Editar Línea" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Editando Línea
        </h2>

        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
          <LineaForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            submitButtonText="Actualizar Línea"
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default EditLineaPage;
