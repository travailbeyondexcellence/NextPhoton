"use client"

import { useState, useMemo } from "react"
import { Clock, Calendar, Mail, Settings, Plus, Edit2, Trash2, Play, Pause, FileText, Users, BookOpen, Target, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { studentPerformances, classPerformanceMetrics } from "@/app/(features)/Performance/comprehensivePerformanceData"

interface ScheduledReport {
  id: string
  name: string
  description: string
  reportType: 'comprehensive' | 'subject' | 'class' | 'individual' | 'custom'
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
    time: string
    dayOfWeek?: number
    dayOfMonth?: number
  }
  recipients: {
    email: string
    name: string
    role: string
  }[]
  filters: {
    subjects?: string[]
    classes?: string[]
    students?: string[]
    timeframe: string
  }
  format: 'pdf' | 'excel' | 'html'
  isActive: boolean
  createdAt: string
  lastRun?: string
  nextRun?: string
  runCount: number
  status: 'active' | 'paused' | 'failed' | 'completed'
}

export default function ScheduledReportsPage() {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: 'sched_001',
      name: 'Weekly Performance Summary',
      description: 'Comprehensive weekly performance overview for all classes',
      reportType: 'comprehensive',
      schedule: {
        frequency: 'weekly',
        time: '09:00',
        dayOfWeek: 1 // Monday
      },
      recipients: [
        { email: 'admin@nextphoton.edu', name: 'System Admin', role: 'Admin' },
        { email: 'principal@nextphoton.edu', name: 'Principal', role: 'Principal' }
      ],
      filters: {
        timeframe: 'week'
      },
      format: 'pdf',
      isActive: true,
      createdAt: '2024-09-01T10:00:00Z',
      lastRun: '2024-09-23T09:00:00Z',
      nextRun: '2024-09-30T09:00:00Z',
      runCount: 12,
      status: 'active'
    },
    {
      id: 'sched_002',
      name: 'Monthly Mathematics Report',
      description: 'Detailed mathematics performance analysis',
      reportType: 'subject',
      schedule: {
        frequency: 'monthly',
        time: '14:00',
        dayOfMonth: 1
      },
      recipients: [
        { email: 'math.dept@nextphoton.edu', name: 'Math Department', role: 'Department Head' }
      ],
      filters: {
        subjects: ['Mathematics'],
        timeframe: 'month'
      },
      format: 'excel',
      isActive: true,
      createdAt: '2024-08-15T14:30:00Z',
      lastRun: '2024-09-01T14:00:00Z',
      nextRun: '2024-10-01T14:00:00Z',
      runCount: 2,
      status: 'active'
    },
    {
      id: 'sched_003',
      name: 'Daily Attendance Alert',
      description: 'Daily attendance summary for all classes',
      reportType: 'class',
      schedule: {
        frequency: 'daily',
        time: '17:00'
      },
      recipients: [
        { email: 'attendance@nextphoton.edu', name: 'Attendance Officer', role: 'Staff' }
      ],
      filters: {
        timeframe: 'day'
      },
      format: 'html',
      isActive: false,
      createdAt: '2024-09-10T09:00:00Z',
      lastRun: '2024-09-20T17:00:00Z',
      nextRun: undefined,
      runCount: 15,
      status: 'paused'
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null)
  const [newReport, setNewReport] = useState<Partial<ScheduledReport>>({
    name: '',
    description: '',
    reportType: 'comprehensive',
    schedule: {
      frequency: 'weekly',
      time: '09:00',
      dayOfWeek: 1
    },
    recipients: [],
    filters: {
      timeframe: 'week'
    },
    format: 'pdf',
    isActive: true
  })

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ]

  const reportTypes = [
    { value: 'comprehensive', label: 'Comprehensive Report', icon: <Target className="h-4 w-4" /> },
    { value: 'subject', label: 'Subject Analysis', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'class', label: 'Class Report', icon: <Users className="h-4 w-4" /> },
    { value: 'individual', label: 'Individual Student', icon: <Users className="h-4 w-4" /> },
    { value: 'custom', label: 'Custom Report', icon: <Settings className="h-4 w-4" /> }
  ]

  const toggleReportStatus = (reportId: string) => {
    setScheduledReports(prev => prev.map(report =>
      report.id === reportId
        ? {
            ...report,
            isActive: !report.isActive,
            status: !report.isActive ? 'active' : 'paused',
            nextRun: !report.isActive ? calculateNextRun(report.schedule) : undefined
          }
        : report
    ))
  }

  const calculateNextRun = (schedule: ScheduledReport['schedule']): string => {
    const now = new Date()
    const [hours, minutes] = schedule.time.split(':').map(Number)

    let nextRun = new Date()
    nextRun.setHours(hours, minutes, 0, 0)

    switch (schedule.frequency) {
      case 'daily':
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1)
        }
        break
      case 'weekly':
        const targetDay = schedule.dayOfWeek || 1
        const currentDay = nextRun.getDay()
        const daysUntilTarget = (targetDay - currentDay + 7) % 7
        if (daysUntilTarget === 0 && nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 7)
        } else {
          nextRun.setDate(nextRun.getDate() + daysUntilTarget)
        }
        break
      case 'monthly':
        nextRun.setDate(schedule.dayOfMonth || 1)
        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1)
        }
        break
      case 'quarterly':
        // Implement quarterly logic
        break
    }

    return nextRun.toISOString()
  }

  const runReportNow = (reportId: string) => {
    setScheduledReports(prev => prev.map(report =>
      report.id === reportId
        ? {
            ...report,
            lastRun: new Date().toISOString(),
            runCount: report.runCount + 1,
            status: 'completed'
          }
        : report
    ))
    alert('Report executed successfully!')
  }

  const deleteReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this scheduled report?')) {
      setScheduledReports(prev => prev.filter(report => report.id !== reportId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'paused': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      case 'completed': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4" />
      case 'paused': return <Pause className="h-4 w-4" />
      case 'failed': return <AlertCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle2 className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const activeReports = scheduledReports.filter(r => r.isActive).length
  const totalRuns = scheduledReports.reduce((sum, r) => sum + r.runCount, 0)

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Scheduled Reports</h1>
              <p className="text-muted-foreground">Automate performance report generation and delivery</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Schedule
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Schedules</span>
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{scheduledReports.length}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Active Reports</span>
            <CheckCircle2 className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{activeReports}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Runs</span>
            <RefreshCw className="h-5 w-5 text-secondary" />
          </div>
          <div className="text-2xl font-bold text-secondary">{totalRuns}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Next Run</span>
            <Clock className="h-5 w-5 text-accent" />
          </div>
          <div className="text-sm font-bold text-accent">
            {scheduledReports
              .filter(r => r.isActive && r.nextRun)
              .sort((a, b) => new Date(a.nextRun!).getTime() - new Date(b.nextRun!).getTime())[0]
              ?.nextRun ?
              new Date(scheduledReports
                .filter(r => r.isActive && r.nextRun)
                .sort((a, b) => new Date(a.nextRun!).getTime() - new Date(b.nextRun!).getTime())[0]
                .nextRun!).toLocaleDateString() : 'None scheduled'
            }
          </div>
        </div>
      </div>

      {/* Scheduled Reports List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <div className="p-6 border-b border-white/20">
          <h3 className="text-lg font-semibold">Scheduled Reports</h3>
        </div>

        <div className="divide-y divide-white/10">
          {scheduledReports.map(report => (
            <div key={report.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{report.name}</h4>
                    <div className={`flex items-center gap-1 ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="text-xs capitalize">{report.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{report.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type: </span>
                      <span className="font-medium capitalize">{report.reportType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Frequency: </span>
                      <span className="font-medium capitalize">{report.schedule.frequency}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time: </span>
                      <span className="font-medium">{report.schedule.time}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Format: </span>
                      <span className="font-medium uppercase">{report.format}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Recipients: </span>
                      <span className="font-medium">{report.recipients.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Run Count: </span>
                      <span className="font-medium">{report.runCount}</span>
                    </div>
                    {report.lastRun && (
                      <div>
                        <span className="text-muted-foreground">Last Run: </span>
                        <span className="font-medium">{new Date(report.lastRun).toLocaleDateString()}</span>
                      </div>
                    )}
                    {report.nextRun && (
                      <div>
                        <span className="text-muted-foreground">Next Run: </span>
                        <span className="font-medium">{new Date(report.nextRun).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Recipients */}
                  <div className="mt-3">
                    <span className="text-muted-foreground text-sm">Recipients: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {report.recipients.map((recipient, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                          {recipient.name} ({recipient.role})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleReportStatus(report.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      report.isActive
                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                    title={report.isActive ? 'Pause' : 'Activate'}
                  >
                    {report.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>

                  <button
                    onClick={() => runReportNow(report.id)}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    title="Run Now"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setEditingReport(report)}
                    className="p-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => deleteReport(report.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {scheduledReports.length === 0 && (
            <div className="p-12 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-medium mb-2">No Scheduled Reports</h3>
              <p className="text-muted-foreground mb-4">Create your first scheduled report to automate report generation</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Schedule
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Templates
          </h3>
          <div className="space-y-2">
            <button className="w-full p-2 text-left rounded bg-black/20 hover:bg-black/30 transition-colors text-sm">
              Daily Attendance Report
            </button>
            <button className="w-full p-2 text-left rounded bg-black/20 hover:bg-black/30 transition-colors text-sm">
              Weekly Performance Summary
            </button>
            <button className="w-full p-2 text-left rounded bg-black/20 hover:bg-black/30 transition-colors text-sm">
              Monthly Grade Report
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Recent Deliveries
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Weekly Summary</span>
              <span className="text-green-400">Sent</span>
            </div>
            <div className="flex justify-between">
              <span>Math Department Report</span>
              <span className="text-green-400">Sent</span>
            </div>
            <div className="flex justify-between">
              <span>Attendance Alert</span>
              <span className="text-yellow-400">Pending</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Scheduler Service</span>
              <span className="text-green-400 text-xs">Running</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Service</span>
              <span className="text-green-400 text-xs">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Report Engine</span>
              <span className="text-green-400 text-xs">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}