"use client"

import { ThemeSelector } from "@/components/ThemeSelector"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { GlassNavbar } from "@/components/glass"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardNavbar() {
  return (
    <div 
      className="h-16 w-full border-b border-white/10 backdrop-blur-xl"
      style={{
        background: `linear-gradient(135deg, rgb(var(--dashboard-header-gradient-from)) 0%, rgb(var(--dashboard-header-gradient-via)) 50%, rgb(var(--dashboard-header-gradient-to)) 100%)`
      }}
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left: Sidebar trigger + title */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-foreground hover:bg-white/5 rounded-md p-2 transition-colors" />
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
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