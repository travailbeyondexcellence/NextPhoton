"use client";

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { useState, useEffect } from "react";

// Outer wrapper with SidebarProvider
export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <SidebarProvider>
      <LayoutWithSidebar>{children}</LayoutWithSidebar>
    </SidebarProvider>
  );
}

// Layout with glassmorphism effects
function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Sidebar with glass effect */}
      <aside
        className={`
          sidebar fixed top-0 left-0 h-screen p-0 w-56 z-50 
          transition-transform duration-300 ease-in-out
          bg-card/10 backdrop-blur-xl border-r border-border/20
          custom-scrollbar scrollbar-thin overflow-y-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <DashboardSidebar />
      </aside>

      {/* Main content area */}
      <div
        className={`
          w-screen flex flex-col min-h-screen 
          transition-all duration-300
          ${open ? "ml-56" : "ml-0"}
        `}
      >
        <DashboardNavbar />
        <main className="flex-1 p-6 overflow-auto custom-scrollbar scrollbar-thin">
          {/* Glass panel wrapper for content */}
          <div className="relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}