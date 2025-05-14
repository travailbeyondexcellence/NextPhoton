"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"
import { UserButton } from "@clerk/nextjs"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useState } from "react"

interface NavbarProps {
  onMenuClick?: () => void
}

export function DashboardNavbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="w-full h-16 bg-yellow-200 border border-red-500 px-4 flex items-center justify-between"
>
      {/* Left: Sidebar trigger + title */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile menu (optional) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <SidebarTrigger />
        <h2 className="text-lg font-semibold truncate">Dashboard</h2>
      </div>

      {/* Right: Theme, notifications, profile */}
      <div className="flex items-center gap-4 shrink-0">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <UserButton 
          afterSignOutUrl="/"
          signInUrl="/sign-in"
          appearance={{ elements: { avatarBox: "h-8 w-8" } }}
        />
      </div>
    </header>
  );
}
