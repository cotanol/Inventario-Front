// src/components/Header.tsx

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRightOnRectangleIcon, // Icono más apropiado para logout
  UserCircleIcon, // Icono para ver perfil
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import profileImage from "../../assets/profile.webp";

interface HeaderProps {
  titulo: string;
}

const Header = ({ titulo }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowDropdown(false);

    const logoutPromise = logout();

    try {
      await toast.promise(logoutPromise, {
        loading: "Cerrando sesión...",
        success: "¡Hasta luego! Sesión cerrada correctamente 👋",
        error: (err) => {
          const errorMessage = err?.message || "Error al cerrar sesión";
          return `Error: ${errorMessage}`;
        },
      });
      navigate("/login");
    } catch (error) {
      // El error ya fue manejado en el toast
      console.error("Logout failed", error);
    }
  };

  return (
    // 1. Contenedor principal del header
    <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
      {/* Título de la página a la izquierda */}
      <h1 className="text-3xl font-bold text-gray-900">{titulo}</h1>

      {/* Contenedor de los elementos de la derecha */}
      <div className="flex items-center gap-6">
        {/* Ícono de Notificaciones */}
        {/* <button className="text-gray-500 hover:text-gray-800 transition-colors">
          <BellIcon className="w-6 h-6" />
        </button> */}

        {/* Botón de perfil con dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={profileImage}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
            />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">
                {user?.nombres}
              </p>
              <p className="text-xs text-gray-500">{user?.perfiles[0]}</p>
            </div>
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </button>

          {/* 2. El Dropdown corregido */}
          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="p-2">
                <Link
                  to="/perfil"
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <UserCircleIcon className="w-5 h-5 text-gray-500" />
                  Ver perfil
                </Link>
              </div>

              <div className="border-t border-gray-100"></div>

              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
