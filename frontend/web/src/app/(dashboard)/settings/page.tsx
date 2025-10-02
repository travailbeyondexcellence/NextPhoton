"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [compactView, setCompactView] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [activityStatus, setActivityStatus] = useState(true)

  // Apply dark mode by directly modifying CSS variables
  const applyDarkMode = useCallback((isDark: boolean) => {
    const root = document.documentElement

    if (isDark) {
      // Dark mode colors
      root.classList.add('dark')
      root.style.setProperty('--background', '15 23 42')
      root.style.setProperty('--foreground', '226 232 240')
      root.style.setProperty('--card', '30 41 59')
      root.style.setProperty('--card-foreground', '226 232 240')
      root.style.setProperty('--primary', '59 130 246')
      root.style.setProperty('--primary-foreground', '255 255 255')
      root.style.setProperty('--secondary', '51 65 85')
      root.style.setProperty('--secondary-foreground', '226 232 240')
      root.style.setProperty('--accent', '71 85 105')
      root.style.setProperty('--accent-foreground', '226 232 240')
      root.style.setProperty('--muted', '51 65 85')
      root.style.setProperty('--muted-foreground', '148 163 184')
      root.style.setProperty('--border', '51 65 85')
      root.style.setProperty('--gradient-from', '15 23 42')
      root.style.setProperty('--gradient-via', '30 41 59')
      root.style.setProperty('--gradient-to', '51 65 85')
    } else {
      // Light mode colors (restore defaults)
      root.classList.remove('dark')
      root.style.setProperty('--background', '240 248 255')
      root.style.setProperty('--foreground', '2 71 159')
      root.style.setProperty('--card', '230 242 255')
      root.style.setProperty('--card-foreground', '30 41 59')
      root.style.setProperty('--primary', '0 82 255')
      root.style.setProperty('--primary-foreground', '255 255 255')
      root.style.setProperty('--secondary', '14 165 233')
      root.style.setProperty('--secondary-foreground', '255 255 255')
      root.style.setProperty('--accent', '56 189 248')
      root.style.setProperty('--accent-foreground', '12 74 110')
      root.style.setProperty('--muted', '204 230 255')
      root.style.setProperty('--muted-foreground', '100 116 139')
      root.style.setProperty('--border', '179 217 255')
      root.style.setProperty('--gradient-from', '17 24 39')
      root.style.setProperty('--gradient-via', '30 58 138')
      root.style.setProperty('--gradient-to', '91 33 182')
    }
  }, [])

  // Toggle dark mode
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked)
    localStorage.setItem('dark-mode', checked.toString())
    applyDarkMode(checked)
  }

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      applyDarkMode(true)
    }
  }, [applyDarkMode])

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle dark theme</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compact View</p>
              <p className="text-sm text-muted-foreground">Use compact spacing</p>
            </div>
            <Switch checked={compactView} onCheckedChange={setCompactView} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Browser push notifications</p>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Important updates via SMS</p>
            </div>
            <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-muted-foreground">Make profile visible to others</p>
            </div>
            <Switch checked={profileVisibility} onCheckedChange={setProfileVisibility} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Activity Status</p>
              <p className="text-sm text-muted-foreground">Show when you're online</p>
            </div>
            <Switch checked={activityStatus} onCheckedChange={setActivityStatus} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}