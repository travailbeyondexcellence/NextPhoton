"use client"

import { useState } from "react"
import { Settings, Edit3, Save, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function NextPhotonSettingsPage() {
  // State for all settings
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    registration: true,
    emailVerification: true,
    autoGrading: false,
    parentAccess: true,
    attendanceTracking: true,
    maxFileSize: 10,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: 90
  })

  const [editingLimits, setEditingLimits] = useState(false)
  const [tempLimits, setTempLimits] = useState({
    maxFileSize: settings.maxFileSize,
    sessionTimeout: settings.sessionTimeout,
    maxLoginAttempts: settings.maxLoginAttempts,
    passwordExpiry: settings.passwordExpiry
  })

  // Handle toggle switches
  const handleSwitchChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Handle system limits editing
  const handleEditLimits = () => {
    setEditingLimits(true)
    setTempLimits({
      maxFileSize: settings.maxFileSize,
      sessionTimeout: settings.sessionTimeout,
      maxLoginAttempts: settings.maxLoginAttempts,
      passwordExpiry: settings.passwordExpiry
    })
  }

  const handleSaveLimits = () => {
    setSettings(prev => ({
      ...prev,
      ...tempLimits
    }))
    setEditingLimits(false)
  }

  const handleCancelLimits = () => {
    setTempLimits({
      maxFileSize: settings.maxFileSize,
      sessionTimeout: settings.sessionTimeout,
      maxLoginAttempts: settings.maxLoginAttempts,
      passwordExpiry: settings.passwordExpiry
    })
    setEditingLimits(false)
  }

  const handleResetDefaults = () => {
    setSettings({
      maintenanceMode: false,
      registration: true,
      emailVerification: true,
      autoGrading: false,
      parentAccess: true,
      attendanceTracking: true,
      maxFileSize: 10,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordExpiry: 90
    })
    setEditingLimits(false)
  }
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
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSwitchChange('maintenanceMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Registration</p>
                <p className="text-sm text-muted-foreground">Allow new user registrations</p>
              </div>
              <Switch
                checked={settings.registration}
                onCheckedChange={(checked) => handleSwitchChange('registration', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">Require email verification for new users</p>
              </div>
              <Switch
                checked={settings.emailVerification}
                onCheckedChange={(checked) => handleSwitchChange('emailVerification', checked)}
              />
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
              <Switch
                checked={settings.autoGrading}
                onCheckedChange={(checked) => handleSwitchChange('autoGrading', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Parent Access</p>
                <p className="text-sm text-muted-foreground">Allow parents to view student progress</p>
              </div>
              <Switch
                checked={settings.parentAccess}
                onCheckedChange={(checked) => handleSwitchChange('parentAccess', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Attendance Tracking</p>
                <p className="text-sm text-muted-foreground">Enable attendance monitoring</p>
              </div>
              <Switch
                checked={settings.attendanceTracking}
                onCheckedChange={(checked) => handleSwitchChange('attendanceTracking', checked)}
              />
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
              <Button
                variant="outline"
                className="hover:bg-white/10"
                onClick={() => {
                  alert('Opening Travail Integration configuration...')
                }}
              >
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Payment Gateway</p>
                <p className="text-sm text-muted-foreground">Configure payment processing</p>
              </div>
              <Button
                variant="outline"
                className="hover:bg-white/10"
                onClick={() => {
                  alert('Opening Payment Gateway setup...')
                }}
              >
                Setup
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">SMS Provider</p>
                <p className="text-sm text-muted-foreground">Configure SMS notifications</p>
              </div>
              <Button
                variant="outline"
                className="hover:bg-white/10"
                onClick={() => {
                  alert('Opening SMS Provider configuration...')
                }}
              >
                Configure
              </Button>
            </div>
          </div>
        </div>

        {/* System Limits */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">System Limits</h2>
            {!editingLimits && (
              <Button
                onClick={handleEditLimits}
                variant="outline"
                size="sm"
                className="hover:bg-white/10"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <label className="text-sm font-medium text-muted-foreground">Max File Upload Size</label>
              {editingLimits ? (
                <div className="flex items-center mt-1 gap-2">
                  <input
                    type="number"
                    value={tempLimits.maxFileSize}
                    onChange={(e) => setTempLimits(prev => ({...prev, maxFileSize: parseInt(e.target.value) || 0}))}
                    className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-sm"
                    min="1"
                    max="100"
                  />
                  <span className="text-sm">MB</span>
                </div>
              ) : (
                <p className="text-lg font-semibold mt-1">{settings.maxFileSize} MB</p>
              )}
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <label className="text-sm font-medium text-muted-foreground">Session Timeout</label>
              {editingLimits ? (
                <div className="flex items-center mt-1 gap-2">
                  <input
                    type="number"
                    value={tempLimits.sessionTimeout}
                    onChange={(e) => setTempLimits(prev => ({...prev, sessionTimeout: parseInt(e.target.value) || 0}))}
                    className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-sm"
                    min="5"
                    max="480"
                  />
                  <span className="text-sm">minutes</span>
                </div>
              ) : (
                <p className="text-lg font-semibold mt-1">{settings.sessionTimeout} minutes</p>
              )}
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <label className="text-sm font-medium text-muted-foreground">Max Login Attempts</label>
              {editingLimits ? (
                <div className="flex items-center mt-1 gap-2">
                  <input
                    type="number"
                    value={tempLimits.maxLoginAttempts}
                    onChange={(e) => setTempLimits(prev => ({...prev, maxLoginAttempts: parseInt(e.target.value) || 0}))}
                    className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-sm"
                    min="3"
                    max="10"
                  />
                  <span className="text-sm">attempts</span>
                </div>
              ) : (
                <p className="text-lg font-semibold mt-1">{settings.maxLoginAttempts} attempts</p>
              )}
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <label className="text-sm font-medium text-muted-foreground">Password Expiry</label>
              {editingLimits ? (
                <div className="flex items-center mt-1 gap-2">
                  <input
                    type="number"
                    value={tempLimits.passwordExpiry}
                    onChange={(e) => setTempLimits(prev => ({...prev, passwordExpiry: parseInt(e.target.value) || 0}))}
                    className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-sm"
                    min="30"
                    max="365"
                  />
                  <span className="text-sm">days</span>
                </div>
              ) : (
                <p className="text-lg font-semibold mt-1">{settings.passwordExpiry} days</p>
              )}
            </div>
          </div>

          {editingLimits && (
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/10">
              <Button
                onClick={handleCancelLimits}
                variant="outline"
                size="sm"
                className="hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveLimits}
                size="sm"
                className="bg-primary/90 hover:bg-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pb-6">
          <Button
            variant="outline"
            className="hover:bg-white/10"
            onClick={handleResetDefaults}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            className="bg-primary/90 hover:bg-primary"
            onClick={() => {
              // Here you would typically save to backend/API
              alert('Settings saved successfully!')
            }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}