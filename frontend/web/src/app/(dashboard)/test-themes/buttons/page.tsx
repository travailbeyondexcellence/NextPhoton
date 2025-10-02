"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download, Heart, Star, Trash } from "lucide-react"
import { toast } from "sonner"

export default function ButtonsTestPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Button Components</h1>
        <p className="text-muted-foreground">Test different button styles and variants</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Primary Buttons */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Primary Buttons</CardTitle>
            <CardDescription>Default button styling with primary colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>
                <Download className="w-4 h-4 mr-2" />
                With Icon
              </Button>
              <Button size="icon">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard("/* Primary button CSS */\n.btn-primary { background: var(--primary); color: var(--primary-foreground); }")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Secondary Buttons */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Secondary Buttons</CardTitle>
            <CardDescription>Secondary button variants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">Secondary</Button>
              <Button variant="secondary" size="sm">Small</Button>
              <Button variant="secondary" size="lg">Large</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">
                <Star className="w-4 h-4 mr-2" />
                With Icon
              </Button>
              <Button variant="secondary" size="icon">
                <Star className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard("/* Secondary button CSS */\n.btn-secondary { background: var(--secondary); color: var(--secondary-foreground); }")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Outline Buttons */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Outline Buttons</CardTitle>
            <CardDescription>Buttons with outline styling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">Outline</Button>
              <Button variant="outline" size="sm">Small</Button>
              <Button variant="outline" size="lg">Large</Button>
              <Button variant="outline" disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                With Icon
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard("/* Outline button CSS */\n.btn-outline { border: 1px solid var(--border); background: transparent; }")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Destructive Buttons */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Destructive Buttons</CardTitle>
            <CardDescription>Buttons for dangerous actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="destructive">Delete</Button>
              <Button variant="destructive" size="sm">Small</Button>
              <Button variant="destructive" size="lg">Large</Button>
              <Button variant="destructive" disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="destructive">
                <Trash className="w-4 h-4 mr-2" />
                Delete Item
              </Button>
              <Button variant="destructive" size="icon">
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard("/* Destructive button CSS */\n.btn-destructive { background: var(--destructive); color: var(--destructive-foreground); }")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Ghost Buttons */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Ghost Buttons</CardTitle>
            <CardDescription>Minimal button styling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost">Ghost</Button>
              <Button variant="ghost" size="sm">Small</Button>
              <Button variant="ghost" size="lg">Large</Button>
              <Button variant="ghost" disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost">
                <Star className="w-4 h-4 mr-2" />
                With Icon
              </Button>
              <Button variant="ghost" size="icon">
                <Star className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard("/* Ghost button CSS */\n.btn-ghost { background: transparent; color: var(--foreground); }")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Link Buttons */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Link Buttons</CardTitle>
            <CardDescription>Button styled as links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="link">Link Button</Button>
              <Button variant="link" size="sm">Small Link</Button>
              <Button variant="link" size="lg">Large Link</Button>
              <Button variant="link" disabled>Disabled Link</Button>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard("/* Link button CSS */\n.btn-link { background: transparent; color: var(--link); text-decoration: underline; }")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy CSS
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}