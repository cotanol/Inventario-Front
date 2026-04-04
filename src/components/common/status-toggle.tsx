import { useState } from "react";
import { toast } from "sonner";

import useFetchApi from "@/hooks/use-fetch";
import { getApiErrorMessage } from "@/lib/api-error";
import { Switch } from "@/components/ui/switch";

interface StatusToggleProps {
  entityId: number;
  endpoint: string;
  initialStatus: boolean;
  onStatusChange: (entityId: number, newStatus: boolean) => void;
  ariaLabel: string;
}

export function CommonStatusToggle({
  entityId,
  endpoint,
  initialStatus,
  onStatusChange,
  ariaLabel,
}: StatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { patch } = useFetchApi();

  const handleToggle = async (newStatus: boolean) => {
    setIsLoading(true);
    setStatus(newStatus);

    const updateStatusPromise = () =>
      patch(endpoint, {
        estadoRegistro: newStatus,
      });

    try {
      await toast.promise(updateStatusPromise(), {
        loading: "Actualizando estado...",
        success: `Estado ${
          newStatus ? "activado" : "desactivado"
        } correctamente 🎉`,
        error: (err) => {
          const message = getApiErrorMessage(err, "Error al actualizar el estado");
          return `Error: ${message}`;
        },
      });

      onStatusChange(entityId, newStatus);
    } catch {
      setStatus(!newStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Switch
      checked={status}
      onCheckedChange={handleToggle}
      disabled={isLoading}
      aria-label={ariaLabel}
    />
  );
}
