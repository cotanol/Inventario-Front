import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import useFetchApi from "@/hooks/use-fetch";
import Header from "@/components/header";
import { PerfilForm } from "@/components/perfiles/perfil-form";
import type { IOpcionMenu } from "@/components/perfiles/perfil-schema";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  descripcion: z.string().optional().nullable(),
  opcionesMenuIds: z
    .array(z.number())
    .min(1, "Debes seleccionar al menos un permiso."),
});

const CreatePerfilPage = () => {
  const { get, post } = useFetchApi();
  const navigate = useNavigate();
  const [opcionesMenu, setOpcionesMenu] = useState<IOpcionMenu[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { nombre: "", descripcion: "", opcionesMenuIds: [] },
  });

  useEffect(() => {
    get<IOpcionMenu[]>("/auth/opciones-menu")
      .then(setOpcionesMenu)
      .catch(() => toast.error("No se pudieron cargar los permisos."));
  }, [get]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setApiError(null);
    const payload = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      opcionesMenu: values.opcionesMenuIds.map((id, index) => ({
        opcionMenuId: id,
        orden: (index + 1) * 10,
      })),
    };
    toast.promise(post("/auth/perfiles", payload), {
      loading: "Creando perfil...",
      success: () => {
        setTimeout(() => navigate("/perfiles"), 1000);
        return "¡Perfil creado exitosamente!";
      },
      error: (err) => {
        const msg = err.response?.data?.message || "Error al crear";
        setApiError(Array.isArray(msg) ? msg.join(", ") : msg);
        return `Error: ${msg}`;
      },
    });
  }

  return (
    <div>
      <Header titulo="Perfiles" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Crear Nuevo Perfil</h2>
        <div className="bg-white py-12 px-20 rounded-lg shadow-md">
          <PerfilForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={form.formState.isSubmitting}
            apiError={apiError}
            onCancel={() => navigate("/perfiles")}
            opcionesMenuDisponibles={opcionesMenu}
          />
        </div>
      </div>
    </div>
  );
};
export default CreatePerfilPage;
