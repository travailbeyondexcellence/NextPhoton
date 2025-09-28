"use client";

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { SecondarySidebarDrawer } from "@/components/SecondarySidebarDrawer";
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
          sidebar fixed top-0 left-0 h-screen p-0 w-72 z-50 
          transition-transform duration-300 ease-in-out
          backdrop-blur-xl border-r border-white/10
          overflow-y-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          background: `linear-gradient(135deg, 
            rgb(var(--sidebar-gradient-from) / var(--sidebar-gradient-opacity, 1)) 0%, 
            rgb(var(--sidebar-gradient-via) / var(--sidebar-gradient-opacity, 1)) 50%, 
            rgb(var(--sidebar-gradient-to) / var(--sidebar-gradient-opacity, 1)) 100%)`
        }}
      >
        <DashboardSidebar />
      </aside>

      {/* Main content area */}
      <div
        className={`
          w-screen flex flex-col min-h-screen 
          transition-all duration-300
          ${open ? "ml-72" : "ml-0"}
        `}
      >
        <DashboardNavbar />
        <main className="flex-1 p-6 overflow-auto relative z-10">
          {/* Main section background overlay for theme-based darkening */}
          <div className="main-section-overlay"></div>
          {/* Glass panel wrapper for content */}
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>

      {/* Secondary Sidebar Drawer */}
      <SecondarySidebarDrawer />
    </div>
  );
}