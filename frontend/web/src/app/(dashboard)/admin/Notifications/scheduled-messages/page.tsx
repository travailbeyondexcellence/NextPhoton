"use client"

import React, { useState } from 'react'
import { Calendar, Clock, Edit2, Trash2, Pause, Play, AlertCircle } from 'lucide-react'

export default function ScheduledMessagesPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all')

  const scheduledMessages = [
    {
      id: 'sm1',
      title: 'Weekly Progress Report',
      content: 'Your child\'s weekly academic progress summary',
      recipients: 'All Guardians',
      recipientCount: 18,
      schedule: 'Every Friday at 3:00 PM',
      nextRun: '2024-12-20 15:00',
      status: 'active',
      type: 'recurring',
      channel: 'email'
    },
    {
      id: 'sm2',
      title: 'Homework Reminder',
      content: 'Daily reminder to check and complete homework assignments',
      recipients: 'All Learners',
      recipientCount: 9,
      schedule: 'Daily at 4:30 PM',
      nextRun: '2024-12-17 16:30',
      status: 'active',
      type: 'recurring',
      channel: 'push'
    },
    {
      id: 'sm3',
      title: 'Staff Meeting Notice',
      content: 'Monthly staff meeting reminder',
      recipients: 'All Educators',
      recipientCount: 9,
      schedule: 'First Monday of month at 9:00 AM',
      nextRun: '2025-01-06 09:00',
      status: 'paused',
      type: 'recurring',
      channel: 'all'
    },
    {
      id: 'sm4',
      title: 'Parent-Teacher Conference',
      content: 'Upcoming parent-teacher conference schedule',
      recipients: 'Selected Groups',
      recipientCount: 45,
      schedule: 'One-time',
      nextRun: '2024-12-22 10:00',
      status: 'active',
      type: 'one-time',
      channel: 'email'
    },
    {
      id: 'sm5',
      title: 'Attendance Report',
      content: 'Weekly attendance summary for guardians',
      recipients: 'Guardians with Low Attendance',
      recipientCount: 7,
      schedule: 'Every Monday at 10:00 AM',
      nextRun: '2024-12-23 10:00',
      status: 'active',
      type: 'recurring',
      channel: 'sms'
    }
  ]

  const filteredMessages = scheduledMessages.filter(msg => {
    if (filter === 'all') return true
    return msg.status === filter
  })

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'text-green-500 bg-green-500/10'
      : 'text-yellow-500 bg-yellow-500/10'
  }

  const getChannelColor = (channel: string) => {
    const colors: Record<string, string> = {
      'email': 'text-blue-500 bg-blue-500/10',
      'sms': 'text-purple-500 bg-purple-500/10',
      'push': 'text-orange-500 bg-orange-500/10',
      'all': 'text-primary bg-primary/10'
    }
    return colors[channel] || 'text-gray-500 bg-gray-500/10'
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Scheduled Messages</h1>
          <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all">
            + Schedule New Message
          </button>
        </div>
        <p className="text-muted-foreground">Manage automated and scheduled notifications</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="text-2xl font-bold">{scheduledMessages.length}</div>
          <div className="text-sm text-muted-foreground">Total Scheduled</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="text-2xl font-bold text-green-500">
            {scheduledMessages.filter(m => m.status === 'active').length}
          </div>
          <div className="text-sm text-muted-foreground">Active</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="text-2xl font-bold text-yellow-500">
            {scheduledMessages.filter(m => m.status === 'paused').length}
          </div>
          <div className="text-sm text-muted-foreground">Paused</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="text-2xl font-bold">
            {scheduledMessages.filter(m => m.type === 'recurring').length}
          </div>
          <div className="text-sm text-muted-foreground">Recurring</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {['all', 'active', 'paused'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
              filter === f
                ? 'bg-primary/20 text-primary border border-primary/50'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Scheduled Messages List */}
      <div className="space-y-4">
        {filteredMessages.map(message => (
          <div
            key={message.id}
            className="p-5 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                  <Calendar size={20} className="text-primary" />
                  <h3 className="font-semibold">{message.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(message.status)}`}>
                    {message.status}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getChannelColor(message.channel)}`}>
                    {message.channel}
                  </span>
                  {message.type === 'recurring' && (
                    <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-500">
                      Recurring
                    </span>
                  )}
                </div>

                {/* Content Preview */}
                <p className="text-sm text-muted-foreground mb-3">{message.content}</p>

                {/* Schedule Details */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Schedule:</span>
                    <span>{message.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Next Run:</span>
                    <span>{new Date(message.nextRun).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Recipients:</span>
                    <span>{message.recipients} ({message.recipientCount})</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {message.status === 'active' ? (
                  <button
                    className="p-2 rounded-lg bg-white/10 hover:bg-yellow-500/20 hover:text-yellow-500 transition-all"
                    title="Pause"
                  >
                    <Pause size={16} />
                  </button>
                ) : (
                  <button
                    className="p-2 rounded-lg bg-white/10 hover:bg-green-500/20 hover:text-green-500 transition-all"
                    title="Resume"
                  >
                    <Play size={16} />
                  </button>
                )}
                <button
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-500 transition-all"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No scheduled messages</h3>
          <p className="text-muted-foreground mb-4">
            Create scheduled messages to automate your communications
          </p>
          <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all">
            Schedule Your First Message
          </button>
        </div>
      )}
    </div>
  )
}