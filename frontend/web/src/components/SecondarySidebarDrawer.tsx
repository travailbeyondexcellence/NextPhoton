"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { cn } from "@/lib/utils"
import { useStore } from "@/statestore/store"

interface SecondarySidebarDrawerProps {
  className?: string
}

export function SecondarySidebarDrawer({ className }: SecondarySidebarDrawerProps) {
  const {
    isSecondarySidebarOpen,
    secondarySidebarContent,
    closeSecondarySidebar,
  } = useStore()

  const drawerRef = useRef<HTMLDivElement>(null)

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSecondarySidebarOpen) {
        closeSecondarySidebar()
      }
    }

    if (isSecondarySidebarOpen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = ''
    }
  }, [isSecondarySidebarOpen, closeSecondarySidebar])

  // Focus trap management
  useEffect(() => {
    if (isSecondarySidebarOpen && drawerRef.current) {
      drawerRef.current.focus()
    }
  }, [isSecondarySidebarOpen])

  if (!isSecondarySidebarOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={closeSecondarySidebar}
        aria-hidden="true"
      />

      {/* Secondary Sidebar Drawer */}
      <aside
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Secondary options"
        className={cn(
          "fixed top-0 left-72 h-screen w-72 z-[60]",
          "bg-white/5 backdrop-blur-xl border-r border-white/10",
          "transition-transform duration-300 ease-in-out",
          "focus:outline-none",
          isSecondarySidebarOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-foreground">
            {getDrawerTitle(secondarySidebarContent)}
          </h3>
          <button
            onClick={closeSecondarySidebar}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Close secondary sidebar"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <SimpleBar className="h-[calc(100vh-4rem)] w-full px-2" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          <div className="py-4">
            {renderSecondaryContent(secondarySidebarContent)}
          </div>
        </SimpleBar>
      </aside>
    </>
  )
}

// Helper function to get drawer title based on content type
function getDrawerTitle(content: string | null): string {
  if (!content) return "Options"
  
  const titleMap: Record<string, string> = {
    analytics: "Analytics Options",
    messaging: "Messaging Options",
    resources: "Resource Management",
    settings: "Advanced Settings",
    // Add more mappings as needed
  }
  
  return titleMap[content] || "Options"
}

// Helper function to render content based on content type
function renderSecondaryContent(content: string | null) {
  if (!content) return null

  // This is where you'll add specific content for each menu type
  switch (content) {
    case "analytics":
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 px-3">Performance Analytics</h4>
            <div className="space-y-1">
              <SecondaryMenuItem label="Overall Performance Dashboard" />
              <SecondaryMenuItem label="Individual Student Analytics" />
              <SecondaryMenuItem label="Class-wise Performance" />
              <SecondaryMenuItem label="Subject-wise Analytics" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 px-3">Reports</h4>
            <div className="space-y-1">
              <SecondaryMenuItem label="Generate Performance Report" />
              <SecondaryMenuItem label="Export Analytics Data" />
              <SecondaryMenuItem label="Custom Report Builder" />
              <SecondaryMenuItem label="Scheduled Reports" />
            </div>
          </div>
        </div>
      )
    case "messaging":
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 px-3">Quick Actions</h4>
            <div className="space-y-1">
              <SecondaryMenuItem label="Compose New Message" />
              <SecondaryMenuItem label="Broadcast to All" />
              <SecondaryMenuItem label="Message Templates" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 px-3">Message Management</h4>
            <div className="space-y-1">
              <SecondaryMenuItem label="Sent Messages" />
              <SecondaryMenuItem label="Scheduled Messages" />
              <SecondaryMenuItem label="Message History" />
              <SecondaryMenuItem label="Notification Settings" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 px-3">Recipients</h4>
            <div className="space-y-1">
              <SecondaryMenuItem label="Message to Educators" />
              <SecondaryMenuItem label="Message to Learners" />
              <SecondaryMenuItem label="Message to Guardians" />
              <SecondaryMenuItem label="Create Groups" />
            </div>
          </div>
        </div>
      )
    // Add more cases as needed
    default:
      return (
        <div className="text-muted-foreground text-sm px-2">
          No options available for this section.
        </div>
      )
  }
}

// Secondary menu item component
function SecondaryMenuItem({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-md text-sm",
        "hover:bg-white/10 transition-colors",
        "text-foreground/80 hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}