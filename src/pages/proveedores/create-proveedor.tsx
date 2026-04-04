import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {  proveedorFormSchema,
  type ProveedorFormValues,
} from "@/components/proveedores/proveedor-schema";
import { ProveedorForm } from "@/components/proveedores/proveedor-form";
import { getApiErrorMessage } from "@/lib/api-error";

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
        const message = getApiErrorMessage(err, "Error al crear el proveedor");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Proveedores" />
      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Crear Nuevo Proveedor
        </h2>
        <div className="form-shell">
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

