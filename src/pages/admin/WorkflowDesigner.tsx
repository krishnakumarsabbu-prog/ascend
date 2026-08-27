import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  GitMerge,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Settings,
  Trash2,
  UserCheck,
  Send,
  Eye,
  FileCode,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { WorkflowDefinition, WorkflowNode, WorkflowEdge, WorkflowNodeType } from '../../types'

export function WorkflowDesigner() {
  const queryClient = useQueryClient()
  const [selectedWorkflowCode, setSelectedWorkflowCode] = useState<string>('FAST_TRACK_WAIVER')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('n-mentor')
  const [isSaving, setIsSaving] = useState(false)

  // Fetch workflow definitions
  const workflowsQuery = useQuery({
    queryKey: ['workflowDefinitions'],
    queryFn: api.workflowDefinitions,
  })

  const definitions = workflowsQuery.data || []
  const activeDef = useMemo(() => {
    return definitions.find((d) => d.code === selectedWorkflowCode) || definitions[0]
  }, [definitions, selectedWorkflowCode])

  // Working copy of nodes & edges for editing
  const [workingDef, setWorkingDef] = useState<WorkflowDefinition | null>(null)

  // Sync working copy when activeDef changes
  useMemo(() => {
    if (activeDef) {
      setWorkingDef(JSON.parse(JSON.stringify(activeDef)))
    }
  }, [activeDef])

  const selectedNode = useMemo(() => {
    return workingDef?.nodes.find((n) => n.id === selectedNodeId) || workingDef?.nodes[0] || null
  }, [workingDef, selectedNodeId])

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: (def: WorkflowDefinition) => api.saveWorkflowDefinition(def),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['workflowDefinitions'] })
      setIsSaving(false)
    },
  })

  const handleUpdateSelectedNode = (field: keyof WorkflowNode, value: any) => {
    if (!workingDef || !selectedNode) return
    setWorkingDef({
      ...workingDef,
      nodes: workingDef.nodes.map((n) => (n.id === selectedNode.id ? { ...n, [field]: value } : n)),
    })
  }

  const handleAddNode = (type: WorkflowNodeType) => {
    if (!workingDef) return
    const newId = `n-${Date.now()}`
    const lastNode = workingDef.nodes[workingDef.nodes.length - 1]
    const newNode: WorkflowNode = {
      id: newId,
      label: `New ${type.replace('_', ' ')} Step`,
      type,
      role: 'MENTOR_COACH',
      sla_hours: 48,
      warning_hours: 24,
      escalation_role: 'SENIOR_LEADER_SPONSOR',
      position_x: (lastNode?.position_x || 100) + 220,
      position_y: 150,
    }

    const newEdge: WorkflowEdge = {
      id: `e-${Date.now()}`,
      source: lastNode ? lastNode.id : newId,
      target: newNode.id,
      label: 'Proceed',
    }

    setWorkingDef({
      ...workingDef,
      nodes: [...workingDef.nodes, newNode],
      edges: lastNode ? [...workingDef.edges, newEdge] : workingDef.edges,
    })
    setSelectedNodeId(newId)
  }

  const handleDeleteNode = (nodeId: string) => {
    if (!workingDef || workingDef.nodes.length <= 2) return
    setWorkingDef({
      ...workingDef,
      nodes: workingDef.nodes.filter((n) => n.id !== nodeId),
      edges: workingDef.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })
    setSelectedNodeId(workingDef.nodes[0].id)
  }

  const handleSave = () => {
    if (!workingDef) return
    setIsSaving(true)
    saveMutation.mutate(workingDef)
  }

  const getNodeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'START': return 'border-emerald-500/80 bg-emerald-950/40 text-emerald-300'
      case 'END': return 'border-indigo-500/80 bg-indigo-950/40 text-indigo-300'
      case 'APPROVAL': return 'border-purple-500/80 bg-purple-950/40 text-purple-300'
      case 'REVIEW': return 'border-blue-500/80 bg-blue-950/40 text-blue-300'
      case 'CONDITION': return 'border-amber-500/80 bg-amber-950/40 text-amber-300'
      case 'ESCALATION': return 'border-rose-500/80 bg-rose-950/40 text-rose-300'
      default: return 'border-slate-700 bg-slate-900 text-slate-300'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <GitMerge className="w-3.5 h-3.5" /> ASCEND Workflow Engine
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Visual Process Modeler (Requirement 13)</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Enterprise Workflow Designer &amp; SLA Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure multi-stage approval processes, SLA timers, condition branches, and escalation paths without application code changes.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWorkingDef(activeDef ? JSON.parse(JSON.stringify(activeDef)) : null)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Canvas
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || saveMutation.isPending}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Deploying...' : 'Deploy Workflow'}</span>
          </button>
        </div>
      </div>

      {/* Preset Workflow Template Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold uppercase text-slate-400 mr-2 shrink-0">Workflow:</span>
        {definitions.map((def) => (
          <button
            key={def.code}
            onClick={() => {
              setSelectedWorkflowCode(def.code)
              setSelectedNodeId(def.nodes[0]?.id || null)
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-2 shrink-0 ${
              selectedWorkflowCode === def.code
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>{def.name}</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-slate-800 text-indigo-300 font-mono">
              v{def.version}
            </span>
          </button>
        ))}
      </div>

      {/* Main Designer Studio (Canvas + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Visual Node Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl min-h-[520px] flex flex-col justify-between relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            {/* Canvas Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {workingDef?.category} WORKFLOW DEFINITION
                </span>
                <h3 className="text-sm font-bold text-white">{workingDef?.name}</h3>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {workingDef?.nodes.length} Stages • {workingDef?.edges.length} Transitions
              </div>
            </div>

            {/* Visual Node Flow Strip */}
            <div className="relative z-10 my-auto py-8 overflow-x-auto flex items-center gap-4 px-2">
              {workingDef?.nodes.map((node, index) => (
                <div key={node.id} className="flex items-center gap-3 shrink-0">
                  {/* Step Card Node */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer shadow-xl transition w-56 flex flex-col justify-between h-36 ${getNodeColor(
                      node.type
                    )} ${
                      selectedNodeId === node.id ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-1">
                        <span>{node.type}</span>
                        <span className="font-mono text-slate-400">#{index + 1}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{node.label}</h4>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-300 truncate max-w-[100px]">{node.role.replace('_', ' ')}</span>
                      {node.sla_hours > 0 && (
                        <span className="font-mono text-amber-400 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {node.sla_hours}h SLA
                        </span>
                      )}
                    </div>
                  </motion.div>

                  {/* Connector Arrow */}
                  {index < (workingDef?.nodes.length || 0) - 1 && (
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <span className="text-[9px] font-bold text-slate-400 mb-0.5">SLA Next</span>
                      <ArrowRight className="w-5 h-5 text-indigo-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Node Palette (Add Nodes) */}
            <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-2">
                <Plus className="w-3.5 h-3.5 text-indigo-400" /> Add Step:
              </span>
              {[
                { type: 'APPROVAL', label: 'Approval Node' },
                { type: 'REVIEW', label: 'Review Node' },
                { type: 'CONDITION', label: 'Condition Branch' },
                { type: 'ESCALATION', label: 'Escalation Node' },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => handleAddNode(btn.type as WorkflowNodeType)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition hover:border-slate-700"
                >
                  + {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Node Inspector & Configuration Sidebar */}
        <div className="space-y-4">
          {selectedNode ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Stage Inspector</h3>
                </div>
                {selectedNode.type !== 'START' && selectedNode.type !== 'END' && (
                  <button
                    onClick={() => handleDeleteNode(selectedNode.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete stage"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Node Label */}
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                  Stage Title
                </label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) => handleUpdateSelectedNode('label', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Node Type */}
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                  Stage Type
                </label>
                <select
                  value={selectedNode.type}
                  onChange={(e) => handleUpdateSelectedNode('type', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="START">START</option>
                  <option value="APPROVAL">APPROVAL</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="DECISION">DECISION</option>
                  <option value="CONDITION">CONDITION</option>
                  <option value="ESCALATION">ESCALATION</option>
                  <option value="END">END</option>
                </select>
              </div>

              {/* Assignee Role */}
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                  Assignee Role
                </label>
                <select
                  value={selectedNode.role}
                  onChange={(e) => handleUpdateSelectedNode('role', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="EARLY_TALENT">EARLY_TALENT (Associate)</option>
                  <option value="MENTOR_COACH">MENTOR_COACH (Lead Architect)</option>
                  <option value="ENGINEERING_EXCELLENCE_COMMITTEE">ENGINEERING_EXCELLENCE_COMMITTEE</option>
                  <option value="SENIOR_LEADER_SPONSOR">SENIOR_LEADER_SPONSOR (VP Sponsor)</option>
                  <option value="TECHNOLOGY_HEAD">TECHNOLOGY_HEAD (Global CTO)</option>
                  <option value="SYSTEM">SYSTEM (Automated Rule)</option>
                </select>
              </div>

              {/* SLA & Escalation Engine Configuration (Requirement 14) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> SLA &amp; Escalation Thresholds
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Max SLA (Hours)</label>
                    <input
                      type="number"
                      value={selectedNode.sla_hours}
                      onChange={(e) => handleUpdateSelectedNode('sla_hours', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Warning (Hours)</label>
                    <input
                      type="number"
                      value={selectedNode.warning_hours}
                      onChange={(e) => handleUpdateSelectedNode('warning_hours', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Auto-Escalation Recipient</label>
                  <select
                    value={selectedNode.escalation_role || 'SENIOR_LEADER_SPONSOR'}
                    onChange={(e) => handleUpdateSelectedNode('escalation_role', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value="ENGINEERING_EXCELLENCE_COMMITTEE">Committee Governance</option>
                    <option value="SENIOR_LEADER_SPONSOR">Senior Leader Sponsor</option>
                    <option value="TECHNOLOGY_HEAD">Technology Head</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
              <Layers className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">Click any stage on the canvas to inspect and configure.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
