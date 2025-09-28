"use client"

import { useState, useMemo } from "react"
import { Calendar, Clock, BookOpen, CheckCircle, AlertCircle, Users, Filter, Plus } from "lucide-react"
import { dailyStudyPlans } from "@/app/(features)/LearningActivities/learningActivitiesDummyData"

export default function DailyStudyPlanPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Calculate stats for today
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayPlans = dailyStudyPlans.filter(plan => plan.date === today)
    const completed = dailyStudyPlans.filter(plan => plan.status === "Completed").length
    const pending = dailyStudyPlans.filter(plan => plan.status === "Pending").length
    const active = dailyStudyPlans.filter(plan => plan.status === "Active").length

    return {
      todayPlans: todayPlans.length,
      completed,
      pending,
      active
    }
  }, [])

  // Filter plans based on selected date and status
  const filteredPlans = useMemo(() => {
    return dailyStudyPlans.filter(plan => {
      const matchesDate = plan.date === selectedDate
      const matchesStatus = statusFilter === "all" || plan.status === statusFilter
      return matchesDate && matchesStatus
    })
  }, [selectedDate, statusFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: { color: "bg-green-500/20 text-green-300 border-green-500/50", icon: <Clock className="h-3 w-3" /> },
      Completed: { color: "bg-blue-500/20 text-blue-300 border-blue-500/50", icon: <CheckCircle className="h-3 w-3" /> },
      Pending: { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", icon: <AlertCircle className="h-3 w-3" /> },
      Cancelled: { color: "bg-red-500/20 text-red-300 border-red-500/50", icon: <AlertCircle className="h-3 w-3" /> }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {status}
      </span>
    )
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      High: "text-red-400",
      Medium: "text-yellow-400",
      Low: "text-green-400"
    }
    return colors[priority as keyof typeof colors]
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-full p-6 space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Daily Study Plan</h1>
            <p className="text-muted-foreground">Manage daily study schedules and activities</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Today's Plans</h3>
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.todayPlans}</p>
          <p className="text-sm text-muted-foreground">Active study plans</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Completed</h3>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
          <p className="text-sm text-muted-foreground">Plans completed</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Pending</h3>
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Plans pending review</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Active</h3>
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.active}</p>
          <p className="text-sm text-muted-foreground">Currently active</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm text-muted-foreground">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 bg-black/20 border border-white/10 rounded text-foreground text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 bg-black/20 border border-white/10 rounded text-foreground text-sm"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button className="ml-auto px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Plan
          </button>
        </div>
      </div>

      {/* Study Plans List */}
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No study plans found</h3>
            <p className="text-muted-foreground">
              {selectedDate === new Date().toISOString().split('T')[0]
                ? "No study plans scheduled for today."
                : `No study plans found for ${formatDate(selectedDate)}.`}
            </p>
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white/10 backdrop-blur-sm rounded-lg border ${
                selectedPlan === plan.id ? 'border-primary' : 'border-white/20'
              } hover:bg-white/15 transition-all cursor-pointer`}
              onClick={() => setSelectedPlan(plan.id === selectedPlan ? null : plan.id)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{plan.title}</h3>
                      {getStatusBadge(plan.status)}
                      <span className={`text-sm font-medium ${getPriorityColor(plan.priority)}`}>
                        {plan.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(plan.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Educator: {plan.educatorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{plan.totalStudyTime} min total</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">
                      {plan.completedTime}/{plan.totalStudyTime} min ({Math.round((plan.completedTime / plan.totalStudyTime) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                      style={{ width: `${(plan.completedTime / plan.totalStudyTime) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.subjects.map((subject, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      {subject}
                    </span>
                  ))}
                </div>

                {/* Time Slots Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Time Slots ({plan.timeSlots.length})</h4>
                  <div className="space-y-2">
                    {plan.timeSlots.slice(0, 2).map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between bg-black/20 rounded p-2">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${
                            slot.isCompleted ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <span className="text-sm font-medium">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                          <span className="text-sm text-muted-foreground">{slot.subject}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{slot.topic}</span>
                      </div>
                    ))}
                    {plan.timeSlots.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{plan.timeSlots.length - 2} more time slots</span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedPlan === plan.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {/* All Time Slots */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-3">All Time Slots</h4>
                      <div className="space-y-3">
                        {plan.timeSlots.map((slot) => (
                          <div key={slot.id} className="bg-black/20 rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className={`h-3 w-3 rounded-full ${
                                  slot.isCompleted ? 'bg-green-400' : 'bg-gray-400'
                                }`} />
                                <span className="font-medium">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                                <span className="text-primary">{slot.subject}</span>
                              </div>
                              {slot.isCompleted && (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              )}
                            </div>
                            <div className="ml-6">
                              <h5 className="text-sm font-medium mb-1">{slot.topic}</h5>
                              <div className="text-xs text-muted-foreground mb-2">
                                <strong>Activities:</strong> {slot.activities.join(", ")}
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">
                                <strong>Resources:</strong> {slot.resources.join(", ")}
                              </div>
                              {slot.notes && (
                                <div className="text-xs text-muted-foreground italic">
                                  <strong>Notes:</strong> {slot.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors">
                        Edit Plan
                      </button>
                      <button className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors">
                        Mark Complete
                      </button>
                      <button className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}