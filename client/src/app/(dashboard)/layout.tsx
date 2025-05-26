"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <SidebarProvider>
    <div className="flex min-w-screen min-h-screen">
        <aside>
          <DashboardSidebar  />
        </aside>

      {/* Main content */}
        <div className={`flex flex-col flex-grow min-w-0  bg-amber-400 `}>
          <DashboardNavbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  </SidebarProvider>
  );
}
