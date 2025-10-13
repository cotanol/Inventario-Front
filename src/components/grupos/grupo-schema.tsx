import * as z from "zod";

// Schema para crear grupo
export const grupoFormSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido.")
    .max(50, "El nombre no puede exceder 50 caracteres."),
  lineaId: z.number().min(1, "Debe seleccionar una línea."),
});

export type GrupoFormData = z.infer<typeof grupoFormSchema>;

// Schema para actualizar grupo (todos los campos opcionales)
export const updateGrupoFormSchema = grupoFormSchema.partial();

export type UpdateGrupoFormData = z.infer<typeof updateGrupoFormSchema>;

// Interface para líneas
export interface ILinea {
  lineaId: number;
  nombre: string;
  estadoRegistro: boolean;
}
