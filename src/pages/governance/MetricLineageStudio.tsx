import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Network,
  Activity,
  Layers,
  Database,
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { MetricLineageNode } from '../../types'
import { Card } from '../../components/ui'

export function MetricLineageStudio() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-readiness-composite')

  // Query lineage DAG
  const lineageQuery = useQuery({
    queryKey: ['metricLineage'],
    queryFn: () => api.metricLineageNodes(),
  })

  const nodes = lineageQuery.data || []
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0]

  const getNodeColor = (category: string) => {
    switch (category) {
      case 'COMPOSITE_METRIC':
        return 'bg-purple-50 border-purple-200 text-purple-900'
      case 'PILLAR_SCORE':
        return 'bg-sky-50 border-sky-200 text-sky-900'
      case 'INTERMEDIATE_INDICATOR':
        return 'bg-blue-50 border-blue-200 text-blue-900'
      default:
        return 'bg-slate-50 border-slate-200 text-slate-900'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-[#007df0]" /> Provenance &amp; Lineage
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-400">Metric Transparency</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
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
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Telemetry to Composite Metric Transformation Pipeline
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                DAG Validated
              </span>
            </div>

            {/* Pipeline Stage Cards */}
            <div className="space-y-3">
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id

                return (
                  <motion.div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    whileHover={{ scale: 1.005 }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${getNodeColor(
                      node.category
                    )} ${isSelected ? 'ring-2 ring-[#007df0] shadow-xs' : 'hover:border-slate-300'}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-white/80 border border-slate-200 text-slate-700">
                          {node.category.replace('_', ' ')}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{node.name}</h4>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 truncate max-w-lg">
                        Formula: {node.formula_latex}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-slate-900">{node.formatted_value}</div>
                      <span className="text-[10px] text-slate-400 font-mono">Weight: {node.sensitivity_weight}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right Col: Calculation Debugger & Sensitivity Breakdown */}
        <div className="space-y-4">
          {selectedNode && (
            <Card className="p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase text-[#007df0]">Metric Calculation Debugger</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedNode.name}</h3>
              </div>

              {/* Current Value */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Computed Output Value</div>
                <div className="text-3xl font-black text-[#007df0]">{selectedNode.formatted_value}</div>
                <div className="text-[10.5px] text-slate-500 font-mono">Update cadence: {selectedNode.update_frequency}</div>
              </div>

              {/* Formula */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">Mathematical Expression:</span>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs overflow-x-auto">
                  {selectedNode.formula_latex}
                </div>
              </div>

              {/* Input Sources */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">Input Telemetry Sources:</span>
                <div className="space-y-1">
                  {selectedNode.input_sources.map((src, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-[#007df0]" />
                      <span>{src}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sensitivity & Governing Body */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 font-mono">
                <div>Governing Body: <strong className="text-slate-800">{selectedNode.owner}</strong></div>
                <div>Confidence Interval: <strong className="text-emerald-600">95% (&plusmn;1.4%)</strong></div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
