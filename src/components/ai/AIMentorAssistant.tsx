import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Sparkles,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Send,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { AIMentorBrief } from '../../types'

interface AIMentorAssistantProps {
  initialAssociateId?: string
}

export function AIMentorAssistant({ initialAssociateId = 'as-ananya' }: AIMentorAssistantProps) {
  const [selectedAssociateId, setSelectedAssociateId] = useState<string>(initialAssociateId)
  const [activeQueryAnswer, setActiveQueryAnswer] = useState<string | null>(null)

  // Queries
  const briefsQuery = useQuery({
    queryKey: ['aiMentorBriefs'],
    queryFn: api.aiMentorBriefs,
  })

  const currentBriefQuery = useQuery({
    queryKey: ['aiMentorBrief', selectedAssociateId],
    queryFn: () => api.aiMentorBrief(selectedAssociateId),
  })

  const briefs = briefsQuery.data || []
  const brief = currentBriefQuery.data

  const handleRunMentorQuery = (queryType: string) => {
    switch (queryType) {
      case 'HIGHEST_RISK':
        setActiveQueryAnswer(
          "### Highest-Risk Mentee Alert\n\n* **Ananya Rao (Status: NEEDS ATTENTION)**: Overall Readiness is **82%**, but Architecture readiness is **74%** with a **-24.0 point gap** in Distributed Systems.\n* **Key Root Cause**: Missed 4 questions on consensus & split-brain in WF-202 exam; ASM-103 milestone delayed 4 days.\n* **Recommended Immediate Action**: Schedule a 45-minute Architecture Defense coaching session before Friday."
        )
        break
      case 'FAST_TRACK':
        setActiveQueryAnswer(
          "### Fast-Track Ready Mentee\n\n* **Rohan Mehta (Status: FAST TRACK)**: Overall Readiness is **87.5%**, milestone velocity is **12 days ahead of schedule**, and code execution score is **95%** on vector search.\n* **Recommended Action**: Nominate for Sponsor Fast-Track Promotion into Payments OLAP Engineering."
        )
        break
      case 'STALLED':
        setActiveQueryAnswer(
          "### Stalled Pipeline Detection\n\n* **Zero blocked associates** in your cohort. However, **Fatima Sheikh** has spent 14 days on Cloud Networking without submitting a pull request.\n* **Recommended Action**: Check in regarding CIDR routing & AWS KMS configuration."
        )
        break
      case 'TALKING_POINTS':
        setActiveQueryAnswer(
          "### Talking Points for Next 1:1 Check-In (Ananya Rao)\n\n1. **Acknowledge Excellence**: Celebrate top 5% cohort score in Prompt Engineering & Java 21 (+88%).\n2. **Target Distributed Systems**: Walk through majority quorum math (\\lfloor N/2 \\rfloor + 1) for her RFC.\n3. **ASM-103 Momentum**: Assist with thread pool executor config to unblock the Kafka rebalance challenge."
        )
        break
      default:
        setActiveQueryAnswer(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-950 border border-purple-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 text-[10px] font-black rounded bg-purple-500/20 text-purple-300 uppercase">
                  AI Mentor Intelligence
                </span>
                <span className="text-xs text-slate-400">Automated Coaching Briefs & Risk Alerts</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Mentee Telemetry & Coaching Assistant
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Provides instant telemetry synthesis, risk alerts, and structured 1:1 talking points.
              </p>
            </div>
          </div>

          {/* Quick Query Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleRunMentorQuery('HIGHEST_RISK')}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Highest-Risk Mentee
            </button>
            <button
              onClick={() => handleRunMentorQuery('FAST_TRACK')}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Fast-Track Candidates
            </button>
            <button
              onClick={() => handleRunMentorQuery('TALKING_POINTS')}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              1:1 Talking Points
            </button>
          </div>
        </div>

        {/* Query Answer Panel */}
        <AnimatePresence>
          {activeQueryAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 text-xs text-slate-200 leading-relaxed space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Mentor Assistant Analysis
                </span>
                <button
                  onClick={() => setActiveQueryAnswer(null)}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
              <div className="whitespace-pre-wrap">{activeQueryAnswer}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mentee Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold uppercase text-slate-400 mr-2 shrink-0">Select Mentee:</span>
        {briefs.map((b) => (
          <button
            key={b.associate_id}
            onClick={() => setSelectedAssociateId(b.associate_id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-2 shrink-0 ${
              selectedAssociateId === b.associate_id
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{b.associate_name}</span>
            <span
              className={`px-1.5 py-0.5 text-[9px] font-black rounded ${
                b.status === 'NEEDS_ATTENTION'
                  ? 'bg-rose-500/30 text-rose-200'
                  : b.status === 'FAST_TRACK'
                  ? 'bg-emerald-500/30 text-emerald-200'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {b.status.replace('_', ' ')}
            </span>
          </button>
        ))}
      </div>

      {/* Formatted Mentor Brief (Requirement 10) */}
      {brief && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          {/* Brief Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-purple-400">{brief.cohort}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{brief.pathway}</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                <span>Mentor Brief: {brief.associate_name}</span>
                <span
                  className={`px-2.5 py-0.5 text-xs font-black rounded-full border ${
                    brief.status === 'NEEDS_ATTENTION'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {brief.status.replace('_', ' ')}
                </span>
              </h3>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Overall Readiness</div>
              <div className="text-2xl font-black text-white">{brief.overall_readiness}%</div>
            </div>
          </div>

          {/* Primary Concern Banner */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-500/30 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                Primary Mentoring Focus
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">{brief.primary_concern}</h4>
            </div>
          </div>

          {/* Evidence Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Telemetry Evidence Summary
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(brief.evidence_summary).map(([key, val]) => (
                <div key={key} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] font-medium text-slate-400 uppercase">{key}</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Mentor Actions & Talking Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Actions */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Recommended Mentor Actions
              </h4>
              <ul className="space-y-2">
                {brief.recommended_actions.map((act, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="font-bold text-purple-400">{idx + 1}.</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Talking Points */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                1:1 Check-In Talking Points
              </h4>
              <ul className="space-y-2">
                {brief.talking_points.map((pt, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
