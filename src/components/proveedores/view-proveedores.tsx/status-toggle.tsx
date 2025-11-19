import { useState } from "react";
import { Switch } from "../../ui/switch";
import useFetchApi from "../../../hooks/use-fetch";
import { toast } from "sonner";

interface StatusToggleProps {
  proveedorId: number;
  initialStatus: boolean;
  onStatusChange: (proveedorId: number, newStatus: boolean) => void;
}

export function ProveedorStatusToggle({
  proveedorId,
  initialStatus,
  onStatusChange,
}: StatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { patch } = useFetchApi();

  const handleToggle = async (newStatus: boolean) => {
    setIsLoading(true);
    setStatus(newStatus); // UI optimista

    const updateStatusPromise = () =>
      patch(`/proveedores/${proveedorId}`, {
        estadoRegistro: newStatus,
      });

    try {
      await toast.promise(updateStatusPromise(), {
        loading: "Actualizando estado...",
        success: `Estado ${
          newStatus ? "activado" : "desactivado"
        } correctamente 🎉`,
        error: (err) => {
          const errorMessage =
            err.response?.data?.message || "Error al actualizar el estado";
          return `Error: ${
            Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
          }`;
        },
      });
      onStatusChange(proveedorId, newStatus);
    } catch (error) {
      setStatus(!newStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={status}
        onCheckedChange={handleToggle}
        disabled={isLoading}
        aria-label="Toggle proveedor status"
      />
    </div>
  );
}
