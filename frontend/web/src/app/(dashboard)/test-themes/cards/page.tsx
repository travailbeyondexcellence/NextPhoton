"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

export default function CardsTestPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Card Components</h1>
        <p className="text-muted-foreground">Test different card styles and glass effects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Regular Card */}
        <Card>
          <CardHeader>
            <CardTitle>Regular Card</CardTitle>
            <CardDescription>Standard card with theme colors</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This card uses the default card styling from the current theme.
            </p>
            <Button size="sm" onClick={() => copyToClipboard("/* Regular card CSS */\n.card { background: var(--card); color: var(--card-foreground); }")}>
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Glass Card */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Glass Card</CardTitle>
            <CardDescription>Card with glassmorphism effect</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This card uses the glass utility class for the backdrop blur effect.
            </p>
            <Button size="sm" onClick={() => copyToClipboard("/* Glass card CSS */\n.glass { background: rgba(255,255,255,0.08); backdrop-filter: blur(8px); }")}>
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Hover Glass Card */}
        <Card className="glass hover:glass-hover transition-all duration-200">
          <CardHeader>
            <CardTitle>Hover Glass Card</CardTitle>
            <CardDescription>Glass card with hover effects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This card has enhanced glass effects on hover. Try hovering over it!
            </p>
            <Button size="sm" onClick={() => copyToClipboard("/* Hover glass card CSS */\n.glass:hover { background: rgba(255,255,255,0.12); }")}>
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Primary Border Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Primary Border Card</CardTitle>
            <CardDescription>Card with primary color border</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This card features a border using the primary theme color.
            </p>
            <Button size="sm" onClick={() => copyToClipboard("/* Primary border card CSS */\n.card { border-color: var(--primary) / 0.2; }")}>
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Accent Card */}
        <Card className="bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="text-accent-foreground">Accent Card</CardTitle>
            <CardDescription>Card with accent color styling</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This card uses the accent color for background and borders.
            </p>
            <Button size="sm" onClick={() => copyToClipboard("/* Accent card CSS */\n.card { background: var(--accent) / 0.1; border-color: var(--accent) / 0.2; }")}>
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Muted Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Muted Card</CardTitle>
            <CardDescription>Card with muted background</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This card uses the muted color for a subtle background.
            </p>
            <Button size="sm" onClick={() => copyToClipboard("/* Muted card CSS */\n.card { background: var(--muted) / 0.5; }")}>
              Copy CSS
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}