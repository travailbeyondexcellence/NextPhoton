"use client"

import React, { useState } from 'react'
import { Radio, Users, AlertTriangle, Info, Send, Calendar } from 'lucide-react'

export default function BroadcastPage() {
  const [broadcastType, setBroadcastType] = useState<'all' | 'role' | 'custom'>('all')
  const [urgency, setUrgency] = useState<'emergency' | 'important' | 'normal'>('normal')
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')

  const broadcastStats = {
    totalUsers: 327,
    educators: 9,
    learners: 9,
    guardians: 18,
    activeNow: 142,
    lastBroadcast: '2 days ago'
  }

  const predefinedBroadcasts = [
    { id: 'b1', title: 'School Holiday Announcement', urgency: 'normal', lastUsed: '1 week ago' },
    { id: 'b2', title: 'Emergency Closure Notice', urgency: 'emergency', lastUsed: '3 months ago' },
    { id: 'b3', title: 'Parent-Teacher Meeting Reminder', urgency: 'important', lastUsed: '2 weeks ago' },
    { id: 'b4', title: 'System Maintenance Notice', urgency: 'normal', lastUsed: '5 days ago' },
    { id: 'b5', title: 'Fee Payment Reminder', urgency: 'important', lastUsed: '1 month ago' }
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'text-red-500 bg-red-500/10 border-red-500/30'
      case 'important': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/30'
    }
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Radio className="text-primary" size={28} />
          <h1 className="text-3xl font-bold">Broadcast Center</h1>
        </div>
        <p className="text-muted-foreground">Send urgent announcements to all users simultaneously</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="text-2xl font-bold">{broadcastStats.totalUsers}</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="text-2xl font-bold text-green-500">{broadcastStats.activeNow}</div>
          <div className="text-sm text-muted-foreground">Active Now</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="text-2xl font-bold">{broadcastStats.educators}</div>
          <div className="text-sm text-muted-foreground">Educators</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="text-2xl font-bold">{broadcastStats.learners}</div>
          <div className="text-sm text-muted-foreground">Learners</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="text-2xl font-bold">{broadcastStats.guardians}</div>
          <div className="text-sm text-muted-foreground">Guardians</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="text-sm font-medium">Last Broadcast</div>
          <div className="text-sm text-muted-foreground">{broadcastStats.lastBroadcast}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Broadcast Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgency Level */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <h3 className="font-semibold mb-4">Urgency Level</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { level: 'emergency', icon: AlertTriangle, label: 'Emergency', desc: 'Critical alerts' },
                { level: 'important', icon: Info, label: 'Important', desc: 'Time-sensitive' },
                { level: 'normal', icon: Calendar, label: 'Normal', desc: 'Regular updates' }
              ].map(({ level, icon: Icon, label, desc }) => (
                <button
                  key={level}
                  onClick={() => setUrgency(level as typeof urgency)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    urgency === level
                      ? getUrgencyColor(level)
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Icon size={24} className="mb-2" />
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Broadcast Recipients */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <h3 className="font-semibold mb-4">Broadcast Recipients</h3>
            <div className="space-y-3">
              {[
                { type: 'all', label: 'All Users', desc: 'Send to everyone in the system' },
                { type: 'role', label: 'By Role', desc: 'Select specific user roles' },
                { type: 'custom', label: 'Custom Selection', desc: 'Choose individual recipients' }
              ].map(({ type, label, desc }) => (
                <label
                  key={type}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                    broadcastType === type
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    checked={broadcastType === type}
                    onChange={() => setBroadcastType(type as typeof broadcastType)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-sm text-muted-foreground">{desc}</div>
                  </div>
                </label>
              ))}

              {broadcastType === 'role' && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-2">
                  {['Educators', 'Learners', 'Guardians', 'Administrators'].map(role => (
                    <label key={role} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Composer */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <h3 className="font-semibold mb-4">Broadcast Message</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter broadcast subject..."
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your broadcast message..."
                  rows={8}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Predefined Broadcasts */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <h3 className="font-semibold mb-4">Predefined Broadcasts</h3>
            <div className="space-y-2">
              {predefinedBroadcasts.map(broadcast => (
                <button
                  key={broadcast.id}
                  className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  <div className="font-medium text-sm">{broadcast.title}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${getUrgencyColor(broadcast.urgency)}`}>
                      {broadcast.urgency}
                    </span>
                    <span className="text-xs text-muted-foreground">{broadcast.lastUsed}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Broadcasting Guidelines */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <h3 className="font-semibold mb-4">Broadcasting Guidelines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Emergency broadcasts bypass all notification preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Important broadcasts are highlighted in user interfaces</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Normal broadcasts follow user notification settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>All broadcasts are logged for audit purposes</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              disabled={!subject || !message}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              Send Broadcast Now
            </button>
            <button className="w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
              Schedule for Later
            </button>
            <button className="w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
              Preview Broadcast
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}