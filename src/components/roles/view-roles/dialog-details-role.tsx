import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { IRol } from "../role-schema";

interface DialogPerfilDetailsProps {
  perfil: IRol | null;
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
  <div className="mb-4">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base font-semibold text-gray-800">{value || "N/A"}</p>
  </div>
);

export const DialogRoleDetails = ({
  perfil,
  isOpen,
  onClose,
}: DialogPerfilDetailsProps) => {
  if (!perfil) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles del Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 py-4">
          <div>
            <DetailItem label="ID Rol" value={perfil.rolId} />
            <DetailItem label="Nombre del Rol" value={perfil.nombre} />
            <DetailItem label="Descripción" value={perfil.descripcion} />
            <DetailItem
              label="Estado"
              value={
                <span
                  className={
                    perfil.estadoRegistro ? "text-green-600" : "text-red-600"
                  }
                >
                  {perfil.estadoRegistro ? "Activo" : "Inactivo"}
                </span>
              }
            />
          </div>
          <div>
            <DetailItem
              label="Permisos Asignados"
              value={
                perfil.permisos.length > 0 ? (
                  <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md max-h-48 overflow-y-auto border">
                    {perfil.permisos
                      .sort() // Ordenar alfabéticamente
                      .map((nombre) => (
                        <li key={nombre} className="text-sm">
                          {nombre}
                        </li>
                      ))}
                  </ul>
                ) : (
                  "Sin permisos asignados."
                )
              }
            />
          </div>
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
