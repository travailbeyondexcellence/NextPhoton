"use client"

import React, { useState, useMemo, useEffect } from 'react'
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
  X,
  Upload,
  Save
} from 'lucide-react'
import { type Announcement } from '@/app/(features)/Announcements/announcement-types'
import { GlassModal } from '@/components/glass/GlassModal'

export default function AnnouncementsPage() {
  // Local state for announcements (loaded from API)
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'expired'>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false) // Track if editing or creating
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null)

  // Fetch announcements from API on component mount
  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/announcements')
      const result = await response.json()

      if (result.success) {
        setAllAnnouncements(result.data)
      } else {
        console.error('Failed to fetch announcements:', result.error)
        // No fallback data - show empty state
        setAllAnnouncements([])
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
      // No fallback data - show empty state
      setAllAnnouncements([])
    } finally {
      setIsLoading(false)
    }
  }

  // Form state for creating new announcement
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general' as Announcement['type'],
    priority: 'medium' as Announcement['priority'],
    visibility: 'all' as Announcement['visibility'],
    publishDate: new Date().toISOString().slice(0, 16),
    expiryDate: '',
    isSticky: false,
    emailNotification: false,
    pushNotification: false,
    tags: '',
  })

  // Handle form input changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      priority: 'medium',
      visibility: 'all',
      publishDate: new Date().toISOString().slice(0, 16),
      expiryDate: '',
      isSticky: false,
      emailNotification: false,
      pushNotification: false,
      tags: '',
    })
    setIsEditMode(false)
    setEditingAnnouncementId(null)
  }

  // Handle form submission (Create or Update)
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()

    // Determine status based on publish date
    const now = new Date()
    const publishDate = new Date(formData.publishDate)
    const expiryDate = formData.expiryDate ? new Date(formData.expiryDate) : null

    let status: Announcement['status'] = 'active'
    if (publishDate > now) {
      status = 'scheduled'
    } else if (expiryDate && expiryDate < now) {
      status = 'expired'
    }

    if (isEditMode && editingAnnouncementId) {
      // UPDATE existing announcement
      const existingAnnouncement = allAnnouncements.find(a => a.id === editingAnnouncementId)

      const updatedAnnouncement: Announcement = {
        ...existingAnnouncement!,
        title: formData.title,
        content: formData.content,
        type: formData.type,
        priority: formData.priority,
        status: status,
        visibility: formData.visibility,
        publishDate: new Date(formData.publishDate).toISOString(),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        isSticky: formData.isSticky,
        emailNotification: formData.emailNotification,
        pushNotification: formData.pushNotification,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        updatedAt: new Date().toISOString(),
      }

      try {
        // Update via API (mock database file)
        const response = await fetch('/api/announcements', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedAnnouncement),
        })

        const result = await response.json()

        if (result.success) {
          // Update local state
          setAllAnnouncements(prev =>
            prev.map(a => a.id === editingAnnouncementId ? updatedAnnouncement : a)
          )

          // Show success message
          alert('Announcement updated and saved to database successfully!')

          // Close modal and reset form
          setShowCreateForm(false)
          resetForm()
        } else {
          alert(`Failed to update announcement: ${result.message}`)
        }
      } catch (error) {
        console.error('Error updating announcement:', error)
        alert('Failed to update announcement. Please try again.')
      }
    } else {
      // CREATE new announcement
      const newAnnouncement: Announcement = {
        id: `annc${Date.now()}`, // Generate unique ID
        title: formData.title,
        content: formData.content,
        type: formData.type,
        priority: formData.priority,
        status: status,
        visibility: formData.visibility,
        publishDate: new Date(formData.publishDate).toISOString(),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        isSticky: formData.isSticky,
        emailNotification: formData.emailNotification,
        pushNotification: formData.pushNotification,
        createdBy: {
          userId: 'admin001', // TODO: Get from authenticated user
          userName: 'Current Admin' // TODO: Get from authenticated user
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        readReceipts: [],
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        attachments: []
      }

      try {
        // Save to API (mock database file)
        const response = await fetch('/api/announcements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAnnouncement),
        })

        const result = await response.json()

        if (result.success) {
          // Update local state with the new announcement
          setAllAnnouncements(prev => [newAnnouncement, ...prev])

          // Show success message
          alert('Announcement created and saved to database successfully!')

          // Close modal and reset form
          setShowCreateForm(false)
          resetForm()
        } else {
          alert(`Failed to create announcement: ${result.message}`)
        }
      } catch (error) {
        console.error('Error creating announcement:', error)
        alert('Failed to create announcement. Please try again.')
      }
    }
  }

  // Handle edit button click
  const handleEditAnnouncement = (announcement: Announcement) => {
    // Populate form with existing announcement data
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      visibility: announcement.visibility,
      publishDate: new Date(announcement.publishDate).toISOString().slice(0, 16),
      expiryDate: announcement.expiryDate ? new Date(announcement.expiryDate).toISOString().slice(0, 16) : '',
      isSticky: announcement.isSticky,
      emailNotification: announcement.emailNotification,
      pushNotification: announcement.pushNotification,
      tags: announcement.tags.join(', '),
    })

    setIsEditMode(true)
    setEditingAnnouncementId(announcement.id)
    setShowCreateForm(true)
  }

  // Handle delete button click
  const handleDeleteAnnouncement = async (announcementId: string) => {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      return
    }

    try {
      // Delete via API (mock database file)
      const response = await fetch(`/api/announcements?id=${announcementId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        // Update local state - remove the deleted announcement
        setAllAnnouncements(prev => prev.filter(a => a.id !== announcementId))

        // Show success message
        alert('Announcement deleted successfully!')
      } else {
        alert(`Failed to delete announcement: ${result.message}`)
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      alert('Failed to delete announcement. Please try again.')
    }
  }

  // Get announcements based on active tab (using local state)
  const tabAnnouncements = useMemo(() => {
    switch (activeTab) {
      case 'active': return allAnnouncements.filter(a => a.status === 'active')
      case 'scheduled': return allAnnouncements.filter(a => a.status === 'scheduled')
      case 'expired': return allAnnouncements.filter(a => a.status === 'expired')
      default: return []
    }
  }, [activeTab, allAnnouncements])

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
          <div className="text-3xl font-bold">{allAnnouncements.filter(a => a.status === 'active').length}</div>
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
          <div className="text-3xl font-bold">{allAnnouncements.filter(a => a.status === 'scheduled').length}</div>
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
          <div className="text-3xl font-bold">{allAnnouncements.filter(a => a.status === 'expired').length}</div>
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
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading announcements...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the data</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
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
                    title="Expand/Collapse"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expandedAnnouncement === announcement.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <button
                    onClick={() => handleEditAnnouncement(announcement)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-all"
                    title="Edit Announcement"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-all"
                    title="Delete Announcement"
                  >
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

      {/* Quick Templates Section - TODO: Implement template system */}
      {/* Templates have been moved to a dedicated feature and will be implemented later */}

      {/* Statistics Summary */}
      <div className="mt-8 p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
        <h3 className="font-semibold mb-4">Announcement Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold">{allAnnouncements.length}</div>
            <div className="text-sm text-muted-foreground">Total Announcements</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {allAnnouncements.reduce((sum, a) => sum + a.viewCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {allAnnouncements.filter(a => a.isSticky).length}
            </div>
            <div className="text-sm text-muted-foreground">Pinned</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {allAnnouncements.reduce((sum, a) => sum + a.readReceipts.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Reads</div>
          </div>
        </div>
      </div>

      {/* Create Announcement Modal */}
      <GlassModal
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false)
          resetForm()
        }}
        size="xl"
        className="max-h-[90vh] overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Megaphone className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">
                {isEditMode ? 'Edit Announcement' : 'Create New Announcement'}
              </h2>
            </div>
            <button
              onClick={() => {
                setShowCreateForm(false)
                resetForm()
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateAnnouncement} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="Enter announcement title..."
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleFormChange('content', e.target.value)}
                placeholder="Enter announcement content..."
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all resize-none"
              />
            </div>

            {/* Type and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleFormChange('type', e.target.value as Announcement['type'])}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="administrative">Administrative</option>
                  <option value="emergency">Emergency</option>
                  <option value="event">Event</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleFormChange('priority', e.target.value as Announcement['priority'])}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Visibility <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => handleFormChange('visibility', e.target.value as Announcement['visibility'])}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="all">All Users</option>
                <option value="learners">Learners Only</option>
                <option value="educators">Educators Only</option>
                <option value="admins">Admins Only</option>
                <option value="guardians">Guardians Only</option>
                <option value="employees">Employees Only</option>
              </select>
            </div>

            {/* Date Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Publish Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Publish Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishDate}
                  onChange={(e) => handleFormChange('publishDate', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.expiryDate}
                  onChange={(e) => handleFormChange('expiryDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (Optional)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleFormChange('tags', e.target.value)}
                placeholder="Enter tags separated by commas (e.g., important, exam, event)"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isSticky}
                  onChange={(e) => handleFormChange('isSticky', e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-white/10 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <div className="flex items-center gap-2">
                  <Pin size={16} className="text-primary" />
                  <span className="text-sm">Pin this announcement (sticky)</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailNotification}
                  onChange={(e) => handleFormChange('emailNotification', e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-white/10 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" />
                  <span className="text-sm">Send email notification</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pushNotification}
                  onChange={(e) => handleFormChange('pushNotification', e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-white/10 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <div className="flex items-center gap-2">
                  <Send size={16} className="text-green-500" />
                  <span className="text-sm">Send push notification</span>
                </div>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  resetForm()
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {isEditMode ? 'Update Announcement' : 'Create Announcement'}
              </button>
            </div>
          </form>
        </div>
      </GlassModal>
    </div>
  )
}