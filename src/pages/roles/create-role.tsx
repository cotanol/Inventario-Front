import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import useFetchApi from "@/hooks/use-fetch";
import Header from "@/components/header";
import { RoleForm } from "@/components/roles/role-form";
import type { IRolePermission } from "@/components/roles/role-schema";
import { MODULE_PERMISSIONS } from "@/lib/permissions";
import { getApiErrorMessage } from "@/lib/api-error";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  descripcion: z.string().optional().nullable(),
  permisos: z
    .array(z.string())
    .min(1, "Debes seleccionar al menos un permiso."),
});

const CreateRolePage = () => {
  const { post } = useFetchApi();
  const navigate = useNavigate();
  const [permisos, setPermisos] = useState<IRolePermission[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { nombre: "", descripcion: "", permisos: [] },
  });

  useEffect(() => {
    setPermisos(MODULE_PERMISSIONS.map((nombre) => ({ nombre })));
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setApiError(null);
    const payload = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      permisos: values.permisos,
    };
    toast.promise(post("/auth/roles", payload), {
      loading: "Creando rol...",
      success: () => {
        setTimeout(() => navigate("/roles"), 1000);
        return "¡Rol creado exitosamente!";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al crear");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Roles" />
      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">Crear Nuevo Rol</h2>
        <div className="form-shell">
          <RoleForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={form.formState.isSubmitting}
            apiError={apiError}
            onCancel={() => navigate("/roles")}
            permisosDisponibles={permisos}
          />
        </div>
      </div>
    </div>
  );
};
export default CreateRolePage;

