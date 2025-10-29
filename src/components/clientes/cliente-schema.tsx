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
  provincia: string;
  distrito: string;
  vendedorId?: number;
  vendedor?: {
    vendedorId: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
  estadoRegistro: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

// Schema para el formulario de CREACIÓN de cliente
export const clienteFormSchema = z.object({
  nombre: z.string().min(1, "El nombre o razón social es requerido."),
  ruc: z
    .string()
    .refine((val) => val.startsWith("10") || val.startsWith("20"), {
      message: "El RUC debe empezar con '10' o '20'.",
    })
    .length(11, "El RUC debe tener exactamente 11 dígitos.")
    .regex(/^[0-9]{11}$/, "El RUC solo debe contener números."),
  direccion: z.string().min(1, "La dirección es requerida."),
  telefono: z.string().optional().nullable(),
  email: z.string().email("El formato del correo no es válido."),
  clasificacion: z.string().min(1, "La clasificación es requerida."),
  departamento: z.string().min(1, "El departamento es requerido."),
  provincia: z.string().min(1, "La provincia es requerida."),
  distrito: z.string().min(1, "El distrito es requerido."),
  vendedorId: z.number().min(1, "Debes seleccionar un vendedor."),
});

export type ClienteFormData = z.infer<typeof clienteFormSchema>;

// Schema para ACTUALIZAR un cliente (todos los campos son opcionales)
export const updateClienteFormSchema = clienteFormSchema.partial();

export type UpdateClienteFormData = z.infer<typeof updateClienteFormSchema>;
