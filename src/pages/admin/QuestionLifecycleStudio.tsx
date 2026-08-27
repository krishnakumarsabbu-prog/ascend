import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Edit3,
  RotateCcw,
  Sparkles,
  Layers,
  History,
  TrendingUp,
  BarChart,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { GovernanceQuestion } from '../../types'

export function QuestionLifecycleStudio() {
  const queryClient = useQueryClient()
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('gq-101')
  const [filterDomain, setFilterDomain] = useState<string>('ALL')

  // Fetch Governance Questions
  const questionsQuery = useQuery({
    queryKey: ['governanceQuestions'],
    queryFn: () => api.governanceQuestions(),
  })

  const questions = questionsQuery.data || []
  const filtered = questions.filter(
    (q) => filterDomain === 'ALL' || q.domain === filterDomain
  )

  const selectedQuestion =
    questions.find((q) => q.id === selectedQuestionId) || questions[0]

  // Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateQuestionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governanceQuestions'] })
    },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'IN_REVIEW':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      case 'DRAFT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'RETIRED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Question Governance &amp; Psychometrics
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Requirement 17</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Item Bank Lifecycle &amp; Psychometric Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Author, peer review, psychometrically validate ($p$-value &amp; discrimination $r$), and govern assessment item retirement.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Item Bank Table */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-900 uppercase">Item Bank ({filtered.length})</span>
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
              >
                <option value="ALL">All Domains</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Architecture">Architecture</option>
                <option value="Cloud">Cloud</option>
                <option value="Data Engineering">Data Engineering</option>
                <option value="AI Engineering">AI Engineering</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filtered.map((q) => (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    selectedQuestion?.id === q.id
                      ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-indigo-700">{q.code}</span>
                    <span className={`px-2 py-0.2 text-[9px] font-bold rounded border ${getStatusBadge(q.status)}`}>
                      {q.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{q.title}</h4>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{q.domain}</span>
                    <span className="font-mono">v{q.version} • p={q.psychometrics.p_value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Question Detail, Psychometrics & Version Changelog */}
        <div className="lg:col-span-2 space-y-5">
          {selectedQuestion ? (
            <div className="space-y-5">
              {/* Question Header & Content Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-indigo-700">{selectedQuestion.code}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{selectedQuestion.domain}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold text-slate-700">Level {selectedQuestion.difficulty}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedQuestion.title}</h2>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-2">
                    {selectedQuestion.status !== 'ACTIVE' && (
                      <button
                        onClick={() =>
                          statusMutation.mutate({
                            id: selectedQuestion.id,
                            status: 'ACTIVE',
                          })
                        }
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                      >
                        Publish to Active
                      </button>
                    )}
                    {selectedQuestion.status === 'ACTIVE' && (
                      <button
                        onClick={() =>
                          statusMutation.mutate({
                            id: selectedQuestion.id,
                            status: 'RETIRED',
                          })
                        }
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
                      >
                        Retire Item
                      </button>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 leading-relaxed">
                  {selectedQuestion.prompt}
                </div>

                {/* Choices */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Answer Choices &amp; Distractor Distribution:</span>
                  {selectedQuestion.choices.map((c) => {
                    const isCorrect = c.id === selectedQuestion.correct_choice_id
                    const freq = selectedQuestion.psychometrics.distractor_frequencies?.[c.id] ?? 0.1

                    return (
                      <div
                        key={c.id}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          <span className="truncate">{c.text}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 shrink-0">
                          Selected: {Math.round(freq * 100)}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Psychometrics Dashboard Strip (Requirement 17) */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Psychometric Telemetry &amp; IRT Parameters
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Exposure Count: {selectedQuestion.psychometrics.exposure_count} attempts</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase">Difficulty (p-value)</div>
                    <div className="text-xl font-black text-indigo-300 mt-1">{selectedQuestion.psychometrics.p_value}</div>
                    <div className="text-[9px] text-slate-500">Target: 0.40 - 0.80</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase">Discrimination (r)</div>
                    <div className="text-xl font-black text-emerald-400 mt-1">+{selectedQuestion.psychometrics.discrimination_index}</div>
                    <div className="text-[9px] text-slate-500">r &gt; 0.35 is Excellent</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase">IRT b (Difficulty)</div>
                    <div className="text-xl font-black text-purple-300 mt-1">+{selectedQuestion.irt_b_difficulty}</div>
                    <div className="text-[9px] text-slate-500">2PL Theta Parameter</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase">Avg Response Time</div>
                    <div className="text-xl font-black text-amber-400 mt-1">{selectedQuestion.psychometrics.avg_response_time_seconds}s</div>
                    <div className="text-[9px] text-slate-500">Per candidate</div>
                  </div>
                </div>
              </div>

              {/* Version History & Changelog */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <History className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Version History &amp; Peer Review Audit Log
                  </h3>
                </div>

                <div className="space-y-3">
                  {selectedQuestion.changelog.map((c) => (
                    <div key={c.version} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">Version {c.version}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600">Author: {c.author}</span>
                        </div>
                        <p className="text-slate-500 mt-0.5">{c.change_summary}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{c.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-400">
              Select a question to inspect psychometrics and version audit log.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
