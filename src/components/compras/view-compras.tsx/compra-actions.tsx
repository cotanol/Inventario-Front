import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import useFetchApi from "@/hooks/use-fetch";
import type { ICompra } from "@/components/compras/compra-schema";
import { getApiErrorMessage } from "@/lib/api-error";

interface CompraActionsProps {
  compra: ICompra;
  onStatusChange: (compraId: number, newEstado: string) => void;
  onNavigateEdit: () => void;
}

export const CompraActions = ({
  compra,
  onStatusChange,
  onNavigateEdit,
}: CompraActionsProps) => {
  const { patch } = useFetchApi();
  const navigate = useNavigate();
  const [isChanging, setIsChanging] = useState(false);

  const handleConfirmarOrden = async () => {
    setIsChanging(true);

    const confirmarPromise = async () => {
      await patch(`/compras/${compra.compraId}/confirmar`, {
        fechaLlegadaEstimada: compra.fechaLlegadaEstimada,
      });
      onStatusChange(compra.compraId, "ORDENADO");
    };

    toast.promise(confirmarPromise(), {
      loading: "Confirmando orden de compra...",
      success: "¡Orden confirmada exitosamente! 🎉",
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al confirmar la orden");
        return `Error: ${message}`;
      },
      finally: () => {
        setIsChanging(false);
      },
    });
  };

  const handleMarcarEnTransito = async () => {
    setIsChanging(true);

    const transitoPromise = async () => {
      await patch(`/compras/${compra.compraId}/transito`, {
        fechaLlegadaEstimada: compra.fechaLlegadaEstimada,
      });
      onStatusChange(compra.compraId, "EN_TRANSITO");
    };

    toast.promise(transitoPromise(), {
      loading: "Marcando mercadería en tránsito...",
      success: "¡Mercadería en tránsito! 🚚",
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al marcar en tránsito");
        return `Error: ${message}`;
      },
      finally: () => {
        setIsChanging(false);
      },
    });
  };

  const handleRecibirMercaderia = async () => {
    // Navegar a la página de recepción de mercadería
    navigate(`/compras/recibir/${compra.compraId}`);
  };

  const handleCancelar = async () => {
    setIsChanging(true);

    const cancelarPromise = async () => {
      await patch(`/compras/${compra.compraId}/cancelar`, {});
      onStatusChange(compra.compraId, "CANCELADO");
    };

    toast.promise(cancelarPromise(), {
      loading: "Cancelando compra...",
      success: "Compra cancelada exitosamente",
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al cancelar la compra");
        return `Error: ${message}`;
      },
      finally: () => {
        setIsChanging(false);
      },
    });
  };

  const isBorrador = compra.estadoCompra === "BORRADOR";
  const isOrdenado = compra.estadoCompra === "ORDENADO";
  const isEnTransito = compra.estadoCompra === "EN_TRANSITO";
  const isCompletado = compra.estadoCompra === "COMPLETADO";
  const isCancelado = compra.estadoCompra === "CANCELADO";

  const puedeEditar = isBorrador || isOrdenado;

  return (
    <>
      {/* Botón Editar - BORRADOR u ORDENADO */}
      <button
        onClick={onNavigateEdit}
        disabled={!puedeEditar || isChanging}
        className={`p-2 rounded-lg transition ${
          puedeEditar && !isChanging
            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            : "text-gray-300 cursor-not-allowed"
        }`}
        title={
          puedeEditar
            ? isOrdenado
              ? "Editar fecha estimada de llegada"
              : "Editar compra"
            : "Solo se pueden editar compras en BORRADOR u ORDENADO"
        }
      >
        <PencilSquareIcon className="w-5 h-5" />
      </button>

      {/* Botón Confirmar Orden - Solo BORRADOR */}
      <button
        onClick={handleConfirmarOrden}
        disabled={!isBorrador || isChanging}
        className={`p-2 rounded-lg transition ${
          isBorrador && !isChanging
            ? "text-green-600 hover:text-green-700 hover:bg-green-50"
            : "text-gray-300 cursor-not-allowed"
        }`}
        title={
          isBorrador
            ? "Confirmar orden (genera PDF)"
            : "Solo se pueden confirmar compras en borrador"
        }
      >
        <ClipboardDocumentCheckIcon className="w-5 h-5" />
      </button>

      {/* Botón Marcar en Tránsito - Solo ORDENADO */}
      <button
        onClick={handleMarcarEnTransito}
        disabled={!isOrdenado || isChanging}
        className={`p-2 rounded-lg transition ${
          isOrdenado && !isChanging
            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            : "text-gray-300 cursor-not-allowed"
        }`}
        title={
          isOrdenado
            ? "Marcar en tránsito"
            : "Solo se pueden marcar en tránsito compras ordenadas"
        }
      >
        <TruckIcon className="w-5 h-5" />
      </button>

      {/* Botón Recibir Mercadería - Solo EN_TRANSITO */}
      <button
        onClick={handleRecibirMercaderia}
        disabled={!isEnTransito || isChanging}
        className={`p-2 rounded-lg transition ${
          isEnTransito && !isChanging
            ? "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            : "text-gray-300 cursor-not-allowed"
        }`}
        title={
          isEnTransito
            ? "Recibir mercadería (actualiza inventario)"
            : "Solo se puede recibir mercadería en tránsito"
        }
      >
        <CheckCircleIcon className="w-5 h-5" />
      </button>

      {/* Botón Cancelar - Solo BORRADOR, ORDENADO, EN_TRANSITO */}
      <button
        onClick={handleCancelar}
        disabled={isCompletado || isCancelado || isChanging}
        className={`p-2 rounded-lg transition ${
          !isCompletado && !isCancelado && !isChanging
            ? "text-red-600 hover:text-red-700 hover:bg-red-50"
            : "text-gray-300 cursor-not-allowed"
        }`}
        title={
          isCompletado
            ? "No se pueden cancelar compras completadas"
            : isCancelado
            ? "La compra ya está cancelada"
            : "Cancelar compra"
        }
      >
        <XCircleIcon className="w-5 h-5" />
      </button>
    </>
  );
};
