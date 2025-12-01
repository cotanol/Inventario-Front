import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ICompra } from "../compra-schema";

interface DialogCompraDetailsProps {
  compra: ICompra | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base font-semibold text-gray-800">{value || "N/A"}</p>
  </div>
);

export const DialogCompraDetails = ({
  compra,
  open,
  onOpenChange,
}: DialogCompraDetailsProps) => {
  if (!compra) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Fecha inválida";
      }
      return date.toLocaleString("es-PE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      BORRADOR: "bg-gray-100 text-gray-800",
      ORDENADO: "bg-blue-100 text-blue-800",
      EN_TRANSITO: "bg-yellow-100 text-yellow-800",
      COMPLETADO: "bg-green-100 text-green-800",
      CANCELADO: "bg-red-100 text-red-800",
    };

    console.log(compra.detalles);
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
          badges[estado as keyof typeof badges]
        }`}
      >
        {estado.replace("_", " ")}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles de la Compra #{compra.compraId.toString().padStart(4, "0")}
          </DialogTitle>
          <DialogDescription>
            Información completa de la compra seleccionada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información General */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                label="N° Compra"
                value={`#${compra.compraId.toString().padStart(4, "0")}`}
              />
              <DetailItem
                label="Estado"
                value={getEstadoBadge(compra.estadoCompra)}
              />
              <DetailItem
                label="Proveedor"
                value={
                  <div>
                    <div>{compra.proveedor.nombreEmpresa}</div>
                    <div className="text-sm text-gray-500">
                      RUC/NIF: {compra.proveedor.numeroIdentificacionFiscal}
                    </div>
                  </div>
                }
              />
              <DetailItem
                label="Contacto Proveedor"
                value={
                  <div>
                    <div>{compra.proveedor.contactoNombre}</div>
                    <div className="text-sm text-gray-500">
                      {compra.proveedor.telefono} | {compra.proveedor.email}
                    </div>
                  </div>
                }
              />
              <DetailItem
                label="Fecha de Orden"
                value={formatDate(compra.fechaOrden)}
              />
              <DetailItem
                label="Fecha Estimada de Llegada"
                value={formatDate(compra.fechaLlegadaEstimada)}
              />
              <DetailItem
                label="Fecha de Registro"
                value={formatDate(compra.fechaCreacion)}
              />
            </div>
          </div>

          {/* Productos de la Compra */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Productos Solicitados
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitado
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recibido
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Costo Unit.
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {compra.detalles.map((detalle) => (
                    <tr key={detalle.detalleCompraId}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {detalle.producto.codigo || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {detalle.producto.nombre}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-900">
                        {detalle.cantidadSolicitada}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span
                          className={`font-semibold ${
                            detalle.cantidadRecibida > 0
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {detalle.cantidadRecibida || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(detalle.costoUnitario)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(detalle.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-base font-bold border-t pt-2">
                  <span>Total Compra:</span>
                  <span className="text-indigo-600">
                    {formatCurrency(compra.totalCompra)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
