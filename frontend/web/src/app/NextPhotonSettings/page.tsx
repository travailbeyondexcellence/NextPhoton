"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function NextPhotonSettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">NextPhoton Settings</h1>
          <p className="text-muted-foreground">Configure system-wide NextPhoton settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Temporarily disable system access</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Registration</p>
              <p className="text-sm text-muted-foreground">Allow new user registrations</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Verification</p>
              <p className="text-sm text-muted-foreground">Require email verification for new users</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-Grading</p>
              <p className="text-sm text-muted-foreground">Enable automatic grading for assignments</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Parent Access</p>
              <p className="text-sm text-muted-foreground">Allow parents to view student progress</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Attendance Tracking</p>
              <p className="text-sm text-muted-foreground">Enable attendance monitoring</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Travail Integration</p>
              <p className="text-sm text-muted-foreground">Connect with travail.photonecademy.com</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payment Gateway</p>
              <p className="text-sm text-muted-foreground">Configure payment processing</p>
            </div>
            <Button variant="outline">Setup</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Provider</p>
              <p className="text-sm text-muted-foreground">Configure SMS notifications</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Max File Upload Size</label>
              <p className="text-lg">10 MB</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Session Timeout</label>
              <p className="text-lg">30 minutes</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Max Login Attempts</label>
              <p className="text-lg">5 attempts</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Password Expiry</label>
              <p className="text-lg">90 days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  )
}