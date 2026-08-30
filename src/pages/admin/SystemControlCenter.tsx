import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sliders,
  SlidersHorizontal,
  Server,
  Activity,
  ToggleLeft,
  ToggleRight,
  Save,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Database,
  Radio,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { ScoringRuleConfig, SystemHealthStatus } from '../../types'
import { Card } from '../../components/ui'

export function SystemControlCenter() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'HEALTH' | 'FLAGS' | 'SCORING'>('SCORING')
  const [selectedPathway, setSelectedPathway] = useState<string>('SOFTWARE_ENGINEERING')

  // Fetch System Health
  const healthQuery = useQuery({
    queryKey: ['systemHealth'],
    queryFn: () => api.systemHealth(),
  })

  // Fetch Scoring Rules
  const scoringQuery = useQuery({
    queryKey: ['scoringRules'],
    queryFn: () => api.scoringRules(),
  })

  // Fetch Feature Flags
  const flagsQuery = useQuery({
    queryKey: ['featureFlags'],
    queryFn: () => api.featureFlags(),
  })

  const health = healthQuery.data
  const scoringRules = scoringQuery.data || []
  const featureFlags = flagsQuery.data || {}

  const activeRule = scoringRules.find((r) => r.pathway === selectedPathway) || scoringRules[0]

  // Local state for rule sliders
  const [technicalWeight, setTechnicalWeight] = useState<number>(0.35)
  const [architectureWeight, setArchitectureWeight] = useState<number>(0.25)
  const [cloudWeight, setCloudWeight] = useState<number>(0.15)
  const [productionWeight, setProductionWeight] = useState<number>(0.15)
  const [leadershipWeight, setLeadershipWeight] = useState<number>(0.10)
  const [minPassScore, setMinPassScore] = useState<number>(80.0)

  // Update Scoring Rule Mutation
  const updateRuleMutation = useMutation({
    mutationFn: (updated: ScoringRuleConfig) => api.updateScoringRule(updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoringRules'] })
    },
  })

  // Update Flags Mutation
  const updateFlagsMutation = useMutation({
    mutationFn: (newFlags: Record<string, boolean>) => api.updateFeatureFlags(newFlags),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] })
    },
  })

  const handleToggleFlag = (key: string) => {
    const updated = { ...featureFlags, [key]: !featureFlags[key] }
    updateFlagsMutation.mutate(updated)
  }

  const handleSaveRule = () => {
    if (!activeRule) return
    updateRuleMutation.mutate({
      ...activeRule,
      technical_weight: technicalWeight,
      architecture_weight: architectureWeight,
      cloud_weight: cloudWeight,
      production_weight: productionWeight,
      leadership_weight: leadershipWeight,
      minimum_passing_score: minPassScore,
    })
  }

  const totalWeight = Number(
    (technicalWeight + architectureWeight + cloudWeight + productionWeight + leadershipWeight).toFixed(2)
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Platform Control
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Requirements 35 &amp; 36–50 (Control Center &amp; Scoring)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            System Control Center &amp; Dynamic Scoring Rules
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Calibrate pathway rubric weights, monitor infrastructure health telemetry, and toggle global feature flags.
          </p>
        </div>
      </div>

      {/* 3 Tabs Ribbon */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { key: 'SCORING', label: '1. Dynamic Scoring Rules & Calibration (Req 35)', icon: SlidersHorizontal },
          { key: 'FLAGS', label: '2. Global Feature Switchboard', icon: ToggleRight },
          { key: 'HEALTH', label: '3. Infrastructure Health & Telemetry', icon: Server },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: SCORING RULES CALIBRATION (Requirement 35) */}
      {activeTab === 'SCORING' && (
        <div className="space-y-6">
          {/* Pathway Selector */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Target Pathway:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { key: 'SOFTWARE_ENGINEERING', label: 'Software Engineering' },
                { key: 'AI_ENGINEERING', label: 'AI Engineering' },
                { key: 'CLOUD_INFRASTRUCTURE', label: 'Cloud Infrastructure' },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPathway(p.key)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    selectedPathway === p.key
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sliders Grid */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Readiness Pillar Weight Calibration (Must sum to 1.00)
                </h3>
                <span
                  className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded ${
                    totalWeight === 1.0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  Total: {totalWeight.toFixed(2)} / 1.00
                </span>
              </div>

              {/* Slider 1: Technical */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>1. Technical Execution Pillar</span>
                  <span className="font-mono text-indigo-700">{(technicalWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.60}
                  step={0.05}
                  value={technicalWeight}
                  onChange={(e) => setTechnicalWeight(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Slider 2: Architecture */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>2. Architecture &amp; Systems Defense</span>
                  <span className="font-mono text-indigo-700">{(architectureWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.50}
                  step={0.05}
                  value={architectureWeight}
                  onChange={(e) => setArchitectureWeight(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Slider 3: Cloud */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>3. Cloud &amp; Infrastructure</span>
                  <span className="font-mono text-indigo-700">{(cloudWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.40}
                  step={0.05}
                  value={cloudWeight}
                  onChange={(e) => setCloudWeight(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Slider 4: Production */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>4. Production Engineering &amp; Observability</span>
                  <span className="font-mono text-indigo-700">{(productionWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.40}
                  step={0.05}
                  value={productionWeight}
                  onChange={(e) => setProductionWeight(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Slider 5: Leadership */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>5. Professionalism &amp; Leadership</span>
                  <span className="font-mono text-indigo-700">{(leadershipWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.30}
                  step={0.05}
                  value={leadershipWeight}
                  onChange={(e) => setLeadershipWeight(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Minimum Gate Pass Score:</span>
                  <input
                    type="number"
                    value={minPassScore}
                    onChange={(e) => setMinPassScore(parseFloat(e.target.value))}
                    className="w-20 p-1.5 text-xs rounded-lg border border-slate-300 font-mono font-bold text-indigo-700"
                  />
                  <span className="text-xs text-slate-500">%</span>
                </div>

                <button
                  onClick={handleSaveRule}
                  disabled={updateRuleMutation.isPending || totalWeight !== 1.0}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <Save className="w-4 h-4" />
                  <span>{updateRuleMutation.isPending ? 'Saving Calibration...' : 'Apply Scoring Weights'}</span>
                </button>
              </div>
            </div>

            {/* Live Calibration Simulation Preview */}
            <div className="space-y-4">
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Sparkles className="w-4 h-4 text-[#007df0]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Live Score Recalculation Preview
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Simulated Associate Score</div>
                  <div className="text-3xl font-black text-emerald-600">
                    {(
                      88.2 * technicalWeight +
                      74.8 * architectureWeight +
                      79.4 * cloudWeight +
                      84.0 * productionWeight +
                      81.0 * leadershipWeight
                    ).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono font-bold">
                    Status: PASS (Above {minPassScore}% bar)
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Adjusting scoring weights updates graduation probabilities and readiness alerts across all GDA cohort views in real-time.
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL FEATURE FLAGS */}
      {activeTab === 'FLAGS' && (
        <div className="max-w-3xl space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Live Global Feature Flags
            </h3>

            <div className="divide-y divide-slate-100">
              {Object.entries(featureFlags).map(([flagKey, isEnabled]) => (
                <div key={flagKey} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-900 font-mono">{flagKey}</div>
                    <div className="text-[11px] text-slate-500">
                      Toggle runtime availability of this capability across all role portals.
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFlag(flagKey)}
                    className={`p-2 rounded-xl transition flex items-center gap-2 text-xs font-bold ${
                      isEnabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {isEnabled ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                    <span>{isEnabled ? 'ENABLED' : 'DISABLED'}</span>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: INFRASTRUCTURE HEALTH */}
      {activeTab === 'HEALTH' && health && (
        <div className="max-w-3xl space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Infrastructure &amp; Telemetry Status
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{health.uptime_pct}% Uptime</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">PostgreSQL Database:</span>
                <span className="font-bold text-emerald-600">{health.database_status}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Vector Store (RAG):</span>
                <span className="font-bold text-purple-600">{health.vector_store_status}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">2PL IRT CAT Compute Latency:</span>
                <span className="font-mono font-bold text-[#007df0]">{health.irt_engine_latency_ms}ms P99</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">xAPI LRS Ingestion Stream:</span>
                <span className="font-bold text-emerald-600">{health.lrs_stream_status}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
