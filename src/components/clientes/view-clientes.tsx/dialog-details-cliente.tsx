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
import type { ICliente } from "../cliente-schema";

interface DialogClienteDetailsProps {
  cliente: ICliente | null;
  isOpen: boolean;
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

export const DialogClienteDetails = ({
  cliente,
  isOpen,
  onClose,
}: DialogClienteDetailsProps) => {
  if (!cliente) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles del Cliente
          </DialogTitle>
          <DialogDescription>
            Información completa del cliente seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <DetailItem label="ID Cliente" value={cliente.clienteId} />
          <DetailItem label="Nombre / Razón Social" value={cliente.nombre} />
          <DetailItem label="RUC" value={cliente.ruc} />
          <DetailItem label="Dirección" value={cliente.direccion} />
          <DetailItem label="Correo Electrónico" value={cliente.email} />
          <DetailItem label="Teléfono" value={cliente.telefono || "N/A"} />
          <DetailItem label="Clasificación" value={cliente.clasificacion} />
          <DetailItem label="Departamento" value={cliente.departamento} />
          <DetailItem label="Provincia" value={cliente.provincia} />
          <DetailItem label="Distrito" value={cliente.distrito} />
          <DetailItem
            label="Estado"
            value={
              <span
                className={
                  cliente.estadoRegistro ? "text-green-600" : "text-red-600"
                }
              >
                {cliente.estadoRegistro ? "Activo" : "Inactivo"}
              </span>
            }
          />
          <DetailItem
            label="Fecha de Creación"
            value={new Date(cliente.fechaCreacion).toLocaleString()}
          />
          <DetailItem
            label="Fecha de Modificación"
            value={new Date(cliente.fechaModificacion).toLocaleString()}
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
