import * as z from "zod";

// Interface para los detalles del pedido
export interface IDetallePedido {
  detalleId: number;
  productoId: number;
  producto: {
    productoId: number;
    codigo: string;
    nombre: string;
    precioVenta: number;
  };
  cantidad: number;
  precioUnitario: number;
  subtotalLinea: number;
}

// Interface principal que representa al pedido (como viene del backend)
export interface IPedido {
  pedidoId: number;
  clienteId: number;
  cliente: {
    clienteId: number;
    nombre: string;
    ruc: string;
  };
  vendedorId: number;
  vendedor: {
    vendedorId: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
  tipoPago: "CONTADO" | "CREDITO";
  totalNeto: number;
  totalFinal: number;
  urlPdf: string | null;
  estadoPedido: "PENDIENTE" | "COMPLETADO" | "CANCELADO";
  estadoRegistro: boolean;
  detalles: IDetallePedido[];
  fechaCreacion: string;
  fechaModificacion: string;
}

// Schema para cada detalle del pedido
const detalleSchema = z.object({
  productoId: z.number().min(1, "Debes seleccionar un producto."),
  cantidad: z.number().min(1, "La cantidad debe ser al menos 1."),
});

// Schema para el formulario de CREACIÓN de pedido
export const pedidoFormSchema = z.object({
  clienteId: z.number().min(1, "Debes seleccionar un cliente."),
  tipoPago: z.enum(["CONTADO", "CREDITO"] as const, {
    error: "Debes seleccionar un tipo de pago.",
  }),
  detalles: z
    .array(detalleSchema)
    .min(1, "Debes agregar al menos un producto al pedido."),
});

export type PedidoFormData = z.infer<typeof pedidoFormSchema>;

// Schema para ACTUALIZAR un pedido (todos los campos son opcionales)
export const updatePedidoFormSchema = pedidoFormSchema.partial();

export type UpdatePedidoFormData = z.infer<typeof updatePedidoFormSchema>;
