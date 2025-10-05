import * as z from "zod";

export const userFormSchema = z.object({
  nombres: z.string().min(1, "El nombre es requerido."),
  apellidoPaterno: z.string().min(1, "El apellido paterno es requerido."),
  apellidoMaterno: z.string().optional().nullable(),
  dni: z.string().regex(/^[0-9]{8}$/, "El DNI debe tener 8 dígitos numéricos."),
  correoElectronico: z.string().email("Correo electrónico no válido."),
  clave: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  celular: z.string().optional().nullable(),
  perfilesIds: z
    .array(z.number())
    .min(1, "Debes seleccionar al menos un perfil."),
});

export type UserFormData = z.infer<typeof userFormSchema>;

export interface IPerfil {
  perfilId: number;
  nombre: string;
}
