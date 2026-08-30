import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitMerge,
  Plus,
  Trash2,
  Save,
  ArrowRight,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Settings,
  Layers,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type {
  WorkflowDefinition,
  WorkflowNode,
  WorkflowNodeType,
  WorkflowEdge,
} from '../../types'
import { Card } from '../../components/ui'

export function WorkflowDesigner() {
  const queryClient = useQueryClient()
  const [selectedWorkflowCode, setSelectedWorkflowCode] = useState<string>('WF-GRAD-AUTO')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'CANVAS' | 'SETTINGS'>('CANVAS')

  // Fetch Workflow Definitions
  const workflowsQuery = useQuery({
    queryKey: ['workflowDefinitions'],
    queryFn: () => api.workflowDefinitions(),
  })

  const definitions = workflowsQuery.data || []
  const currentDef = definitions.find((d) => d.code === selectedWorkflowCode) || definitions[0]

  // Local mutable state for currently edited definition
  const [workingDef, setWorkingDef] = useState<WorkflowDefinition | null>(null)

  // Update working state when definition query resolves
  if (currentDef && (!workingDef || workingDef.code !== currentDef.code)) {
    setWorkingDef(JSON.parse(JSON.stringify(currentDef)))
    if (!selectedNodeId && currentDef.nodes.length > 0) {
      setSelectedNodeId(currentDef.nodes[0].id)
    }
  }

  // Save Workflow Definition Mutation
  const saveMutation = useMutation({
    mutationFn: (def: WorkflowDefinition) => api.saveWorkflowDefinition(def),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflowDefinitions'] })
    },
  })

  const selectedNode = workingDef?.nodes.find((n) => n.id === selectedNodeId)

  const handleUpdateNode = (updatedFields: Partial<WorkflowNode>) => {
    if (!workingDef || !selectedNodeId) return
    const newNodes = workingDef.nodes.map((node) =>
      node.id === selectedNodeId ? { ...node, ...updatedFields } : node
    )
    setWorkingDef({ ...workingDef, nodes: newNodes })
  }

  const handleAddNode = (type: WorkflowNodeType) => {
    if (!workingDef) return
    const newNodeId = `node-${Date.now()}`
    const newNode: WorkflowNode = {
      id: newNodeId,
      label: `New ${type.toLowerCase()} step`,
      type,
      role: 'MENTOR',
      sla_hours: 48,
      warning_hours: 12,
      position_x: (workingDef.nodes.length + 1) * 200,
      position_y: 150,
    }
    const newNodes = [...workingDef.nodes, newNode]
    const lastNode = workingDef.nodes[workingDef.nodes.length - 1]
    const newEdges: WorkflowEdge[] = lastNode
      ? [
          ...workingDef.edges,
          {
            id: `edge-${Date.now()}`,
            source: lastNode.id,
            target: newNodeId,
            label: 'APPROVE',
          },
        ]
      : workingDef.edges

    setWorkingDef({
      ...workingDef,
      nodes: newNodes,
      edges: newEdges,
    })
    setSelectedNodeId(newNodeId)
  }

  const handleRemoveNode = (nodeId: string) => {
    if (!workingDef) return
    const newNodes = workingDef.nodes.filter((n) => n.id !== nodeId)
    const newEdges = workingDef.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    )
    setWorkingDef({
      ...workingDef,
      nodes: newNodes,
      edges: newEdges,
    })
    setSelectedNodeId(newNodes[0]?.id || null)
  }

  const handleSaveWorkflow = () => {
    if (!workingDef) return
    saveMutation.mutate(workingDef)
  }

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'START':
        return 'border-emerald-300 bg-emerald-50 text-emerald-800'
      case 'APPROVAL':
        return 'border-[#007df0] bg-sky-50 text-sky-900'
      case 'REVIEW':
        return 'border-indigo-300 bg-indigo-50 text-indigo-900'
      case 'CONDITION':
        return 'border-amber-300 bg-amber-50 text-amber-900'
      case 'ESCALATION':
        return 'border-rose-300 bg-rose-50 text-rose-900'
      case 'END':
        return 'border-purple-300 bg-purple-50 text-purple-900'
      default:
        return 'border-slate-300 bg-slate-50 text-slate-800'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider flex items-center gap-1.5">
              <GitMerge className="w-3.5 h-3.5 text-[#007df0]" /> Visual Governance Engine
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-400">Workflow Studio</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Visual Workflow &amp; Approval Designer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build, test, and enforce multi-stage approval DAGs, automated SLA escalation policies, and decision audit matrices.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveWorkflow}
            disabled={saveMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'Publishing DAG...' : 'Publish Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Workflow Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {definitions.map((def) => (
          <button
            key={def.id}
            onClick={() => {
              setSelectedWorkflowCode(def.code)
              setSelectedNodeId(def.nodes[0]?.id || null)
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 shrink-0 ${
              selectedWorkflowCode === def.code
                ? 'bg-[#007df0] text-white border-[#007df0] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>{def.name}</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-slate-100 text-slate-600 font-mono">
              v{def.version}
            </span>
          </button>
        ))}
      </div>

      {/* Main Designer Studio (Canvas + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Visual Node Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 min-h-[520px] flex flex-col justify-between relative overflow-hidden">
            {/* Canvas Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#007df0]">
                  {workingDef?.category} WORKFLOW DEFINITION
                </span>
                <h3 className="text-sm font-bold text-slate-900">{workingDef?.name}</h3>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {workingDef?.nodes.length} Stages • {workingDef?.edges.length} Transitions
              </div>
            </div>

            {/* Visual Node Flow Strip */}
            <div className="relative z-10 my-auto py-8 overflow-x-auto flex items-center gap-4 px-2">
              {workingDef?.nodes.map((node, index) => (
                <div key={node.id} className="flex items-center gap-3 shrink-0">
                  {/* Step Card Node */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer shadow-xs transition-all w-56 flex flex-col justify-between h-36 ${getNodeColor(
                      node.type
                    )} ${
                      selectedNodeId === node.id ? 'ring-2 ring-[#007df0] ring-offset-2 ring-offset-white' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                        <span>{node.type}</span>
                        <span className="font-mono text-slate-400">#{index + 1}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{node.label}</h4>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-700 truncate max-w-[100px]">{node.role.replace('_', ' ')}</span>
                      {node.sla_hours > 0 && (
                        <span className="font-mono text-amber-700 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {node.sla_hours}h SLA
                        </span>
                      )}
                    </div>
                  </motion.div>

                  {/* Connector Arrow */}
                  {index < (workingDef?.nodes.length || 0) - 1 && (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <span className="text-[9px] font-bold text-slate-400 mb-0.5">SLA Next</span>
                      <ArrowRight className="w-5 h-5 text-[#007df0]" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Node Palette (Add Nodes) */}
            <div className="relative z-10 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-2">
                <Plus className="w-3.5 h-3.5 text-[#007df0]" /> Add Step:
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
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-2xs"
                >
                  + {btn.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Node Inspector & Configuration Sidebar */}
        <div className="space-y-4">
          {selectedNode ? (
            <Card className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#007df0]" />
                  <h3 className="text-sm font-bold text-slate-900">Stage Inspector</h3>
                </div>
                {selectedNode.type !== 'START' && selectedNode.type !== 'END' && (
                  <button
                    onClick={() => handleRemoveNode(selectedNode.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove step from pipeline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Inspector Form Fields */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Stage Label</label>
                  <input
                    type="text"
                    value={selectedNode.label}
                    onChange={(e) => handleUpdateNode({ label: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#007df0]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Node Type</label>
                  <select
                    value={selectedNode.type}
                    onChange={(e) => handleUpdateNode({ type: e.target.value as WorkflowNodeType })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#007df0]"
                  >
                    <option value="START">START</option>
                    <option value="APPROVAL">APPROVAL</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="CONDITION">CONDITION</option>
                    <option value="ESCALATION">ESCALATION</option>
                    <option value="END">END</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Assigned Approver Role</label>
                  <select
                    value={selectedNode.role}
                    onChange={(e) => handleUpdateNode({ role: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#007df0]"
                  >
                    <option value="MENTOR">Mentor</option>
                    <option value="PRACTICE_LEAD">Technology Practice Head</option>
                    <option value="SENIOR_LEADER_SPONSOR">Executive Sponsor</option>
                    <option value="GOVERNANCE_COMMITTEE">Governance Committee</option>
                    <option value="SYSTEM_ADMIN">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    SLA Window Duration (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="720"
                    value={selectedNode.sla_hours}
                    onChange={(e) => handleUpdateNode({ sla_hours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#007df0]"
                  />
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400">
              <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Select any stage on the canvas to configure roles and SLA thresholds.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
