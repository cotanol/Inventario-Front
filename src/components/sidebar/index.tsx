// src/components/Sidebar.tsx
import {
  HomeIcon,
  // ClipboardDocumentIcon,
  // TagIcon,
  // ArrowDownTrayIcon,
  // ArrowUpTrayIcon,
  UserIcon,
  RectangleStackIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

import { NavLink } from "react-router-dom";
import logoImage from "../../assets/logo-image.png";

const navigation = [
  { name: "Home", icon: HomeIcon, href: "/" },
  { name: "Usuarios", icon: UserIcon, href: "/usuarios" },
  { name: "Perfiles", icon: UserIcon, href: "/perfiles" },
  { name: "Productos", icon: RectangleStackIcon, href: "/productos" },
  { name: "Marcas", icon: RectangleStackIcon, href: "/marcas" },
  { name: "Lineas", icon: RectangleStackIcon, href: "/lineas" },
  { name: "Grupos", icon: RectangleStackIcon, href: "/grupos" },
  { name: "Clientes", icon: RectangleStackIcon, href: "/clientes" },
  { name: "Vendedores", icon: UserIcon, href: "/vendedores" },
  { name: "Pedidos", icon: ShoppingCartIcon, href: "/pedidos" },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-sidebar-background border-r border-gray-200 flex flex-col justify-between relative">
      <div>
        <div className="flex items-center justify-center">
          <img src={logoImage} alt="Logo-Pagina" className="w-30" />
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-6 py-2 text-sm font-medium rounded-md transition cursor-pointer ${
                  isActive
                    ? "bg-secondary text-white" // 👈 Clases cuando el enlace está ACTIVO
                    : "text-gray-300 hover:bg-secondary hover:text-white" // Clases cuando está INACTIVO
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
