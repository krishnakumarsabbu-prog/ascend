import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, BookOpen, Code2, Network, Clock, CheckCircle2, ChevronRight, Target } from 'lucide-react'
import type { PersonalizedLearningItem } from '../../types'
import { Link } from 'react-router-dom'

interface PersonalizedRecommendationsProps {
  items: PersonalizedLearningItem[]
  onSelectAction?: (item: PersonalizedLearningItem) => void
}

export function PersonalizedRecommendations({ items }: PersonalizedRecommendationsProps) {
  const getActionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'challenge':
        return <Code2 className="w-4 h-4 text-emerald-400" />
      case 'course':
        return <BookOpen className="w-4 h-4 text-blue-400" />
      case 'architecture practice':
        return <Network className="w-4 h-4 text-cyan-400" />
      default:
        return <Target className="w-4 h-4 text-purple-400" />
    }
  }

  const getActionLink = (item: PersonalizedLearningItem) => {
    if (item.action_url) return item.action_url
    if (item.action_type.toLowerCase() === 'challenge') return '/challenges'
    if (item.action_type.toLowerCase() === 'architecture practice') return '/architect-board'
    return '/curriculum'
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Personalized Learning Engine
              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-indigo-500/20 text-indigo-300 uppercase">
                AI Next Best Action
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Dynamically synthesized next actions to optimize your pathway commissioning readiness.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations Feed */}
      <div className="space-y-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left Details */}
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-black text-xs shrink-0 border border-indigo-500/20">
                  #{item.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      {getActionIcon(item.action_type)}
                      {item.action_type}
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-400">{item.category}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> ~{item.estimated_hours} hrs
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                    {item.title}
                  </h3>

                  {/* Explicit Reason (Requirement 6) */}
                  <div className="mt-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-amber-400">Reason: </span>
                    {item.reason}
                  </div>
                </div>
              </div>

              {/* Right CTA */}
              <div className="self-end sm:self-center shrink-0">
                <Link
                  to={getActionLink(item)}
                  className="px-3.5 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <span>Start Action</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
