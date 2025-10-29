import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {
  updatePedidoFormSchema,
  type UpdatePedidoFormData,
  type IPedido,
} from "@/components/pedidos/pedido-schema";
import { PedidoForm } from "@/components/pedidos/pedido-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Cliente {
  clienteId: number;
  nombre: string;
  ruc: string;
  estadoRegistro: boolean;
  vendedorId: number;
  vendedor: {
    vendedorId: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
}

interface Producto {
  productoId: number;
  codigo: string;
  nombre: string;
  precio: number;
  estadoRegistro: boolean;
  inventario?: {
    cantidadActual: number;
  };
}

const EditPedidoPage = () => {
  const { id } = useParams<{ id: string }>();
  const { get, patch } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedido, setPedido] = useState<IPedido | null>(null);

  const form = useForm<UpdatePedidoFormData>({
    resolver: zodResolver(updatePedidoFormSchema),
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  const loadInitialData = useCallback(async () => {
    if (!id) return;
    setIsLoadingData(true);
    try {
      const [pedidoData, clientesRes, productosRes] = await Promise.all([
        get<IPedido>(`/pedidos/${id}`),
        get<Cliente[]>("/clientes"),
        get<Producto[]>("/catalogo/productos"),
      ]);

      setPedido(pedidoData);

      // Filtrar solo activos
      const clientesActivos = clientesRes.filter((c) => c.estadoRegistro);
      const productosActivos = productosRes.filter(
        (p) =>
          p.estadoRegistro && p.inventario && p.inventario.cantidadActual > 0
      );

      setClientes(clientesActivos);
      setProductos(productosActivos);

      // Cargar datos en el formulario
      form.reset({
        clienteId: pedidoData.clienteId,
        tipoPago: pedidoData.tipoPago,
        detalles: pedidoData.detalles.map((d) => ({
          productoId: d.productoId,
          cantidad: d.cantidad,
        })),
      });
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setApiError("No se pudieron cargar los datos del pedido.");
    } finally {
      setIsLoadingData(false);
    }
  }, [id, get, form]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  async function onSubmit(values: UpdatePedidoFormData) {
    if (!id) return;
    setApiError(null);

    // Obtener el vendedorId del cliente seleccionado
    const clienteSeleccionado = clientes.find(
      (c) => c.clienteId === values.clienteId
    );

    if (!clienteSeleccionado) {
      setApiError("Cliente no encontrado");
      return;
    }

    // Crear el payload con el vendedorId del cliente
    const payload = {
      ...values,
      vendedorId: clienteSeleccionado.vendedorId,
    };

    const updatePedidoPromise = () => patch(`/pedidos/${id}`, payload);

    toast.promise(updatePedidoPromise(), {
      loading: "Actualizando pedido...",
      success: () => {
        setTimeout(() => navigate("/pedidos"), 1000);
        return "¡Pedido actualizado exitosamente! 🎉";
      },
      error: (err) => {
        const errorMessage =
          err.response?.data?.message || "Error al actualizar el pedido";
        const message = Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage;
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  const handleCancel = () => {
    navigate("/pedidos");
  };

  if (isLoadingData) {
    return (
      <div>
        <Header titulo="Pedidos" />
        <div className="p-6">Cargando datos del pedido...</div>
      </div>
    );
  }

  // Si el pedido no está en estado PENDIENTE, no permitir edición
  if (pedido && pedido.estadoPedido !== "PENDIENTE") {
    return (
      <div>
        <Header titulo="Pedidos" />
        <div className="max-w-5xl mx-auto p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No se puede editar</AlertTitle>
            <AlertDescription>
              Solo se pueden editar pedidos en estado PENDIENTE. Este pedido
              está en estado: <strong>{pedido.estadoPedido}</strong>.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => navigate("/pedidos")}>
              Volver a Pedidos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header titulo="Pedidos" />
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            Editar Pedido #{pedido?.pedidoId.toString().padStart(4, "0")}
          </h2>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Estás editando un pedido en estado PENDIENTE. Los cambios
              afectarán la información del pedido.
            </AlertDescription>
          </Alert>
          <PedidoForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            clientes={clientes}
            productos={productos}
            submitButtonText="Actualizar Pedido"
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPedidoPage;
