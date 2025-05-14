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
    <header className="w-full h-16 border-b bg-background px-4 flex items-center">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Left: Sidebar toggle + page title */}
      <div className="flex items-center space-x-4 flex-1">
        <SidebarTrigger />
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
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
