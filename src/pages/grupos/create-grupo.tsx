import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { GrupoForm } from "@/components/grupos/grupo-form";
import {
  grupoFormSchema,
  type GrupoFormData,
  type ILinea,
} from "@/components/grupos/grupo-schema";
import { getApiErrorMessage } from "@/lib/api-error";

const CreateGrupoPage = () => {
  const { get, post } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [lineas, setLineas] = useState<ILinea[]>([]);
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
        const lineasResponse = await get<ILinea[]>("/catalogo/lineas");
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
        const message = getApiErrorMessage(err, "Error al crear el grupo");
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
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Nuevo Grupo
        </h2>
        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
          <GrupoForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={form.formState.isSubmitting}
            apiError={apiError}
            lineas={lineas}
            isLoadingLineas={isLoadingLineas}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGrupoPage;
