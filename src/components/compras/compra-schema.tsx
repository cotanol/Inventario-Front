import * as z from "zod";

// Interface para los detalles de la compra
export interface IDetalleCompra {
  detalleCompraId: number;
  productoId: number;
  producto: {
    productoId: number;
    codigo: string;
    nombre: string;
    precioVenta: number;
  };
  cantidadSolicitada: number;
  cantidadRecibida: number;
  costoUnitario: number;
  subtotal: number;
}

// Interface principal que representa la compra (como viene del backend)
export interface ICompra {
  compraId: number;
  proveedorId: number;
  proveedor: {
    proveedorId: number;
    nombreEmpresa: string;
    numeroIdentificacionFiscal: string;
  };
  fechaOrden: string;
  fechaLlegadaEstimada: string | null;
  estadoCompra:
    | "BORRADOR"
    | "ORDENADO"
    | "EN_TRANSITO"
    | "COMPLETADO"
    | "CANCELADO";
  totalCompra: number;
  urlPdf: string | null;
  estadoRegistro: boolean;
  detalles: IDetalleCompra[];
  fechaCreacion: string;
  fechaModificacion: string;
}

// Schema para cada detalle de la compra
const detalleCompraSchema = z.object({
  productoId: z.number().min(1, "Debes seleccionar un producto."),
  cantidadSolicitada: z.number().min(1, "La cantidad debe ser al menos 1."),
  costoUnitario: z.number().min(0.01, "El costo unitario debe ser mayor a 0."),
});

// Schema para el formulario de CREACIÓN de compra
export const compraFormSchema = z.object({
  proveedorId: z.number().min(1, "Debes seleccionar un proveedor."),
  fechaOrden: z.string().min(1, "La fecha de orden es requerida."),
  fechaLlegadaEstimada: z.string().optional(),
  estadoCompra: z
    .enum(["BORRADOR", "ORDENADO", "EN_TRANSITO", "COMPLETADO", "CANCELADO"])
    .optional(),
  detalles: z
    .array(detalleCompraSchema)
    .min(1, "Debes agregar al menos un producto."),
});

export type CompraFormValues = z.infer<typeof compraFormSchema>;
