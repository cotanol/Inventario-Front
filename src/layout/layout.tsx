// src/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-[#f1f1f1]  overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
