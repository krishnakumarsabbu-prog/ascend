import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Code2,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Search,
  ChevronRight,
  Terminal,
  Zap,
} from 'lucide-react'
import { api } from '../lib/api'
import type { CodingChallenge } from '../types'
import { Button, Card, Badge, Skeleton } from '../components/ui'

export function PracticeChallenges() {
  const navigate = useNavigate()
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['coding-challenges'],
    queryFn: api.codingChallenges,
  })

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL')
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const domains = ['ALL', 'Distributed Systems & Concurrency', 'AI / Embeddings', 'Distributed Systems', 'Data Architecture']
  const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD']

  const filteredChallenges = (challenges || []).filter((c: CodingChallenge) => {
    const matchesDiff = selectedDifficulty === 'ALL' || c.difficulty === selectedDifficulty
    const matchesDomain = selectedDomain === 'ALL' || c.domain.includes(selectedDomain)
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesDiff && matchesDomain && matchesSearch
  })


  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            HackerRank Live Coding Engine
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            Enterprise Practice Challenges
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-slate-500">
            Hone production-grade distributed systems, concurrency, and RAG architectures in the split-pane in-browser IDE with live compiler benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live Code Sandbox Ready
          </Badge>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges by title, tag, or keyword..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Difficulty:</span>
              <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Challenges Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge, idx) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="flex flex-col justify-between h-full p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group border-slate-200">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-700 border border-blue-100">
                      {challenge.id.toUpperCase()}
                    </span>
                    <Badge
                      className={
                        challenge.difficulty === 'HARD'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : challenge.difficulty === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {challenge.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">{challenge.domain}</p>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" />
                      {challenge.time_limit_minutes} mins
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <Zap size={13} />
                      +{challenge.credits_reward} Credits
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {challenge.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>


                  <Button
                    onClick={() => navigate(`/coding/${challenge.id}`)}
                    className="w-full bg-[#1e3a66] hover:bg-[#14294b] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm mt-2"
                  >
                    <Code2 size={14} />
                    Solve in IDE
                    <ArrowRight size={13} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
