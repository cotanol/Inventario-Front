import type { CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout() {
  return (
    <SidebarProvider
      defaultOpen
      style={{
        '--sidebar-width': '18.5rem',
        '--sidebar-width-mobile': '19rem',
      } as CSSProperties}
    >
      <div className="app-shell flex min-h-screen w-full overflow-hidden">
        <Sidebar />
        <SidebarInset className="relative flex flex-1 flex-col bg-transparent !m-0 !rounded-none !shadow-none">
          <main className="layout-main relative flex-1 flex flex-col overflow-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
