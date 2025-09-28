"use client"

import { useState, useMemo } from "react"
import { Download, Database, FileSpreadsheet, FileText, Code, Calendar, Filter, Settings, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { studentPerformances, classPerformanceMetrics } from "@/app/(features)/Performance/comprehensivePerformanceData"

interface ExportConfig {
  dataType: string[]
  format: string
  timeframe: string
  includePersonalData: boolean
  includeMetadata: boolean
  compressionLevel: string
  customFields: string[]
}

interface ExportJob {
  id: string
  name: string
  format: string
  size: string
  status: 'completed' | 'processing' | 'failed' | 'queued'
  createdAt: string
  downloadUrl?: string
  progress?: number
}

export default function ExportDataPage() {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    dataType: ["student_performance"],
    format: "csv",
    timeframe: "semester",
    includePersonalData: false,
    includeMetadata: true,
    compressionLevel: "medium",
    customFields: []
  })

  const [isExporting, setIsExporting] = useState(false)
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: "exp001",
      name: "Student Performance Data - September 2024",
      format: "CSV",
      size: "2.1 MB",
      status: "completed",
      createdAt: "2024-09-25T14:30:00Z",
      downloadUrl: "#"
    },
    {
      id: "exp002",
      name: "Class Metrics Export",
      format: "JSON",
      size: "1.8 MB",
      status: "completed",
      createdAt: "2024-09-24T10:15:00Z",
      downloadUrl: "#"
    },
    {
      id: "exp003",
      name: "Complete Analytics Dataset",
      format: "Excel",
      size: "5.2 MB",
      status: "processing",
      createdAt: "2024-09-25T16:00:00Z",
      progress: 65
    }
  ])

  const dataTypes = [
    { value: "student_performance", label: "Student Performance", desc: "Grades, scores, and academic metrics", count: studentPerformances.length },
    { value: "class_metrics", label: "Class Metrics", desc: "Class-level performance data", count: classPerformanceMetrics.length },
    { value: "attendance", label: "Attendance Records", desc: "Student attendance data", count: 847 },
    { value: "test_results", label: "Test Results", desc: "Individual test scores and results", count: 1423 },
    { value: "assignments", label: "Assignment Data", desc: "Assignment submissions and grades", count: 892 },
    { value: "behavioral", label: "Behavioral Analytics", desc: "Behavior tracking data", count: 234 }
  ]

  const exportFormats = [
    { value: "csv", label: "CSV", icon: <FileSpreadsheet className="h-5 w-5" />, desc: "Comma-separated values" },
    { value: "excel", label: "Excel", icon: <FileSpreadsheet className="h-5 w-5" />, desc: "Microsoft Excel format" },
    { value: "json", label: "JSON", icon: <Code className="h-5 w-5" />, desc: "JavaScript Object Notation" },
    { value: "xml", label: "XML", icon: <FileText className="h-5 w-5" />, desc: "Extensible Markup Language" },
    { value: "sql", label: "SQL", icon: <Database className="h-5 w-5" />, desc: "SQL INSERT statements" }
  ]

  const customFieldOptions = [
    "student_id", "student_name", "class_id", "subject_name", "educator_name",
    "test_date", "test_name", "score", "max_score", "percentage", "grade",
    "attendance_rate", "improvement_trend", "strong_areas", "weak_areas"
  ]

  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    setExportConfig(prev => ({
      ...prev,
      dataType: checked
        ? [...prev.dataType, dataType]
        : prev.dataType.filter(t => t !== dataType)
    }))
  }

  const handleCustomFieldChange = (field: string, checked: boolean) => {
    setExportConfig(prev => ({
      ...prev,
      customFields: checked
        ? [...prev.customFields, field]
        : prev.customFields.filter(f => f !== field)
    }))
  }

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      const newExport: ExportJob = {
        id: `exp${Date.now()}`,
        name: `Export - ${new Date().toLocaleDateString()}`,
        format: exportConfig.format.toUpperCase(),
        size: "3.2 MB",
        status: "completed",
        createdAt: new Date().toISOString(),
        downloadUrl: "#"
      }

      setExportJobs(prev => [newExport, ...prev])
      setIsExporting(false)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'processing': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      case 'queued': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4 animate-spin" />
      case 'failed': return <AlertCircle className="h-4 w-4" />
      case 'queued': return <Clock className="h-4 w-4" />
      default: return <Database className="h-4 w-4" />
    }
  }

  const totalRecords = useMemo(() => {
    return exportConfig.dataType.reduce((total, type) => {
      const dataType = dataTypes.find(dt => dt.value === type)
      return total + (dataType?.count || 0)
    }, 0)
  }, [exportConfig.dataType])

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Download className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Export Analytics Data</h1>
            <p className="text-muted-foreground">Export performance data in various formats for external analysis</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Selection
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Data Types {exportConfig.dataType.length > 0 && `(${exportConfig.dataType.length} selected)`}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dataTypes.map(type => (
                    <label key={type.value} className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      exportConfig.dataType.includes(type.value)
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 bg-black/20 hover:border-white/20'
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={exportConfig.dataType.includes(type.value)}
                          onChange={(e) => handleDataTypeChange(type.value, e.target.checked)}
                          className="mt-1 rounded border-white/20"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground mb-1">{type.desc}</div>
                          <div className="text-xs text-primary">{type.count.toLocaleString()} records</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">Total Records Selected:</span>
                  <span className="text-xl font-bold text-primary">{totalRecords.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Export Format
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {exportFormats.map(format => (
                <label key={format.value} className="block">
                  <input
                    type="radio"
                    name="format"
                    value={format.value}
                    checked={exportConfig.format === format.value}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, format: e.target.value }))}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-lg border cursor-pointer transition-all text-center ${
                    exportConfig.format === format.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-black/20 hover:border-white/20'
                  }`}>
                    <div className="flex justify-center mb-2">{format.icon}</div>
                    <div className="font-medium">{format.label}</div>
                    <div className="text-xs text-muted-foreground">{format.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Export Options
            </h3>

            <div className="space-y-6">
              {/* Timeframe */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Timeframe</label>
                <select
                  value={exportConfig.timeframe}
                  onChange={(e) => setExportConfig(prev => ({ ...prev, timeframe: e.target.value }))}
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="semester">This Semester</option>
                  <option value="year">Academic Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {/* Privacy & Security */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Privacy & Security</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.includePersonalData}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, includePersonalData: e.target.checked }))}
                      className="rounded border-white/20"
                    />
                    <div>
                      <div className="text-sm font-medium">Include Personal Data</div>
                      <div className="text-xs text-muted-foreground">Student names, IDs, and personal information</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.includeMetadata}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                      className="rounded border-white/20"
                    />
                    <div>
                      <div className="text-sm font-medium">Include Metadata</div>
                      <div className="text-xs text-muted-foreground">Timestamps, source information, and additional context</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Compression */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Compression Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "none", label: "None", desc: "Fastest" },
                    { value: "medium", label: "Medium", desc: "Balanced" },
                    { value: "high", label: "High", desc: "Smallest" }
                  ].map(level => (
                    <label key={level.value} className="block">
                      <input
                        type="radio"
                        name="compression"
                        value={level.value}
                        checked={exportConfig.compressionLevel === level.value}
                        onChange={(e) => setExportConfig(prev => ({ ...prev, compressionLevel: e.target.value }))}
                        className="sr-only"
                      />
                      <div className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                        exportConfig.compressionLevel === level.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/10 bg-black/20 hover:border-white/20'
                      }`}>
                        <div className="font-medium text-sm">{level.label}</div>
                        <div className="text-xs text-muted-foreground">{level.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Fields */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Custom Fields {exportConfig.customFields.length > 0 && `(${exportConfig.customFields.length} selected)`}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {customFieldOptions.map(field => (
                    <label key={field} className="flex items-center gap-2 p-2 rounded text-xs bg-black/20 hover:bg-black/30 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportConfig.customFields.includes(field)}
                        onChange={(e) => handleCustomFieldChange(field, e.target.checked)}
                        className="rounded border-white/20"
                      />
                      <span className="text-xs">{field.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isExporting || exportConfig.dataType.length === 0}
                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Exporting Data...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Export History & Status */}
        <div className="space-y-6">
          {/* Quick Export Templates */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4">Quick Export Templates</h3>
            <div className="space-y-3">
              <button className="w-full p-3 text-left rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                <div className="font-medium text-sm">Complete Dataset</div>
                <div className="text-xs text-muted-foreground">All data types, CSV format</div>
              </button>

              <button className="w-full p-3 text-left rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                <div className="font-medium text-sm">Performance Only</div>
                <div className="text-xs text-muted-foreground">Student & class performance</div>
              </button>

              <button className="w-full p-3 text-left rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                <div className="font-medium text-sm">Analytics Export</div>
                <div className="text-xs text-muted-foreground">JSON format for APIs</div>
              </button>
            </div>
          </div>

          {/* Export Jobs */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4">Export History</h3>
            <div className="space-y-3">
              {exportJobs.map(job => (
                <div key={job.id} className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{job.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{job.format}</span>
                        <span>•</span>
                        <span>{job.size}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span className="text-xs capitalize">{job.status}</span>
                    </div>
                  </div>

                  {job.status === 'processing' && job.progress && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{job.progress}%</span>
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-1.5">
                        <div
                          className="bg-yellow-400 h-1.5 rounded-full transition-all"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground mb-3">
                    {new Date(job.createdAt).toLocaleString()}
                  </div>

                  {job.status === 'completed' && job.downloadUrl && (
                    <button className="w-full py-2 px-3 bg-primary/20 text-primary rounded text-xs hover:bg-primary/30 transition-colors flex items-center justify-center gap-1">
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Export Statistics */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4">Export Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Exports</span>
                <span className="font-medium">{exportJobs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Most Popular Format</span>
                <span className="font-medium text-xs">CSV</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Data Exported</span>
                <span className="font-medium">24.8 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}