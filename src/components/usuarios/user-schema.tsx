import * as z from "zod";

// Schema para crear usuario
export const userFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  apellido: z.string().min(1, "El apellido es requerido."),
  correoElectronico: z
    .string()
    .email("Correo electrónico no válido."),
  clave: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  rolId: z.number().int().positive("Debes seleccionar un rol válido."),
});

export type UserFormData = z.infer<typeof userFormSchema>;

// Schema para actualizar usuario (sin clave, todos los campos opcionales)
export const updateUserFormSchema = userFormSchema
  .partial()
  .omit({ clave: true });

export type UpdateUserFormData = z.infer<typeof updateUserFormSchema>;

// Interface para roles
export interface IRol {
  rolId: number;
  nombre: string;
  estadoRegistro: boolean;
}
