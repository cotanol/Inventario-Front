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
import type { IProveedor } from "../proveedor-schema";

interface DialogProveedorDetailsProps {
  proveedor: IProveedor | null;
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

export const DialogProveedorDetails = ({
  proveedor,
  isOpen,
  onClose,
}: DialogProveedorDetailsProps) => {
  if (!proveedor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles del Proveedor
          </DialogTitle>
          <DialogDescription>
            Información completa del proveedor seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <DetailItem label="ID Proveedor" value={proveedor.proveedorId} />
          <DetailItem
            label="Nombre de la Empresa"
            value={proveedor.nombreEmpresa}
          />
          <DetailItem
            label="RUC / Tax ID"
            value={proveedor.numeroIdentificacionFiscal}
          />
          <DetailItem label="País" value={proveedor.pais} />
          <DetailItem
            label="Contacto"
            value={proveedor.contactoNombre || "N/A"}
          />
          <DetailItem label="Teléfono" value={proveedor.telefono || "N/A"} />
          <DetailItem label="Email" value={proveedor.email || "N/A"} />
          <DetailItem label="Dirección" value={proveedor.direccion || "N/A"} />
          <DetailItem
            label="Estado"
            value={
              <span
                className={
                  proveedor.estadoRegistro ? "text-green-600" : "text-red-600"
                }
              >
                {proveedor.estadoRegistro ? "Activo" : "Inactivo"}
              </span>
            }
          />
          <DetailItem
            label="Fecha de Registro"
            value={new Date(proveedor.fechaCreacion).toLocaleString("es-ES")}
          />
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
