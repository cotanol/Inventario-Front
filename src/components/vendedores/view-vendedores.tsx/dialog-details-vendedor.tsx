import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type IVendedor } from "../vendedor-schema";

interface DialogVendedorDetailsProps {
  isOpen: boolean;
  vendedor: IVendedor | null;
  onClose: () => void;
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

export const DialogVendedorDetails = ({
  isOpen,
  vendedor,
  onClose,
}: DialogVendedorDetailsProps) => {
  if (!vendedor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Detalles del Vendedor
          </DialogTitle>
          <DialogDescription>
            Información completa del vendedor seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <DetailItem label="ID Vendedor" value={vendedor.vendedorId} />
          <DetailItem label="Nombres" value={vendedor.nombres} />
          <DetailItem
            label="Apellido Paterno"
            value={vendedor.apellidoPaterno}
          />
          <DetailItem
            label="Apellido Materno"
            value={vendedor.apellidoMaterno}
          />
          <DetailItem label="DNI" value={vendedor.dni} />
          <DetailItem label="Correo Electrónico" value={vendedor.correo} />
          <DetailItem
            label="Estado"
            value={
              <span
                className={
                  vendedor.estadoRegistro ? "text-green-600" : "text-red-600"
                }
              >
                {vendedor.estadoRegistro ? "Activo" : "Inactivo"}
              </span>
            }
          />
          <DetailItem
            label="Fecha de Creación"
            value={new Date(vendedor.fechaCreacion).toLocaleString()}
          />
          <DetailItem
            label="Fecha de Modificación"
            value={new Date(vendedor.fechaModificacion).toLocaleString()}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
