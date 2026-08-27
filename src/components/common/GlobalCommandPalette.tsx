import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Command,
  ArrowRight,
  Sparkles,
  Users,
  Brain,
  BookOpen,
  GitBranch,
  ShieldCheck,
  Zap,
  CornerDownLeft,
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
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Query Search Results
  const searchQuery = useQuery({
    queryKey: ['globalSearch', query],
    queryFn: () => api.searchGlobal(query),
    enabled: isOpen,
  })

  const results = searchQuery.data || []

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSelectedIndex(0)
    } else {
      setQuery('')
    }
  }, [isOpen])

  // Global Keyboard listener (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else {
          // Open handled by parent or state
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSelectResult = (item: GlobalSearchResult) => {
    navigate(item.url)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      handleSelectResult(results[selectedIndex])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ASSOCIATE':
        return <Users className="w-4 h-4 text-emerald-400" />
      case 'SKILL':
        return <Brain className="w-4 h-4 text-purple-400" />
      case 'COURSE':
        return <BookOpen className="w-4 h-4 text-blue-400" />
      case 'PROJECT':
        return <GitBranch className="w-4 h-4 text-indigo-400" />
      default:
        return <Zap className="w-4 h-4 text-amber-400" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
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
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none font-medium"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700 rounded shadow-inner">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              No matching ASCEND entities found for &quot;{query}&quot;.
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-indigo-600/30 border border-indigo-500/50' : 'hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{item.title}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                      {item.category}
                    </span>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-indigo-400 font-bold">ASCEND Universal Search</span>
        </div>
      </motion.div>
    </div>
  )
}
