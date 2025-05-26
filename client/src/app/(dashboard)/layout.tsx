"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <SidebarProvider>
    <div className="flex grow min-h-screen">
        <aside
          className={`bg-red-400 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'w-0' : 'w-64'
            } shrink-0`}
        >
          <DashboardSidebar hidden={isMobileMenuOpen} />
        </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 w-full bg-amber-400">
        <DashboardNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  </SidebarProvider>
  );
}
