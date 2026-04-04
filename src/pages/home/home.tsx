import Header from "@/components/header";
import {
  ArchiveBoxArrowDownIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const metrics = [
  {
    title: "Productos Activos",
    value: "1,248",
    caption: "Catalogo actualizado",
    icon: CubeIcon,
  },
  {
    title: "Clientes",
    value: "326",
    caption: "Cuentas vigentes",
    icon: UserGroupIcon,
  },
  {
    title: "Pedidos Hoy",
    value: "58",
    caption: "Ritmo comercial",
    icon: ClipboardDocumentListIcon,
  },
  {
    title: "Compras en Curso",
    value: "17",
    caption: "En seguimiento",
    icon: ArchiveBoxArrowDownIcon,
  },
];

const HomePage = () => {
  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Dashboard" />
      <div className="content-wrap space-y-6">
        <section className="panel-card p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Bienvenido al centro de operaciones
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Supervisa el estado de inventario, movimientos y relaciones
            comerciales desde un solo lugar con enfoque rapido y operativo.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.title} className="panel-card p-5">
              <div className="mb-4 inline-flex rounded-xl bg-slate-100 p-2 text-slate-700">
                <metric.icon className="h-5 w-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                {metric.title}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {metric.value}
              </p>
              <p className="mt-1 text-sm text-slate-600">{metric.caption}</p>
            </article>
          ))}
        </section>

        <section className="panel-card p-6">
          <h3 className="text-xl font-bold text-slate-900">Siguiente accion</h3>
          <p className="mt-2 text-sm text-slate-600">
            Revisa pedidos pendientes y valida compras en transito para mantener
            el stock saludable durante la jornada.
          </p>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
