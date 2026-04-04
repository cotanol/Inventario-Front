import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import useFetchApi from "@/hooks/use-fetch";
import Header from "@/components/header";
import { RoleForm } from "@/components/roles/role-form";
import type { IRol, IRolePermission } from "@/components/roles/role-schema";
import { MODULE_PERMISSIONS } from "@/lib/permissions";
import { getApiErrorMessage } from "@/lib/api-error";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  descripcion: z.string().optional().nullable(),
  permisos: z
    .array(z.string())
    .min(1, "Debes seleccionar al menos un permiso."),
});

const EditRolePage = () => {
  const { id } = useParams<{ id: string }>();
  const { get, patch } = useFetchApi();
  const navigate = useNavigate();
  const [permisos, setPermisos] = useState<IRolePermission[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm({ resolver: zodResolver(formSchema) });

  const loadInitialData = useCallback(async () => {
    if (!id) return;
    try {
      const rolData = await get<IRol>(`/auth/roles/${id}`);
      form.reset({
        nombre: rolData.nombre,
        descripcion: rolData.descripcion,
        permisos: rolData.permisos,
      });
      setPermisos(MODULE_PERMISSIONS.map((nombre) => ({ nombre })));
    } catch {
      setApiError("No se pudieron cargar los datos para editar.");
    } finally {
      setIsLoadingData(false);
    }
  }, [id, get, form]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id) return;
    const payload = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      permisos: values.permisos,
    };
    toast.promise(patch(`/auth/roles/${id}`, payload), {
      loading: "Actualizando...",
      success: () => {
        setTimeout(() => navigate("/roles"), 1000);
        return "¡Rol actualizado!";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al actualizar");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  if (isLoadingData)
    return (
      <div>
        <Header titulo="Roles" />
        <div className="p-6">Cargando...</div>
      </div>
    );

  return (
    <div>
      <Header titulo="Roles" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Editando Rol</h2>
        <div className="bg-white py-12 px-20 rounded-lg shadow-md">
          <RoleForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={form.formState.isSubmitting}
            apiError={apiError}
            onCancel={() => navigate("/roles")}
            submitButtonText="Actualizar Rol"
            permisosDisponibles={permisos}
          />
        </div>
      </div>
    </div>
  );
};
export default EditRolePage;
