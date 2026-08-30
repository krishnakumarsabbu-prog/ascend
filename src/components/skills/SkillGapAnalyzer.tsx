import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Clock, BookOpen, Code2, GitBranch, ArrowRight, ShieldAlert, CheckCircle, Filter } from 'lucide-react'
import type { SkillGap } from '../../types'
import { Link } from 'react-router-dom'
import { Card, Badge } from '../ui'

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
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> CRITICAL</span>
      case 'HIGH':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> HIGH</span>
      case 'MEDIUM':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-sky-50 text-sky-700 border border-sky-200">MEDIUM</span>
      default:
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200">LOW</span>
    }
  }

  const criticalCount = gaps.filter(g => g.priority.toUpperCase() === 'CRITICAL').length
  const highCount = gaps.filter(g => g.priority.toUpperCase() === 'HIGH').length

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Competency Gap Analyzer</h2>
            </div>
            <p className="text-xs text-slate-500">
              Identifies technical discrepancies between your current verified evidence and target pathway benchmarks.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-center shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-rose-600">Critical Gaps</div>
              <div className="text-xl font-black text-rose-700">{criticalCount}</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-amber-600">High Priority</div>
              <div className="text-xl font-black text-amber-700">{highCount}</div>
            </div>
          </div>
        </div>

        {/* Priority Filter Buttons */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter by Priority:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedPriority === p
                  ? 'bg-[#007df0] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </Card>

      {/* Gaps List / Table */}
      <div className="space-y-4">
        {filteredGaps.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900">No skill gaps matching filter!</h3>
            <p className="text-xs text-slate-500 mt-1">All verified skills in this tier have met or exceeded target benchmarks.</p>
          </Card>
        ) : (
          filteredGaps.map((gap) => (
            <motion.div
              key={gap.skill_id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-5 hover:border-sky-300 hover:shadow-md transition-all space-y-4">
                {/* Row Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onSelectSkill?.(gap.skill_id)}
                      className="text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {gap.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          Importance: <span className="font-semibold text-slate-800">{gap.business_importance}</span>
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#007df0] transition mt-1">
                        {gap.skill_name}
                      </h3>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-medium">Gap Delta</div>
                      <div className="text-lg font-black text-rose-600">-{gap.gap} pts</div>
                    </div>
                    {getPriorityBadge(gap.priority)}
                  </div>
                </div>

                {/* Progression Tracker Bar */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex justify-between items-baseline text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Current:</span>
                      <span className="font-bold text-slate-900">{gap.current_score}%</span>
                      <span className="text-[11px] text-slate-500 font-medium">({gap.current_level})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Target:</span>
                      <span className="font-bold text-[#007df0]">{gap.required_score}%</span>
                      <span className="text-[11px] text-sky-700 font-medium">({gap.required_level})</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-[#007df0] rounded-full transition-all duration-500"
                      style={{ width: `${gap.current_score}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-amber-500 shadow-sm"
                      style={{ left: `${gap.required_score}%` }}
                    />
                  </div>
                </div>

                {/* Action Pipeline Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {/* Course */}
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Recommended Course
                      </span>
                      <p className="text-xs font-bold text-slate-800">{gap.recommended_course}</p>
                    </div>
                    <Link
                      to="/curriculum"
                      className="text-xs text-[#007df0] hover:underline font-bold flex items-center gap-1 mt-3"
                    >
                      <span>Launch Module</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Challenge */}
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                        <Code2 className="w-3.5 h-3.5 text-emerald-600" /> Recommended Challenge
                      </span>
                      <p className="text-xs font-bold text-slate-800">{gap.recommended_challenge}</p>
                    </div>
                    <Link
                      to="/challenges"
                      className="text-xs text-emerald-600 hover:underline font-bold flex items-center gap-1 mt-3"
                    >
                      <span>Attempt in IDE</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Project & Time */}
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                        <GitBranch className="w-3.5 h-3.5 text-purple-600" /> Project Evidence
                      </span>
                      <p className="text-xs font-bold text-slate-800">{gap.recommended_project}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" /> {gap.expected_completion_time}
                      </span>
                      <button
                        onClick={() => onSelectSkill?.(gap.skill_id)}
                        className="text-[#007df0] hover:underline font-bold"
                      >
                        View Evidence
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
