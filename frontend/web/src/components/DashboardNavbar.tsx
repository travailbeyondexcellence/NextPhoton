"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "@/components/ThemeSelector"
import { GlassNavbar } from "@/components/glass"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useState } from "react"

export function DashboardNavbar() {
  return (
    <GlassNavbar className="h-16 px-4 flex items-center" sticky={true}>
      <div className="w-full flex items-center justify-between">
        {/* Left: Sidebar trigger + title */}
        <div className="flex items-center gap-4 min-w-0">
          {/* SidebarTrigger with glass effect */}
          <SidebarTrigger className="text-foreground hover:bg-card/10 rounded-md p-2 transition-colors" />
          <h2 className="text-lg font-semibold truncate text-foreground">Dashboard</h2>
        </div>

        {/* Right: Theme selector, notifications */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeSelector />
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-card/10 backdrop-blur-sm border border-border/20 hover:bg-card/15 flex items-center justify-center"
          >
            <Bell className="h-5 w-5 text-foreground" />
          </Button>
        </div>
      </div>
    </GlassNavbar>
  );
}