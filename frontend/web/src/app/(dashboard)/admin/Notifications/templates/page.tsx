"use client"

import React, { useState } from 'react'
import { FileText, Edit, Trash2, Plus, Copy, Search } from 'lucide-react'
import { messageTemplates } from '@/app/(features)/Notifications/notificationsDummyData'

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const categories = ['all', 'Academic', 'Administrative', 'Behavioral', 'Health & Safety', 'Events']

  const filteredTemplates = messageTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.body.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Academic': 'text-blue-500 bg-blue-500/10',
      'Administrative': 'text-purple-500 bg-purple-500/10',
      'Behavioral': 'text-orange-500 bg-orange-500/10',
      'Health & Safety': 'text-red-500 bg-red-500/10',
      'Events': 'text-green-500 bg-green-500/10'
    }
    return colors[category] || 'text-gray-500 bg-gray-500/10'
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Message Templates</h1>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all">
            <Plus size={18} />
            Create Template
          </button>
        </div>
        <p className="text-muted-foreground">Manage reusable message templates for quick communication</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                selectedCategory === category
                  ? 'bg-primary/20 text-primary border border-primary/50'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`p-5 rounded-xl border backdrop-blur-sm cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-primary/50 bg-primary/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            {/* Template Header */}
            <div className="flex items-start justify-between mb-3">
              <FileText size={20} className="text-primary" />
              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(template.category)}`}>
                {template.category}
              </span>
            </div>

            {/* Template Name */}
            <h3 className="font-semibold mb-2">{template.name}</h3>

            {/* Subject Preview */}
            <div className="mb-3">
              <div className="text-xs text-muted-foreground mb-1">Subject:</div>
              <div className="text-sm line-clamp-1">{template.subject}</div>
            </div>

            {/* Body Preview */}
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-1">Message:</div>
              <div className="text-sm text-muted-foreground line-clamp-3">{template.body}</div>
            </div>

            {/* Variables */}
            {template.variables && template.variables.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-1">Variables:</div>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map(variable => (
                    <span
                      key={variable}
                      className="text-xs px-2 py-1 rounded bg-white/10"
                    >
                      {`{${variable}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span>Used {template.usageCount} times</span>
              <span>{new Date(template.lastModified).toLocaleDateString()}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle use template
                }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all text-sm"
              >
                <Copy size={14} />
                Use
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle edit
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle delete
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `No templates match "${searchQuery}"`
              : 'Create your first template to get started'}
          </p>
          <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all">
            <Plus size={18} className="inline mr-2" />
            Create Template
          </button>
        </div>
      )}

      {/* Template Statistics */}
      <div className="mt-8 p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
        <h3 className="font-semibold mb-4">Template Usage Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold">{messageTemplates.length}</div>
            <div className="text-sm text-muted-foreground">Total Templates</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {messageTemplates.reduce((sum, t) => sum + t.usageCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Uses</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {messageTemplates.filter(t => t.usageCount > 10).length}
            </div>
            <div className="text-sm text-muted-foreground">Popular Templates</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {new Set(messageTemplates.map(t => t.category)).size}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
        </div>
      </div>
    </div>
  )
}