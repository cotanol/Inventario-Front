import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { MarcaForm } from "@/components/marcas/marca-form";
import {
  updateMarcaFormSchema,
  type UpdateMarcaFormData,
} from "@/components/marcas/marca-schema";
import type { Marca } from "@/context/auth-context";

const EditMarcaPage = () => {
  const { id } = useParams<{ id: string }>(); // Obtenemos el ID de la marca de la URL

  const { get, patch } = useFetchApi();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<UpdateMarcaFormData>({
    resolver: zodResolver(updateMarcaFormSchema),
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  // --- LÓGICA DE CARGA DE DATOS ---
  // Usamos useCallback para memoizar la función de carga
  const loadInitialData = useCallback(async () => {
    if (!id) return;
    setIsLoadingData(true);
    try {
      const marcaResponse = await get<Marca>(`/catalogo/marcas/${id}`);

      // Poblamos el formulario con los datos de la marca
      form.reset({
        nombre: marcaResponse.nombre,
      });
    } catch (err) {
      console.error("Error al cargar datos para editar", err);
      setApiError("No se pudieron cargar los datos de la marca.");
    } finally {
      setIsLoadingData(false);
    }
  }, [id, get, form]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // --- LÓGICA DE ENVÍO ---
  async function onSubmit(values: UpdateMarcaFormData) {
    if (!id) return;
    setApiError(null);

    const updateMarcaPromise = () => patch(`/catalogo/marcas/${id}`, values);

    toast.promise(updateMarcaPromise(), {
      loading: "Actualizando marca...",
      success: () => {
        // Navegamos a la lista después de un pequeño delay para mostrar el toast
        setTimeout(() => navigate("/marcas"), 1000);
        return "¡Marca actualizada exitosamente! 🎉";
      },
      error: (err) => {
        const errorMessage =
          err.response?.data?.message || "Error al actualizar la marca";
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
        <Header titulo="Editar Marca" />
        <div className="p-6" aria-busy="true">
          Cargando datos de la marca...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header titulo="Editar Marca" />
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Editando Marca
          </h2>
          <MarcaForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            onCancel={() => navigate("/marcas")}
            submitButtonText="Actualizar Marca"
          />
        </div>
      </div>
    </div>
  );
};

export default EditMarcaPage;
