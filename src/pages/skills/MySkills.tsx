import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Search,
  Filter,
  Award,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Layers,
  Code2,
  Network,
  Database,
  Cloud,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'
import { api } from '../../lib/api'
import { SkillEvidenceDrawer } from '../../components/skills/SkillEvidenceDrawer'
import { SkillGapAnalyzer } from '../../components/skills/SkillGapAnalyzer'
import { PersonalizedRecommendations } from '../../components/skills/PersonalizedRecommendations'
import type { AssociateSkill } from '../../types'

interface MySkillsProps {
  associateId?: string
}

export function MySkills({ associateId = 'as-ananya' }: MySkillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'PROGRESSION' | 'GAPS' | 'RECOMMENDATIONS'>('PROGRESSION')
  const [inspectingSkill, setInspectingSkill] = useState<AssociateSkill | null>(null)

  // Data queries
  const profileQuery = useQuery({
    queryKey: ['skillProfile', associateId],
    queryFn: () => api.skillProfile(associateId),
  })

  const gapsQuery = useQuery({
    queryKey: ['skillGaps', associateId],
    queryFn: () => api.skillGaps(associateId),
  })

  const recommendationsQuery = useQuery({
    queryKey: ['personalizedRecommendations', associateId],
    queryFn: () => api.personalizedRecommendations(associateId),
  })

  const profile = profileQuery.data
  const gaps = gapsQuery.data || []
  const recommendations = recommendationsQuery.data || []

  // Filter skills
  const filteredSkills = useMemo(() => {
    if (!profile?.skills) return []
    return profile.skills.filter((s) => {
      const matchCategory = selectedCategory === 'ALL' || s.category === selectedCategory
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.current_level.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [profile?.skills, selectedCategory, searchQuery])

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'software engineering': return <Code2 className="w-4 h-4 text-emerald-400" />
      case 'cloud': return <Cloud className="w-4 h-4 text-sky-400" />
      case 'data engineering': return <Database className="w-4 h-4 text-amber-400" />
      case 'architecture': return <Network className="w-4 h-4 text-cyan-400" />
      case 'ai engineering': return <Cpu className="w-4 h-4 text-purple-400" />
      default: return <Layers className="w-4 h-4 text-slate-400" />
    }
  }

  const getLevelColor = (level: string) => {
    if (level.includes('L4')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    if (level.includes('L3')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
    if (level.includes('L2')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    if (level.includes('L1')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    return 'bg-slate-500/10 text-slate-400 border-slate-500/30'
  }

  if (profileQuery.isLoading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm font-semibold">Loading ASCEND Skills Intelligence...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" /> ASCEND Skills Intelligence
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Central Enterprise Competency Framework</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            My Skills & Competency Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Granular competency tracking triangulated from automated assessments, live code execution, ASM deliverables, and architect defense boards.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start lg:self-auto shadow-lg">
          <button
            onClick={() => setActiveTab('PROGRESSION')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'PROGRESSION'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Skill Matrix ({profile?.skills.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('GAPS')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'GAPS'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Skill Gaps</span>
            {gaps.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500/20 text-rose-300 font-black">
                {gaps.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('RECOMMENDATIONS')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'RECOMMENDATIONS'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Recommendations</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Competency */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Overall Competency</span>
            <Brain className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{profile?.overall_competency}%</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2% MoM
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${profile?.overall_competency}%` }} />
          </div>
        </div>

        {/* Total Verified Skills */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Tracked Skills</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{profile?.total_skills}</span>
            <span className="text-xs text-slate-400">across 5 domains</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Triangulated against enterprise taxonomy
          </p>
        </div>

        {/* Strong Skills (Target Met) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Benchmark Met</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{profile?.strong_skills_count}</span>
            <span className="text-xs text-slate-400">/ {profile?.total_skills} skills</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Competency score ≥ pathway benchmark
          </p>
        </div>

        {/* Active Skill Gaps */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Active Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{profile?.gaps_count}</span>
            <span className="text-xs text-slate-400">requiring reinforcement</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Targeted in personalized learning actions
          </p>
        </div>
      </div>

      {/* Domain Average Cards */}
      {profile?.category_scores && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(profile.category_scores).map(([category, score]) => (
            <div
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? 'ALL' : category)}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                selectedCategory === category
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {getCategoryIcon(category)}
                <span className="text-xs font-bold text-slate-300 truncate">{category}</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-black text-white">{score}%</span>
                <span className="text-[10px] text-indigo-400 font-semibold">Avg</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Tab Content */}
      {activeTab === 'PROGRESSION' && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Category Filter Pills */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills, categories, levels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['ALL', 'Software Engineering', 'Cloud', 'Data Engineering', 'Architecture', 'AI Engineering'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Visual Skill Cards Grid (Requirement 1 & 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.skill_id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                onClick={() => setInspectingSkill(skill)}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer shadow-lg hover:shadow-indigo-500/10 transition group flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {skill.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getLevelColor(skill.current_level)}`}>
                      {skill.current_level}
                    </span>
                  </div>

                  {/* Skill Name */}
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition">
                    {skill.name}
                  </h3>

                  {/* Progress & Target Gauges */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-400 font-medium">Current Competency:</span>
                      <span className="font-black text-white">{skill.current_score}%</span>
                    </div>

                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          skill.current_score >= skill.target_score
                            ? 'bg-emerald-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${skill.current_score}%` }}
                      />
                      {/* Target Indicator Line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                        style={{ left: `${skill.target_score}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>Target: {skill.target_score}% ({skill.target_level})</span>
                      <span className={skill.gap === 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {skill.gap === 0 ? '✓ Target Met' : `Gap: -${skill.gap} pts`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    {skill.evidence_count} evidence records
                  </span>

                  <span className="text-indigo-400 group-hover:text-indigo-300 font-bold flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'GAPS' && (
        <SkillGapAnalyzer
          gaps={gaps}
          onSelectSkill={(skillId) => {
            const found = profile?.skills.find((s) => s.skill_id === skillId)
            if (found) setInspectingSkill(found)
          }}
        />
      )}

      {activeTab === 'RECOMMENDATIONS' && (
        <div className="space-y-6">
          <PersonalizedRecommendations items={recommendations} />
          <SkillGapAnalyzer
            gaps={gaps}
            onSelectSkill={(skillId) => {
              const found = profile?.skills.find((s) => s.skill_id === skillId)
              if (found) setInspectingSkill(found)
            }}
          />
        </div>
      )}

      {/* Slide-over Evidence Inspector Drawer */}
      <SkillEvidenceDrawer
        skill={inspectingSkill}
        isOpen={Boolean(inspectingSkill)}
        onClose={() => setInspectingSkill(null)}
      />
    </div>
  )
}
