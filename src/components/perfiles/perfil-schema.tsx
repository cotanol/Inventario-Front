import * as z from "zod";

// Interface para un Permiso individual
export interface IPermiso {
  permisoId: number;
  nombre: string;
  descripcion: string | null;
}

// Interface principal para un Perfil completo
export interface IPerfil {
  perfilId: number;
  nombre: string;
  descripcion: string | null;
  estadoRegistro: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
  permisosLink: {
    permisoId: number;
    orden: number;
    permiso: IPermiso;
  }[];
}

// Schema para el formulario de CREACIÓN
export const perfilFormSchema = z.object({
  nombre: z.string().min(1, "El nombre del perfil es requerido."),
  descripcion: z.string().optional().nullable(),
  permisos: z
    .array(
      z.object({
        permisoId: z.number(),
        orden: z.number().min(0),
      })
    )
    .min(1, "Debes seleccionar al menos un permiso."),
});

export type PerfilFormData = z.infer<typeof perfilFormSchema>;

// Schema para ACTUALIZAR
export const updatePerfilFormSchema = perfilFormSchema.partial();
export type UpdatePerfilFormData = z.infer<typeof updatePerfilFormSchema>;
