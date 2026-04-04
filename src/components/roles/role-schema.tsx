import * as z from "zod";
import type { ModulePermission } from "@/lib/permissions";

// Interface para un permiso individual del rol
export interface IRolePermission {
  nombre: string;
}

// Interface principal para un Rol
export interface IRol {
  rolId: number;
  nombre: string;
  descripcion: string | null;
  estadoRegistro: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  permisos: ModulePermission[];
}

// Schema para el formulario de CREACIÓN
export const roleFormSchema = z.object({
  nombre: z.string().min(1, "El nombre del rol es requerido."),
  descripcion: z.string().optional().nullable(),
  permisos: z
    .array(z.string())
    .min(1, "Debes seleccionar al menos un permiso."),
});

export type RoleFormData = z.infer<typeof roleFormSchema>;

// Schema para ACTUALIZAR
export const updateRoleFormSchema = roleFormSchema.partial();
export type UpdateRoleFormData = z.infer<typeof updateRoleFormSchema>;
