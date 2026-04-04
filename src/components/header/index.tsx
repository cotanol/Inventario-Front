import { useSidebar } from '@/components/ui/sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

import { useAuth } from '@/context/auth-context';
import profileImage from '@/assets/profile.webp';

interface HeaderProps {
  titulo: string;
}

const Header = ({ titulo }: HeaderProps) => {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/75 bg-white/90 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-slate-900 sm:text-3xl">
              {titulo}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white px-3 py-2 shadow-sm">
          <img
            src={profileImage}
            alt="Usuario"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.nombre}</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">{user?.rol}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
