import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { LineaForm } from "@/components/lineas/linea-form";
import {
  lineaFormSchema,
  type LineaFormData,
} from "@/components/lineas/linea-schema";
import { getApiErrorMessage } from "@/lib/api-error";

const CreateLineaPage = () => {
  const { post } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<LineaFormData>({
    resolver: zodResolver(lineaFormSchema),
    mode: "onChange",
    defaultValues: {
      nombre: "",
    },
  });

  const onSubmit = async (values: LineaFormData) => {
    setApiError(null);

    const createLineaPromise = () => post("/catalogo/lineas", values);

    toast.promise(createLineaPromise(), {
      loading: "Creando línea...",
      success: () => {
        // Reseteamos el formulario
        form.reset();
        // Navegamos a la lista después de un pequeño delay para mostrar el toast
        setTimeout(() => navigate("/lineas"), 1000);
        return "¡Línea creada exitosamente! 🎉";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al crear la línea");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  };

  const handleCancel = () => {
    navigate("/lineas");
  };

  return (
    <div>
      <Header titulo="Registrar Línea" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Nueva Línea
        </h2>

        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
          <LineaForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={form.formState.isSubmitting}
            apiError={apiError}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateLineaPage;
