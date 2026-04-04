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
      <div>
        <Header titulo="Recibir Mercadería" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!compra || compra.estadoCompra !== "EN_TRANSITO") {
    return (
      <div>
        <Header titulo="Recibir Mercadería" />
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
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
    <div>
      <Header titulo="Recibir Mercadería" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Compra #{compra.compraId.toString().padStart(4, "0")}
        </h2>
        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
          {/* Información de la Compra */}
          <div className="mb-6 pb-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Proveedor</p>
                <p className="text-base font-semibold">
                  {compra.proveedor.nombreEmpresa}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Compra</p>
                <p className="text-base font-semibold text-indigo-600">
                  {formatCurrency(compra.totalCompra)}
                </p>
              </div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              📦 Instrucciones
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
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
            <div className="border rounded-lg overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Solicitado
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Cantidad Recibida
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Costo Unit.
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {compra.detalles.map((detalle, index) => (
                    <tr key={detalle.detalleCompraId}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {detalle.producto.codigo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {detalle.producto.nombre}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700">
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
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
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
                className="bg-green-600 hover:bg-green-700"
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
