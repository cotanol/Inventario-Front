import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {  updateClienteFormSchema,
  type UpdateClienteFormData,
  type ICliente,
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

const EditClientePage = () => {
  const { id } = useParams<{ id: string }>();
  const { get, patch } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  const form = useForm<UpdateClienteFormData>({
    resolver: zodResolver(updateClienteFormSchema),
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  const loadInitialData = useCallback(async () => {
    if (!id) return;
    setIsLoadingData(true);
    try {
      const [clienteData, vendedoresResponse] = await Promise.all([
        get<ICliente>(`/clientes/${id}`),
        get<Vendedor[]>("/vendedores"),
      ]);

      const vendedoresActivos = vendedoresResponse.filter(
        (vendedor) => vendedor.estadoRegistro
      );
      setVendedores(vendedoresActivos);
      form.reset(clienteData);
    } catch (err) {
      setApiError("No se pudieron cargar los datos del cliente.");
    } finally {
      setIsLoadingData(false);
    }
  }, [id, get, form]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  async function onSubmit(values: UpdateClienteFormData) {
    if (!id) return;
    setApiError(null);
    const payload = { ...values };
    if (payload.telefono === "") payload.telefono = null;

    const updateClientePromise = () => patch(`/clientes/${id}`, payload);

    toast.promise(updateClientePromise(), {
      loading: "Actualizando cliente...",
      success: () => {
        setTimeout(() => navigate("/clientes"), 1000);
        return "¡Cliente actualizado exitosamente! 🎉";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al actualizar el cliente");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  if (isLoadingData) {
    return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Clientes" />
        <div className="content-wrap">Cargando datos del cliente...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Clientes" />
      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Editando Cliente
        </h2>
        <div className="form-shell">
          <ClienteForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            vendedores={vendedores}
            onCancel={() => navigate("/clientes")}
            submitButtonText="Actualizar Cliente"
          />
        </div>
      </div>
    </div>
  );
};

export default EditClientePage;

