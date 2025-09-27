"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"
import { getCurrentTheme, getTheme } from "@/lib/theme-utils"
import { toast } from "sonner"

export default function GlassComponentsTestPage() {
  const [currentTheme, setCurrentTheme] = useState<string>("")
  const [currentGlass, setCurrentGlass] = useState({
    cardOpacity: 0.08,
    borderOpacity: 0.15,
    blurIntensity: 8,
    hoverOpacity: 0.12,
  })
  
  const [experimentalGlass, setExperimentalGlass] = useState({
    cardOpacity: 0.08,
    borderOpacity: 0.15,
    blurIntensity: 8,
    hoverOpacity: 0.12,
  })

  useEffect(() => {
    const themeName = getCurrentTheme()
    setCurrentTheme(themeName)
    
    const theme = getTheme(themeName as any)
    if (theme?.glass) {
      const glassSettings = {
        cardOpacity: theme.glass.cardOpacity || 0.08,
        borderOpacity: theme.glass.borderOpacity || 0.15,
        blurIntensity: theme.glass.blurIntensity || 8,
        hoverOpacity: theme.glass.hoverOpacity || 0.12,
      }
      setCurrentGlass(glassSettings)
      setExperimentalGlass(glassSettings)
    }
  }, [])

  const generateGlassCSS = (glass: typeof experimentalGlass) => {
    return `
.glass {
  background: rgba(255, 255, 255, ${glass.cardOpacity});
  backdrop-filter: blur(${glass.blurIntensity}px);
  -webkit-backdrop-filter: blur(${glass.blurIntensity}px);
  border: 1px solid rgba(255, 255, 255, ${glass.borderOpacity});
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.glass:hover {
  background: rgba(255, 255, 255, ${glass.hoverOpacity});
}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Glass Components</h1>
        <p className="text-muted-foreground">
          Current theme: <span className="font-mono font-medium text-primary">{currentTheme}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Glass Settings (Static) */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              Current Glass Settings
            </CardTitle>
            <CardDescription>Current glassmorphism values (read-only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Card Opacity:</span>
                <span className="font-mono text-sm">{currentGlass.cardOpacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Border Opacity:</span>
                <span className="font-mono text-sm">{currentGlass.borderOpacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Blur Intensity:</span>
                <span className="font-mono text-sm">{currentGlass.blurIntensity}px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Hover Opacity:</span>
                <span className="font-mono text-sm">{currentGlass.hoverOpacity}</span>
              </div>
            </div>

            {/* Current Glass Example */}
            <div className="p-4 rounded-lg border border-white/20 bg-white/[0.08] backdrop-blur-[8px]">
              <h4 className="font-medium mb-2">Current Glass Effect</h4>
              <p className="text-sm text-muted-foreground">This card uses the current theme's glass settings.</p>
            </div>

            <Button
              onClick={() => copyToClipboard(generateGlassCSS(currentGlass))}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Current Glass CSS
            </Button>
          </CardContent>
        </Card>

        {/* Experimental Glass Settings (Interactive) */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              Experimental Glass Settings
            </CardTitle>
            <CardDescription>Experiment with different glass effects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Controls */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Card Opacity: {experimentalGlass.cardOpacity.toFixed(3)}</Label>
                <Slider
                  value={[experimentalGlass.cardOpacity]}
                  onValueChange={([value]) => setExperimentalGlass(prev => ({...prev, cardOpacity: value}))}
                  max={0.5}
                  min={0.01}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <Label>Border Opacity: {experimentalGlass.borderOpacity.toFixed(3)}</Label>
                <Slider
                  value={[experimentalGlass.borderOpacity]}
                  onValueChange={([value]) => setExperimentalGlass(prev => ({...prev, borderOpacity: value}))}
                  max={0.8}
                  min={0.05}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <Label>Blur Intensity: {experimentalGlass.blurIntensity}px</Label>
                <Slider
                  value={[experimentalGlass.blurIntensity]}
                  onValueChange={([value]) => setExperimentalGlass(prev => ({...prev, blurIntensity: value}))}
                  max={30}
                  min={0}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Hover Opacity: {experimentalGlass.hoverOpacity.toFixed(3)}</Label>
                <Slider
                  value={[experimentalGlass.hoverOpacity]}
                  onValueChange={([value]) => setExperimentalGlass(prev => ({...prev, hoverOpacity: value}))}
                  max={0.6}
                  min={0.01}
                  step={0.01}
                />
              </div>
            </div>

            {/* Experimental Glass Example */}
            <div 
              className="p-4 rounded-lg border transition-all duration-200 hover:bg-white/[0.12]"
              style={{
                backgroundColor: `rgba(255, 255, 255, ${experimentalGlass.cardOpacity})`,
                borderColor: `rgba(255, 255, 255, ${experimentalGlass.borderOpacity})`,
                backdropFilter: `blur(${experimentalGlass.blurIntensity}px)`,
                WebkitBackdropFilter: `blur(${experimentalGlass.blurIntensity}px)`,
              }}
            >
              <h4 className="font-medium mb-2">Experimental Glass Effect</h4>
              <p className="text-sm text-muted-foreground">This card uses your experimental settings. Hover to see the hover effect.</p>
            </div>

            <Button
              onClick={() => copyToClipboard(generateGlassCSS(experimentalGlass))}
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
          <CardDescription>Copy this CSS to share with Claude for theme updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm">
            <pre className="whitespace-pre-wrap text-primary">{generateGlassCSS(experimentalGlass)}</pre>
          </div>
          <Button
            onClick={() => copyToClipboard(generateGlassCSS(experimentalGlass))}
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