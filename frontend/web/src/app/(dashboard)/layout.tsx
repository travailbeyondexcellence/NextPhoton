"use client";

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { SecondarySidebarDrawer } from "@/components/SecondarySidebarDrawer";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
    <div className="flex w-screen h-screen overflow-hidden relative">
      {/* Background gradient that extends to full content - handled by CSS */}
      <div className="fixed inset-0 z-0 bg-background" />
      
      {/* Sidebar with conditional glass effect */}
      <aside
        className={cn(
          "sidebar fixed top-0 left-0 h-screen p-0 w-72 z-50",
          "transition-transform duration-300 ease-in-out",
          "theme-backdrop-blur border-r theme-border-glass",
          "overflow-y-auto sidebar-theme-gradient",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <DashboardSidebar />
      </aside>

      {/* Main content area */}
      <div
        className={`
          relative w-screen flex flex-col min-h-screen
          transition-all duration-300
          ${open ? "ml-72" : "ml-0"}
        `}
      >
        <DashboardNavbar />
        <main className="flex-1 overflow-auto relative z-10">
          {/* Content with extended background */}
          <div className="relative min-h-full">
            {/* Main section background overlay for theme-based darkening */}
            <div className="main-section-overlay"></div>
            {/* Glass panel wrapper for content */}
            <div className="relative z-10 p-6">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Secondary Sidebar Drawer */}
      <SecondarySidebarDrawer />
    </div>
  );
}