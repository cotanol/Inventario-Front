import * as z from "zod";

// Schema para crear usuario
export const userFormSchema = z.object({
  nombres: z.string().min(1, "El nombre es requerido."),
  apellidoPaterno: z.string().min(1, "El apellido paterno es requerido."),
  apellidoMaterno: z.string().optional().nullable(),
  dni: z.string().regex(/^[0-9]{8}$/, "El DNI debe tener 8 dígitos numéricos."),
  correoElectronico: z.string().email("Correo electrónico no válido."),
  clave: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  celular: z.string().optional().nullable(),
  perfilesIds: z.number().int().positive("Debes seleccionar un perfil válido."),
});

export type UserFormData = z.infer<typeof userFormSchema>;

// Schema para actualizar usuario (sin clave, todos los campos opcionales)
export const updateUserFormSchema = userFormSchema
  .partial()
  .omit({ clave: true });

export type UpdateUserFormData = z.infer<typeof updateUserFormSchema>;

// Interface para perfiles
export interface IPerfil {
  perfilId: number;
  nombre: string;
  estadoRegistro: boolean;
}
