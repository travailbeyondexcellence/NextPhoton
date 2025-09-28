"use client"

import { useState, useMemo } from "react"
import { BookOpen, GitBranch, Eye, Share2, Tag, Plus, Search, Network } from "lucide-react"
import { mindMaps } from "@/app/(features)/AcademicPlans/academicPlansDummyData"

export default function MindmapsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [selectedMindmap, setSelectedMindmap] = useState<string | null>(null)

  // Get unique subjects and calculate stats
  const { subjects, stats } = useMemo(() => {
    const uniqueSubjects = [...new Set(mindMaps.map(m => m.subject))].sort()
    const totalMindmaps = mindMaps.length
    const totalViews = mindMaps.reduce((sum, m) => sum + m.viewCount, 0)
    const totalNodes = mindMaps.reduce((sum, m) => sum + m.nodes.length, 0)
    const publicMaps = mindMaps.filter(m => m.isPublic).length

    return {
      subjects: uniqueSubjects,
      stats: { totalMindmaps, totalViews, totalNodes, publicMaps }
    }
  }, [])

  // Filter mindmaps
  const filteredMindmaps = useMemo(() => {
    return mindMaps.filter(mindmap => {
      const matchesSearch =
        mindmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mindmap.centralConcept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mindmap.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesSubject = subjectFilter === "all" || mindmap.subject === subjectFilter

      return matchesSearch && matchesSubject
    })
  }, [searchTerm, subjectFilter])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = today.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const getNodeTypeBadge = (type: string) => {
    const typeConfig = {
      concept: { color: "bg-blue-500/20 text-blue-300", emoji: "💡" },
      example: { color: "bg-green-500/20 text-green-300", emoji: "📝" },
      definition: { color: "bg-purple-500/20 text-purple-300", emoji: "📖" },
      question: { color: "bg-yellow-500/20 text-yellow-300", emoji: "❓" }
    }

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.concept
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${config.color}`}>
        <span>{config.emoji}</span>
        {type}
      </span>
    )
  }

  const getConnectionTypeBadge = (type: string) => {
    const connectionConfig = {
      relates: { color: "text-blue-400", symbol: "↔️" },
      causes: { color: "text-green-400", symbol: "➡️" },
      contains: { color: "text-purple-400", symbol: "📦" },
      contradicts: { color: "text-red-400", symbol: "⛔" }
    }

    const config = connectionConfig[type as keyof typeof connectionConfig] || connectionConfig.relates
    return (
      <span className={`inline-flex items-center gap-1 text-xs ${config.color}`}>
        <span>{config.symbol}</span>
        {type}
      </span>
    )
  }

  // Build node tree structure for display
  const buildNodeTree = (nodes: typeof mindMaps[0]["nodes"]) => {
    const rootNodes = nodes.filter(n => !n.parentId)
    const getChildren = (parentId: string) => nodes.filter(n => n.parentId === parentId)

    const renderNode = (node: typeof nodes[0], depth: number = 0) => (
      <div key={node.id} style={{ marginLeft: `${depth * 20}px` }} className="py-1">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">{depth === 0 ? '🎯' : depth === 1 ? '└─' : '  └─'}</span>
          {getNodeTypeBadge(node.type)}
          <span className="text-sm">{node.label}</span>
        </div>
        {getChildren(node.id).map(child => renderNode(child, depth + 1))}
      </div>
    )

    return rootNodes.map(node => renderNode(node, 0))
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Network className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Academic Mindmaps</h1>
            <p className="text-muted-foreground">Visual learning pathways and concept maps</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Mindmaps</span>
            <GitBranch className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">{stats.totalMindmaps}</div>
          <div className="text-xs text-muted-foreground mt-2">Available maps</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Views</span>
            <Eye className="h-5 w-5 text-secondary" />
          </div>
          <div className="text-2xl font-bold">{stats.totalViews}</div>
          <div className="text-xs text-muted-foreground mt-2">All time views</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Nodes</span>
            <span className="text-accent">🔗</span>
          </div>
          <div className="text-2xl font-bold">{stats.totalNodes}</div>
          <div className="text-xs text-muted-foreground mt-2">Concept nodes</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Public Maps</span>
            <Share2 className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold">{stats.publicMaps}</div>
          <div className="text-xs text-muted-foreground mt-2">Shared publicly</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search mindmaps by title, concept, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

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

          <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Mindmap
          </button>
        </div>
      </div>

      {/* Mindmaps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMindmaps.length === 0 ? (
          <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center text-muted-foreground">
            No mindmaps found matching your criteria
          </div>
        ) : (
          filteredMindmaps.map((mindmap) => (
            <div
              key={mindmap.id}
              className={`bg-white/10 backdrop-blur-sm rounded-lg border ${
                selectedMindmap === mindmap.id ? 'border-primary' : 'border-white/20'
              } hover:bg-white/15 transition-all cursor-pointer`}
              onClick={() => setSelectedMindmap(mindmap.id === selectedMindmap ? null : mindmap.id)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{mindmap.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Central Concept: <span className="text-primary font-medium">{mindmap.centralConcept}</span>
                    </p>
                  </div>
                  {mindmap.isPublic && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                      <Share2 className="h-3 w-3" />
                      Public
                    </span>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{mindmap.subject}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="h-4 w-4" />
                    <span>{mindmap.nodes.length} nodes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🔗</span>
                    <span>{mindmap.connections.length} connections</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{mindmap.viewCount} views</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {mindmap.tags.slice(0, 4).map((tag, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-white/10 text-xs rounded-md">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                  {mindmap.tags.length > 4 && (
                    <span className="px-2 py-1 text-xs text-muted-foreground">+{mindmap.tags.length - 4} more</span>
                  )}
                </div>

                {/* Dates */}
                <div className="text-xs text-muted-foreground">
                  Created {formatDate(mindmap.createdAt)} · Updated {formatDate(mindmap.updatedAt)}
                </div>

                {/* Expanded Details */}
                {selectedMindmap === mindmap.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {/* Node Structure */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Node Structure</h4>
                      <div className="bg-black/20 rounded p-3 max-h-64 overflow-y-auto">
                        {buildNodeTree(mindmap.nodes)}
                      </div>
                    </div>

                    {/* Connections */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Key Connections</h4>
                      <div className="space-y-1">
                        {mindmap.connections.slice(0, 3).map((conn, idx) => {
                          const fromNode = mindmap.nodes.find(n => n.id === conn.from)
                          const toNode = mindmap.nodes.find(n => n.id === conn.to)
                          return (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">{fromNode?.label}</span>
                              {getConnectionTypeBadge(conn.type)}
                              <span className="text-muted-foreground">{toNode?.label}</span>
                              {conn.label && (
                                <span className="text-xs text-muted-foreground italic">({conn.label})</span>
                              )}
                            </div>
                          )
                        })}
                        {mindmap.connections.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{mindmap.connections.length - 3} more connections</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-sm">
                        🗺️ Open Mindmap
                      </button>
                      <button className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors text-sm">
                        ✏️ Edit
                      </button>
                      <button className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors text-sm">
                        📋 Clone
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