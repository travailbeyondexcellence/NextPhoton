"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="grow flex flex-col min-w-0 bg-blue-100">
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <div className="grow flex flex-col min-w-0">
          <DashboardNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
      </SidebarProvider>
      </div>
  );
}
