import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { GrupoForm } from "../../components/grupos/create-grupo";
import type { Linea } from "@/context/auth-context";

const grupoFormSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido.")
    .max(50, "El nombre no puede exceder 50 caracteres."),
  lineaId: z.number().min(1, "Debe seleccionar una línea."),
});

export type GrupoFormData = z.infer<typeof grupoFormSchema>;

const CreateGrupoPage = () => {
  const { get, post } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [isLoadingLineas, setIsLoadingLineas] = useState(true);

  const form = useForm<GrupoFormData>({
    resolver: zodResolver(grupoFormSchema),
    mode: "onChange",
    defaultValues: {
      nombre: "",
      lineaId: undefined,
    },
  });

  // Cargar líneas al montar el componente
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

  const onSubmit = async (values: GrupoFormData) => {
    setApiError(null);

    const createGrupoPromise = () => post("/catalogo/grupos", values);

    toast.promise(createGrupoPromise(), {
      loading: "Creando grupo...",
      success: () => {
        // Reseteamos el formulario
        form.reset();
        // Navegamos a la lista después de un pequeño delay para mostrar el toast
        setTimeout(() => navigate("/grupos"), 1000);
        return "¡Grupo creado exitosamente! 🎉";
      },
      error: (err) => {
        const errorMessage =
          err.response?.data?.message || "Error al crear el grupo";
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

  return (
    <div>
      <Header titulo="Registrar Grupo" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Nuevo Grupo</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <GrupoForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={form.formState.isSubmitting}
            apiError={apiError}
            onCancel={handleCancel}
            lineas={lineas}
            isLoadingLineas={isLoadingLineas}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGrupoPage;
