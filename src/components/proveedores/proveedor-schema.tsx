import * as z from "zod";

// Interface principal que representa al proveedor (como viene del backend)
export interface IProveedor {
  proveedorId: number;
  nombreEmpresa: string;
  contactoNombre: string | null;
  telefono: string | null;
  email: string | null;
  numeroIdentificacionFiscal: string;
  direccion: string | null;
  pais: string;
  estadoRegistro: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

// Schema para el formulario de CREACIÓN/EDICIÓN de proveedor
export const proveedorFormSchema = z.object({
  nombreEmpresa: z.string().min(1, "El nombre de la empresa es requerido."),
  contactoNombre: z.string().optional(),
  telefono: z.string().optional(),
  email: z
    .string()
    .email("El formato del correo no es válido.")
    .optional()
    .or(z.literal("")),
  numeroIdentificacionFiscal: z
    .string()
    .min(1, "El número de identificación fiscal es requerido."),
  direccion: z.string().optional(),
  pais: z.string().min(1, "El país es requerido."),
});

export type ProveedorFormValues = z.infer<typeof proveedorFormSchema>;
