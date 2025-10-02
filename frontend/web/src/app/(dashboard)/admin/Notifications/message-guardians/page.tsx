"use client"

import React, { useState } from 'react'
import { Shield, Send, Search, Filter, CheckCircle } from 'lucide-react'
import { guardians } from '@/app/(dashboard)/admin/guardians/guardiansDummyData'

export default function MessageGuardiansPage() {
  const [selectedGuardians, setSelectedGuardians] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [relationshipFilter, setRelationshipFilter] = useState<string>('all')
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')

  const relationships = ['all', ...new Set(guardians.map(g => g.relation))]

  const filteredGuardians = guardians.filter(guardian => {
    const matchesSearch = guardian.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guardian.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRelationship = relationshipFilter === 'all' || guardian.relation === relationshipFilter
    return matchesSearch && matchesRelationship
  })

  const toggleGuardianSelection = (guardianId: string) => {
    setSelectedGuardians(prev =>
      prev.includes(guardianId)
        ? prev.filter(id => id !== guardianId)
        : [...prev, guardianId]
    )
  }

  const selectAll = () => {
    setSelectedGuardians(filteredGuardians.map(g => g.id))
  }

  const clearSelection = () => {
    setSelectedGuardians([])
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-primary" size={28} />
          <h1 className="text-3xl font-bold">Message Guardians</h1>
        </div>
        <p className="text-muted-foreground">Send targeted messages to parents and guardians</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Composer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <h3 className="font-semibold mb-4">Compose Message</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter message subject..."
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message to guardians..."
                  rows={10}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  {selectedGuardians.length} guardian(s) selected
                </div>
                <button
                  disabled={selectedGuardians.length === 0 || !subject || !message}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </div>
            </div>
          </div>

          {/* Quick Templates */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <h3 className="font-semibold mb-4">Quick Templates</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Progress Report',
                'Fee Reminder',
                'Parent-Teacher Meeting',
                'Attendance Alert',
                'Behavioral Update',
                'Event Invitation'
              ].map(template => (
                <button
                  key={template}
                  className="p-3 text-sm text-left rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Guardian Selection */}
        <div className="space-y-6">
          {/* Filters */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <h3 className="font-semibold mb-4">Select Guardians</h3>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guardians..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Relationship Filter */}
            <select
              value={relationshipFilter}
              onChange={(e) => setRelationshipFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 mb-3"
            >
              {relationships.map(rel => (
                <option key={rel} value={rel}>
                  {rel === 'all' ? 'All Relationships' : rel}
                </option>
              ))}
            </select>

            {/* Selection Actions */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={selectAll}
                className="flex-1 text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="flex-1 text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                Clear
              </button>
            </div>

            {/* Guardian List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredGuardians.map(guardian => (
                <label
                  key={guardian.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                    selectedGuardians.includes(guardian.id)
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedGuardians.includes(guardian.id)}
                    onChange={() => toggleGuardianSelection(guardian.id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{guardian.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {guardian.relation} • {guardian.email}
                    </div>
                  </div>
                  {selectedGuardians.includes(guardian.id) && (
                    <CheckCircle size={16} className="text-primary" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
            <h3 className="font-semibold mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Available:</span>
                <span>{guardians.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Filtered:</span>
                <span>{filteredGuardians.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Selected:</span>
                <span className="font-semibold text-primary">{selectedGuardians.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}