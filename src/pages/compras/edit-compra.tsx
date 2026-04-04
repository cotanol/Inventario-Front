import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { Button } from "@/components/ui/button";
import {  compraFormSchema,
  type CompraFormValues,
  type ICompra,
} from "@/components/compras/compra-schema";
import { CompraForm } from "@/components/compras/compra-form";
import { getApiErrorMessage } from "@/lib/api-error";

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
            .slice(0, 10),
          fechaLlegadaEstimada: compraData.fechaLlegadaEstimada
            ? new Date(compraData.fechaLlegadaEstimada)
                .toISOString()
                .slice(0, 10)
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
        const message = getApiErrorMessage(err, "Error al actualizar la compra");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  if (loading) {
    return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Editar Compra" />
        <div className="flex justify-center items-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[color:var(--accent-strong)]"></div>
        </div>
      </div>
    );
  }

  if (!compra) {
    return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Editar Compra" />
        <div className="content-wrap">
          <div className="rounded-lg border border-red-300/40 bg-red-100/70 p-4">
            <p className="text-red-900">No se pudo cargar la compra</p>
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
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Ver Compra" />
        <div className="content-wrap">
          <div className="mb-6 rounded-lg border border-amber-300/40 bg-amber-100/65 p-4">
            <p className="text-amber-900">
              Esta compra está en estado <strong>{compra.estadoCompra}</strong>{" "}
              y no se puede editar.
            </p>
          </div>
          <div className="form-shell">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Proveedor</p>
                <p className="text-base font-semibold">
                  {compra.proveedor.nombreEmpresa}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Estado</p>
                <p className="text-base font-semibold">{compra.estadoCompra}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total</p>
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
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Editar Compra" />
        <div className="content-wrap">
          <div className="mb-6 rounded-lg border border-amber-300/40 bg-amber-100/65 p-4">
            <p className="text-amber-900">
              ⚠️ Solo se pueden editar compras en estado{" "}
              <strong>BORRADOR</strong> u <strong>ORDENADO</strong>. Esta compra
              está en estado <strong>{compra.estadoCompra}</strong>.
            </p>
            <p className="mt-2 text-sm text-amber-800">
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
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Compras" />

      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Editar Compra #{compra?.compraId.toString().padStart(4, "0")}
        </h2>
        {esOrdenado && (
          <div className="mb-6 rounded-lg border border-sky-300/40 bg-sky-100/70 p-4">
            <p className="text-sky-900">
              ℹ️ Esta compra está en estado <strong>ORDENADO</strong>. Solo
              puedes modificar la <strong>Fecha Estimada de Llegada</strong>.
            </p>
          </div>
        )}
        <div className="form-shell">
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

