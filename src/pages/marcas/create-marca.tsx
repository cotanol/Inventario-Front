import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { MarcaForm } from "@/components/marcas/marca-form";
import {
  marcaFormSchema,
  type MarcaFormData,
} from "@/components/marcas/marca-schema";
import { getApiErrorMessage } from "@/lib/api-error";

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

    toast.promise(createMarcaPromise(), {
      loading: "Creando marca...",
      success: () => {
        // Reseteamos el formulario
        form.reset();
        // Navegamos a la lista después de un pequeño delay para mostrar el toast
        setTimeout(() => navigate("/marcas"), 1000);
        return "¡Marca creada exitosamente! 🎉";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al crear la marca");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  return (
    <div>
      <Header titulo="Marcas" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Crear Nueva Marca
        </h2>
        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
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
