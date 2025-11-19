import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { Button } from "@/components/ui/button";
import {
  compraFormSchema,
  type CompraFormValues,
  type ICompra,
} from "@/components/compras/compra-schema";
import { CompraForm } from "@/components/compras/compra-form";

interface Proveedor {
  proveedorId: number;
  nombreEmpresa: string;
  numeroIdentificacionFiscal: string;
  estadoRegistro: boolean;
}

interface Producto {
  productoId: number;
  codigo: string;
  nombre: string;
  precioVenta: number;
  costoReferencial: number | null;
  estadoRegistro: boolean;
}

const EditCompraPage = () => {
  const { id } = useParams<{ id: string }>();
  const { get, patch } = useFetchApi();
  const navigate = useNavigate();
  const [compra, setCompra] = useState<ICompra | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<CompraFormValues>({
    resolver: zodResolver(compraFormSchema),
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compraData, proveedoresRes, productosRes] = await Promise.all([
          get<ICompra>(`/compras/${id}`),
          get<Proveedor[]>("/proveedores"),
          get<Producto[]>("/catalogo/productos"),
        ]);

        setCompra(compraData);

        const proveedoresActivos = proveedoresRes.filter(
          (p) => p.estadoRegistro
        );
        const productosActivos = productosRes.filter((p) => p.estadoRegistro);

        setProveedores(proveedoresActivos);
        setProductos(productosActivos);

        // Cargar los datos de la compra en el formulario
        form.reset({
          proveedorId: compraData.proveedorId,
          fechaOrden: new Date(compraData.fechaOrden)
            .toISOString()
            .slice(0, 16),
          fechaLlegadaEstimada: compraData.fechaLlegadaEstimada
            ? new Date(compraData.fechaLlegadaEstimada)
                .toISOString()
                .slice(0, 16)
            : "",
          detalles: compraData.detalles.map((detalle) => ({
            productoId: detalle.productoId,
            cantidadSolicitada: detalle.cantidadSolicitada,
            costoUnitario: detalle.costoUnitario,
          })),
        });
      } catch (err) {
        console.error("Error al cargar datos:", err);
        toast.error("Error al cargar la compra");
        navigate("/compras");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, get, navigate, form]);

  // Validar estado antes de permitir edición
  useEffect(() => {
    if (
      compra &&
      compra.estadoCompra !== "BORRADOR" &&
      compra.estadoCompra !== "ORDENADO"
    ) {
      toast.warning(
        "Solo se pueden editar compras en BORRADOR u ORDENADO. Redirigiendo..."
      );
      setTimeout(() => navigate("/compras"), 2000);
    }
  }, [compra, navigate]);

  async function onSubmit(values: CompraFormValues) {
    if (!compra) return;

    setApiError(null);

    const updateCompraPromise = () =>
      patch(`/compras/${id}`, {
        ...values,
      });

    toast.promise(updateCompraPromise(), {
      loading: "Actualizando compra...",
      success: () => {
        setTimeout(() => navigate("/compras"), 1000);
        return "¡Compra actualizada exitosamente! 🎉";
      },
      error: (err) => {
        const errorMessage =
          err.response?.data?.message || "Error al actualizar la compra";
        setApiError(
          Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
        );
        return `Error: ${
          Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
        }`;
      },
    });
  }

  if (loading) {
    return (
      <div>
        <Header titulo="Editar Compra" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!compra) {
    return (
      <div>
        <Header titulo="Editar Compra" />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">No se pudo cargar la compra</p>
            <Button
              onClick={() => navigate("/compras")}
              className="mt-4"
              variant="outline"
            >
              Volver a Compras
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Validar según estado qué se puede editar
  const esBorrador = compra.estadoCompra === "BORRADOR";
  const esOrdenado = compra.estadoCompra === "ORDENADO";
  const esCompletado = compra.estadoCompra === "COMPLETADO";
  const esCancelado = compra.estadoCompra === "CANCELADO";

  // Solo se puede editar en BORRADOR u ORDENADO
  // En COMPLETADO y CANCELADO no se puede editar nada
  const soloLectura = esCompletado || esCancelado;

  if (soloLectura) {
    return (
      <div>
        <Header titulo="Ver Compra" />
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Esta compra está en estado <strong>{compra.estadoCompra}</strong>{" "}
              y no se puede editar.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Proveedor</p>
                <p className="text-base font-semibold">
                  {compra.proveedor.nombreEmpresa}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="text-base font-semibold">{compra.estadoCompra}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-base font-semibold">
                  S/ {compra.totalCompra.toFixed(2)}
                </p>
              </div>
              <Button onClick={() => navigate("/compras")} variant="outline">
                Volver a Compras
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!esBorrador && !esOrdenado) {
    return (
      <div>
        <Header titulo="Editar Compra" />
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              ⚠️ Solo se pueden editar compras en estado{" "}
              <strong>BORRADOR</strong> u <strong>ORDENADO</strong>. Esta compra
              está en estado <strong>{compra.estadoCompra}</strong>.
            </p>
            <p className="text-sm text-yellow-700 mt-2">
              Para modificar esta compra, primero cancélala y crea una nueva.
            </p>
          </div>
          <Button onClick={() => navigate("/compras")} variant="outline">
            Volver a Compras
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header titulo={esOrdenado ? "Editar Fecha Estimada" : "Editar Compra"} />
      <div className="p-6">
        {esOrdenado && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              ℹ️ Esta compra está en estado <strong>ORDENADO</strong>. Solo
              puedes modificar la <strong>Fecha Estimada de Llegada</strong>.
            </p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <CompraForm
            form={form}
            onSubmit={onSubmit}
            proveedores={proveedores}
            productos={productos}
            apiError={apiError}
            isSubmitting={isSubmitting}
            submitButtonText="Actualizar Compra"
            onCancel={() => navigate("/compras")}
            estadoCompra={compra.estadoCompra}
          />
        </div>
      </div>
    </div>
  );
};

export default EditCompraPage;
