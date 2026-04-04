import {
  HomeIcon,
  UsersIcon, // Usuarios (Plural)
  ShieldCheckIcon, // Perfiles/Roles (Seguridad)
  CubeIcon, // Productos (Objeto físico)
  TagIcon, // Marcas (Etiquetas)
  QueueListIcon, // Líneas (Listas/Categorías)
  SwatchIcon, // Grupos (Variantes/Colores/Grupos)
  UserGroupIcon, // Clientes (Grupo de personas externo)
  IdentificationIcon, // Vendedores (Carnet/Staff)
  BuildingStorefrontIcon, // Proveedores (Negocio/Edificio)
  ClipboardDocumentListIcon, // Pedidos (Lista de documentos)
  ArchiveBoxArrowDownIcon, // Compras (Entrada de mercancía)
} from "@heroicons/react/24/outline";

import { NavLink } from "react-router-dom";
import logoImage from "../../assets/logo-image.png";
import { useAuth } from "@/context/auth-context";
import {
  hasRequiredPermissions,
  type ModulePermission,
} from "@/lib/permissions";

interface NavigationItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  requiredPermission?: ModulePermission;
}

const navigation: NavigationItem[] = [
  // --- Dashboard ---
  { name: "Dashboard", icon: HomeIcon, href: "/" },

  // --- Seguridad / Acceso ---
  {
    name: "Usuarios",
    icon: UsersIcon,
    href: "/usuarios",
    requiredPermission: "USUARIOS",
  },
  {
    name: "Roles",
    icon: ShieldCheckIcon,
    href: "/roles",
    requiredPermission: "ROLES",
  },

  // --- Inventario / Catálogo ---
  {
    name: "Productos",
    icon: CubeIcon,
    href: "/productos",
    requiredPermission: "PRODUCTOS",
  },
  {
    name: "Marcas",
    icon: TagIcon,
    href: "/marcas",
    requiredPermission: "MARCAS",
  },
  {
    name: "Líneas",
    icon: QueueListIcon,
    href: "/lineas",
    requiredPermission: "LINEAS",
  },
  {
    name: "Grupos",
    icon: SwatchIcon,
    href: "/grupos",
    requiredPermission: "GRUPOS",
  },

  // --- Terceros ---
  {
    name: "Clientes",
    icon: UserGroupIcon,
    href: "/clientes",
    requiredPermission: "CLIENTES",
  },
  {
    name: "Vendedores",
    icon: IdentificationIcon,
    href: "/vendedores",
    requiredPermission: "VENDEDORES",
  },
  {
    name: "Proveedores",
    icon: BuildingStorefrontIcon,
    href: "/proveedores",
    requiredPermission: "PROVEEDORES",
  },

  // --- Movimientos ---
  {
    name: "Pedidos",
    icon: ClipboardDocumentListIcon,
    href: "/pedidos",
    requiredPermission: "PEDIDOS",
  },
  {
    name: "Compras",
    icon: ArchiveBoxArrowDownIcon,
    href: "/compras",
    requiredPermission: "COMPRAS",
  },
];

export default function Sidebar() {
  const { user } = useAuth();

  const visibleNavigation = navigation.filter((item) => {
    if (!item.requiredPermission) {
      return true;
    }

    return hasRequiredPermissions(user?.permisos ?? [], [item.requiredPermission]);
  });

  return (
    <aside className="h-screen w-80 bg-sidebar-background border-r border-gray-200 flex flex-col justify-between relative">
      <div>
        <div className="flex items-center justify-center pt-8 pb-4">
          <img src={logoImage} alt="Logo-Pagina" className="w-30" />
        </div>

        <nav className="px-4 py-6 space-y-2">
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-6 py-2 text-sm font-medium rounded-md transition cursor-pointer ${
                  isActive
                    ? "bg-secondary text-white"
                    : "text-gray-300 hover:bg-secondary hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
