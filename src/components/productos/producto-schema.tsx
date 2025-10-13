import * as z from "zod";

// Schema para crear producto
export const productoFormSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es requerido.")
    .max(20, "El código no puede exceder 20 caracteres."),
  nombre: z
    .string()
    .min(1, "El nombre es requerido.")
    .max(100, "El nombre no puede exceder 100 caracteres."),
  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres.")
    .optional()
    .or(z.literal("")),
  precio: z
    .number()
    .min(0.01, "El precio debe ser mayor a 0.")
    .max(99999999.99, "El precio es demasiado alto."),
  grupoId: z.number().min(1, "Debe seleccionar un grupo."),
  marcaId: z.number().min(1, "Debe seleccionar una marca."),
});

export type ProductoFormData = z.infer<typeof productoFormSchema>;

// Schema para actualizar producto (todos los campos opcionales)
export const updateProductoFormSchema = productoFormSchema.partial();

export type UpdateProductoFormData = z.infer<typeof updateProductoFormSchema>;

// Interfaces para las relaciones
export interface IGrupo {
  grupoId: number;
  nombre: string;
  estadoRegistro: boolean;
  linea: {
    nombre: string;
  };
}

export interface IMarca {
  marcaId: number;
  nombre: string;
  estadoRegistro: boolean;
}
