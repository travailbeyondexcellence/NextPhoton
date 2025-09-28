"use client"

import { useState, useMemo } from "react"
import { Settings, Plus, Trash2, Eye, Save, BarChart3, PieChart, LineChart, Calendar, Users, BookOpen, Target, Filter, Layers, Code, FileText } from "lucide-react"
import { studentPerformances, classPerformanceMetrics } from "@/app/(features)/Performance/comprehensivePerformanceData"

interface ReportSection {
  id: string
  type: 'chart' | 'table' | 'metric' | 'text'
  title: string
  dataSource: string
  chartType?: 'bar' | 'line' | 'pie' | 'area'
  filters: Record<string, any>
  columns?: string[]
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max'
  customContent?: string
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  sections: ReportSection[]
  layout: 'single' | 'two-column' | 'grid'
  createdAt: string
  lastModified: string
}

export default function CustomReportBuilderPage() {
  const [currentReport, setCurrentReport] = useState<ReportTemplate>({
    id: 'custom_' + Date.now(),
    name: "New Custom Report",
    description: "Custom performance analysis report",
    sections: [],
    layout: 'two-column',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  })

  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [savedReports, setSavedReports] = useState<ReportTemplate[]>([
    {
      id: 'rpt_001',
      name: 'Monthly Performance Dashboard',
      description: 'Comprehensive monthly performance overview',
      sections: [],
      layout: 'grid',
      createdAt: '2024-09-20T10:00:00Z',
      lastModified: '2024-09-25T14:30:00Z'
    },
    {
      id: 'rpt_002',
      name: 'Subject Performance Analysis',
      description: 'Detailed subject-wise performance breakdown',
      sections: [],
      layout: 'two-column',
      createdAt: '2024-09-18T15:30:00Z',
      lastModified: '2024-09-24T11:20:00Z'
    }
  ])

  const sectionTypes = [
    {
      type: 'metric' as const,
      label: 'Key Metric',
      icon: <Target className="h-5 w-5" />,
      description: 'Display a single important metric'
    },
    {
      type: 'chart' as const,
      label: 'Chart',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Visual data representation'
    },
    {
      type: 'table' as const,
      label: 'Data Table',
      icon: <Layers className="h-5 w-5" />,
      description: 'Tabular data display'
    },
    {
      type: 'text' as const,
      label: 'Text Block',
      icon: <FileText className="h-5 w-5" />,
      description: 'Custom text content'
    }
  ]

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: <BarChart3 className="h-4 w-4" /> },
    { value: 'line', label: 'Line Chart', icon: <LineChart className="h-4 w-4" /> },
    { value: 'pie', label: 'Pie Chart', icon: <PieChart className="h-4 w-4" /> },
    { value: 'area', label: 'Area Chart', icon: <LineChart className="h-4 w-4" /> }
  ]

  const dataSources = [
    { value: 'student_performance', label: 'Student Performance', fields: ['studentName', 'overallGrade', 'overallPercentage', 'rank', 'attendanceRate'] },
    { value: 'class_metrics', label: 'Class Metrics', fields: ['className', 'averagePerformance', 'totalStudents', 'topPerformers'] },
    { value: 'subject_performance', label: 'Subject Performance', fields: ['subject', 'currentGrade', 'percentage', 'trend'] },
    { value: 'test_results', label: 'Test Results', fields: ['testName', 'score', 'maxScore', 'percentage', 'date'] }
  ]

  const addSection = (type: ReportSection['type']) => {
    const newSection: ReportSection = {
      id: 'section_' + Date.now(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      dataSource: 'student_performance',
      filters: {},
      ...(type === 'chart' && { chartType: 'bar' }),
      ...(type === 'table' && { columns: ['studentName', 'overallGrade'] }),
      ...(type === 'metric' && { aggregation: 'avg' }),
      ...(type === 'text' && { customContent: 'Enter your custom content here...' })
    }

    setCurrentReport(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      lastModified: new Date().toISOString()
    }))
    setSelectedSection(newSection.id)
  }

  const updateSection = (sectionId: string, updates: Partial<ReportSection>) => {
    setCurrentReport(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
      lastModified: new Date().toISOString()
    }))
  }

  const removeSection = (sectionId: string) => {
    setCurrentReport(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
      lastModified: new Date().toISOString()
    }))
    if (selectedSection === sectionId) {
      setSelectedSection(null)
    }
  }

  const saveReport = () => {
    const updatedReport = {
      ...currentReport,
      lastModified: new Date().toISOString()
    }

    const existingIndex = savedReports.findIndex(r => r.id === currentReport.id)
    if (existingIndex >= 0) {
      setSavedReports(prev => prev.map((r, i) => i === existingIndex ? updatedReport : r))
    } else {
      setSavedReports(prev => [updatedReport, ...prev])
    }

    alert('Report saved successfully!')
  }

  const loadReport = (report: ReportTemplate) => {
    setCurrentReport(report)
    setSelectedSection(null)
    setPreviewMode(false)
  }

  const selectedSectionData = useMemo(() => {
    return currentReport.sections.find(s => s.id === selectedSection)
  }, [selectedSection, currentReport.sections])

  const availableFields = useMemo(() => {
    if (!selectedSectionData) return []
    const dataSource = dataSources.find(ds => ds.value === selectedSectionData.dataSource)
    return dataSource?.fields || []
  }, [selectedSectionData])

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Custom Report Builder</h1>
              <p className="text-muted-foreground">Design and build custom performance reports</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={saveReport}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Configuration Panel */}
        {!previewMode && (
          <div className="lg:col-span-1 space-y-6">
            {/* Report Settings */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Report Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Report Name</label>
                  <input
                    type="text"
                    value={currentReport.name}
                    onChange={(e) => setCurrentReport(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-foreground backdrop-blur-sm hover:bg-white/15 focus:bg-white/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
                  <textarea
                    value={currentReport.description}
                    onChange={(e) => setCurrentReport(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-foreground backdrop-blur-sm hover:bg-white/15 focus:bg-white/20 transition-all resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Layout</label>
                  <select
                    value={currentReport.layout}
                    onChange={(e) => setCurrentReport(prev => ({ ...prev, layout: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-foreground backdrop-blur-sm hover:bg-white/15 focus:bg-white/20 transition-all"
                    style={{
                      backgroundColor: 'rgb(255 255 255 / 0.1)',
                      color: 'rgb(var(--foreground))',
                    }}
                  >
                    <option value="single" className="bg-gray-900 text-white">Single Column</option>
                    <option value="two-column" className="bg-gray-900 text-white">Two Columns</option>
                    <option value="grid" className="bg-gray-900 text-white">Grid Layout</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Add Sections */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Add Sections</h3>

              <div className="grid grid-cols-1 gap-3">
                {sectionTypes.map(sectionType => (
                  <button
                    key={sectionType.type}
                    onClick={() => addSection(sectionType.type)}
                    className="p-3 text-left rounded-lg bg-black/20 hover:bg-black/30 transition-colors border border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {sectionType.icon}
                      <span className="font-medium">{sectionType.label}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{sectionType.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Reports */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Saved Reports</h3>

              <div className="space-y-2">
                {savedReports.map(report => (
                  <button
                    key={report.id}
                    onClick={() => loadReport(report)}
                    className="w-full p-3 text-left rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    <div className="font-medium text-sm">{report.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Modified: {new Date(report.lastModified).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className={`${previewMode ? 'lg:col-span-4' : 'lg:col-span-2'} space-y-6`}>
          {/* Report Canvas */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 min-h-96">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{currentReport.name}</h2>
                <p className="text-sm text-muted-foreground">{currentReport.description}</p>
              </div>
              {!previewMode && (
                <span className="text-xs text-muted-foreground">
                  {currentReport.sections.length} sections
                </span>
              )}
            </div>

            {/* Report Content */}
            <div className={`${
              currentReport.layout === 'single' ? 'space-y-6' :
              currentReport.layout === 'two-column' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' :
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            }`}>
              {currentReport.sections.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No sections added yet</p>
                    <p className="text-sm">Add sections from the panel on the left to build your report</p>
                  </div>
                </div>
              ) : (
                currentReport.sections.map(section => (
                  <div
                    key={section.id}
                    className={`bg-black/20 rounded-lg p-4 border border-white/10 ${
                      !previewMode ? 'hover:border-primary/50 cursor-pointer' : ''
                    } ${selectedSection === section.id ? 'border-primary' : ''}`}
                    onClick={() => !previewMode && setSelectedSection(section.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{section.title}</h3>
                      {!previewMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeSection(section.id)
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Section Content Preview */}
                    <div className="text-sm text-muted-foreground">
                      {section.type === 'metric' && (
                        <div className="text-center py-4">
                          <div className="text-2xl font-bold text-primary">85.2%</div>
                          <div className="text-xs">Average Performance</div>
                        </div>
                      )}

                      {section.type === 'chart' && (
                        <div className="text-center py-4">
                          <div className="w-full h-24 bg-gradient-to-r from-primary/20 to-secondary/20 rounded flex items-center justify-center">
                            {section.chartType === 'bar' && <BarChart3 className="h-8 w-8" />}
                            {section.chartType === 'line' && <LineChart className="h-8 w-8" />}
                            {section.chartType === 'pie' && <PieChart className="h-8 w-8" />}
                            {section.chartType === 'area' && <LineChart className="h-8 w-8" />}
                          </div>
                          <div className="text-xs mt-2">{section.chartType} Chart Preview</div>
                        </div>
                      )}

                      {section.type === 'table' && (
                        <div className="space-y-2">
                          <div className="flex gap-2 text-xs font-medium">
                            {section.columns?.slice(0, 3).map(col => (
                              <div key={col} className="flex-1 bg-primary/20 p-1 rounded">{col}</div>
                            ))}
                          </div>
                          <div className="flex gap-2 text-xs">
                            <div className="flex-1 bg-black/30 p-1 rounded">Sample</div>
                            <div className="flex-1 bg-black/30 p-1 rounded">Data</div>
                            <div className="flex-1 bg-black/30 p-1 rounded">Row</div>
                          </div>
                        </div>
                      )}

                      {section.type === 'text' && (
                        <div className="text-xs bg-black/30 p-3 rounded">
                          {section.customContent?.substring(0, 100)}...
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Section Properties Panel */}
        {!previewMode && selectedSectionData && (
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Section Properties</h3>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Title</label>
                  <input
                    type="text"
                    value={selectedSectionData.title}
                    onChange={(e) => updateSection(selectedSectionData.id, { title: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-foreground backdrop-blur-sm hover:bg-white/15 focus:bg-white/20 transition-all"
                  />
                </div>

                {/* Data Source */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Data Source</label>
                  <select
                    value={selectedSectionData.dataSource}
                    onChange={(e) => updateSection(selectedSectionData.id, { dataSource: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-foreground backdrop-blur-sm hover:bg-white/15 focus:bg-white/20 transition-all"
                    style={{
                      backgroundColor: 'rgb(255 255 255 / 0.1)',
                      color: 'rgb(var(--foreground))',
                    }}
                  >
                    {dataSources.map(source => (
                      <option key={source.value} value={source.value} className="bg-gray-900 text-white">{source.label}</option>
                    ))}
                  </select>
                </div>

                {/* Chart Type (for chart sections) */}
                {selectedSectionData.type === 'chart' && (
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Chart Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {chartTypes.map(chart => (
                        <button
                          key={chart.value}
                          onClick={() => updateSection(selectedSectionData.id, { chartType: chart.value as any })}
                          className={`p-2 rounded-lg border transition-colors ${
                            selectedSectionData.chartType === chart.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-white/10 bg-black/20 hover:border-white/20'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {chart.icon}
                            <span className="text-xs">{chart.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Columns (for table sections) */}
                {selectedSectionData.type === 'table' && (
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Columns</label>
                    <div className="space-y-2">
                      {availableFields.map(field => (
                        <label key={field} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedSectionData.columns?.includes(field) || false}
                            onChange={(e) => {
                              const currentColumns = selectedSectionData.columns || []
                              const newColumns = e.target.checked
                                ? [...currentColumns, field]
                                : currentColumns.filter(c => c !== field)
                              updateSection(selectedSectionData.id, { columns: newColumns })
                            }}
                            className="rounded border-white/20"
                          />
                          <span className="text-sm">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aggregation (for metric sections) */}
                {selectedSectionData.type === 'metric' && (
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Aggregation</label>
                    <select
                      value={selectedSectionData.aggregation}
                      onChange={(e) => updateSection(selectedSectionData.id, { aggregation: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-foreground backdrop-blur-sm hover:bg-white/15 focus:bg-white/20 transition-all"
                      style={{
                        backgroundColor: 'rgb(255 255 255 / 0.1)',
                        color: 'rgb(var(--foreground))',
                      }}
                    >
                      <option value="avg" className="bg-gray-900 text-white">Average</option>
                      <option value="sum" className="bg-gray-900 text-white">Sum</option>
                      <option value="count" className="bg-gray-900 text-white">Count</option>
                      <option value="min" className="bg-gray-900 text-white">Minimum</option>
                      <option value="max" className="bg-gray-900 text-white">Maximum</option>
                    </select>
                  </div>
                )}

                {/* Custom Content (for text sections) */}
                {selectedSectionData.type === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Content</label>
                    <textarea
                      value={selectedSectionData.customContent}
                      onChange={(e) => updateSection(selectedSectionData.id, { customContent: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-foreground backdrop-blur-sm hover:bg-white/15 focus:bg-white/20 transition-all resize-none"
                      rows={6}
                      placeholder="Enter your custom content here..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}