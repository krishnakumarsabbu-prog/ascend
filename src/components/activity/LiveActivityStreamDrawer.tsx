import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Users,
  Radio,
  X,
  Sparkles,
  Award,
  BriefcaseBusiness,
  Terminal,
  Brain,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { ActivityStreamEvent, PresenceSession } from '../../types'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function LiveActivityStreamDrawer({ isOpen, onClose }: DrawerProps) {
  const [activeTab, setActiveTab] = useState<'STREAM' | 'PRESENCE'>('STREAM')

  const streamQuery = useQuery({
    queryKey: ['activityStream'],
    queryFn: () => api.activityStream(30),
    refetchInterval: 15_000,
    enabled: isOpen,
  })

  const presenceQuery = useQuery({
    queryKey: ['activityPresence'],
    queryFn: () => api.activityPresence(),
    refetchInterval: 15_000,
    enabled: isOpen,
  })

  const stream = streamQuery.data || []
  const presence = presenceQuery.data || []

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'CREDENTIAL_ISSUED':
        return <Award className="w-4 h-4 text-purple-600" />
      case 'GIG_APPLIED':
        return <BriefcaseBusiness className="w-4 h-4 text-emerald-600" />
      case 'DEFENSE_RATIFIED':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />
      case 'ASSESSMENT_SUBMITTED':
        return <Brain className="w-4 h-4 text-sky-600" />
      default:
        return <Terminal className="w-4 h-4 text-amber-600" />
    }
  }

  const getPresenceBadge = (status: string) => {
    switch (status) {
      case 'IN_ASSESSMENT':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'IN_DEFENSE_PANEL':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
          />

          {/* Slide-over Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white border-l border-slate-200 text-slate-900 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white/95 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-sky-50 text-[#007df0] border border-sky-200">
                    <Activity className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Live Activity &amp; Presence</h3>
                    <p className="text-[10.5px] text-slate-500 font-mono">Real-time enterprise telemetry feed</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs Switcher */}
              <div className="p-3 border-b border-slate-100 grid grid-cols-2 gap-2 text-xs font-bold bg-slate-50">
                <button
                  onClick={() => setActiveTab('STREAM')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'STREAM'
                      ? 'bg-[#007df0] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Activity Stream ({stream.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('PRESENCE')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'PRESENCE'
                      ? 'bg-[#007df0] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Active Now ({presence.length})</span>
                </button>
              </div>

              {/* Drawer Body Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {activeTab === 'STREAM' && (
                  <div className="space-y-3">
                    {stream.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                              {getEventIcon(evt.event_type)}
                            </div>
                            <span className="font-bold text-slate-900">{evt.actor_name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                        </div>

                        <p className="text-[11.5px] text-slate-600 leading-relaxed">{evt.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'PRESENCE' && (
                  <div className="space-y-3">
                    {presence.map((sess) => (
                      <div
                        key={sess.user_id}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-bold text-slate-900">{sess.user_name}</span>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getPresenceBadge(sess.status)}`}>
                            {sess.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="text-[11.5px] text-slate-600 font-medium">{sess.current_activity}</div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-100">
                          <span>{sess.active_device}</span>
                          <span>{sess.last_ping}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
