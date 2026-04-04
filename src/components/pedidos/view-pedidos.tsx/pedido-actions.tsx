import { useState } from "react";
import {  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import useFetchApi from "@/hooks/use-fetch";
import type { IPedido } from "@/components/pedidos/pedido-schema";
import { getApiErrorMessage } from "@/lib/api-error";

interface PedidoActionsProps {
  pedido: IPedido;
  onStatusChange: (pedidoId: number, newEstado: string) => void;
  onNavigateEdit: () => void;
}

export const PedidoActions = ({
  pedido,
  onStatusChange,
  onNavigateEdit,
}: PedidoActionsProps) => {
  const { patch } = useFetchApi();
  const [isChanging, setIsChanging] = useState(false);

  const handleChangeEstado = async (nuevoEstado: string) => {
    setIsChanging(true);

    const actionPath =
      nuevoEstado === "COMPLETADO" ? "completar" : "cancelar";

    const changeEstadoPromise = async () => {
      await patch(`/pedidos/${pedido.pedidoId}/${actionPath}`, {});
      onStatusChange(pedido.pedidoId, nuevoEstado);
    };

    toast.promise(changeEstadoPromise(), {
      loading: `Cambiando estado a ${nuevoEstado}...`,
      success: `¡Pedido ${nuevoEstado.toLowerCase()} exitosamente! 🎉`,
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al cambiar el estado");
        return `Error: ${message}`;
      },
      finally: () => {
        setIsChanging(false);
      },
    });
  };

  const isPendiente = pedido.estadoPedido === "PENDIENTE";

  return (
    <>
      {/* Botón Editar - Solo disponible si está PENDIENTE */}
      <button
        onClick={onNavigateEdit}
        disabled={!isPendiente || isChanging}
        className={`p-2 rounded-lg transition ${
          isPendiente && !isChanging
            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            : "text-gray-300 cursor-not-allowed"
        }`}
        title={
          isPendiente
            ? "Editar pedido"
            : "Solo se pueden editar pedidos pendientes"
        }
      >
        <PencilSquareIcon className="w-5 h-5" />
      </button>

      {/* Botón Completar - Solo disponible si está PENDIENTE */}
      <button
        onClick={() => handleChangeEstado("COMPLETADO")}
        disabled={!isPendiente || isChanging}
        className={`p-2 rounded-lg transition ${
          isPendiente && !isChanging
            ? "text-green-600 hover:text-green-700 hover:bg-green-50"
            : "text-gray-300 cursor-not-allowed"
        }`}
        title={
          isPendiente
            ? "Completar pedido (descuenta inventario)"
            : "Solo se pueden completar pedidos pendientes"
        }
      >
        <CheckCircleIcon className="w-5 h-5" />
      </button>

      {/* Botón Cancelar - Solo disponible si está PENDIENTE */}
      <button
        onClick={() => handleChangeEstado("CANCELADO")}
        disabled={!isPendiente || isChanging}
        className={`p-2 rounded-lg transition ${
          isPendiente && !isChanging
            ? "text-red-600 hover:text-red-700 hover:bg-red-50"
            : "text-gray-300 cursor-not-allowed"
        }`}
        title={
          isPendiente
            ? "Cancelar pedido"
            : "Solo se pueden cancelar pedidos pendientes"
        }
      >
        <XCircleIcon className="w-5 h-5" />
      </button>
    </>
  );
};
