import * as z from "zod";

// Interface principal que representa al cliente (como viene del backend)
export interface ICliente {
  clienteId: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  clasificacion: string;
  departamento: string;
  distrito: string;
  estadoRegistro: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

// Schema para el formulario de CREACIÓN de cliente
export const clienteFormSchema = z.object({
  nombre: z.string().min(1, "El nombre o razón social es requerido."),
  ruc: z
    .string()
    .length(11, "El RUC debe tener exactamente 11 dígitos.")
    .regex(/^[0-9]{11}$/, "El RUC solo debe contener números."),
  direccion: z.string().min(1, "La dirección es requerida."),
  telefono: z.string().optional().nullable(),
  email: z.string().email("El formato del correo no es válido."),
  clasificacion: z.string().min(1, "La clasificación es requerida."),
  departamento: z.string().min(1, "El departamento es requerido."),
  distrito: z.string().min(1, "El distrito es requerido."),
});

export type ClienteFormData = z.infer<typeof clienteFormSchema>;

// Schema para ACTUALIZAR un cliente (todos los campos son opcionales)
export const updateClienteFormSchema = clienteFormSchema.partial();

export type UpdateClienteFormData = z.infer<typeof updateClienteFormSchema>;
