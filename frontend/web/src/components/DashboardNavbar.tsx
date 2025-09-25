"use client"

import { ThemeSelector } from "@/components/ThemeSelector"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { GlassNavbar } from "@/components/glass"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardNavbar() {
  return (
    <GlassNavbar className="h-16 px-4 flex items-center" sticky={true}>
      <div className="w-full flex items-center justify-between">
        {/* Left: Sidebar trigger + title */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-foreground hover:bg-card/10 rounded-md p-2 transition-colors" />
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        </div>

        {/* Right: Theme selector + Profile dropdown */}
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <ProfileDropdown />
        </div>
      </div>
    </GlassNavbar>
  );
}