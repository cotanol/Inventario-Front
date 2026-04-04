import {
  ArchiveBoxArrowDownIcon,
  ArrowLeftStartOnRectangleIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  HomeIcon,
  IdentificationIcon,
  QueueListIcon,
  ShieldCheckIcon,
  SwatchIcon,
  TagIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import logoImage from '@/assets/logo-image.png';
import { useAuth } from '@/context/auth-context';
import { hasRequiredPermissions, type ModulePermission } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPermission?: ModulePermission;
}

interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

const navigationGroups: NavigationGroup[] = [
  {
    label: 'General',
    items: [{ name: 'Dashboard', icon: HomeIcon, href: '/' }],
  },
  {
    label: 'Seguridad',
    items: [
      {
        name: 'Usuarios',
        icon: UsersIcon,
        href: '/usuarios',
        requiredPermission: 'USUARIOS',
      },
      {
        name: 'Roles',
        icon: ShieldCheckIcon,
        href: '/roles',
        requiredPermission: 'ROLES',
      },
    ],
  },
  {
    label: 'Catalogo',
    items: [
      {
        name: 'Productos',
        icon: CubeIcon,
        href: '/productos',
        requiredPermission: 'PRODUCTOS',
      },
      {
        name: 'Marcas',
        icon: TagIcon,
        href: '/marcas',
        requiredPermission: 'MARCAS',
      },
      {
        name: 'Lineas',
        icon: QueueListIcon,
        href: '/lineas',
        requiredPermission: 'LINEAS',
      },
      {
        name: 'Grupos',
        icon: SwatchIcon,
        href: '/grupos',
        requiredPermission: 'GRUPOS',
      },
    ],
  },
  {
    label: 'Relacion Comercial',
    items: [
      {
        name: 'Clientes',
        icon: UserGroupIcon,
        href: '/clientes',
        requiredPermission: 'CLIENTES',
      },
      {
        name: 'Vendedores',
        icon: IdentificationIcon,
        href: '/vendedores',
        requiredPermission: 'VENDEDORES',
      },
      {
        name: 'Proveedores',
        icon: BuildingStorefrontIcon,
        href: '/proveedores',
        requiredPermission: 'PROVEEDORES',
      },
    ],
  },
  {
    label: 'Movimientos',
    items: [
      {
        name: 'Pedidos',
        icon: ClipboardDocumentListIcon,
        href: '/pedidos',
        requiredPermission: 'PEDIDOS',
      },
      {
        name: 'Compras',
        icon: ArchiveBoxArrowDownIcon,
        href: '/compras',
        requiredPermission: 'COMPRAS',
      },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { setOpenMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const visibleGroups = useMemo(
    () =>
      navigationGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            if (!item.requiredPermission) {
              return true;
            }

            return hasRequiredPermissions(user?.permisos ?? [], [item.requiredPermission]);
          }),
        }))
        .filter((group) => group.items.length > 0),
    [user?.permisos],
  );

  const handleLogout = async () => {
    const logoutPromise = logout();

    try {
      await toast.promise(logoutPromise, {
        loading: 'Cerrando sesion...',
        success: 'Sesion cerrada correctamente',
        error: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : 'No se pudo cerrar sesion';

          return `Error: ${errorMessage}`;
        },
      });

      setOpenMobile(false);
      navigate('/login');
    } catch {
      return;
    }
  };

  return (
    <SidebarRoot
      collapsible="offcanvas"
      className="border-r-0 [&>[data-slot=sidebar-container]]:p-0 [&_[data-slot=sidebar-inner]]:rounded-none [&_[data-slot=sidebar-inner]]:border-r [&_[data-slot=sidebar-inner]]:border-white/10"
    >
      <SidebarHeader className="px-4 pb-3 pt-5">
        <div className="rounded-2xl border border-white/12 bg-white/5 p-4 backdrop-blur-sm">
          <img src={logoImage} alt="Logo DYM" className="mx-auto h-12 w-auto" />
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.24em] text-cyan-100/70">
            Control Comercial
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pb-3">
        {visibleGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-1 py-1">
            <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100/65">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.name}
                      isActive={
                        item.href === '/'
                          ? location.pathname === '/'
                          : location.pathname === item.href ||
                            location.pathname.startsWith(`${item.href}/`)
                      }
                      className={cn(
                        'sidebar-link rounded-xl px-3 py-2.5 text-sm font-semibold text-[color:var(--sidebar-link)] transition-all duration-200 hover:bg-white/10 hover:text-white',
                        (item.href === '/' && location.pathname === '/') ||
                          (item.href !== '/' &&
                            (location.pathname === item.href ||
                              location.pathname.startsWith(`${item.href}/`)))
                          ? 'bg-[color:var(--sidebar-active-solid)] text-[color:var(--sidebar-active-foreground)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] hover:bg-[color:var(--sidebar-active-solid)] hover:text-[color:var(--sidebar-active-foreground)]'
                          : '',
                      )}
                    >
                      <Link to={item.href} onClick={() => setOpenMobile(false)}>
                        <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4 pt-2">
        <SidebarSeparator className="mx-0 bg-white/20" />
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-3 rounded-xl border border-red-300/35 bg-red-500/16 px-4 py-2.5 text-sm font-semibold text-red-50 transition hover:bg-red-500/28"
        >
          <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
          Cerrar sesion
        </button>
      </SidebarFooter>
    </SidebarRoot>
  );
}
