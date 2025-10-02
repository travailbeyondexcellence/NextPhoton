"use client"

import React, { useState } from 'react'
import { History, Search, Filter, Download, Calendar } from 'lucide-react'
import { notifications } from '@/app/(features)/Notifications/notificationsDummyData'

export default function MessageHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredHistory = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || notification.type === typeFilter
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'message': 'text-blue-500 bg-blue-500/10',
      'alert': 'text-red-500 bg-red-500/10',
      'announcement': 'text-green-500 bg-green-500/10',
      'reminder': 'text-yellow-500 bg-yellow-500/10',
      'notification': 'text-purple-500 bg-purple-500/10'
    }
    return colors[type] || 'text-gray-500 bg-gray-500/10'
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <History className="text-primary" size={28} />
            <h1 className="text-3xl font-bold">Message History</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
            <Download size={18} />
            Export History
          </button>
        </div>
        <p className="text-muted-foreground">Complete archive of all sent messages and notifications</p>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
          >
            <option value="all">All Types</option>
            <option value="message">Messages</option>
            <option value="alert">Alerts</option>
            <option value="announcement">Announcements</option>
            <option value="reminder">Reminders</option>
          </select>

          {/* Date Range */}
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
            placeholder="End Date"
          />
        </div>
      </div>

      {/* History Timeline */}
      <div className="space-y-4">
        {filteredHistory.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Timeline connector */}
            {index < filteredHistory.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-white/10" />
            )}

            <div className="flex gap-4">
              {/* Timeline dot */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>

              {/* Message Card */}
              <div className="flex-1 p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                  <span>•</span>
                  <span>To: {item.recipientCount} recipients</span>
                  <span>•</span>
                  <span>Status: {item.deliveryStatus}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-6 text-center">
        <button className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
          Load More History
        </button>
      </div>
    </div>
  )
}