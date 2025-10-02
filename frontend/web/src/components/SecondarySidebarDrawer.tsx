"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { cn } from "@/lib/utils"
import { useStore } from "@/statestore/store"

interface SecondarySidebarDrawerProps {
  className?: string
}

export function SecondarySidebarDrawer({ className }: SecondarySidebarDrawerProps) {
  const router = useRouter()
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
          "theme-backdrop-blur border-r border-sidebar-border/30",
          "transition-transform duration-300 ease-in-out",
          "focus:outline-none",
          isSecondarySidebarOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        style={{
          background: `linear-gradient(135deg, 
            rgb(var(--sidebar-gradient-from) / var(--sidebar-gradient-opacity, 1)) 0%, 
            rgb(var(--sidebar-gradient-via) / var(--sidebar-gradient-opacity, 1)) 50%, 
            rgb(var(--sidebar-gradient-to) / var(--sidebar-gradient-opacity, 1)) 100%)`,
          color: 'var(--sidebar-text-color, inherit)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border/30">
          <h3 className="text-lg font-semibold">
            {getDrawerTitle(secondarySidebarContent)}
          </h3>
          <button
            onClick={closeSecondarySidebar}
            className="p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 ease-out hover:scale-110 group"
            aria-label="Close secondary sidebar"
          >
            <X size={20} className="opacity-75 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:rotate-90" />
          </button>
        </div>

        {/* Content */}
        <SimpleBar className="h-[calc(100vh-4rem)] w-full px-2" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          <div className="py-4">
            {renderSecondaryContent(secondarySidebarContent, router, closeSecondarySidebar)}
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
function renderSecondaryContent(content: string | null, router: any, closeSecondarySidebar: () => void) {
  if (!content) return null

  // This is where you'll add specific content for each menu type
  switch (content) {
    case "analytics":
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-foreground mb-3 px-3 uppercase tracking-wider bg-sidebar-accent/30 py-2 rounded-md theme-backdrop-blur">Performance Analytics</h4>
            <div className="space-y-1">
              <SecondaryMenuItem
                label="Overall Performance Dashboard"
                onClick={() => {
                  router.push('/admin/performance')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Individual Student Analytics"
                onClick={() => {
                  router.push('/admin/performance/individual-analytics')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Class-wise Performance"
                onClick={() => {
                  router.push('/admin/performance/class-performance')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Subject-wise Analytics"
                onClick={() => {
                  router.push('/admin/performance/subject-analytics')
                  closeSecondarySidebar()
                }}
              />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground mb-3 px-3 uppercase tracking-wider bg-sidebar-accent/30 py-2 rounded-md theme-backdrop-blur">Reports</h4>
            <div className="space-y-1">
              <SecondaryMenuItem
                label="Generate Performance Report"
                onClick={() => {
                  router.push('/admin/performance/generate-report')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Export Analytics Data"
                onClick={() => {
                  router.push('/admin/performance/export-data')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Custom Report Builder"
                onClick={() => {
                  router.push('/admin/performance/custom-report-builder')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Scheduled Reports"
                onClick={() => {
                  router.push('/admin/performance/scheduled-reports')
                  closeSecondarySidebar()
                }}
              />
            </div>
          </div>
        </div>
      )
    case "messaging":
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-foreground mb-3 px-3 uppercase tracking-wider bg-sidebar-accent/30 py-2 rounded-md theme-backdrop-blur">Quick Actions</h4>
            <div className="space-y-1">
              <SecondaryMenuItem
                label="Compose New Message"
                onClick={() => {
                  router.push('/admin/Notifications/compose-message')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Broadcast to All"
                onClick={() => {
                  router.push('/admin/Notifications/broadcast')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Message Templates"
                onClick={() => {
                  router.push('/admin/Notifications/templates')
                  closeSecondarySidebar()
                }}
              />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground mb-3 px-3 uppercase tracking-wider bg-sidebar-accent/30 py-2 rounded-md theme-backdrop-blur">Message Management</h4>
            <div className="space-y-1">
              <SecondaryMenuItem
                label="Sent Messages"
                onClick={() => {
                  router.push('/admin/Notifications/sent-messages')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Scheduled Messages"
                onClick={() => {
                  router.push('/admin/Notifications/scheduled-messages')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Message History"
                onClick={() => {
                  router.push('/admin/Notifications/message-history')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Notification Settings"
                onClick={() => {
                  router.push('/admin/Notifications/settings')
                  closeSecondarySidebar()
                }}
              />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground mb-3 px-3 uppercase tracking-wider bg-sidebar-accent/30 py-2 rounded-md theme-backdrop-blur">Recipients</h4>
            <div className="space-y-1">
              <SecondaryMenuItem
                label="Message to Educators"
                onClick={() => {
                  router.push('/admin/Notifications/message-educators')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Message to Learners"
                onClick={() => {
                  router.push('/admin/Notifications/message-learners')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Message to Guardians"
                onClick={() => {
                  router.push('/admin/Notifications/message-guardians')
                  closeSecondarySidebar()
                }}
              />
              <SecondaryMenuItem
                label="Create Groups"
                onClick={() => {
                  router.push('/admin/Notifications/create-groups')
                  closeSecondarySidebar()
                }}
              />
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
        "w-full text-left px-4 py-2 rounded-md text-xs font-normal",
        "transition-all duration-200 ease-out",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.01] hover:shadow-sm",
        "text-muted-foreground hover:text-sidebar-accent-foreground",
        "hover:translate-x-1 border-l-2 border-transparent hover:border-sidebar-accent",
        "ml-2"
      )}
    >
      {label}
    </button>
  )
}