"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function NextPhotonSettingsPage() {
  return (
    <div className="min-h-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">NextPhoton Settings</h1>
            <p className="text-muted-foreground">Configure system-wide NextPhoton settings</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Configuration */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">General Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">Temporarily disable system access</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Registration</p>
                <p className="text-sm text-muted-foreground">Allow new user registrations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">Require email verification for new users</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Academic Settings */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Academic Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Auto-Grading</p>
                <p className="text-sm text-muted-foreground">Enable automatic grading for assignments</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Parent Access</p>
                <p className="text-sm text-muted-foreground">Allow parents to view student progress</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Attendance Tracking</p>
                <p className="text-sm text-muted-foreground">Enable attendance monitoring</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Integration Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Travail Integration</p>
                <p className="text-sm text-muted-foreground">Connect with travail.photonecademy.com</p>
              </div>
              <Button variant="outline" className="hover:bg-white/10">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Payment Gateway</p>
                <p className="text-sm text-muted-foreground">Configure payment processing</p>
              </div>
              <Button variant="outline" className="hover:bg-white/10">Setup</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">SMS Provider</p>
                <p className="text-sm text-muted-foreground">Configure SMS notifications</p>
              </div>
              <Button variant="outline" className="hover:bg-white/10">Configure</Button>
            </div>
          </div>
        </div>

        {/* System Limits */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">System Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <label className="text-sm font-medium text-muted-foreground">Max File Upload Size</label>
              <p className="text-lg font-semibold mt-1">10 MB</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <label className="text-sm font-medium text-muted-foreground">Session Timeout</label>
              <p className="text-lg font-semibold mt-1">30 minutes</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <label className="text-sm font-medium text-muted-foreground">Max Login Attempts</label>
              <p className="text-lg font-semibold mt-1">5 attempts</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <label className="text-sm font-medium text-muted-foreground">Password Expiry</label>
              <p className="text-lg font-semibold mt-1">90 days</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pb-6">
          <Button variant="outline" className="hover:bg-white/10">Reset to Defaults</Button>
          <Button className="bg-primary/90 hover:bg-primary">Save Settings</Button>
        </div>
      </div>
    </div>
  )
}