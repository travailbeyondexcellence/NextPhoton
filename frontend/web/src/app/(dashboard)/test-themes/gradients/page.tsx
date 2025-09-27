"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw } from "lucide-react"
import { getCurrentTheme, getTheme } from "@/lib/theme-utils"
import { toast } from "sonner"

export default function GradientsTestPage() {
  const [currentTheme, setCurrentTheme] = useState<string>("")
  const [currentGradient, setCurrentGradient] = useState({
    from: "",
    via: "",
    to: "",
  })
  
  // Experimental gradient state
  const [experimentalGradient, setExperimentalGradient] = useState({
    from: "#FF1493",
    via: "#FF5BFC", 
    to: "#FF1496",
  })

  useEffect(() => {
    const themeName = getCurrentTheme()
    setCurrentTheme(themeName)
    
    const theme = getTheme(themeName as any)
    if (theme?.glass) {
      setCurrentGradient({
        from: theme.glass.backgroundGradientFrom || "",
        via: theme.glass.backgroundGradientVia || "",
        to: theme.glass.backgroundGradientTo || "",
      })
    }
  }, [])

  const generateGradientCSS = (gradient: typeof experimentalGradient) => {
    return `background: linear-gradient(to bottom right, ${gradient.from}, ${gradient.via}, ${gradient.to});`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const resetExperimental = () => {
    setExperimentalGradient({
      from: currentGradient.from,
      via: currentGradient.via,
      to: currentGradient.to,
    })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Background Gradients</h1>
        <p className="text-muted-foreground">
          Current theme: <span className="font-mono font-medium text-primary">{currentTheme}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Gradient (Static) */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              Current Theme Gradient
            </CardTitle>
            <CardDescription>This is the gradient currently being used (read-only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Gradient Preview */}
            <div 
              className="h-32 rounded-lg border border-border relative overflow-hidden"
              style={{
                background: `linear-gradient(to bottom right, ${currentGradient.from}, ${currentGradient.via}, ${currentGradient.to})`
              }}
            >
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded">
                  Live Preview
                </span>
              </div>
            </div>

            {/* Current Colors Display */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: currentGradient.from }}
                ></div>
                <span className="font-mono text-sm">{currentGradient.from}</span>
                <span className="text-xs text-muted-foreground">From</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: currentGradient.via }}
                ></div>
                <span className="font-mono text-sm">{currentGradient.via}</span>
                <span className="text-xs text-muted-foreground">Via</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: currentGradient.to }}
                ></div>
                <span className="font-mono text-sm">{currentGradient.to}</span>
                <span className="text-xs text-muted-foreground">To</span>
              </div>
            </div>

            {/* Copy Current CSS */}
            <Button
              onClick={() => copyToClipboard(generateGradientCSS(currentGradient))}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Current Gradient CSS
            </Button>
          </CardContent>
        </Card>

        {/* Experimental Gradient (Interactive) */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              Experimental Gradient
            </CardTitle>
            <CardDescription>Experiment with different gradient combinations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Experimental Gradient Preview */}
            <div 
              className="h-32 rounded-lg border border-border relative overflow-hidden"
              style={{
                background: `linear-gradient(to bottom right, ${experimentalGradient.from}, ${experimentalGradient.via}, ${experimentalGradient.to})`
              }}
            >
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded">
                  Experimental Preview
                </span>
              </div>
            </div>

            {/* Color Controls */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="exp-from">From Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="exp-from"
                    type="color"
                    value={experimentalGradient.from}
                    onChange={(e) => setExperimentalGradient(prev => ({...prev, from: e.target.value}))}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={experimentalGradient.from}
                    onChange={(e) => setExperimentalGradient(prev => ({...prev, from: e.target.value}))}
                    className="font-mono text-sm"
                    placeholder="#FF1493"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="exp-via">Via Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="exp-via"
                    type="color"
                    value={experimentalGradient.via}
                    onChange={(e) => setExperimentalGradient(prev => ({...prev, via: e.target.value}))}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={experimentalGradient.via}
                    onChange={(e) => setExperimentalGradient(prev => ({...prev, via: e.target.value}))}
                    className="font-mono text-sm"
                    placeholder="#FF5BFC"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="exp-to">To Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="exp-to"
                    type="color"
                    value={experimentalGradient.to}
                    onChange={(e) => setExperimentalGradient(prev => ({...prev, to: e.target.value}))}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={experimentalGradient.to}
                    onChange={(e) => setExperimentalGradient(prev => ({...prev, to: e.target.value}))}
                    className="font-mono text-sm"
                    placeholder="#FF1496"
                  />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(generateGradientCSS(experimentalGradient))}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy CSS
              </Button>
              <Button
                onClick={resetExperimental}
                variant="outline"
                size="icon"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSS Output */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Generated CSS</CardTitle>
          <CardDescription>Copy this CSS to share with Claude for theme updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm">
            <div className="mb-3">
              <span className="text-muted-foreground">// Current gradient:</span>
              <br />
              <code>{generateGradientCSS(currentGradient)}</code>
            </div>
            <div>
              <span className="text-muted-foreground">// Experimental gradient:</span>
              <br />
              <code className="text-primary">{generateGradientCSS(experimentalGradient)}</code>
            </div>
          </div>
          <Button
            onClick={() => copyToClipboard(`// Current gradient:\n${generateGradientCSS(currentGradient)}\n\n// Experimental gradient:\n${generateGradientCSS(experimentalGradient)}`)}
            className="mt-3 w-full"
            variant="outline"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Both CSS Snippets
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}