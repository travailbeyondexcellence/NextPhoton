"use client"

import { useState, useMemo } from "react"
import { MessageSquare, Bell, Send, Clock, Users, Filter, Search, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Archive, Star, Paperclip, Calendar, Mail, Smartphone, Monitor, AlertTriangle } from "lucide-react"
import { notifications, getNotificationStats, messageTemplates, recipientGroups, type Notification } from "@/app/(features)/Notifications/notificationsDummyData"

export default function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'sent' | 'scheduled'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const stats = getNotificationStats()

  // Filter notifications based on selections
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const tabMatch =
        selectedTab === 'all' ||
        (selectedTab === 'unread' && notification.status === 'unread') ||
        (selectedTab === 'sent' && (notification.deliveryStatus === 'sent' || notification.deliveryStatus === 'delivered')) ||
        (selectedTab === 'scheduled' && notification.deliveryStatus === 'scheduled')

      const categoryMatch = selectedCategory === "all" || notification.category === selectedCategory
      const typeMatch = selectedType === "all" || notification.type === selectedType
      const searchMatch = searchTerm === "" ||
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.sender.name.toLowerCase().includes(searchTerm.toLowerCase())

      return tabMatch && categoryMatch && typeMatch && searchMatch
    })
  }, [selectedTab, selectedCategory, selectedType, searchTerm])

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message': return <Mail className="h-4 w-4" />
      case 'alert': return <AlertTriangle className="h-4 w-4" />
      case 'announcement': return <MessageSquare className="h-4 w-4" />
      case 'reminder': return <Clock className="h-4 w-4" />
      case 'system': return <Monitor className="h-4 w-4" />
      case 'achievement': return <Star className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'message': return 'text-blue-400 bg-blue-500/20'
      case 'alert': return 'text-red-400 bg-red-500/20'
      case 'announcement': return 'text-purple-400 bg-purple-500/20'
      case 'reminder': return 'text-yellow-400 bg-yellow-500/20'
      case 'system': return 'text-gray-400 bg-gray-500/20'
      case 'achievement': return 'text-green-400 bg-green-500/20'
      default: return 'text-primary bg-primary/20'
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getDeliveryStatusColor = (status: Notification['deliveryStatus']) => {
    switch (status) {
      case 'sent': return 'text-blue-400'
      case 'delivered': return 'text-green-400'
      case 'failed': return 'text-red-400'
      case 'pending': return 'text-yellow-400'
      case 'scheduled': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getChannelIcon = (channel: Notification['channel']) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />
      case 'sms': return <Smartphone className="h-3 w-3" />
      case 'push': return <Bell className="h-3 w-3" />
      case 'in-app': return <Monitor className="h-3 w-3" />
      case 'all': return <Users className="h-3 w-3" />
      default: return <MessageSquare className="h-3 w-3" />
    }
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground">Manage system notifications and alerts</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Send className="h-4 w-4" />
            Compose New
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Unread Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Unread</div>
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{stats.unread}</div>
          <div className="text-xs text-muted-foreground mt-2">New notifications</div>
        </div>

        {/* Sent Today Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Sent</div>
            <Send className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold">{stats.sent}</div>
          <div className="text-xs text-muted-foreground mt-2">Delivered messages</div>
        </div>

        {/* Scheduled Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Scheduled</div>
            <Clock className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold">{stats.scheduled}</div>
          <div className="text-xs text-muted-foreground mt-2">Pending delivery</div>
        </div>

        {/* Failed Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Failed</div>
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
          <div className="text-xs text-muted-foreground mt-2">Delivery failed</div>
        </div>

        {/* Total Recipients Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Recipients</div>
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold">{recipientGroups.reduce((sum, g) => sum + g.members.length, 0)}</div>
          <div className="text-xs text-muted-foreground mt-2">Active users</div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 mb-6">
        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-white/10">
          <div className="flex">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: stats.unread },
              { key: 'sent', label: 'Sent', count: stats.sent },
              { key: 'scheduled', label: 'Scheduled', count: stats.scheduled }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`px-6 py-3 text-sm font-medium transition-all relative ${
                  selectedTab === tab.key
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 m-2 text-sm bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="all">All Categories</option>
                  <option value="Academic">Academic</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Emergency">Emergency</option>
                  <option value="General">General</option>
                  <option value="Personal">Personal</option>
                  <option value="System">System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="all">All Types</option>
                  <option value="message">Message</option>
                  <option value="alert">Alert</option>
                  <option value="announcement">Announcement</option>
                  <option value="reminder">Reminder</option>
                  <option value="system">System</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden ${
              notification.status === 'unread' ? 'border-primary/50' : ''
            }`}
          >
            {/* Notification Header */}
            <div
              className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setExpandedNotification(expandedNotification === notification.id ? null : notification.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {/* Status Indicator */}
                  {notification.status === 'unread' && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  )}

                  {/* Type Icon */}
                  <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className={`text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {notification.priority} priority
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{notification.content}</p>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>From: {notification.sender.name} ({notification.sender.role})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(notification.timestamp).toLocaleString()}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${getDeliveryStatusColor(notification.deliveryStatus)}`}>
                        <CheckCircle className="h-3 w-3" />
                        <span>{notification.deliveryStatus}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {getChannelIcon(notification.channel)}
                        <span>{notification.channel}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {notification.actions.map((action, idx) => (
                          <button
                            key={idx}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              action.type === 'primary' ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
                              action.type === 'secondary' ? 'bg-secondary/20 text-secondary hover:bg-secondary/30' :
                              'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  {expandedNotification === notification.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedNotification === notification.id && (
              <div className="px-4 pb-4 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Recipient Information */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recipient Details</h4>
                    <div className="bg-black/20 rounded-lg p-3 space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">To: </span>
                        <span>{notification.recipient.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Role: </span>
                        <span>{notification.recipient.role}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type: </span>
                        <span className="capitalize">{notification.recipient.type}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Category: </span>
                        <span>{notification.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  {notification.metadata && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Additional Information</h4>
                      <div className="bg-black/20 rounded-lg p-3 space-y-2 text-sm">
                        {notification.metadata.className && (
                          <div>
                            <span className="text-muted-foreground">Class: </span>
                            <span>{notification.metadata.className}</span>
                          </div>
                        )}
                        {notification.metadata.subjectName && (
                          <div>
                            <span className="text-muted-foreground">Subject: </span>
                            <span>{notification.metadata.subjectName}</span>
                          </div>
                        )}
                        {notification.scheduledFor && (
                          <div>
                            <span className="text-muted-foreground">Scheduled: </span>
                            <span>{new Date(notification.scheduledFor).toLocaleString()}</span>
                          </div>
                        )}
                        {notification.expiresAt && (
                          <div>
                            <span className="text-muted-foreground">Expires: </span>
                            <span>{new Date(notification.expiresAt).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Attachments */}
                {notification.attachments && notification.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Attachments</h4>
                    <div className="flex flex-wrap gap-2">
                      {notification.attachments.map((attachment, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded-lg">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{attachment.name}</span>
                          <span className="text-xs text-muted-foreground">({attachment.size})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Read By */}
                {notification.readBy && notification.readBy.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Read By ({notification.readBy.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {notification.readBy.map((reader, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                          User {reader.userId} - {new Date(reader.readAt).toLocaleDateString()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  {notification.status === 'unread' && (
                    <button className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                      Mark as Read
                    </button>
                  )}
                  <button className="px-3 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors text-sm">
                    <Archive className="h-4 w-4 inline mr-1" />
                    Archive
                  </button>
                  {notification.deliveryStatus === 'failed' && (
                    <button className="px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors text-sm">
                      Retry Send
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No notifications found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
        </div>
      )}

      {/* Quick Templates Section */}
      <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold mb-4">Quick Message Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {messageTemplates.slice(0, 3).map((template) => (
            <div key={template.id} className="bg-black/20 rounded-lg p-4">
              <h3 className="font-medium mb-2">{template.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{template.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-primary">Used {template.usageCount} times</span>
                <button className="text-xs px-2 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}