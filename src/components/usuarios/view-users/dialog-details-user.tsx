import React from "react";

// --- Shadcn UI Imports ---
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

// Se asume que la interfaz User se exportará desde el AuthContext
import type { User } from "../../../context/auth-context";

interface DialogUserDetailsProps {
  user: User | null; // El usuario a mostrar, o null si no hay ninguno seleccionado
  isOpen: boolean; // Controla si el dialog está visible
  onClose: () => void; // Función para cerrar el dialog
}

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base font-semibold text-gray-800">{value || "N/A"}</p>
  </div>
);

export const DialogUserDetails = ({
  user,
  isOpen,
  onClose,
}: DialogUserDetailsProps) => {
  // Si no hay un usuario seleccionado, no renderizamos nada.
  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles del Usuario
          </DialogTitle>
          <DialogDescription>
            Información completa del usuario seleccionado.
          </DialogDescription>
        </DialogHeader>

        {/* Cuerpo del Dialog con layout de 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <DetailItem label="ID de Usuario" value={user.usuarioId} />
          <DetailItem label="Nombres" value={user.nombres} />
          <DetailItem label="Apellido Paterno" value={user.apellidoPaterno} />
          <DetailItem
            label="Apellido Materno"
            value={user.apellidoMaterno || "N/A"}
          />
          <DetailItem label="DNI" value={user.dni} />
          <DetailItem
            label="Correo Electrónico"
            value={user.correoElectronico}
          />
          <DetailItem label="Celular" value={user.celular || "N/A"} />
          <DetailItem
            label="Estado"
            value={
              <span
                className={
                  user.estadoRegistro ? "text-green-600" : "text-red-600"
                }
              >
                {user.estadoRegistro ? "Activo" : "Inactivo"}
              </span>
            }
          />
          <DetailItem
            label="Perfiles Asignados"
            value={user.perfiles.join(", ")}
          />
          <DetailItem
            label="Fecha de Creación"
            value={new Date(user.fechaCreacion).toLocaleString()}
          />
          <DetailItem
            label="Fecha de Modificación"
            value={new Date(user.fechaModificacion).toLocaleString()}
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
