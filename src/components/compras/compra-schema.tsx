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
    costoReferencial: number;
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
    contactoNombre: string;
    telefono: string;
    email: string;
    direccion: string;
    pais: string;
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
export const compraFormSchema = z
  .object({
    proveedorId: z.number().min(1, "Debes seleccionar un proveedor."),
    fechaOrden: z
      .string()
      .min(1, "La fecha de orden es requerida.")
      .refine(
        (fecha) => {
          const fechaSeleccionada = new Date(fecha);
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          fechaSeleccionada.setHours(0, 0, 0, 0);
          return fechaSeleccionada < hoy;
        },
        {
          message: "La fecha de orden solo puede ser hoy o anterior.",
        }
      ),
    fechaLlegadaEstimada: z
      .string()
      .optional()
      .refine(
        (fecha) => {
          if (!fecha || fecha === "") return true;
          const fechaSeleccionada = new Date(fecha);
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          fechaSeleccionada.setHours(0, 0, 0, 0);
          return fechaSeleccionada >= hoy;
        },
        {
          message: "La fecha estimada de llegada debe ser hoy o posterior.",
        }
      ),
    estadoCompra: z
      .enum(["BORRADOR", "ORDENADO", "EN_TRANSITO", "COMPLETADO", "CANCELADO"])
      .optional(),
    detalles: z
      .array(detalleCompraSchema)
      .min(1, "Debes agregar al menos un producto."),
  })
  .refine(
    (data) => {
      // Validación cruzada: si hay fecha estimada, debe ser posterior a fecha de orden
      if (data.fechaLlegadaEstimada && data.fechaLlegadaEstimada !== "") {
        const fechaOrden = new Date(data.fechaOrden);
        const fechaEstimada = new Date(data.fechaLlegadaEstimada);
        fechaOrden.setHours(0, 0, 0, 0);
        fechaEstimada.setHours(0, 0, 0, 0);
        return fechaEstimada >= fechaOrden;
      }
      return true;
    },
    {
      message:
        "La fecha estimada de llegada debe ser igual o posterior a la fecha de orden.",
      path: ["fechaLlegadaEstimada"],
    }
  );

export type CompraFormValues = z.infer<typeof compraFormSchema>;
