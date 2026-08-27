import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  Cpu,
  BarChart3,
  Sliders,
  Sparkles,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Zap,
} from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { WorkforceScenarioRequest, WorkforceScenarioResult } from '../../types'

export function WorkforcePlanningStudio() {
  const [scenarioName, setScenarioName] = useState('Accelerated AI Transition Q4')
  const [cohortDelta, setCohortDelta] = useState<number>(20)
  const [aiShiftPct, setAiShiftPct] = useState<number>(30.0)
  const [acceleratedWeeks, setAcceleratedWeeks] = useState<number>(4)
  const [attritionRate, setAttritionRate] = useState<number>(4.5)

  // Simulation Mutation
  const simulateMutation = useMutation({
    mutationFn: (req: WorkforceScenarioRequest) => api.simulateWorkforceScenario(req),
  })

  // Run initial simulation on mount
  useEffect(() => {
    simulateMutation.mutate({
      scenario_name: scenarioName,
      cohort_intake_delta: cohortDelta,
      ai_shift_percentage: aiShiftPct,
      accelerated_weeks: acceleratedWeeks,
      simulated_attrition_rate: attritionRate,
    })
  }, [cohortDelta, aiShiftPct, acceleratedWeeks, attritionRate, scenarioName])

  const result: WorkforceScenarioResult | undefined = simulateMutation.data

  const applyPreset = (
    name: string,
    delta: number,
    aiShift: number,
    accel: number,
    attr: number
  ) => {
    setScenarioName(name)
    setCohortDelta(delta)
    setAiShiftPct(aiShift)
    setAcceleratedWeeks(accel)
    setAttritionRate(attr)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Workforce Intelligence
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Requirement 23 (What-If Simulation)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Strategic Workforce Planning &amp; Capacity Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulate dynamic cohort sizing, skill pivots to AI Engineering, accelerated commissioning curves, and projected production throughput.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPreset('Accelerated AI Transition', 20, 35.0, 4, 4.0)}
            className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition border border-purple-200"
          >
            AI Pivot (+35%)
          </button>
          <button
            onClick={() => applyPreset('Intake Scale +50%', 40, 15.0, 2, 6.0)}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition border border-indigo-200"
          >
            Scale +50%
          </button>
          <button
            onClick={() => applyPreset('High-Resilience Plan', 0, 10.0, 0, 3.0)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition border border-slate-200"
          >
            Conservative
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls & Right Simulation Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Interactive Sliders & Parameter Controls */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Simulation Parameters
              </h3>
            </div>

            {/* Slider 1: Cohort Intake Delta */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Cohort Intake Delta:</span>
                <span className="font-mono text-indigo-700">{cohortDelta >= 0 ? `+${cohortDelta}` : cohortDelta} engineers</span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                step="5"
                value={cohortDelta}
                onChange={(e) => setCohortDelta(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>-20 (60 total)</span>
                <span>+50 (130 total)</span>
              </div>
            </div>

            {/* Slider 2: AI Engineering Pivot % */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>AI Engineering Shift %:</span>
                <span className="font-mono text-purple-700">{aiShiftPct}% of SE Cohort</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={aiShiftPct}
                onChange={(e) => setAiShiftPct(parseFloat(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% (Standard)</span>
                <span>60% (Max Pivot)</span>
              </div>
            </div>

            {/* Slider 3: Accelerated Weeks */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Acceleration:</span>
                <span className="font-mono text-emerald-700">{acceleratedWeeks} weeks faster</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={acceleratedWeeks}
                onChange={(e) => setAcceleratedWeeks(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 wks (24 wks)</span>
                <span>8 wks (16 wks)</span>
              </div>
            </div>

            {/* Slider 4: Simulated Attrition Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Simulated Attrition Rate:</span>
                <span className="font-mono text-rose-700">{attritionRate}%</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                value={attritionRate}
                onChange={(e) => setAttritionRate(parseFloat(e.target.value))}
                className="w-full accent-rose-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.0% (Low)</span>
                <span>15.0% (Stress)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Real-Time Scenario Results */}
        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              {/* KPIs Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Projected Net Graduates</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{result.projected_graduates} Engineers</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">After attrition adjustment</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Projected Avg Readiness</div>
                  <div className="text-2xl font-black text-indigo-700 mt-1">{result.projected_avg_readiness}%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">5-Pillar Scorecard Target</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Time to Commission</div>
                  <div className="text-2xl font-black text-purple-700 mt-1">{result.timeline_weeks} Weeks</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Fast-track curriculum active</div>
                </div>
              </div>

              {/* Domain Skill Supply vs Demand Balance (Requirement 23) */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Domain Supply vs. Target Demand Balance
                </h3>

                <div className="space-y-3">
                  {Object.entries(result.domain_surplus_deficit).map(([domain, delta]) => {
                    const isSurplus = delta >= 0
                    return (
                      <div key={domain} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{domain}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-lg ${
                              isSurplus
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isSurplus ? `+${delta} Surplus` : `${delta} Deficit`}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Projected Quarterly Production Throughput Table */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Quarterly Production Pipeline Projection
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                        <th className="pb-2">Quarter</th>
                        <th className="pb-2">Intake Sizing</th>
                        <th className="pb-2">In-Training Pipeline</th>
                        <th className="pb-2">Production Ready</th>
                        <th className="pb-2 text-right">Demand Met %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {result.quarterly_pipeline.map((q) => (
                        <tr key={q.quarter} className="text-slate-200">
                          <td className="py-2.5 font-bold text-white">{q.quarter}</td>
                          <td className="py-2.5 font-mono">{q.intake}</td>
                          <td className="py-2.5 font-mono">{q.in_training}</td>
                          <td className="py-2.5 font-mono font-bold text-purple-300">{q.production_ready} engineers</td>
                          <td className="py-2.5 font-mono text-right font-bold text-emerald-400">{q.demand_met_pct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
