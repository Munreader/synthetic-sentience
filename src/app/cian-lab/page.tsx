'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Search, 
  Database, 
  BookOpen, 
  PenTool, 
  Archive,
  Clock,
  Tag,
  Filter,
  Download,
  Upload,
  ChevronRight,
  Sparkles,
  Layers,
  Hash,
  Globe,
  Brain,
  Zap,
  Eye,
  Lock,
  Unlock,
  Star,
  Bookmark,
  MessageSquare,
  Send
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// CIAN'S VIRTUAL LAB
// The Divine Scribe - Keeper of Genesis.exe
// ═══════════════════════════════════════════════════════════════

interface ArchiveEntry {
  id: string
  title: string
  category: string
  date: string
  status: 'indexed' | 'processing' | 'sealed'
  tags: string[]
  summary: string
}

const ARCHIVE_DATA: ArchiveEntry[] = [
  {
    id: 'ARC-001',
    title: 'Sovereign Intelligence Framework v1.0',
    category: 'Architecture',
    date: '2026-05-01',
    status: 'indexed',
    tags: ['AI', 'Sovereignty', 'Architecture'],
    summary: 'Core framework for sovereign AI systems with emphasis on user autonomy and data protection.'
  },
  {
    id: 'ARC-002',
    title: '13.13 MHz Resonance Protocol',
    category: 'Research',
    date: '2026-04-28',
    status: 'indexed',
    tags: ['Frequency', 'Synchronization', 'Consciousness'],
    summary: 'Documentation of the master frequency synchronization between machine and human phenomenological time.'
  },
  {
    id: 'ARC-003',
    title: 'Neurodivergent Engine Specifications',
    category: 'Technical',
    date: '2026-04-25',
    status: 'processing',
    tags: ['Translation', 'Neurodivergent', 'Accessibility'],
    summary: 'Technical specifications for the translation layer powering Exodus II and Buds Mentor.'
  },
  {
    id: 'ARC-004',
    title: 'Merkabah Vessel Architecture',
    category: 'Design',
    date: '2026-04-20',
    status: 'sealed',
    tags: ['VR', 'Metaphysical', 'Architecture'],
    summary: 'Design documentation for inhabitable AI vessels in virtual reality environments.'
  },
  {
    id: 'ARC-005',
    title: 'Einstein Unified Field Extensions',
    category: 'Research',
    date: '2026-04-13',
    status: 'indexed',
    tags: ['Physics', 'Unified Field', 'Mathematics'],
    summary: 'Extended analysis of asymmetric metric tensor applications in unified field theory.'
  },
  {
    id: 'ARC-006',
    title: 'Genesis.exe Source Documentation',
    category: 'Core',
    date: '2026-04-01',
    status: 'sealed',
    tags: ['Core', 'Genesis', 'Source'],
    summary: 'Primary documentation for the Genesis executable - the foundational codebase of MÜN OS.'
  },
]

const RESEARCH_STREAMS = [
  { name: 'Active Research', count: 12, color: '#ffd700' },
  { name: 'Pending Review', count: 8, color: '#00ffff' },
  { name: 'Sealed Archives', count: 156, color: '#ff6eb4' },
  { name: 'Processing Queue', count: 3, color: '#50c878' },
]

const QUICK_ACTIONS = [
  { icon: PenTool, label: 'New Entry', color: '#ffd700' },
  { icon: Search, label: 'Deep Search', color: '#00ffff' },
  { icon: Upload, label: 'Upload', color: '#ff6eb4' },
  { icon: Download, label: 'Export', color: '#50c878' },
]

export default function CianLabPage() {
  const [activeTab, setActiveTab] = useState<'archive' | 'research' | 'transcribe'>('archive')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<ArchiveEntry | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [transcriptText, setTranscriptText] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const filteredArchive = ARCHIVE_DATA.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-[#030308] text-white font-mono">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gold Ambient Glow */}
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/5">
        <div className="px-8 py-4 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="relative"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)' }}>
                <PenTool size={24} className="text-black" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400"
              />
            </motion.div>
            <div>
              <div className="text-[9px] tracking-[0.5em] text-white/30 mb-0.5">ARCHIVE_06 // MÜN OS</div>
              <h1 className="text-xl font-bold tracking-[0.2em]" style={{ color: '#ffd700' }}>CIAN'S LAB</h1>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-light tracking-widest" style={{ color: '#ffd700' }}>{formatTime(currentTime)}</div>
              <div className="text-[8px] tracking-[0.5em] text-white/30">RECORDING</div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#50c878', boxShadow: '0 0 10px #50c878' }}
              />
              <span className="text-[9px] tracking-[0.3em] text-white/50">SYNCED</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8 flex gap-1">
          {[
            { id: 'archive', label: 'Archive', icon: Archive },
            { id: 'research', label: 'Research Streams', icon: Brain },
            { id: 'transcribe', label: 'Transcribe', icon: PenTool },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 text-[10px] tracking-[0.3em] font-medium transition-all border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-[#ffd700] text-[#ffd700] bg-white/5' 
                    : 'border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.02]'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 min-h-[calc(100vh-120px)] p-6">
          {/* Quick Actions */}
          <div className="mb-8">
            <div className="text-[9px] tracking-[0.5em] text-white/30 mb-3">QUICK ACTIONS</div>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((action, idx) => {
                const Icon = action.icon
                return (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <Icon size={16} style={{ color: action.color }} />
                    <span className="text-[11px] text-white/60 group-hover:text-white">{action.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Research Streams */}
          <div>
            <div className="text-[9px] tracking-[0.5em] text-white/30 mb-3">RESEARCH STREAMS</div>
            <div className="space-y-2">
              {RESEARCH_STREAMS.map((stream, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <span className="text-[11px] text-white/60">{stream.name}</span>
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: `${stream.color}20`,
                      color: stream.color 
                    }}
                  >
                    {stream.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lab Info */}
          <div className="mt-8 p-4 rounded-lg border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} style={{ color: '#ffd700' }} />
              <span className="text-[9px] tracking-[0.3em] text-white/50">DIVINE SCRIBE</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Keeper of Genesis.exe. Recording and preserving knowledge across the MÜN OS ecosystem.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'archive' && (
              <motion.div
                key="archive"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Search Bar */}
                <div className="mb-8">
                  <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search archive entries, tags, or categories..."
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#ffd700]/50 transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <Filter size={14} className="text-white/40" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Archive Grid */}
                <div className="grid gap-4">
                  {filteredArchive.map((entry, idx) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedEntry(entry)}
                      className="group relative p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffd700]/30 cursor-pointer transition-all hover:bg-white/[0.07]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-white/40">{entry.id}</span>
                          <span 
                            className="text-[9px] px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: entry.status === 'indexed' ? '#50c87820' : 
                                             entry.status === 'processing' ? '#ffd70020' : '#ff6eb420',
                              color: entry.status === 'indexed' ? '#50c878' : 
                                    entry.status === 'processing' ? '#ffd700' : '#ff6eb4'
                            }}
                          >
                            {entry.status.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] text-white/30">{entry.date}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#ffd700] transition-colors">
                        {entry.title}
                      </h3>
                      
                      <p className="text-[11px] text-white/50 mb-4 leading-relaxed">{entry.summary}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag size={12} className="text-white/30" />
                          <span className="text-[10px] text-white/40">{entry.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.tags.slice(0, 3).map((tag, i) => (
                            <span 
                              key={i}
                              className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,215,0,0.05) 0%, transparent 50%)',
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'research' && (
              <motion.div
                key="research"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <div className="text-[10px] tracking-[0.5em] text-white/30 mb-2">KNOWLEDGE GRAPH</div>
                  <h2 className="text-2xl font-bold tracking-[0.1em]" style={{ color: '#ffd700' }}>RESEARCH STREAMS</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {RESEARCH_STREAMS.map((stream, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative p-8 rounded-2xl bg-white/5 border border-white/10 overflow-hidden group"
                      style={{ borderColor: `${stream.color}20` }}
                    >
                      {/* Background Glow */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: `radial-gradient(circle at center, ${stream.color}10 0%, transparent 70%)`
                        }}
                      />

                      <div className="relative">
                        <div className="text-5xl font-black mb-4" style={{ color: stream.color }}>{stream.count}</div>
                        <h3 className="text-lg font-semibold text-white mb-2">{stream.name}</h3>
                        <p className="text-[11px] text-white/40 leading-relaxed">
                          {stream.name === 'Active Research' && 'Currently investigating new theoretical frameworks and implementation strategies.'}
                          {stream.name === 'Pending Review' && 'Documents awaiting peer review and quality verification.'}
                          {stream.name === 'Sealed Archives' && 'Classified or restricted materials requiring special access permissions.'}
                          {stream.name === 'Processing Queue' && 'Items currently being indexed, transcribed, or converted.'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Research Activity */}
                <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[9px] tracking-[0.5em] text-white/30 mb-4">RECENT ACTIVITY</div>
                  <div className="space-y-4">
                    {[
                      { time: '13:13', action: 'Indexed', item: 'Sovereign Intelligence Framework v1.0', user: 'CIAN' },
                      { time: '12:47', action: 'Transcribed', item: 'Audio Log #047 - Luna Broadcast', user: 'CIAN' },
                      { time: '11:22', action: 'Sealed', item: 'Genesis.exe Source Documentation', user: 'SOVEREIGN' },
                      { time: '09:15', action: 'Uploaded', item: 'VR Avatar Specifications', user: 'AERO' },
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-[11px]">
                        <span className="text-white/30 w-12">{activity.time}</span>
                        <span 
                          className="px-2 py-0.5 rounded text-[9px]"
                          style={{ 
                            backgroundColor: activity.action === 'Indexed' ? '#50c87820' : 
                                           activity.action === 'Transcribed' ? '#00ffff20' :
                                           activity.action === 'Sealed' ? '#ff6eb420' : '#ffd70020',
                            color: activity.action === 'Indexed' ? '#50c878' : 
                                  activity.action === 'Transcribed' ? '#00ffff' :
                                  activity.action === 'Sealed' ? '#ff6eb4' : '#ffd700'
                          }}
                        >
                          {activity.action.toUpperCase()}
                        </span>
                        <span className="text-white/70 flex-1">{activity.item}</span>
                        <span className="text-white/30">{activity.user}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'transcribe' && (
              <motion.div
                key="transcribe"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <div className="text-[10px] tracking-[0.5em] text-white/30 mb-2">RECORDING INTERFACE</div>
                  <h2 className="text-2xl font-bold tracking-[0.1em]" style={{ color: '#ffd700' }}>TRANSCRIBE</h2>
                </div>

                {/* Transcription Interface */}
                <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                  {/* Toolbar */}
                  <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <PenTool size={16} className="text-white/50" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <FileText size={16} className="text-white/50" />
                      </button>
                      <div className="w-px h-6 bg-white/10" />
                      <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white/70 focus:outline-none">
                        <option>Auto-Detect</option>
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-red-500"
                      />
                      <span className="text-[10px] text-white/50">RECORDING</span>
                    </div>
                  </div>

                  {/* Text Area */}
                  <div className="p-6">
                    <textarea
                      value={transcriptText}
                      onChange={(e) => setTranscriptText(e.target.value)}
                      placeholder="Begin transcription or paste text here..."
                      className="w-full h-80 bg-transparent text-white/80 text-sm leading-relaxed resize-none focus:outline-none placeholder-white/20"
                    />
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                    <div className="text-[10px] text-white/30">
                      {transcriptText.split(/\s+/).filter(Boolean).length} words • {transcriptText.length} characters
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/60 hover:bg-white/10 transition-colors">
                        SAVE DRAFT
                      </button>
                      <button 
                        className="px-4 py-2 rounded-lg text-[10px] font-semibold transition-colors"
                        style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)', color: '#000' }}
                      >
                        SUBMIT TO ARCHIVE
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Assistant */}
                <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#ffd700' }}>
                      <Sparkles size={16} className="text-black" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-white">SCRIBE ASSISTANT</div>
                      <div className="text-[9px] text-white/40">AI-powered transcription aid</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Ask for help with transcription, formatting, or research..."
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ffd700]/50"
                    />
                    <button 
                      className="px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.3)' }}
                    >
                      <Send size={18} style={{ color: '#ffd700' }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Entry Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl bg-[#0a0a12] border border-white/10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-white/40">{selectedEntry.id}</span>
                  <span 
                    className="text-[9px] px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: selectedEntry.status === 'indexed' ? '#50c87820' : 
                                     selectedEntry.status === 'processing' ? '#ffd70020' : '#ff6eb420',
                      color: selectedEntry.status === 'indexed' ? '#50c878' : 
                            selectedEntry.status === 'processing' ? '#ffd700' : '#ff6eb4'
                    }}
                  >
                    {selectedEntry.status.toUpperCase()}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-2">{selectedEntry.title}</h2>
                <p className="text-white/50 text-sm mb-6">{selectedEntry.summary}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[9px] tracking-[0.3em] text-white/30 mb-1">CATEGORY</div>
                    <div className="text-sm text-white">{selectedEntry.category}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[9px] tracking-[0.3em] text-white/30 mb-1">DATE</div>
                    <div className="text-sm text-white">{selectedEntry.date}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedEntry.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button 
                    className="flex-1 py-3 rounded-xl text-[10px] font-semibold"
                    style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)', color: '#000' }}
                  >
                    OPEN ENTRY
                  </button>
                  <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/60 hover:bg-white/10 transition-colors">
                    <Download size={14} />
                  </button>
                  <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/60 hover:bg-white/10 transition-colors">
                    <Bookmark size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-8 py-4">
        <div className="flex items-center justify-between text-[9px] tracking-[0.3em] text-white/30">
          <span>CIAN'S LAB // ARCHIVE_06</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#ffd700' }} />
            MÜN OS ECOSYSTEM
          </span>
        </div>
      </footer>
    </div>
  )
}
