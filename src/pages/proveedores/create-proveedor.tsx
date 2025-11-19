import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {
  proveedorFormSchema,
  type ProveedorFormValues,
} from "@/components/proveedores/proveedor-schema";
import { ProveedorForm } from "@/components/proveedores/proveedor-form";

const CreateProveedorPage = () => {
  const { post } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorFormSchema),
    mode: "onChange",
    defaultValues: {
      nombreEmpresa: "",
      contactoNombre: "",
      telefono: "",
      email: "",
      numeroIdentificacionFiscal: "",
      direccion: "",
      pais: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: ProveedorFormValues) {
    setApiError(null);

    const createProveedorPromise = () => post("/proveedores", values);

    toast.promise(createProveedorPromise(), {
      loading: "Creando proveedor...",
      success: () => {
        form.reset();
        setTimeout(() => navigate("/proveedores"), 1000);
        return "¡Proveedor creado exitosamente! 🎉";
      },
      error: (err) => {
        const errorMessage =
          err.response?.data?.message || "Error al crear el proveedor";
        setApiError(
          Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
        );
        return `Error: ${
          Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
        }`;
      },
    });
  }

  return (
    <div>
      <Header titulo="Registrar Proveedor" />
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ProveedorForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            submitButtonText="Crear Proveedor"
            onCancel={() => navigate("/proveedores")}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProveedorPage;
