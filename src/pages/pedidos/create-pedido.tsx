import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {  pedidoFormSchema,
  type PedidoFormData,
} from "@/components/pedidos/pedido-schema";
import { PedidoForm } from "@/components/pedidos/pedido-form";
import { getApiErrorMessage } from "@/lib/api-error";

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
  precioVenta: number;
  estadoRegistro: boolean;
  inventario?: {
    cantidadActual: number;
  };
}

const CreatePedidoPage = () => {
  const { post, get } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoFormSchema),
    mode: "onChange",
    defaultValues: {
      clienteId: 0,
      tipoPago: "CONTADO",
      detalles: [{ productoId: 0, cantidad: 1 }],
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, productosRes] = await Promise.all([
          get<Cliente[]>("/clientes"),
          get<Producto[]>("/catalogo/productos"),
        ]);

        // Filtrar solo activos
        const clientesActivos = clientesRes.filter((c) => c.estadoRegistro);
        const productosActivos = productosRes.filter(
          (p) =>
            p.estadoRegistro && p.inventario && p.inventario.cantidadActual > 0
        );

        setClientes(clientesActivos);
        setProductos(productosActivos);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        toast.error("Error al cargar los datos necesarios");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [get]);

  async function onSubmit(values: PedidoFormData) {
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

    const createPedidoPromise = () => post("/pedidos", payload);

    toast.promise(createPedidoPromise(), {
      loading: "Creando pedido...",
      success: () => {
        form.reset();
        setTimeout(() => navigate("/pedidos"), 1000);
        return "¡Pedido creado exitosamente! 🎉";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al crear el pedido");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  const handleCancel = () => {
    navigate("/pedidos");
  };

  if (loading) {
    return (
      <div>
        <Header titulo="Pedidos" />
        <div className="p-6">Cargando datos necesarios...</div>
      </div>
    );
  }

  return (
    <div>
      <Header titulo="Pedidos" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Crear Nuevo Pedido
        </h2>
        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
          <PedidoForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            clientes={clientes}
            productos={productos}
            submitButtonText="Crear Pedido"
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePedidoPage;
