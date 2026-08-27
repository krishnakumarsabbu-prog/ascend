import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Clock, BookOpen, Code2, GitBranch, ArrowRight, ShieldAlert, CheckCircle, Filter } from 'lucide-react'
import type { SkillGap } from '../../types'
import { Link } from 'react-router-dom'

interface SkillGapAnalyzerProps {
  gaps: SkillGap[]
  onSelectSkill?: (skillId: string) => void
}

export function SkillGapAnalyzer({ gaps, onSelectSkill }: SkillGapAnalyzerProps) {
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL')

  const filteredGaps = selectedPriority === 'ALL'
    ? gaps
    : gaps.filter(g => g.priority.toUpperCase() === selectedPriority)

  const getPriorityBadge = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'CRITICAL':
        return <span className="px-2.5 py-1 text-[11px] font-black rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> CRITICAL</span>
      case 'HIGH':
        return <span className="px-2.5 py-1 text-[11px] font-black rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> HIGH</span>
      case 'MEDIUM':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30">MEDIUM</span>
      default:
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/30">LOW</span>
    }
  }

  const criticalCount = gaps.filter(g => g.priority.toUpperCase() === 'CRITICAL').length
  const highCount = gaps.filter(g => g.priority.toUpperCase() === 'HIGH').length

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">Competency Gap Analyzer</h2>
            </div>
            <p className="text-xs text-slate-400">
              Identifies technical discrepancies between your current verified evidence and target pathway benchmarks.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <div className="text-xs uppercase font-semibold text-rose-400">Critical Gaps</div>
              <div className="text-xl font-black text-rose-300">{criticalCount}</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <div className="text-xs uppercase font-semibold text-amber-400">High Priority</div>
              <div className="text-xl font-black text-amber-300">{highCount}</div>
            </div>
          </div>
        </div>

        {/* Priority Filter Buttons */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter by Priority:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                selectedPriority === p
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Gaps List / Table */}
      <div className="space-y-4">
        {filteredGaps.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white">No skill gaps matching filter!</h3>
            <p className="text-xs text-slate-400 mt-1">All verified skills in this tier have met or exceeded target benchmarks.</p>
          </div>
        ) : (
          filteredGaps.map((gap) => (
            <motion.div
              key={gap.skill_id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-slate-700 shadow-lg transition space-y-4"
            >
              {/* Row Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onSelectSkill?.(gap.skill_id)}
                    className="text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {gap.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        Importance: <span className="font-semibold text-slate-200">{gap.business_importance}</span>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition mt-1">
                      {gap.skill_name}
                    </h3>
                  </button>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-medium">Gap Delta</div>
                    <div className="text-lg font-black text-rose-400">-{gap.gap} pts</div>
                  </div>
                  {getPriorityBadge(gap.priority)}
                </div>
              </div>

              {/* Progression Tracker Bar */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex justify-between items-baseline text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Current:</span>
                    <span className="font-bold text-white">{gap.current_score}%</span>
                    <span className="text-[11px] text-slate-400 font-medium">({gap.current_level})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Target:</span>
                    <span className="font-bold text-indigo-300">{gap.required_score}%</span>
                    <span className="text-[11px] text-indigo-400/80 font-medium">({gap.required_level})</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${gap.current_score}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                    style={{ left: `${gap.required_score}%` }}
                  />
                </div>
              </div>

              {/* Action Pipeline Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* Course */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Recommended Course
                    </span>
                    <p className="text-xs font-semibold text-slate-200">{gap.recommended_course}</p>
                  </div>
                  <Link
                    to="/curriculum"
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mt-2.5"
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Challenge */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Recommended Challenge
                    </span>
                    <p className="text-xs font-semibold text-slate-200">{gap.recommended_challenge}</p>
                  </div>
                  <Link
                    to="/challenges"
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 mt-2.5"
                  >
                    <span>Attempt in IDE</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Project & Time */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                      <GitBranch className="w-3.5 h-3.5 text-purple-400" /> Project Evidence
                    </span>
                    <p className="text-xs font-semibold text-slate-200">{gap.recommended_project}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2.5 pt-1 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {gap.expected_completion_time}
                    </span>
                    <button
                      onClick={() => onSelectSkill?.(gap.skill_id)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      View Evidence
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
