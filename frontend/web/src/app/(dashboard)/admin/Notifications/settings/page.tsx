"use client"

import React, { useState } from 'react'
import { Settings, Bell, Mail, MessageSquare, Smartphone, Globe, Clock, Shield } from 'lucide-react'

export default function NotificationSettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [inAppEnabled, setInAppEnabled] = useState(true)
  const [quietHours, setQuietHours] = useState({ enabled: false, start: '22:00', end: '07:00' })

  const notificationPreferences = [
    { id: 'academic', label: 'Academic Updates', email: true, sms: false, push: true, inApp: true },
    { id: 'attendance', label: 'Attendance Alerts', email: true, sms: true, push: true, inApp: true },
    { id: 'behavioral', label: 'Behavioral Reports', email: true, sms: true, push: false, inApp: true },
    { id: 'events', label: 'Event Reminders', email: true, sms: false, push: true, inApp: true },
    { id: 'emergency', label: 'Emergency Notices', email: true, sms: true, push: true, inApp: true },
    { id: 'administrative', label: 'Administrative Messages', email: true, sms: false, push: false, inApp: true }
  ]

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="text-primary" size={28} />
          <h1 className="text-3xl font-bold">Notification Settings</h1>
        </div>
        <p className="text-muted-foreground">Configure notification channels and preferences</p>
      </div>

      {/* Global Channel Settings */}
      <div className="mb-6 p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
        <h3 className="font-semibold mb-4">Global Channel Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Mail, label: 'Email', enabled: emailEnabled, setEnabled: setEmailEnabled },
            { icon: MessageSquare, label: 'SMS', enabled: smsEnabled, setEnabled: setSmsEnabled },
            { icon: Smartphone, label: 'Push', enabled: pushEnabled, setEnabled: setPushEnabled },
            { icon: Globe, label: 'In-App', enabled: inAppEnabled, setEnabled: setInAppEnabled }
          ].map(({ icon: Icon, label, enabled, setEnabled }) => (
            <div
              key={label}
              className={`p-4 rounded-lg border transition-all ${
                enabled
                  ? 'border-primary/50 bg-primary/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={20} className={enabled ? 'text-primary' : 'text-muted-foreground'} />
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-5 rounded-full transition-colors ${
                    enabled ? 'bg-primary' : 'bg-white/20'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-5' : 'translate-x-0.5'
                    } mt-0.5`} />
                  </div>
                </label>
              </div>
              <div className="font-medium">{label}</div>
              <div className="text-xs text-muted-foreground">
                {enabled ? 'Active' : 'Disabled'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Preferences */}
      <div className="mb-6 p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
        <h3 className="font-semibold mb-4">Notification Categories</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-4 text-sm text-muted-foreground mb-2">
            <div className="col-span-2">Category</div>
            <div className="text-center">Email</div>
            <div className="text-center">SMS</div>
            <div className="text-center">Push</div>
            <div className="text-center">In-App</div>
          </div>
          {notificationPreferences.map(pref => (
            <div key={pref.id} className="grid grid-cols-5 gap-4 items-center p-3 rounded-lg bg-white/5">
              <div className="col-span-2 font-medium">{pref.label}</div>
              {['email', 'sms', 'push', 'inApp'].map(channel => (
                <div key={channel} className="text-center">
                  <input
                    type="checkbox"
                    defaultChecked={pref[channel as keyof typeof pref] as boolean}
                    className="w-4 h-4"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="mb-6 p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="text-primary" size={20} />
            <h3 className="font-semibold">Quiet Hours</h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={quietHours.enabled}
              onChange={(e) => setQuietHours({ ...quietHours, enabled: e.target.checked })}
              className="sr-only"
            />
            <div className={`w-10 h-5 rounded-full transition-colors ${
              quietHours.enabled ? 'bg-primary' : 'bg-white/20'
            }`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                quietHours.enabled ? 'translate-x-5' : 'translate-x-0.5'
              } mt-0.5`} />
            </div>
          </label>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Pause non-urgent notifications during specified hours
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Time</label>
            <input
              type="time"
              value={quietHours.start}
              onChange={(e) => setQuietHours({ ...quietHours, start: e.target.value })}
              disabled={!quietHours.enabled}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Time</label>
            <input
              type="time"
              value={quietHours.end}
              onChange={(e) => setQuietHours({ ...quietHours, end: e.target.value })}
              disabled={!quietHours.enabled}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="mb-6 p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-primary" size={20} />
          <h3 className="font-semibold">Security & Privacy</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Encrypt sensitive messages', enabled: true },
            { label: 'Require read receipts', enabled: false },
            { label: 'Auto-delete old messages after 90 days', enabled: false },
            { label: 'Log all notification activities', enabled: true }
          ].map(setting => (
            <label key={setting.label} className="flex items-center justify-between p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-all">
              <span className="text-sm">{setting.label}</span>
              <input
                type="checkbox"
                defaultChecked={setting.enabled}
                className="w-4 h-4"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
          Reset to Defaults
        </button>
        <button className="px-6 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all">
          Save Settings
        </button>
      </div>
    </div>
  )
}