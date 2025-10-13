import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {
  clienteFormSchema,
  type ClienteFormData,
} from "@/components/clientes/cliente-schema";
import { ClienteForm } from "@/components/clientes/cliente-form";

const CreateClientePage = () => {
  const { post } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteFormSchema),
    mode: "onChange",
    defaultValues: {
      nombre: "",
      ruc: "",
      direccion: "",
      telefono: null,
      email: "",
      clasificacion: "",
      departamento: "",
      distrito: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: ClienteFormData) {
    setApiError(null);
    const payload = { ...values };
    if (payload.telefono === "") payload.telefono = null;

    const createClientePromise = () => post("/clientes", payload);

    toast.promise(createClientePromise(), {
      loading: "Creando cliente...",
      success: () => {
        form.reset();
        setTimeout(() => navigate("/clientes"), 1000);
        return "¡Cliente creado exitosamente! 🎉";
      },
      error: (err) => {
        const errorMessage =
          err.response?.data?.message || "Error al crear el cliente";
        const message = Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage;
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  return (
    <div>
      <Header titulo="Clientes" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Crear Nuevo Cliente
        </h2>
        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
          <ClienteForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            onCancel={() => navigate("/clientes")}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateClientePage;
