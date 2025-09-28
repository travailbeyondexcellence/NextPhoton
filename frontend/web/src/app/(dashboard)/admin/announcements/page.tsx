"use client"

import React, { useState, useMemo } from 'react'
import {
  Megaphone,
  Plus,
  Filter,
  Search,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  Pin,
  PinOff,
  Clock,
  AlertTriangle,
  CheckCircle,
  Archive,
  Send,
  Copy,
  FileText,
  Tag,
  ChevronDown,
  X
} from 'lucide-react'
import {
  announcements,
  getActiveAnnouncements,
  getScheduledAnnouncements,
  getExpiredAnnouncements,
  announcementTemplates,
  type Announcement
} from '@/app/(features)/Announcements/announcementsDummyData'

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'expired'>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null)

  // Get announcements based on active tab
  const tabAnnouncements = useMemo(() => {
    switch (activeTab) {
      case 'active': return getActiveAnnouncements()
      case 'scheduled': return getScheduledAnnouncements()
      case 'expired': return getExpiredAnnouncements()
      default: return []
    }
  }, [activeTab])

  // Filter announcements based on search and filters
  const filteredAnnouncements = useMemo(() => {
    return tabAnnouncements.filter(announcement => {
      const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === 'all' || announcement.type === filterType
      const matchesPriority = filterPriority === 'all' || announcement.priority === filterPriority
      return matchesSearch && matchesType && matchesPriority
    })
  }, [tabAnnouncements, searchQuery, filterType, filterPriority])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/10 border-red-500/30'
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/30'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'general': 'text-blue-500 bg-blue-500/10',
      'academic': 'text-purple-500 bg-purple-500/10',
      'administrative': 'text-indigo-500 bg-indigo-500/10',
      'emergency': 'text-red-500 bg-red-500/10',
      'event': 'text-green-500 bg-green-500/10',
      'holiday': 'text-pink-500 bg-pink-500/10'
    }
    return colors[type] || 'text-gray-500 bg-gray-500/10'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} className="text-green-500" />
      case 'scheduled': return <Clock size={16} className="text-yellow-500" />
      case 'expired': return <Archive size={16} className="text-gray-500" />
      default: return <FileText size={16} className="text-gray-500" />
    }
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Megaphone className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
              <p className="text-muted-foreground">Create and manage system-wide announcements</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all"
          >
            <Plus size={18} />
            Create Announcement
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Card */}
        <div
          className={`p-6 rounded-xl border backdrop-blur-sm cursor-pointer transition-all ${
            activeTab === 'active'
              ? 'border-primary/50 bg-primary/10'
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          }`}
          onClick={() => setActiveTab('active')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Active</div>
            <CheckCircle className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold">{getActiveAnnouncements().length}</div>
          <div className="text-sm text-muted-foreground mt-2">Current announcements</div>
        </div>

        {/* Scheduled Card */}
        <div
          className={`p-6 rounded-xl border backdrop-blur-sm cursor-pointer transition-all ${
            activeTab === 'scheduled'
              ? 'border-primary/50 bg-primary/10'
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          }`}
          onClick={() => setActiveTab('scheduled')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Scheduled</div>
            <Clock className="text-yellow-500" size={20} />
          </div>
          <div className="text-3xl font-bold">{getScheduledAnnouncements().length}</div>
          <div className="text-sm text-muted-foreground mt-2">Future announcements</div>
        </div>

        {/* Expired Card */}
        <div
          className={`p-6 rounded-xl border backdrop-blur-sm cursor-pointer transition-all ${
            activeTab === 'expired'
              ? 'border-primary/50 bg-primary/10'
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          }`}
          onClick={() => setActiveTab('expired')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Expired</div>
            <Archive className="text-gray-500" size={20} />
          </div>
          <div className="text-3xl font-bold">{getExpiredAnnouncements().length}</div>
          <div className="text-sm text-muted-foreground mt-2">Past announcements</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
          >
            <option value="all">All Types</option>
            <option value="general">General</option>
            <option value="academic">Academic</option>
            <option value="administrative">Administrative</option>
            <option value="emergency">Emergency</option>
            <option value="event">Event</option>
            <option value="holiday">Holiday</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No announcements found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? `No announcements match "${searchQuery}"` : `No ${activeTab} announcements to display`}
            </p>
          </div>
        ) : (
          filteredAnnouncements.map(announcement => (
            <div
              key={announcement.id}
              className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all"
            >
              {/* Announcement Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(announcement.status)}
                    <h3 className="font-semibold text-lg">{announcement.title}</h3>
                    {announcement.isSticky && <Pin size={16} className="text-primary" />}
                    <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(announcement.type)}`}>
                      {announcement.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>By {announcement.createdBy.userName}</span>
                    <span>•</span>
                    <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {announcement.viewCount} views
                    </span>
                    {announcement.readReceipts.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{announcement.readReceipts.length} read</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedAnnouncement(
                      expandedAnnouncement === announcement.id ? null : announcement.id
                    )}
                    className="p-2 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expandedAnnouncement === announcement.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-all">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Content Preview */}
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {announcement.content}
              </p>

              {/* Tags */}
              {announcement.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {announcement.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded bg-white/10 text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Expanded Content */}
              {expandedAnnouncement === announcement.id && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Full Content:</h4>
                    <div className="p-4 rounded-lg bg-white/5 whitespace-pre-wrap">
                      {announcement.content}
                    </div>
                  </div>

                  {announcement.attachments && announcement.attachments.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Attachments:</h4>
                      <div className="flex flex-wrap gap-2">
                        {announcement.attachments.map((attachment, idx) => (
                          <span
                            key={idx}
                            className="text-sm px-3 py-2 rounded bg-white/10 flex items-center gap-2"
                          >
                            <FileText size={14} />
                            {attachment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Published:</span>
                      <div>{new Date(announcement.publishDate).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expires:</span>
                      <div>{announcement.expiryDate ? new Date(announcement.expiryDate).toLocaleString() : 'Never'}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Visibility:</span>
                      <div className="capitalize">{announcement.visibility}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Notifications:</span>
                      <div className="flex gap-2">
                        {announcement.emailNotification && <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">Email</span>}
                        {announcement.pushNotification && <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Push</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                      <Copy size={14} className="inline mr-2" />
                      Duplicate
                    </button>
                    <button className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                      <Send size={14} className="inline mr-2" />
                      Republish
                    </button>
                    <button className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                      <Users size={14} className="inline mr-2" />
                      View Recipients
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quick Templates Section */}
      <div className="mt-8 p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
        <h3 className="font-semibold mb-4">Quick Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcementTemplates.map(template => (
            <button
              key={template.id}
              className="p-4 text-left rounded-lg bg-white/10 hover:bg-white/20 transition-all"
            >
              <div className="font-medium text-sm">{template.name}</div>
              <div className="text-xs text-muted-foreground mt-1 capitalize">
                {template.type} • {template.priority} priority
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="mt-8 p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
        <h3 className="font-semibold mb-4">Announcement Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <div className="text-sm text-muted-foreground">Total Announcements</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {announcements.reduce((sum, a) => sum + a.viewCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {announcements.filter(a => a.isSticky).length}
            </div>
            <div className="text-sm text-muted-foreground">Pinned</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {announcements.reduce((sum, a) => sum + a.readReceipts.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Reads</div>
          </div>
        </div>
      </div>
    </div>
  )
}