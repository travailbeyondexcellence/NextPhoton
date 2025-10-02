"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentTheme } from "@/lib/theme-utils"
import { useEffect, useState } from "react"

export default function TestThemesOverview() {
  const [currentTheme, setCurrentTheme] = useState<string>("")

  useEffect(() => {
    setCurrentTheme(getCurrentTheme())
  }, [])

  const testAreas = [
    {
      title: "Background Gradients",
      description: "Test and modify background gradient colors and effects",
      href: "/test-themes/gradients",
      icon: "🎨"
    },
    {
      title: "Glass Components",
      description: "Test glassmorphism effects, opacity, and blur settings",
      href: "/test-themes/glass-components", 
      icon: "🔍"
    },
    {
      title: "Sidebar Theming",
      description: "Test sidebar colors, hover states, and active indicators",
      href: "/test-themes/sidebar",
      icon: "📱"
    },
    {
      title: "Card Components",
      description: "Test card backgrounds, borders, and glass effects",
      href: "/test-themes/cards",
      icon: "🗃️"
    },
    {
      title: "Button Theming",
      description: "Test button colors, hover states, and variants",
      href: "/test-themes/buttons",
      icon: "🔘"
    },
    {
      title: "Form Elements",
      description: "Test input fields, form controls, and validation styles",
      href: "/test-themes/forms",
      icon: "📝"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Current Theme Info */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            Current Active Theme
          </CardTitle>
          <CardDescription>
            Currently using: <span className="font-mono font-medium text-primary">{currentTheme}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            All test components below will reflect the current theme settings. 
            Use the theme selector in the top navigation to switch themes.
          </p>
        </CardContent>
      </Card>

      {/* Test Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testAreas.map((area) => (
          <Card key={area.href} className="glass hover:glass-hover transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">{area.icon}</span>
                {area.title}
              </CardTitle>
              <CardDescription>{area.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={area.href}>
                  Test {area.title}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="font-bold text-primary">1.</span>
            <p>Navigate to specific test areas using the tabs above or cards below</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-primary">2.</span>
            <p>View current theme settings (static, non-editable)</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-primary">3.</span>
            <p>Experiment with the interactive controls</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-primary">4.</span>
            <p>Copy generated CSS to share with Claude for theme updates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}