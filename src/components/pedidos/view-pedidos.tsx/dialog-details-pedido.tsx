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
import type { IPedido } from "../pedido-schema";

interface DialogPedidoDetailsProps {
  pedido: IPedido | null;
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

export const DialogPedidoDetails = ({
  pedido,
  open,
  onOpenChange,
}: DialogPedidoDetailsProps) => {
  if (!pedido) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      // Verificar si la fecha es válida
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
      PENDIENTE: "bg-yellow-100 text-yellow-800",
      COMPLETADO: "bg-green-100 text-green-800",
      CANCELADO: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
          badges[estado as keyof typeof badges]
        }`}
      >
        {estado}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles del Pedido #{pedido.pedidoId.toString().padStart(4, "0")}
          </DialogTitle>
          <DialogDescription>
            Información completa del pedido seleccionado.
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
                label="N° Pedido"
                value={`#${pedido.pedidoId.toString().padStart(4, "0")}`}
              />
              <DetailItem
                label="Estado"
                value={getEstadoBadge(pedido.estadoPedido)}
              />
              <DetailItem
                label="Cliente"
                value={
                  <div>
                    <div>{pedido.cliente.nombre}</div>
                    <div className="text-sm text-gray-500">
                      RUC: {pedido.cliente.ruc}
                    </div>
                  </div>
                }
              />
              <DetailItem
                label="Vendedor"
                value={`${pedido.vendedor.nombres} ${pedido.vendedor.apellidoPaterno} ${pedido.vendedor.apellidoMaterno}`}
              />
              <DetailItem
                label="Tipo de Pago"
                value={
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                      pedido.tipoPago === "CONTADO"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {pedido.tipoPago}
                  </span>
                }
              />
              <DetailItem
                label="Fecha de Registro"
                value={formatDate(pedido.fechaCreacion)}
              />
            </div>
          </div>

          {/* Productos del Pedido */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Productos
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
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pedido.detalles.map((detalle) => (
                    <tr key={detalle.detalleId}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {detalle.producto.codigo || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {detalle.producto.nombre}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-900">
                        {detalle.cantidad}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(detalle.precioUnitario)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(detalle.subtotalLinea)}
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
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">
                    {formatCurrency(pedido.totalNeto)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-indigo-600">
                    {formatCurrency(pedido.totalFinal)}
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
