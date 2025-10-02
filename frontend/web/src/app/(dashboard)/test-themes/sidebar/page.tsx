"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Home, Users, Settings } from "lucide-react"
import { getCurrentTheme, getTheme } from "@/lib/theme-utils"
import { toast } from "sonner"

export default function SidebarTestPage() {
  const [currentTheme, setCurrentTheme] = useState<string>("")
  const [currentColors, setCurrentColors] = useState({
    background: "",
    foreground: "",
    muted: "",
    accent: "",
    border: "",
  })
  
  const [experimentalColors, setExperimentalColors] = useState({
    background: "#1f0813",
    foreground: "#fdf2f8",
    muted: "#3d1424",
    accent: "#f9a8d4",
    border: "#f9a8d4",
  })

  useEffect(() => {
    const themeName = getCurrentTheme()
    setCurrentTheme(themeName)
    
    const theme = getTheme(themeName as any)
    if (theme?.colors) {
      const colors = {
        background: theme.colors.background || "",
        foreground: theme.colors.foreground || "",
        muted: theme.colors.muted || "",
        accent: theme.colors.accent || "",
        border: theme.colors.border || "",
      }
      setCurrentColors(colors)
      setExperimentalColors(colors)
    }
  }, [])

  const SidebarPreview = ({ colors, title }: { colors: typeof experimentalColors; title: string }) => (
    <div className="w-full max-w-xs mx-auto">
      <h4 className="font-medium mb-3 text-center">{title}</h4>
      <div 
        className="rounded-lg p-3 space-y-2"
        style={{ 
          backgroundColor: colors.background,
          color: colors.foreground,
          border: `1px solid ${colors.border}20`
        }}
      >
        <div className="text-xs text-gray-400 mb-2">MENU</div>
        
        <div 
          className="flex items-center gap-2 p-2 rounded text-sm"
          style={{ backgroundColor: `${colors.accent}20` }}
        >
          <Home size={16} />
          <span>Dashboard</span>
        </div>
        
        <div 
          className="flex items-center gap-2 p-2 rounded text-sm opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: colors.foreground }}
        >
          <Users size={16} />
          <span>Users</span>
        </div>
        
        <div 
          className="flex items-center gap-2 p-2 rounded text-sm opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: colors.foreground }}
        >
          <Settings size={16} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const generateSidebarCSS = (colors: typeof experimentalColors) => {
    return `
/* Sidebar Colors */
.sidebar {
  background-color: ${colors.background};
  color: ${colors.foreground};
  border-color: ${colors.border}40;
}

.sidebar-item {
  color: ${colors.foreground};
  opacity: 0.7;
  transition: opacity 0.2s;
}

.sidebar-item:hover {
  opacity: 1;
  background-color: ${colors.muted};
}

.sidebar-item.active {
  background-color: ${colors.accent}20;
  color: ${colors.foreground};
  opacity: 1;
}`
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Sidebar Theming</h1>
        <p className="text-muted-foreground">
          Current theme: <span className="font-mono font-medium text-primary">{currentTheme}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Sidebar Colors */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Current Sidebar Colors</CardTitle>
            <CardDescription>Colors currently used in the sidebar (read-only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SidebarPreview colors={currentColors} title="Current Sidebar" />
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: currentColors.background }}></div>
                <span className="font-mono">{currentColors.background}</span>
                <span className="text-muted-foreground">Background</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: currentColors.foreground }}></div>
                <span className="font-mono">{currentColors.foreground}</span>
                <span className="text-muted-foreground">Foreground</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: currentColors.accent }}></div>
                <span className="font-mono">{currentColors.accent}</span>
                <span className="text-muted-foreground">Accent</span>
              </div>
            </div>

            <Button
              onClick={() => copyToClipboard(generateSidebarCSS(currentColors))}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Current CSS
            </Button>
          </CardContent>
        </Card>

        {/* Experimental Sidebar Colors */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Experimental Sidebar Colors</CardTitle>
            <CardDescription>Test different sidebar color combinations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SidebarPreview colors={experimentalColors} title="Experimental Sidebar" />
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={experimentalColors.background}
                    onChange={(e) => setExperimentalColors(prev => ({...prev, background: e.target.value}))}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={experimentalColors.background}
                    onChange={(e) => setExperimentalColors(prev => ({...prev, background: e.target.value}))}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Foreground Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={experimentalColors.foreground}
                    onChange={(e) => setExperimentalColors(prev => ({...prev, foreground: e.target.value}))}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={experimentalColors.foreground}
                    onChange={(e) => setExperimentalColors(prev => ({...prev, foreground: e.target.value}))}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={experimentalColors.accent}
                    onChange={(e) => setExperimentalColors(prev => ({...prev, accent: e.target.value}))}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={experimentalColors.accent}
                    onChange={(e) => setExperimentalColors(prev => ({...prev, accent: e.target.value}))}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => copyToClipboard(generateSidebarCSS(experimentalColors))}
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Experimental CSS
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CSS Output */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Generated CSS</CardTitle>
          <CardDescription>Sidebar styling for the experimental colors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm">
            <pre className="whitespace-pre-wrap text-primary">{generateSidebarCSS(experimentalColors)}</pre>
          </div>
          <Button
            onClick={() => copyToClipboard(generateSidebarCSS(experimentalColors))}
            className="mt-3 w-full"
            variant="outline"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy CSS
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}