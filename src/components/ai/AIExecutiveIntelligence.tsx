import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Send,
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Users,
  Search,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { AIExecutiveQueryResult } from '../../types'
import { Card } from '../ui'

export interface AIExecutiveIntelligenceProps {
  role?: string
  currentRole?: string
}

export function AIExecutiveIntelligence({ role, currentRole = 'SENIOR_LEADER_SPONSOR' }: AIExecutiveIntelligenceProps) {
  const activeRole = role || currentRole
  const [queryText, setQueryText] = useState('')
  const [currentResult, setCurrentResult] = useState<AIExecutiveQueryResult | null>(null)

  // Query Mutation
  const queryMutation = useMutation({
    mutationFn: (q: string) => api.aiExecutiveQuery(q, activeRole),
    onSuccess: (data) => {
      setCurrentResult(data)
    },
  })

  const handleQuery = (textToQuery?: string) => {
    const q = textToQuery || queryText
    if (!q.trim() || queryMutation.isPending) return
    queryMutation.mutate(q.trim())
  }

  const executivePrompts = [
    'How many engineers will be production-ready for Payments in Q4?',
    'What are the primary skill gaps across the 2025 cohort?',
    'Which associates are at risk of missing their 24-month commissioning SLA?',
    'Forecast supply vs demand gap for AI and Data pathways',
  ]

  return (
    <div className="space-y-6">
      {/* Natural Language Query Bar */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900">
            Natural Language Executive Query Assistant
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Query real-time cross-cohort telemetry, workforce supply forecasts, and skill shortage metrics using plain English.
        </p>

        {/* Input & Search Trigger */}
        <div className="flex items-center gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ask an executive question (e.g. 'How many engineers will be ready for Payments in Q4?')..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleQuery()
              }}
              className="w-full pl-11 pr-4 py-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#007df0] focus:bg-white"
            />
          </div>
          <button
            onClick={() => handleQuery()}
            disabled={!queryText.trim() || queryMutation.isPending}
            className="px-6 py-3 rounded-xl bg-[#007df0] hover:bg-[#0069cc] disabled:opacity-50 text-white font-bold text-xs transition shadow-xs flex items-center gap-2 shrink-0"
          >
            <span>Ask AI</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Suggestions:</span>
          {executivePrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleQuery(p)}
              disabled={queryMutation.isPending}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shrink-0 transition"
            >
              {p}
            </button>
          ))}
        </div>
      </Card>

      {/* Loading Indicator */}
      {queryMutation.isPending && (
        <Card className="p-8 text-center text-slate-500">
          <Sparkles className="w-8 h-8 text-[#007df0] animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold">Synthesizing enterprise cohort telemetry &amp; supply models...</p>
        </Card>
      )}

      {/* Result Card */}
      <AnimatePresence>
        {currentResult && !queryMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <Card className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#007df0]">
                    Executive Intelligence Response
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">"{currentResult.query}"</h3>
                  <span className="text-[11px] text-slate-400">Generated {currentResult.generated_at}</span>
                </div>
                <div className="flex items-center gap-2">
                  {currentResult.affected_cohorts?.map((c: string) => (
                    <span key={c} className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Metrics Strip */}
              {currentResult.key_metrics && currentResult.key_metrics.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentResult.key_metrics.map((km: { label: string; value: string }, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[10.5px] font-semibold text-slate-500 uppercase">{km.label}</div>
                      <div className="text-lg font-black text-[#007df0] mt-1">{km.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Answer Content */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {currentResult.answer_markdown}
              </div>

              {/* Strategic Recommendations */}
              {currentResult.recommended_decisions && currentResult.recommended_decisions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> Strategic Executive Recommendations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentResult.recommended_decisions.map((decision: string, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">Recommendation #{idx + 1}</span>
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">
                            HIGH IMPACT
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{decision}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
