import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { MarcaForm } from "@/components/marcas/create-marca";

const marcaFormSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido.")
    .max(50, "El nombre no puede exceder 50 caracteres."),
});

export type MarcaFormData = z.infer<typeof marcaFormSchema>;

const CreateMarcaPage = () => {
  const { post } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<MarcaFormData>({
    resolver: zodResolver(marcaFormSchema),
    mode: "onChange",
    defaultValues: {
      nombre: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: MarcaFormData) {
    setApiError(null);

    const createMarcaPromise = () => post("/catalogo/marcas", values);

    try {
      await toast.promise(createMarcaPromise(), {
        loading: "Creando marca...",
        success: `Marca ${values.nombre} creada exitosamente 🎉`,
        error: (err) => {
          const errorMessage =
            err.response?.data?.message || "Error al crear la marca";
          const message = Array.isArray(errorMessage)
            ? errorMessage.join(", ")
            : errorMessage;
          setApiError(message);
          return `Error: ${message}`;
        },
      });
      navigate("/marcas");
    } catch (error) {
      // El error ya fue manejado en el toast
    }
  }

  return (
    <div>
      <Header titulo="Marcas" />
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Crear Nueva Marca
          </h2>
          <MarcaForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            onCancel={() => navigate("/marcas")}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateMarcaPage;
