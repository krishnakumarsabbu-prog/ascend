import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutGrid,
  Plus,
  Trash2,
  Save,
  Sliders,
  Sparkles,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Award,
  Layers,
  Check,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { CustomDashboardLayout, DashboardWidgetConfig } from '../../types'

export function CustomDashboardBuilder() {
  const queryClient = useQueryClient()
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>('dash-exec-sponsor')
  const [showAddWidget, setShowAddWidget] = useState(false)

  // Fetch Dashboards
  const dashboardsQuery = useQuery({
    queryKey: ['customDashboards'],
    queryFn: () => api.customDashboards(),
  })

  const dashboards = dashboardsQuery.data || []
  const activeDashboard = dashboards.find((d) => d.id === selectedDashboardId) || dashboards[0]

  const [currentWidgets, setCurrentWidgets] = useState<DashboardWidgetConfig[]>(
    activeDashboard?.widgets || []
  )

  // Save Dashboard Mutation
  const saveMutation = useMutation({
    mutationFn: (updated: CustomDashboardLayout) => api.saveCustomDashboard(updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customDashboards'] })
    },
  })

  const handleSave = () => {
    if (!activeDashboard) return
    saveMutation.mutate({
      ...activeDashboard,
      widgets: currentWidgets,
    })
  }

  const handleRemoveWidget = (widgetId: string) => {
    setCurrentWidgets((prev) => prev.filter((w) => w.id !== widgetId))
  }

  const handleAddWidget = (widgetType: string, title: string, size: string, metricSource: string) => {
    const newWidget: DashboardWidgetConfig = {
      id: `w-${Date.now()}`,
      widget_type: widgetType,
      title,
      size,
      metric_source: metricSource,
    }
    setCurrentWidgets((prev) => [...prev, newWidget])
    setShowAddWidget(false)
  }

  const getWidgetColSpan = (size: string) => {
    switch (size) {
      case '2x1':
        return 'sm:col-span-2'
      case '2x2':
        return 'sm:col-span-2 row-span-2'
      case 'full':
        return 'col-span-full'
      default:
        return 'col-span-1'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5" /> Widget Canvas
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Requirement 25 (Dashboard Studio)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Custom Executive Dashboard Builder
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build, rearrange, and persist role-specific analytics dashboards using 15+ real-time enterprise telemetry widgets.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddWidget(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add Widget</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'Saving Layout...' : 'Save Dashboard'}</span>
          </button>
        </div>
      </div>

      {/* Widgets Grid Canvas */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Active Layout: <strong className="text-white">{activeDashboard?.title}</strong> ({currentWidgets.length} widgets)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentWidgets.map((w) => (
            <motion.div
              key={w.id}
              layout
              className={`p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col justify-between space-y-4 ${getWidgetColSpan(
                w.size
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 uppercase">
                    {w.widget_type.replace('_', ' ')}
                  </span>
                  <h4 className="text-xs font-bold text-white">{w.title}</h4>
                </div>
                <button
                  onClick={() => handleRemoveWidget(w.id)}
                  className="text-slate-500 hover:text-rose-400 transition"
                  title="Remove widget"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Simulated Widget Content Preview */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center text-xs space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Live Telemetry Source</div>
                <div className="text-base font-black text-indigo-400">{w.metric_source}</div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                <span>Size: {w.size}</span>
                <span>Auto-refresh: 30s</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Widget Modal */}
      <AnimatePresence>
        {showAddWidget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Add Telemetry Widget</h3>
                <button onClick={() => setShowAddWidget(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { type: 'KPI_CARD', title: 'Executive KPI Counter', size: '1x1', source: 'TOTAL_ACTIVE_TALENT' },
                  { type: 'RADIAL_GAUGE', title: '5-Pillar Scorecard Radial Gauge', size: '1x1', source: 'OVERALL_READINESS_SCORE' },
                  { type: 'TIME_SERIES', title: 'Historical Milestone Velocity', size: '2x1', source: 'TIME_SERIES_VELOCITY' },
                  { type: 'HEATMAP_MATRIX', title: '5-Domain Skill Health Heatmap', size: '2x2', source: 'SKILL_HEALTH_MATRIX' },
                  { type: 'LEADERBOARD', title: 'Top Performing Associates Table', size: '2x1', source: 'TOP_ASSOCIATES' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleAddWidget(item.type, item.title, item.size, item.source)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Source: {item.source} • Grid: {item.size}</div>
                    </div>
                    <Plus className="w-4 h-4 text-indigo-600" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
