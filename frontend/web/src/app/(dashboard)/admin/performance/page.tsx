"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { FileText, TrendingUp, Award, AlertTriangle, Users, BookOpen, Target, Clock, Filter, Search, ChevronDown, ChevronUp, ChevronRight, BarChart3, PieChart, Settings, Download, Calendar, User } from "lucide-react"
import { overallStats, studentPerformances, classPerformanceMetrics, performanceTrends, alertsAndInsights } from "@/app/(features)/Performance/comprehensivePerformanceData"

export default function PerformancePage() {
  const router = useRouter()
  const [selectedTimeframe, setSelectedTimeframe] = useState("current")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showStudentDetails, setShowStudentDetails] = useState(false)
  const [showAnalyticsDropdown, setShowAnalyticsDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAnalyticsDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Analytics navigation options
  const analyticsOptions = [
    {
      category: "Performance Analytics",
      items: [
        {
          icon: BarChart3,
          label: "Overall Performance Dashboard",
          href: "/admin/performance",
          isActive: true
        },
        {
          icon: User,
          label: "Individual Student Analytics",
          href: "/admin/performance/individual-analytics"
        },
        {
          icon: Users,
          label: "Class-wise Performance",
          href: "/admin/performance/class-performance"
        },
        {
          icon: BookOpen,
          label: "Subject-wise Analytics",
          href: "/admin/performance/subject-analytics"
        }
      ]
    },
    {
      category: "Reports",
      items: [
        {
          icon: FileText,
          label: "Generate Performance Report",
          href: "/admin/performance/generate-report"
        },
        {
          icon: Download,
          label: "Export Analytics Data",
          href: "/admin/performance/export-data"
        },
        {
          icon: Settings,
          label: "Custom Report Builder",
          href: "/admin/performance/custom-report-builder"
        },
        {
          icon: Clock,
          label: "Scheduled Reports",
          href: "/admin/performance/scheduled-reports"
        }
      ]
    }
  ]

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    return studentPerformances.filter(student =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.overallGrade.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  // Get performance distribution
  const performanceDistribution = useMemo(() => {
    const distribution = { excellent: 0, good: 0, average: 0, needsImprovement: 0 }
    studentPerformances.forEach(student => {
      if (student.overallPercentage >= 90) distribution.excellent++
      else if (student.overallPercentage >= 80) distribution.good++
      else if (student.overallPercentage >= 60) distribution.average++
      else distribution.needsImprovement++
    })
    return distribution
  }, [])

  const getGradeColor = (grade: string) => {
    const colors = {
      'A': 'text-green-400',
      'A+': 'text-green-400',
      'A-': 'text-green-400',
      'B': 'text-blue-400',
      'B+': 'text-blue-400',
      'B-': 'text-blue-400',
      'C': 'text-yellow-400',
      'C+': 'text-yellow-400',
      'C-': 'text-yellow-400',
      'D': 'text-orange-400',
      'D+': 'text-orange-400',
      'D-': 'text-orange-400',
      'F': 'text-red-400'
    }
    return colors[grade as keyof typeof colors] || 'text-gray-400'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Improving':
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case 'Declining':
        return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
      default:
        return <span className="h-4 w-4 text-yellow-400">→</span>
    }
  }

  const getAlertBadge = (type: string, priority: string) => {
    const typeColors = {
      Alert: "bg-red-500/20 text-red-300 border-red-500/50",
      Insight: "bg-blue-500/20 text-blue-300 border-blue-500/50",
      Recommendation: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
    }
    const priorityIcons = {
      High: "⚡",
      Medium: "⚠️",
      Low: "ℹ️"
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${typeColors[type as keyof typeof typeColors]}`}>
        <span>{priorityIcons[priority as keyof typeof priorityIcons]}</span>
        {type}
      </span>
    )
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Academic Performance</h1>
              <p className="text-muted-foreground">Track and analyze student performance metrics</p>
            </div>
          </div>

          {/* Analytics Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowAnalyticsDropdown(!showAnalyticsDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all duration-200 border border-primary/30"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Performance Analytics</span>
              <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${showAnalyticsDropdown ? 'rotate-90' : ''}`} />
            </button>

            {/* Dropdown Content */}
            {showAnalyticsDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50">
                <div className="p-2">
                  {analyticsOptions.map((section, sectionIdx) => (
                    <div key={section.category} className={sectionIdx > 0 ? "mt-4 pt-3 border-t border-white/10" : ""}>
                      <div className="px-3 py-1.5 mb-1">
                        <div className="text-xs font-bold text-primary/80 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-8 h-[1px] bg-gradient-to-r from-primary/40 to-transparent"></span>
                          {section.category}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon
                          return (
                            <button
                              key={item.href}
                              onClick={() => {
                                router.push(item.href)
                                setShowAnalyticsDropdown(false)
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-all duration-200 text-left ${
                                item.isActive
                                  ? 'bg-primary/20 text-primary font-medium border-l-2 border-primary'
                                  : 'text-foreground/70 hover:text-foreground hover:bg-white/10 hover:pl-4'
                              }`}
                            >
                              <Icon className="h-4 w-4 flex-shrink-0" />
                              <span>{item.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Average Grade Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Average Grade</div>
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">{overallStats.averageGrade}%</div>
          <div className="text-xs text-muted-foreground mt-2">Overall average</div>
        </div>

        {/* Top Performers Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Top Performers</div>
            <Award className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold">{overallStats.topPerformers}</div>
          <div className="text-xs text-muted-foreground mt-2">Students above 90%</div>
        </div>

        {/* Need Support Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Need Support</div>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold">{overallStats.needSupport}</div>
          <div className="text-xs text-muted-foreground mt-2">Students below 60%</div>
        </div>

        {/* Improvement Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Improvement</div>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold">{overallStats.monthlyImprovement}%</div>
          <div className="text-xs text-muted-foreground mt-2">Monthly progress</div>
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Distribution Chart */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">Performance Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Excellent (90%+)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-black/30 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${(performanceDistribution.excellent / overallStats.totalStudents) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{performanceDistribution.excellent}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Good (80-89%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-black/30 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full"
                    style={{ width: `${(performanceDistribution.good / overallStats.totalStudents) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{performanceDistribution.good}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average (60-79%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-black/30 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${(performanceDistribution.average / overallStats.totalStudents) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{performanceDistribution.average}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Needs Improvement (&lt;60%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-black/30 rounded-full h-2">
                  <div
                    className="bg-red-400 h-2 rounded-full"
                    style={{ width: `${(performanceDistribution.needsImprovement / overallStats.totalStudents) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{performanceDistribution.needsImprovement}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Performance Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">Subject Enrollment</h3>
          <div className="space-y-3">
            {Object.entries(overallStats.subjectDistribution).map(([subject, count]) => (
              <div key={subject} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{subject}</span>
                <span className="text-sm font-medium">{count} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts and Insights */}
      <div className="mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">Recent Alerts & Insights</h3>
          <div className="space-y-3">
            {alertsAndInsights.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-4 bg-black/20 rounded-lg cursor-pointer hover:bg-black/30 transition-colors"
                onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{alert.title}</h4>
                    {getAlertBadge(alert.type, alert.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  {alert.studentName && (
                    <div className="text-xs text-primary mt-1">Student: {alert.studentName}</div>
                  )}
                  {alert.subject && (
                    <div className="text-xs text-secondary mt-1">Subject: {alert.subject}</div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Analytics Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Performance Analytics</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded text-sm text-foreground backdrop-blur-sm hover:bg-white/15 focus:bg-white/20 transition-all"
              style={{
                backgroundColor: 'rgb(255 255 255 / 0.1)',
                color: 'rgb(var(--foreground))',
              }}
            >
              <option value="current" className="bg-gray-900 text-white">Current Month</option>
              <option value="semester" className="bg-gray-900 text-white">This Semester</option>
              <option value="year" className="bg-gray-900 text-white">Academic Year</option>
            </select>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-4">Performance Trends (Last 6 Months)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {performanceTrends.map((trend, idx) => (
              <div key={idx} className="bg-black/20 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">{trend.month}</div>
                <div className="text-lg font-bold">{trend.averagePerformance}%</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400">+{trend.improvementRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Performance Overview */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-4">Class Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classPerformanceMetrics.map((classMetric) => (
              <div key={classMetric.classId} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">{classMetric.className}</h4>
                  <span className="text-xs text-muted-foreground">{classMetric.totalStudents} students</span>
                </div>
                <div className="text-lg font-bold mb-2">{classMetric.averagePerformance}%</div>
                <div className="text-xs text-muted-foreground mb-2">Educator: {classMetric.educatorName}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-400">🏆 {classMetric.topPerformers} top</span>
                  <span className="text-red-400">⚠️ {classMetric.needSupport} support</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Performance Details */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold">Student Performance Details</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-sm hover:bg-white/15 focus:bg-white/20 transition-all"
                />
              </div>
              <button
                onClick={() => setShowStudentDetails(!showStudentDetails)}
                className="px-3 py-2 bg-primary/20 text-primary rounded-lg text-sm flex items-center gap-1"
              >
                {showStudentDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showStudentDetails ? 'Hide' : 'Show'} Details
              </button>
            </div>
          </div>

          {showStudentDetails && (
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div key={student.studentId} className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{student.studentName}</h4>
                      <span className={`font-bold text-lg ${getGradeColor(student.overallGrade)}`}>
                        {student.overallGrade}
                      </span>
                      <span className="text-muted-foreground">({student.overallPercentage}%)</span>
                      <span className="text-xs text-muted-foreground">Rank #{student.rank}/{student.totalStudents}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(student.improvementTrend)}
                      <span className="text-xs">{student.improvementTrend}</span>
                      {student.isTopPerformer && <Award className="h-4 w-4 text-yellow-400" />}
                      {student.needsSupport && <AlertTriangle className="h-4 w-4 text-red-400" />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Attendance: </span>
                      <span className={student.attendanceRate >= 90 ? 'text-green-400' : student.attendanceRate >= 80 ? 'text-yellow-400' : 'text-red-400'}>
                        {student.attendanceRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Monthly Progress: </span>
                      <span className={student.monthlyProgress > 0 ? 'text-green-400' : student.monthlyProgress < 0 ? 'text-red-400' : 'text-yellow-400'}>
                        {student.monthlyProgress > 0 ? '+' : ''}{student.monthlyProgress}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Subjects: </span>
                      <span>{student.subjectPerformances.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Updated: </span>
                      <span>{new Date(student.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-2">Subject Performance:</div>
                    <div className="flex flex-wrap gap-2">
                      {student.subjectPerformances.map((subject, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white/10 rounded text-xs">
                          {subject.subject}: <span className={getGradeColor(subject.currentGrade)}>{subject.currentGrade}</span> ({subject.percentage}%)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}