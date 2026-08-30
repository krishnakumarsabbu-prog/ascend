import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Plus,
  Trash2,
  Save,
  Move,
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  PieChart,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { DashboardWidgetConfig, CustomDashboardLayout } from '../../types'
import { Card } from '../../components/ui'

export function CustomDashboardBuilder() {
  const queryClient = useQueryClient()
  const [activeDashboardId, setActiveDashboardId] = useState<string>('dash-exec-01')
  const [showAddWidget, setShowAddWidget] = useState(false)
  const [newWidgetTitle, setNewWidgetTitle] = useState('')
  const [newWidgetType, setNewWidgetType] = useState<string>('KPI_CARD')
  const [newWidgetMetric, setNewWidgetMetric] = useState('READINESS_INDEX')
  const [newWidgetSize, setNewWidgetSize] = useState<string>('2x1')
  const [currentWidgets, setCurrentWidgets] = useState<DashboardWidgetConfig[]>([])

  // Query saved dashboards
  const dashboardsQuery = useQuery({
    queryKey: ['customDashboards'],
    queryFn: async () => {
      const data = await api.customDashboards()
      if (data.length > 0 && currentWidgets.length === 0) {
        setCurrentWidgets(data[0].widgets)
      }
      return data
    },
  })

  // Save Dashboard Mutation
  const saveMutation = useMutation({
    mutationFn: (cfg: CustomDashboardLayout) => api.saveCustomDashboard(cfg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customDashboards'] })
    },
  })

  const dashboards = dashboardsQuery.data || []
  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId) || dashboards[0]

  const handleAddWidget = () => {
    if (!newWidgetTitle.trim()) return
    const widget: DashboardWidgetConfig = {
      id: `w-${Date.now()}`,
      title: newWidgetTitle,
      widget_type: newWidgetType,
      metric_source: newWidgetMetric,
      size: newWidgetSize,
    }
    setCurrentWidgets([...currentWidgets, widget])
    setNewWidgetTitle('')
    setShowAddWidget(false)
  }

  const handleRemoveWidget = (widgetId: string) => {
    setCurrentWidgets(currentWidgets.filter((w) => w.id !== widgetId))
  }

  const handleSave = () => {
    if (!activeDashboard) return
    saveMutation.mutate({
      ...activeDashboard,
      widgets: currentWidgets,
    })
  }

  const getWidgetColSpan = (size: string) => {
    switch (size) {
      case 'full':
      case '3x1':
        return 'col-span-1 sm:col-span-2 lg:col-span-3'
      case '2x1':
      case '2x2':
        return 'col-span-1 sm:col-span-2'
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
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5 text-[#007df0]" /> Self-Service Analytics Studio
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-400">Custom Executive Studio</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Custom Executive Dashboard Builder
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Drag, configure, and curate executive KPI widgets, cross-cohort throughput feeds, and readiness distributions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddWidget(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#007df0]" />
            <span>Add Widget</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'Saving Layout...' : 'Save Dashboard'}</span>
          </button>
        </div>
      </div>

      {/* Widgets Grid Canvas */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Layout: <strong className="text-slate-900">{activeDashboard?.title}</strong> ({currentWidgets.length} widgets)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentWidgets.map((w) => (
            <motion.div
              key={w.id}
              layout
              className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 ${getWidgetColSpan(
                w.size
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-sky-50 text-sky-800 border border-sky-200 uppercase">
                    {w.widget_type.replace('_', ' ')}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{w.title}</h4>
                </div>
                <button
                  onClick={() => handleRemoveWidget(w.id)}
                  className="text-slate-400 hover:text-rose-600 transition"
                  title="Remove widget"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Simulated Widget Content Preview */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Live Telemetry Source</div>
                <div className="text-base font-black text-[#007df0]">{w.metric_source}</div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                <span>Size: {w.size}</span>
                <span>Auto-refresh: 30s</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Add Widget Modal */}
      <AnimatePresence>
        {showAddWidget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Add Executive Telemetry Widget</h3>
                <button onClick={() => setShowAddWidget(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Widget Title:</label>
                  <input
                    type="text"
                    placeholder="e.g. Q4 Cloud Readiness Velocity"
                    value={newWidgetTitle}
                    onChange={(e) => setNewWidgetTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#007df0]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Widget Visualization Type:</label>
                  <select
                    value={newWidgetType}
                    onChange={(e) => setNewWidgetType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#007df0] bg-white"
                  >
                    <option value="KPI_CARD">Single KPI Metric Card</option>
                    <option value="TIME_SERIES">Time-Series Velocity Chart</option>
                    <option value="FUNNEL_CHART">Funnel Progression Chart</option>
                    <option value="HEATMAP_MATRIX">Readiness Matrix Heatmap</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Telemetry Data Source:</label>
                  <select
                    value={newWidgetMetric}
                    onChange={(e) => setNewWidgetMetric(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#007df0] bg-white"
                  >
                    <option value="READINESS_INDEX">Composite Readiness Index</option>
                    <option value="SKILL_GAP_VELOCITY">Skill Gap Resolution Velocity</option>
                    <option value="ASM_BOARD_PASS_RATE">ASM Architect Board Pass Rate</option>
                    <option value="WORKFORCE_SUPPLY_GAP">Workforce Supply vs Demand Gap</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Widget Layout Width:</label>
                  <select
                    value={newWidgetSize}
                    onChange={(e) => setNewWidgetSize(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#007df0] bg-white"
                  >
                    <option value="1x1">1 Column (1x1)</option>
                    <option value="2x1">2 Columns (2x1)</option>
                    <option value="full">Full Row (full)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowAddWidget(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWidget}
                  disabled={!newWidgetTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition shadow-xs"
                >
                  Add to Canvas
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
