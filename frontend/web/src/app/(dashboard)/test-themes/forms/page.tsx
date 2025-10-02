"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Copy } from "lucide-react"
import { toast } from "sonner"

export default function FormsTestPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Form Elements</h1>
        <p className="text-muted-foreground">Test different form controls and input styles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Text Inputs */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Text Inputs</CardTitle>
            <CardDescription>Various text input types and states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="normal-input">Normal Input</Label>
              <Input id="normal-input" placeholder="Enter text here..." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="disabled-input">Disabled Input</Label>
              <Input id="disabled-input" placeholder="Disabled input" disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="error-input">Input with Error State</Label>
              <Input id="error-input" placeholder="Error state" className="border-destructive" />
              <p className="text-sm text-destructive">This field has an error</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password-input">Password Input</Label>
              <Input id="password-input" type="password" placeholder="Password" />
            </div>

            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard("/* Input CSS */\n.input { background: var(--background); border: 1px solid var(--border); color: var(--foreground); }")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Input CSS
            </Button>
          </CardContent>
        </Card>

        {/* Textarea and Select */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Textarea & Select</CardTitle>
            <CardDescription>Multi-line text and dropdown controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="textarea">Textarea</Label>
              <Textarea id="textarea" placeholder="Enter multi-line text here..." rows={3} />
            </div>
            
            <div className="space-y-2">
              <Label>Select Dropdown</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Disabled Select</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Disabled select" />
                </SelectTrigger>
              </Select>
            </div>

            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard("/* Textarea & Select CSS */\n.textarea, .select { background: var(--background); border: 1px solid var(--border); }")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Checkboxes and Radio */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Checkboxes & Radio</CardTitle>
            <CardDescription>Selection controls and their states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Checkboxes</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="check1" />
                  <Label htmlFor="check1">Normal checkbox</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check2" defaultChecked />
                  <Label htmlFor="check2">Checked checkbox</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check3" disabled />
                  <Label htmlFor="check3">Disabled checkbox</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Radio Group</Label>
              <RadioGroup defaultValue="option-one">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="r1" />
                  <Label htmlFor="r1">Option One</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="r2" />
                  <Label htmlFor="r2">Option Two</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-three" id="r3" disabled />
                  <Label htmlFor="r3">Disabled Option</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard("/* Checkbox & Radio CSS */\n.checkbox, .radio { border: 1px solid var(--border); }\n.checkbox:checked { background: var(--primary); }")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy CSS
            </Button>
          </CardContent>
        </Card>

        {/* Form Example */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Complete Form Example</CardTitle>
            <CardDescription>A form combining multiple elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message..." />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="agree" />
              <Label htmlFor="agree">I agree to the terms and conditions</Label>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1">Submit Form</Button>
              <Button variant="outline">Cancel</Button>
            </div>

            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard("/* Complete form CSS */\n.form { background: var(--card); padding: 1rem; border-radius: 0.5rem; }")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Form CSS
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}