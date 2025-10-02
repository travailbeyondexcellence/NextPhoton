"use client"

import { ThemeSelector } from "@/components/ThemeSelector"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { GlassNavbar } from "@/components/glass"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardNavbar() {
  return (
    <div 
      className="h-16 w-full border-b theme-border-glass theme-backdrop-blur relative z-40 dashboard-header-gradient"
    >
      <div className="h-full px-4 flex items-center justify-between" style={{ color: 'var(--dashboard-header-text-color, inherit)' }}>
        {/* Left: Sidebar trigger + title */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="theme-bg-glass-hover rounded-md p-2 transition-colors" />
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>

        {/* Right: Theme selector + Profile dropdown */}
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}