import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {  vendedorFormSchema,
  type VendedorFormData,
} from "@/components/vendedores/vendedor-schema";
import { VendedorForm } from "@/components/vendedores/vendedor-form";
import { getApiErrorMessage } from "@/lib/api-error";

const CreateVendedorPage = () => {
  const { post } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<VendedorFormData>({
    resolver: zodResolver(vendedorFormSchema),
    mode: "onChange",
    defaultValues: {
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      dni: "",
      correo: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: VendedorFormData) {
    setApiError(null);

    const createVendedorPromise = () => post("/vendedores", values);

    toast.promise(createVendedorPromise(), {
      loading: "Creando vendedor...",
      success: () => {
        form.reset();
        setTimeout(() => navigate("/vendedores"), 1000);
        return "¡Vendedor creado exitosamente! 🎉";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al crear el vendedor");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  return (
    <div>
      <Header titulo="Vendedores" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Crear Nuevo Vendedor
        </h2>
        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
          <VendedorForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            onCancel={() => navigate("/vendedores")}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateVendedorPage;
