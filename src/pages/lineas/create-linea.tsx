import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { LineaForm } from "../../components/lineas/create-linea";

const lineaFormSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido.")
    .max(50, "El nombre no puede exceder 50 caracteres."),
});

export type LineaFormData = z.infer<typeof lineaFormSchema>;

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
        const errorMessage =
          err.response?.data?.message || "Error al crear la línea";
        const message = Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage;
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Nueva Línea</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
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
