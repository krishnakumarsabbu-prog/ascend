import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShieldCheck,
  Award,
  Layers,
  Calendar,
  Filter,
  DollarSign,
  Clock,
  Sparkles,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { ExecutiveAnalyticsData } from '../../types'
import { Card } from '../../components/ui'

export function ExecutiveAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'EXECUTIVE' | 'COHORTS' | 'SKILLS' | 'INTEGRITY'>('EXECUTIVE')
  const [timeRange, setTimeRange] = useState<string>('90')

  const analyticsQuery = useQuery({
    queryKey: ['executiveAnalytics'],
    queryFn: () => api.executiveAnalytics(),
  })

  const data = analyticsQuery.data

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> Executive Intelligence
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Requirement 24 (Analytics Suite)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Executive &amp; Operational Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive business metrics, cohort throughput velocities, competency heatmaps, and assessment integrity indices.
          </p>
        </div>

        {/* Time-Range Filter */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-slate-100 border border-slate-200/90 flex text-xs font-bold text-slate-600 shadow-2xs">
            {['30', '90', '180', '365'].map((d) => (
              <button
                key={d}
                onClick={() => setTimeRange(d)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === d ? 'bg-[#007df0] text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Tabs Ribbon */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { key: 'EXECUTIVE', label: '1. Executive Overview', icon: TrendingUp },
          { key: 'COHORTS', label: '2. Cohort & Pathway Velocity', icon: Users },
          { key: 'SKILLS', label: '3. Skill & Competency Matrix', icon: Layers },
          { key: 'INTEGRITY', label: '4. Assessment & Integrity', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
                isActive
                  ? 'bg-[#007df0] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {data && (
        <div className="space-y-6">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'EXECUTIVE' && (
            <div className="space-y-6">
              {/* KPIs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.executive_kpis.map((kpi) => {
                  const isPositive = kpi.trend_direction === 'UP' || kpi.metric_key === 'COST_PER_READY_ENGINEER'
                  return (
                    <Card
                      key={kpi.metric_key}
                      className="p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {kpi.label}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex items-center gap-0.5 border ${
                            isPositive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {kpi.change_pct_30d > 0 ? `+${kpi.change_pct_30d}%` : `${kpi.change_pct_30d}%`}
                        </span>
                      </div>
                      <div className="text-3xl font-black text-slate-900">{kpi.formatted_value}</div>
                      <div className="text-[10.5px] text-slate-500 font-mono">Vs. previous {timeRange} days</div>
                    </Card>
                  )
                })}
              </div>

              {/* Velocity Time-Series Trend */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#007df0]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Time-Series Velocity &amp; Readiness Curve ({timeRange} Day Trajectory)
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +18.2% Compound Velocity
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {data.time_series_velocity.map((v) => (
                    <div key={v.day} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{v.day}</div>
                      <div className="text-lg font-black text-[#007df0]">{v.avg_readiness}% Readiness</div>
                      <div className="text-[10px] text-slate-600 font-mono">SE: {v.se_velocity}x • AI: {v.ai_velocity}x</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: COHORT & PATHWAY VELOCITY */}
          {activeTab === 'COHORTS' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Cohort Throughput &amp; Commissioning Progress
                </h3>

                <div className="space-y-4">
                  {data.cohort_progress.map((c) => (
                    <div key={c.cohort_name} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{c.cohort_name}</h4>
                          <span className="text-xs text-slate-500">
                            {c.enrolled} Enrolled • {c.passed_gates} Passed All Gates • {c.at_risk} At-Risk
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-indigo-700">{c.commissioned_pct}% Commissioned</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${c.commissioned_pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILL & COMPETENCY MATRIX */}
          {activeTab === 'SKILLS' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Enterprise Skill Health &amp; Gap Matrix (5 Domains)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                        <th className="pb-3">Domain</th>
                        <th className="pb-3">Health Score</th>
                        <th className="pb-3">Top Growing Skill</th>
                        <th className="pb-3">Persistent Critical Gap</th>
                        <th className="pb-3 text-right">L4 Master Engineers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.skill_health_matrix.map((sk) => (
                        <tr key={sk.domain} className="hover:bg-slate-50">
                          <td className="py-3 font-bold text-slate-900">{sk.domain}</td>
                          <td className="py-3 font-mono font-bold text-indigo-700">{sk.health_score}%</td>
                          <td className="py-3 text-slate-700">{sk.top_skill}</td>
                          <td className="py-3 text-rose-600 font-medium">{sk.critical_gap}</td>
                          <td className="py-3 text-right font-mono font-bold text-purple-700">{sk.l4_masters}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ASSESSMENT & INTEGRITY */}
          {activeTab === 'INTEGRITY' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Overall Integrity Score</div>
                  <div className="text-3xl font-black text-emerald-600 mt-1">{data.assessment_integrity_metrics.overall_integrity_score} / 100</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Automated proctoring telemetry</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">CAT SEM Stopping Target Met</div>
                  <div className="text-3xl font-black text-indigo-700 mt-1">{data.assessment_integrity_metrics.cat_stopping_accuracy_met_pct}%</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">&le; 0.28 SEM standard error</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Flagged Anomaly Frequency</div>
                  <div className="text-3xl font-black text-amber-600 mt-1">{data.assessment_integrity_metrics.flagged_proctoring_anomalies_pct}%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Tab loss &amp; velocity alerts</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
