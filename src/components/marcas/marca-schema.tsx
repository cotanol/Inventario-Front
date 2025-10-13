import * as z from "zod";

// Schema para crear marca
export const marcaFormSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido.")
    .max(50, "El nombre no puede exceder 50 caracteres."),
});

export type MarcaFormData = z.infer<typeof marcaFormSchema>;

// Schema para actualizar marca (todos los campos opcionales)
export const updateMarcaFormSchema = marcaFormSchema.partial();

export type UpdateMarcaFormData = z.infer<typeof updateMarcaFormSchema>;
