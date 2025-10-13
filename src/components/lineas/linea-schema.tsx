import * as z from "zod";

// Schema para crear línea
export const lineaFormSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido.")
    .max(50, "El nombre no puede exceder 50 caracteres."),
});

export type LineaFormData = z.infer<typeof lineaFormSchema>;

// Schema para actualizar línea (todos los campos opcionales)
export const updateLineaFormSchema = lineaFormSchema.partial();

export type UpdateLineaFormData = z.infer<typeof updateLineaFormSchema>;
