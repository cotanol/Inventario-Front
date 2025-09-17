// src/components/Sidebar.tsx
import {
  HomeIcon,
  ClipboardDocumentIcon,
  TagIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { useNavigate, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import profileImage from "../../assets/profile.webp";
import { useAuth } from "../../context/auth-context";

const navigation = [
  { name: "Home", icon: HomeIcon, href: "/" },
  { name: "User", icon: ClipboardDocumentIcon, href: "/usuarios" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const profileRef = useRef(null);
  const { logout } = useAuth();

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !(profileRef.current as any).contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setShowDropdown(false);
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside className="h-screen w-64 bg-sidebar-background border-r border-gray-200 flex flex-col justify-between relative">
      <div>
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

      {/* Sección inferior (cuenta) */}
      <div className="px-4 py-6 space-y-2">
        {/* Botón de usuarios */}
        <button
          onClick={() => navigate("/usuarios")}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md text-white hover:bg-indigo-100 hover:text-[#6366f1] transition cursor-pointer"
        >
          <UserIcon className="w-5 h-5" />
          Usuarios
        </button>

        {/* Botón de perfil con dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-indigo-100 hover:text-[#6366f1] transition cursor-pointer"
          >
            <img
              src={profileImage}
              alt="User"
              className="w-9 h-9 rounded-full object-cover border border-gray-300"
            />
            <div className="text-left">
              <p className="text-sm font-semibold">Clarissa Dexter</p>
              <p className="text-xs text-gray-500">Chief Finance Officer</p>
            </div>
          </button>

          {/* Mini popup / dropdown */}
          {showDropdown && (
            <div className="absolute left-full bottom-0 mb-2 ml-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 px-2 py-2">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/perfil"); // 👈 redirige al perfil
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-[#6366f1] rounded-md transition cursor-pointer"
              >
                <UserIcon className="w-5 h-5" />
                Ver perfil
              </button>
              <button
                onClick={() => {
                  // setShowDropdown(false);
                  // console.log("Cerrar sesión");
                  // 👉 si quieres, aquí puedes hacer navigate("/login")
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-[#6366f1] rounded-md transition cursor-pointer"
              >
                <ArrowUpTrayIcon className="w-5 h-5 text-red-400" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
