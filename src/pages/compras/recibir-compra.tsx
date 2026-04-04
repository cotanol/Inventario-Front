import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import useFetchApi from "@/hooks/use-fetch";
import type { ICompra } from "@/components/compras/compra-schema";
import { getApiErrorMessage } from "@/lib/api-error";

interface CantidadRecibida {
  detalleCompraId: number;
  cantidadRecibida: number;
}

interface RecibirMercaderiaForm {
  detalles: CantidadRecibida[];
}

const RecibirCompraPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { get, patch } = useFetchApi();
  const [compra, setCompra] = useState<ICompra | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue } = useForm<RecibirMercaderiaForm>();

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const compraData = await get<ICompra>(`/compras/${id}`);
        setCompra(compraData);

        // Inicializar las cantidades recibidas con las solicitadas por defecto
        compraData.detalles.forEach((detalle, index) => {
          setValue(
            `detalles.${index}.detalleCompraId`,
            detalle.detalleCompraId
          );
          setValue(
            `detalles.${index}.cantidadRecibida`,
            detalle.cantidadSolicitada
          );
        });
      } catch (error: any) {
        toast.error("Error al cargar la compra");
        navigate("/compras");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompra();
  }, [id, get, navigate, setValue]);

  const onSubmit = async (data: RecibirMercaderiaForm) => {
    if (!compra) return;

    setIsSubmitting(true);

    const recibirPromise = async () => {
      await patch(`/compras/${id}/recepcion`, {
        detalles: data.detalles,
      });
      navigate("/compras");
    };

    toast.promise(recibirPromise(), {
      loading: "Recibiendo mercadería y actualizando inventario...",
      success: "¡Mercadería recibida exitosamente! Inventario actualizado 📦",
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al recibir mercadería");
        return `Error: ${message}`;
      },
      finally: () => {
        setIsSubmitting(false);
      },
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  if (isLoading) {
    return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Recibir Mercadería" />
        <div className="flex justify-center items-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[color:var(--accent-strong)]"></div>
        </div>
      </div>
    );
  }

  if (!compra || compra.estadoCompra !== "EN_TRANSITO") {
    return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Recibir Mercadería" />
        <div className="content-wrap">
          <div className="rounded-lg border border-amber-300/40 bg-amber-100/65 p-4">
            <p className="text-amber-900">
              Esta compra no está en estado EN_TRANSITO. Solo se puede recibir
              mercadería de compras que están en tránsito.
            </p>
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

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Recibir Mercadería" />
      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Compra #{compra.compraId.toString().padStart(4, "0")}
        </h2>
        <div className="form-shell">
          {/* Información de la Compra */}
          <div className="mb-6 pb-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Proveedor</p>
                <p className="text-base font-semibold">
                  {compra.proveedor.nombreEmpresa}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Compra</p>
                <p className="text-base font-semibold text-[color:var(--accent-strong)]">
                  {formatCurrency(compra.totalCompra)}
                </p>
              </div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="mb-6 rounded-lg border border-sky-300/40 bg-sky-100/70 p-4">
            <h3 className="mb-2 font-semibold text-sky-900">
              📦 Instrucciones
            </h3>
            <ul className="space-y-1 text-sm text-sky-900">
              <li>• Ingrese la cantidad real recibida de cada producto</li>
              <li>
                • La cantidad recibida no puede ser mayor a la cantidad
                solicitada
              </li>
              <li>
                • Al confirmar, se actualizará el inventario automáticamente
              </li>
              <li>• El costo referencial de los productos se actualizará</li>
            </ul>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="table-shell mb-6 table-scroll">
              <table className="data-grid data-grid-responsive min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.06em]">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.06em]">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.06em]">
                      Solicitado
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.06em]">
                      Cantidad Recibida
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-[0.06em]">
                      Costo Unit.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compra.detalles.map((detalle, index) => (
                    <tr key={detalle.detalleCompraId} className="hover:bg-[color:var(--table-hover)]">
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {detalle.producto.codigo}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {detalle.producto.nombre}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-slate-700">
                        {detalle.cantidadSolicitada}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          {...register(
                            `detalles.${index}.cantidadRecibida` as const,
                            {
                              required: true,
                              min: 0,
                              max: detalle.cantidadSolicitada,
                              valueAsNumber: true,
                            }
                          )}
                          className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center focus:border-[color:var(--accent-strong)] focus:outline-none focus:ring-2 focus:ring-orange-100"
                          defaultValue={detalle.cantidadSolicitada}
                        />
                        <input
                          type="hidden"
                          {...register(
                            `detalles.${index}.detalleCompraId` as const,
                            { valueAsNumber: true }
                          )}
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-slate-900">
                        {formatCurrency(detalle.costoUnitario)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/compras")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[color:var(--accent-strong)] text-white hover:brightness-110"
              >
                {isSubmitting ? "Procesando..." : "Confirmar Recepción"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecibirCompraPage;

