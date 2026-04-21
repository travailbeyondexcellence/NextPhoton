"use client"

import React, { useState } from 'react'
import { Send, Check, CheckCheck, X, Clock, Filter, Search, ChevronDown } from 'lucide-react'
import { notifications } from '@/app/(features)/Notifications/notificationsDummyData'

export default function SentMessagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [channelFilter, setChannelFilter] = useState<string>('all')
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null)

  // Filter sent notifications
  const sentNotifications = notifications.filter(n =>
    ['sent', 'delivered', 'failed'].includes(n.deliveryStatus)
  )

  const filteredMessages = sentNotifications.filter(message => {
    const matchesSearch = message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || message.deliveryStatus === statusFilter
    const matchesChannel = channelFilter === 'all' || message.channel === channelFilter
    return matchesSearch && matchesStatus && matchesChannel
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock size={16} className="text-yellow-500" />
      case 'delivered': return <CheckCheck size={16} className="text-green-500" />
      case 'failed': return <X size={16} className="text-red-500" />
      default: return <Send size={16} className="text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'sent': 'text-yellow-500 bg-yellow-500/10',
      'delivered': 'text-green-500 bg-green-500/10',
      'failed': 'text-red-500 bg-red-500/10'
    }
    return colors[status] || 'text-gray-500 bg-gray-500/10'
  }

  const getChannelBadge = (channel: string) => {
    const colors: Record<string, string> = {
      'email': 'text-blue-500 bg-blue-500/10',
      'sms': 'text-purple-500 bg-purple-500/10',
      'push': 'text-orange-500 bg-orange-500/10',
      'in-app': 'text-green-500 bg-green-500/10',
      'all': 'text-primary bg-primary/10'
    }
    return colors[channel] || 'text-gray-500 bg-gray-500/10'
  }

  const stats = {
    total: sentNotifications.length,
    delivered: sentNotifications.filter(n => n.deliveryStatus === 'delivered').length,
    sent: sentNotifications.filter(n => n.deliveryStatus === 'sent').length,
    failed: sentNotifications.filter(n => n.deliveryStatus === 'failed').length
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Sent Messages</h1>
        <p className="text-muted-foreground">View and manage all sent notifications</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="flex items-center justify-between mb-2">
            <Send size={20} className="text-primary" />
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
          <div className="text-sm text-muted-foreground">Total Sent</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="flex items-center justify-between mb-2">
            <CheckCheck size={20} className="text-green-500" />
            <span className="text-2xl font-bold text-green-500">{stats.delivered}</span>
          </div>
          <div className="text-sm text-muted-foreground">Delivered</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="flex items-center justify-between mb-2">
            <Clock size={20} className="text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-500">{stats.sent}</span>
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <div className="flex items-center justify-between mb-2">
            <X size={20} className="text-red-500" />
            <span className="text-2xl font-bold text-red-500">{stats.failed}</span>
          </div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
        >
          <option value="all">All Status</option>
          <option value="delivered">Delivered</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>

        {/* Channel Filter */}
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
        >
          <option value="all">All Channels</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
          <option value="in-app">In-App</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.map(message => (
          <div
            key={message.id}
            className="p-5 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all"
          >
            {/* Message Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(message.deliveryStatus)}
                  <h3 className="font-semibold">{message.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(message.deliveryStatus)}`}>
                    {message.deliveryStatus}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getChannelBadge(message.channel)}`}>
                    {message.channel === 'all' ? 'All Channels' : message.channel}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
              </div>
              <button
                onClick={() => setExpandedMessage(expandedMessage === message.id ? null : message.id)}
                className="p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform ${expandedMessage === message.id ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {/* Message Details */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>To: {message.recipientCount} recipients</span>
              <span>•</span>
              <span>Sent: {new Date(message.timestamp).toLocaleString()}</span>
              {message.readCount !== undefined && (
                <>
                  <span>•</span>
                  <span>Read: {message.readCount}/{message.recipientCount}</span>
                </>
              )}
            </div>

            {/* Expanded Content */}
            {expandedMessage === message.id && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                <div>
                  <div className="text-sm font-medium mb-1">Full Message:</div>
                  <div className="text-sm text-muted-foreground p-3 rounded-lg bg-white/5">
                    {message.content}
                  </div>
                </div>
                {message.attachments && message.attachments.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1">Attachments:</div>
                    <div className="flex flex-wrap gap-2">
                      {message.attachments.map((attachment, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded bg-white/10"
                        >
                          {attachment.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    Resend
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    View Recipients
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    Download Report
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <Send size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No messages found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? `No messages match "${searchQuery}"`
              : 'No sent messages to display'}
          </p>
        </div>
      )}
    </div>
  )
}