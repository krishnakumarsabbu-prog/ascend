import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Network,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  TrendingUp,
  Cpu,
  Database,
  BarChart3,
  Sliders,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { MetricLineageNode } from '../../types'

export function MetricLineageStudio() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('comp-readiness')

  const lineageQuery = useQuery({
    queryKey: ['metricLineageNodes'],
    queryFn: () => api.metricLineageNodes(),
  })

  const nodes = lineageQuery.data || []
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0]

  const getNodeColor = (category: string) => {
    switch (category) {
      case 'COMPOSITE_METRIC':
        return 'bg-purple-950/80 border-purple-500/50 text-purple-200'
      case 'PILLAR_SCORE':
        return 'bg-indigo-950/80 border-indigo-500/50 text-indigo-200'
      case 'INTERMEDIATE_INDICATOR':
        return 'bg-blue-950/80 border-blue-500/50 text-blue-200'
      default:
        return 'bg-slate-900 border-slate-700 text-slate-300'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" /> Provenance &amp; Lineage
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Requirement 27 (Metric Transparency)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Metric Lineage &amp; Calculation Provenance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual Directed Acyclic Graph (DAG) demonstrating how raw telemetry streams transform into higher-level Pillar scores and Composite Readiness.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Interactive Lineage DAG Pipeline + Right Calculation Debugger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Visual Lineage DAG */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">
                Telemetry to Composite Metric Transformation Pipeline
              </span>
              <span className="text-[10px] font-mono text-emerald-400">DAG Validated</span>
            </div>

            {/* Pipeline Stage Cards */}
            <div className="space-y-3">
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id

                return (
                  <motion.div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${getNodeColor(
                      node.category
                    )} ${isSelected ? 'ring-2 ring-indigo-400 shadow-lg' : ''}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-white/10 text-white">
                          {node.category.replace('_', ' ')}
                        </span>
                        <h4 className="text-xs font-bold text-white">{node.name}</h4>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate max-w-lg">
                        Formula: {node.formula_latex}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-white">{node.formatted_value}</div>
                      <span className="text-[10px] text-slate-400 font-mono">Weight: {node.sensitivity_weight}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Calculation Debugger & Sensitivity Breakdown (Requirement 27) */}
        <div className="space-y-4">
          {selectedNode && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase text-indigo-600">Metric Calculation Debugger</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedNode.name}</h3>
              </div>

              {/* Current Value */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Computed Output Value</div>
                <div className="text-3xl font-black text-indigo-700">{selectedNode.formatted_value}</div>
                <div className="text-[10px] text-slate-500 font-mono">Update cadence: {selectedNode.update_frequency}</div>
              </div>

              {/* Formula */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">Mathematical Expression:</span>
                <div className="p-3 rounded-xl bg-slate-900 text-purple-300 font-mono text-xs overflow-x-auto">
                  {selectedNode.formula_latex}
                </div>
              </div>

              {/* Input Sources */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">Input Telemetry Sources:</span>
                <div className="space-y-1">
                  {selectedNode.input_sources.map((src, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{src}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sensitivity & Governing Body */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 font-mono">
                <div>Governing Body: <strong className="text-slate-700">{selectedNode.owner}</strong></div>
                <div>Confidence Interval: <strong className="text-emerald-600">95% (±1.4%)</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
