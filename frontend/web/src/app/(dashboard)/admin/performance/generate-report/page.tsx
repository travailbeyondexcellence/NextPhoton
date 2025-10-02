"use client"

import { useState, useMemo } from "react"
import { FileText, Download, Calendar, Users, BookOpen, Target, Filter, Settings, Mail, Clock, Check } from "lucide-react"
import { studentPerformances, classPerformanceMetrics } from "@/app/(features)/Performance/comprehensivePerformanceData"

interface ReportConfig {
  reportType: string
  timeframe: string
  subjects: string[]
  classes: string[]
  students: string[]
  includeCharts: boolean
  includeComparisons: boolean
  includeRecommendations: boolean
  format: string
}

export default function GenerateReportPage() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    reportType: "comprehensive",
    timeframe: "semester",
    subjects: [],
    classes: [],
    students: [],
    includeCharts: true,
    includeComparisons: true,
    includeRecommendations: true,
    format: "pdf"
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReports, setGeneratedReports] = useState<Array<{
    id: string
    name: string
    type: string
    createdAt: string
    size: string
    status: 'completed' | 'processing' | 'failed'
  }>>([
    {
      id: "rpt001",
      name: "Comprehensive Performance Report - September 2024",
      type: "Comprehensive",
      createdAt: "2024-09-25T10:30:00Z",
      size: "2.4 MB",
      status: "completed"
    },
    {
      id: "rpt002",
      name: "Mathematics Subject Analysis",
      type: "Subject Analysis",
      createdAt: "2024-09-24T14:15:00Z",
      size: "1.8 MB",
      status: "completed"
    },
    {
      id: "rpt003",
      name: "Class 10A Performance Review",
      type: "Class Report",
      createdAt: "2024-09-23T09:45:00Z",
      size: "1.2 MB",
      status: "completed"
    }
  ])

  // Get all unique subjects and classes
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>()
    studentPerformances.forEach(student => {
      student.subjectPerformances.forEach(subject => {
        subjects.add(subject.subject)
      })
    })
    return Array.from(subjects)
  }, [])

  const availableClasses = useMemo(() => {
    return classPerformanceMetrics.map(cls => ({
      id: cls.classId,
      name: cls.className,
      subject: cls.subject,
      educator: cls.educatorName
    }))
  }, [])

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      subjects: checked
        ? [...prev.subjects, subject]
        : prev.subjects.filter(s => s !== subject)
    }))
  }

  const handleClassChange = (classId: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      classes: checked
        ? [...prev.classes, classId]
        : prev.classes.filter(c => c !== classId)
    }))
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      const newReport = {
        id: `rpt${Date.now()}`,
        name: `${reportConfig.reportType.charAt(0).toUpperCase() + reportConfig.reportType.slice(1)} Report - ${new Date().toLocaleDateString()}`,
        type: reportConfig.reportType.charAt(0).toUpperCase() + reportConfig.reportType.slice(1),
        createdAt: new Date().toISOString(),
        size: "1.5 MB",
        status: "completed" as const
      }

      setGeneratedReports(prev => [newReport, ...prev])
      setIsGenerating(false)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'processing': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      case 'failed': return <Target className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Generate Performance Report</h1>
            <p className="text-muted-foreground">Create customized performance reports and analytics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Report Configuration
            </h3>

            <div className="space-y-6">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Report Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: "comprehensive", label: "Comprehensive Report", desc: "Complete performance overview" },
                    { value: "subject", label: "Subject Analysis", desc: "Subject-specific performance" },
                    { value: "class", label: "Class Report", desc: "Class-wise performance" },
                    { value: "individual", label: "Individual Student", desc: "Single student analysis" }
                  ].map(type => (
                    <div key={type.value} className="relative">
                      <input
                        type="radio"
                        id={type.value}
                        name="reportType"
                        value={type.value}
                        checked={reportConfig.reportType === type.value}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, reportType: e.target.value }))}
                        className="sr-only"
                      />
                      <label
                        htmlFor={type.value}
                        className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                          reportConfig.reportType === type.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-white/10 bg-black/20 hover:border-white/20'
                        }`}
                      >
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.desc}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeframe */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Timeframe</label>
                <select
                  value={reportConfig.timeframe}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, timeframe: e.target.value }))}
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="semester">This Semester</option>
                  <option value="year">Academic Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Subjects {reportConfig.subjects.length > 0 && `(${reportConfig.subjects.length} selected)`}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSubjects.map(subject => (
                    <label key={subject} className="flex items-center gap-2 p-2 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reportConfig.subjects.includes(subject)}
                        onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                        className="rounded border-white/20"
                      />
                      <span className="text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Class Selection */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Classes {reportConfig.classes.length > 0 && `(${reportConfig.classes.length} selected)`}
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableClasses.map(cls => (
                    <label key={cls.id} className="flex items-center gap-2 p-2 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reportConfig.classes.includes(cls.id)}
                        onChange={(e) => handleClassChange(cls.id, e.target.checked)}
                        className="rounded border-white/20"
                      />
                      <span className="text-sm">{cls.name} - {cls.subject} ({cls.educator})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Report Options */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Report Options</label>
                <div className="space-y-2">
                  {[
                    { key: "includeCharts", label: "Include Charts & Graphs", desc: "Visual data representations" },
                    { key: "includeComparisons", label: "Include Comparisons", desc: "Comparative analysis with peers" },
                    { key: "includeRecommendations", label: "Include Recommendations", desc: "AI-powered suggestions" }
                  ].map(option => (
                    <label key={option.key} className="flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reportConfig[option.key as keyof ReportConfig] as boolean}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, [option.key]: e.target.checked }))}
                        className="rounded border-white/20"
                      />
                      <div>
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Output Format */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Output Format</label>
                <div className="flex gap-3">
                  {[
                    { value: "pdf", label: "PDF", icon: "📄" },
                    { value: "excel", label: "Excel", icon: "📊" },
                    { value: "html", label: "HTML", icon: "🌐" }
                  ].map(format => (
                    <label key={format.value} className="flex-1">
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={reportConfig.format === format.value}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value }))}
                        className="sr-only"
                      />
                      <div className={`p-3 text-center rounded-lg border cursor-pointer transition-all ${
                        reportConfig.format === format.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/10 bg-black/20 hover:border-white/20'
                      }`}>
                        <div className="text-lg">{format.icon}</div>
                        <div className="text-sm font-medium">{format.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Report History & Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full p-3 text-left rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Weekly Summary</div>
                    <div className="text-xs text-muted-foreground">Quick overview report</div>
                  </div>
                </div>
              </button>

              <button className="w-full p-3 text-left rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-secondary" />
                  <div>
                    <div className="text-sm font-medium">All Classes</div>
                    <div className="text-xs text-muted-foreground">Complete overview</div>
                  </div>
                </div>
              </button>

              <button className="w-full p-3 text-left rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <div>
                    <div className="text-sm font-medium">Subject Analysis</div>
                    <div className="text-xs text-muted-foreground">All subjects</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
            <div className="space-y-3">
              {generatedReports.map(report => (
                <div key={report.id} className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{report.name}</h4>
                      <p className="text-xs text-muted-foreground">{report.type}</p>
                    </div>
                    <div className={`flex items-center gap-1 ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    <span>{report.size}</span>
                  </div>

                  {report.status === 'completed' && (
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 px-3 bg-primary/20 text-primary rounded text-xs hover:bg-primary/30 transition-colors flex items-center justify-center gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                      <button className="flex-1 py-2 px-3 bg-secondary/20 text-secondary rounded text-xs hover:bg-secondary/30 transition-colors flex items-center justify-center gap-1">
                        <Mail className="h-3 w-3" />
                        Share
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Report Statistics */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4">Report Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Reports</span>
                <span className="font-medium">{generatedReports.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Most Popular</span>
                <span className="font-medium text-xs">Comprehensive</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Size</span>
                <span className="font-medium">1.8 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}