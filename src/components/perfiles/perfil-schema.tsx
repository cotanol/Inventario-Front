import * as z from "zod";

// Interface para una Opcion de Menú individual
export interface IOpcionMenu {
  opcionMenuId: number;
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
  opcionesMenuLink: {
    opcionMenuId: number;
    orden: number;
    opcionMenu: IOpcionMenu;
  }[];
}

// Schema para el formulario de CREACIÓN
export const perfilFormSchema = z.object({
  nombre: z.string().min(1, "El nombre del perfil es requerido."),
  descripcion: z.string().optional().nullable(),
  opcionesMenu: z
    .array(
      z.object({
        opcionMenuId: z.number(),
        orden: z.number().min(0),
      })
    )
    .min(1, "Debes seleccionar al menos un permiso."),
});

export type PerfilFormData = z.infer<typeof perfilFormSchema>;

// Schema para ACTUALIZAR
export const updatePerfilFormSchema = perfilFormSchema.partial();
export type UpdatePerfilFormData = z.infer<typeof updatePerfilFormSchema>;
