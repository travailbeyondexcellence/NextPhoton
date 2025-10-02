"use client"

import React, { useState } from 'react'
import { Send, Paperclip, Users, Calendar, AlertCircle } from 'lucide-react'
import { messageTemplates, recipientGroups } from '@/app/(features)/Notifications/notificationsDummyData'

export default function ComposeMessagePage() {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [channel, setChannel] = useState<'all' | 'in-app' | 'email' | 'sms' | 'push'>('all')
  const [scheduleDate, setScheduleDate] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')

  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setSubject(template.subject)
      setMessage(template.body)
    }
  }

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const getTotalRecipients = () => {
    return selectedGroups.reduce((total, groupId) => {
      const group = recipientGroups.find(g => g.id === groupId)
      return total + (group?.memberCount || 0)
    }, 0)
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Compose New Message</h1>
        <p className="text-muted-foreground">Create and send notifications to learners, educators, and guardians</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Compose Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <label className="block text-sm font-medium mb-3">Select Template (Optional)</label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
            >
              <option value="">-- No Template --</option>
              {messageTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} - {template.category}
                </option>
              ))}
            </select>
          </div>

          {/* Message Details */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter message subject..."
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={10}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                <Paperclip size={18} />
                <span className="text-sm">Attach Files</span>
              </button>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5 space-y-4">
            <h3 className="font-semibold mb-3">Delivery Options</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Channel</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'in-app', 'email', 'sms', 'push'].map(ch => (
                  <button
                    key={ch}
                    onClick={() => setChannel(ch as typeof channel)}
                    className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                      channel === ch
                        ? 'bg-primary/20 text-primary border border-primary/50'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {ch === 'all' ? 'All Channels' : ch}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <div className="flex gap-2">
                {['high', 'medium', 'low'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPriority(p as typeof priority)}
                    className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                      priority === p
                        ? 'bg-primary/20 text-primary border border-primary/50'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar size={16} className="inline mr-2" />
                Schedule for Later (Optional)
              </label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Recipient Selection Sidebar */}
        <div className="space-y-6">
          {/* Recipient Groups */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <h3 className="font-semibold mb-4">Select Recipients</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recipientGroups.map(group => (
                <label
                  key={group.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                    selectedGroups.includes(group.id)
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group.id)}
                    onChange={() => handleGroupToggle(group.id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{group.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {group.memberCount} members
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <h3 className="font-semibold mb-4">Message Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Recipients:</span>
                <span className="font-medium">{getTotalRecipients()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Channel:</span>
                <span className="font-medium capitalize">{channel === 'all' ? 'All Channels' : channel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority:</span>
                <span className="font-medium capitalize">{priority}</span>
              </div>
              {scheduleDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled:</span>
                  <span className="font-medium">
                    {new Date(scheduleDate).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {selectedGroups.length === 0 && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-yellow-500 mt-0.5" />
                  <p className="text-sm text-yellow-500">
                    Please select at least one recipient group
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              disabled={selectedGroups.length === 0 || !subject || !message}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              {scheduleDate ? 'Schedule Message' : 'Send Message'}
            </button>
            <button className="w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}