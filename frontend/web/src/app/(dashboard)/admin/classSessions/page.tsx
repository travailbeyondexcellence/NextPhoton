"use client"

import { useState, useMemo } from "react"
import { Building2, Calendar, Clock, Users, Video, CircleDot, CheckCircle, XCircle, Search, Filter } from "lucide-react"
import classSessions from "@/app/(features)/ClassSessions/classSessionsDummyData"

export default function ClassSessionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

    const liveSessions = classSessions.filter(s => s.status === "live").length
    const todaySessions = classSessions.filter(s => {
      const sessionDate = new Date(s.scheduledAt)
      return sessionDate >= todayStart && sessionDate < todayEnd
    }).length
    const totalThisMonth = classSessions.filter(s => {
      const sessionDate = new Date(s.scheduledAt)
      return sessionDate.getMonth() === now.getMonth() && sessionDate.getFullYear() === now.getFullYear()
    }).length

    return { liveSessions, todaySessions, totalThisMonth }
  }, [])

  // Get unique subjects for filter
  const subjects = useMemo(() => {
    const uniqueSubjects = [...new Set(classSessions.map(s => s.subject).filter(Boolean))]
    return uniqueSubjects.sort()
  }, [])

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return classSessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.educatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.subject?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || session.status === statusFilter
      const matchesSubject = subjectFilter === "all" || session.subject === subjectFilter

      return matchesSearch && matchesStatus && matchesSubject
    })
  }, [searchTerm, statusFilter, subjectFilter])

  // Sort sessions by date (live first, then scheduled, then completed)
  const sortedSessions = useMemo(() => {
    return [...filteredSessions].sort((a, b) => {
      const statusOrder = { live: 0, scheduled: 1, completed: 2, cancelled: 3 }
      if (a.status !== b.status) {
        return statusOrder[a.status] - statusOrder[b.status]
      }
      return new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    })
  }, [filteredSessions])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <CircleDot className="h-4 w-4 text-red-500 animate-pulse" />
      case "scheduled":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      live: "bg-red-500/20 text-red-300 border-red-500/50",
      scheduled: "bg-blue-500/20 text-blue-300 border-blue-500/50",
      completed: "bg-green-500/20 text-green-300 border-green-500/50",
      cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Class Sessions</h1>
            <p className="text-muted-foreground">Manage and monitor class sessions</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Sessions Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Live Sessions</div>
            <div className="text-red-500">
              <CircleDot className="h-5 w-5 animate-pulse" />
            </div>
          </div>
          <div className="text-2xl font-bold">{stats.liveSessions}</div>
          <div className="text-xs text-muted-foreground mt-2">Currently active</div>
        </div>

        {/* Today's Sessions Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Today's Sessions</div>
            <div className="text-secondary">📅</div>
          </div>
          <div className="text-2xl font-bold">{stats.todaySessions}</div>
          <div className="text-xs text-muted-foreground mt-2">Scheduled for today</div>
        </div>

        {/* Total Sessions Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Total Sessions</div>
            <div className="text-accent">📊</div>
          </div>
          <div className="text-2xl font-bold">{stats.totalThisMonth}</div>
          <div className="text-xs text-muted-foreground mt-2">This month</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sessions, educators, batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Status</option>
            <option value="live">Live</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Class Sessions List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Class Sessions ({sortedSessions.length})</h2>
        </div>

        <div className="divide-y divide-white/10">
          {sortedSessions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No sessions found matching your criteria
            </div>
          ) : (
            sortedSessions.map((session) => (
              <div key={session.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Session Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{session.title}</h3>
                          {getStatusBadge(session.status)}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{session.educatorName || "Unknown Educator"}</span>
                          </div>
                          {session.subject && (
                            <div className="flex items-center gap-1">
                              <span className="text-primary">📚</span>
                              <span>{session.subject}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(session.scheduledAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(session.scheduledAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>⏱️</span>
                            <span>{session.durationMinutes} min</span>
                          </div>
                        </div>

                        {/* Batch and Students */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          {session.batchName && (
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md">
                              {session.batchName}
                            </span>
                          )}
                          {session.enrolledStudents && (
                            <span className="text-muted-foreground">
                              {session.enrolledStudents} students enrolled
                            </span>
                          )}
                          {session.learnersPresent && (
                            <span className="text-green-400">
                              {session.learnersPresent.length} attended
                            </span>
                          )}
                        </div>

                        {/* Topics */}
                        {session.topicsCovered && session.topicsCovered.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {session.topicsCovered.map((topic, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white/10 text-xs rounded-md">
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Notes */}
                        {session.notes && (
                          <p className="text-sm text-muted-foreground italic mt-2">{session.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Join
                    </button>
                    {session.recordingUrl && (
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-foreground rounded-lg transition-colors">
                        📹 Recording
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}