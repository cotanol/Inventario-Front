import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {  clienteFormSchema,
  type ClienteFormData,
} from "@/components/clientes/cliente-schema";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { getApiErrorMessage } from "@/lib/api-error";

interface Vendedor {
  vendedorId: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  estadoRegistro: boolean;
}

const CreateClientePage = () => {
  const { post, get } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);

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
      provincia: "",
      distrito: "",
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendedoresResponse = await get<Vendedor[]>("/vendedores");
        const vendedoresActivos = vendedoresResponse.filter(
          (vendedor) => vendedor.estadoRegistro
        );
        setVendedores(vendedoresActivos);
      } catch (err) {
        console.error("Error al cargar vendedores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [get]);

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
        const message = getApiErrorMessage(err, "Error al crear el cliente");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  if (loading) {
    return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Clientes" />
        <div className="content-wrap">Cargando datos necesarios...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Clientes" />
      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Crear Nuevo Cliente
        </h2>
        <div className="form-shell">
          <ClienteForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            vendedores={vendedores}
            onCancel={() => navigate("/clientes")}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateClientePage;

