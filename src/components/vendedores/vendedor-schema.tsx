import * as z from "zod";

// Interface principal que representa al vendedor (como viene del backend)
export interface IVendedor {
  vendedorId: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  correo: string;
  estadoRegistro: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

// Schema para el formulario de CREACIÓN de vendedor
export const vendedorFormSchema = z.object({
  nombres: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  apellidoPaterno: z.string().min(2, "El apellido paterno es requerido."),
  apellidoMaterno: z.string().min(2, "El apellido materno es requerido."),
  dni: z
    .string()
    .length(8, "El DNI debe tener exactamente 8 dígitos.")
    .regex(/^[0-9]{8}$/, "El DNI solo debe contener números."),
  correo: z.string().email("El formato del correo no es válido."),
});

export type VendedorFormData = z.infer<typeof vendedorFormSchema>;

// Schema para ACTUALIZAR un vendedor (todos los campos son opcionales)
export const updateVendedorFormSchema = vendedorFormSchema.partial();

export type UpdateVendedorFormData = z.infer<typeof updateVendedorFormSchema>;
