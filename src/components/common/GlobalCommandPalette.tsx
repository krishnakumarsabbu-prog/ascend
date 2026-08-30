import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Users,
  Brain,
  BookOpen,
  Award,
  BriefcaseBusiness,
  Terminal,
  Zap,
  CornerDownLeft,
  X,
  GitBranch,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { GlobalSearchResult } from '../../types'

interface PaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalCommandPalette({ isOpen, onClose }: PaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch search results
  const searchQuery = useQuery({
    queryKey: ['globalSearch', query],
    queryFn: () => api.searchGlobal(query),
    enabled: isOpen && query.trim().length > 0,
  })

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  const results: GlobalSearchResult[] = searchQuery.data || []

  // Listen to keyboard navigation (ArrowUp, ArrowDown, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + (results.length || 1)) % (results.length || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = results[selectedIndex]
      if (item) {
        handleSelectResult(item)
      }
    }
  }

  const handleSelectResult = (item: GlobalSearchResult) => {
    navigate(item.url)
    onClose()
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'ASSOCIATE':
        return <Users className="w-4 h-4 text-emerald-600" />
      case 'SKILL':
        return <Brain className="w-4 h-4 text-purple-600" />
      case 'COURSE':
        return <BookOpen className="w-4 h-4 text-blue-600" />
      case 'PROJECT':
        return <GitBranch className="w-4 h-4 text-[#007df0]" />
      default:
        return <Zap className="w-4 h-4 text-amber-600" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-[#007df0] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search associates, skills, courses, gigs, metric provenance, or commands (Ctrl+K)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none font-medium"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-500 border border-slate-200 rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 bg-slate-50/50">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-mono">
              {query ? `No matching ASCEND entities found for "${query}".` : 'Type to search modules, skills, or associates...'}
            </div>
          ) : (
            results.map((item: GlobalSearchResult, idx: number) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-sky-50 border border-sky-300 shadow-2xs' : 'hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 shadow-2xs">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-sky-100 text-sky-800">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                      {item.category}
                    </span>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-[#007df0]" />}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#007df0] font-bold">ASCEND Universal Search</span>
        </div>
      </motion.div>
    </div>
  )
}
