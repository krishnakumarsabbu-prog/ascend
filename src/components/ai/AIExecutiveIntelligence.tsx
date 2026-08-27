import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Send,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Briefcase,
  ChevronRight,
} from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { AIExecutiveQueryResult } from '../../types'

interface AIExecutiveIntelligenceProps {
  role?: string
}

export function AIExecutiveIntelligence({ role = 'SENIOR_LEADER_SPONSOR' }: AIExecutiveIntelligenceProps) {
  const [queryInput, setQueryInput] = useState('')
  const [currentResult, setCurrentResult] = useState<AIExecutiveQueryResult | null>(null)

  const queryMutation = useMutation({
    mutationFn: (q: string) => api.aiExecutiveQuery(q, role),
    onSuccess: (result) => {
      setCurrentResult(result)
    },
  })

  const handleQuery = (q: string) => {
    if (!q.trim() || queryMutation.isPending) return
    setQueryInput(q)
    queryMutation.mutate(q)
  }

  const executivePrompts = [
    'Which cohort is most at risk?',
    'Where do we have the largest skill gap?',
    'How many associates are commission-ready?',
    'Which technology skills are improving fastest?',
    'Which business units have insufficient future talent?',
  ]

  return (
    <div className="space-y-6">
      {/* Search / Ask Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 text-[10px] font-black rounded bg-indigo-500/20 text-indigo-300 uppercase">
                AI Executive Intelligence
              </span>
              <span className="text-xs text-slate-400">Natural-Language Workforce Insights</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Talent Pipeline & Capability Intelligence
            </h2>
            <p className="text-xs text-slate-400">
              Query real-time cross-cohort telemetry, workforce supply forecasts, and skill bottlenecks.
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask a business question (e.g. 'Where is our biggest skill gap?', 'Which cohort is at risk?')..."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleQuery(queryInput)
            }}
            disabled={queryMutation.isPending}
            className="flex-1 px-4 py-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleQuery(queryInput)}
            disabled={!queryInput.trim() || queryMutation.isPending}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0"
          >
            <span>Ask AI</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Suggestions:</span>
          {executivePrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleQuery(p)}
              disabled={queryMutation.isPending}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {queryMutation.isPending && (
        <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold">Synthesizing enterprise cohort telemetry & supply models...</p>
        </div>
      )}

      {/* Result Card (Requirement 11) */}
      <AnimatePresence>
        {currentResult && !queryMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Executive Intelligence Response
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">"{currentResult.query}"</h3>
                <span className="text-[11px] text-slate-500">Generated {currentResult.generated_at}</span>
              </div>
              <div className="flex items-center gap-2">
                {currentResult.affected_cohorts.map((c) => (
                  <span key={c} className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Metrics Strip */}
            {currentResult.key_metrics && currentResult.key_metrics.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentResult.key_metrics.map((km, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase">{km.label}</div>
                    <div className="text-lg font-black text-indigo-300 mt-1">{km.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Answer Content */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {currentResult.answer_markdown}
            </div>

            {/* Recommended Decisions */}
            {currentResult.recommended_decisions && currentResult.recommended_decisions.length > 0 && (
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Recommended Strategic Decisions
                </h4>
                <ul className="space-y-1.5">
                  {currentResult.recommended_decisions.map((dec, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="font-bold text-indigo-400">•</span>
                      <span>{dec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
