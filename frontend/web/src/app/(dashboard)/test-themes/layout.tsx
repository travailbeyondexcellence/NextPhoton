"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeSelector } from "@/components/ThemeSelector"

export default function TestThemesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const testRoutes = [
    { href: "/test-themes", label: "Overview", exact: true },
    { href: "/test-themes/gradients", label: "Gradients" },
    { href: "/test-themes/glass-components", label: "Glass Components" },
    { href: "/test-themes/sidebar", label: "Sidebar" },
    { href: "/test-themes/cards", label: "Cards" },
    { href: "/test-themes/buttons", label: "Buttons" },
    { href: "/test-themes/forms", label: "Forms" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Theme Testing Laboratory
              </h1>
              <p className="text-muted-foreground text-sm">
                Test and experiment with different theme components and configurations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Switch Theme:</span>
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {testRoutes.map((route) => {
              const isActive = route.exact 
                ? pathname === route.href 
                : pathname.startsWith(route.href) && route.href !== "/test-themes"
              
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                  )}
                >
                  {route.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  )
}