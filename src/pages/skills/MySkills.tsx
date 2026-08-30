import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Search,
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
import { Card, Badge, ProgressBar } from '../../components/ui'

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
      case 'software engineering':
        return <Code2 className="w-4 h-4 text-emerald-600" />
      case 'cloud':
        return <Cloud className="w-4 h-4 text-sky-600" />
      case 'data engineering':
        return <Database className="w-4 h-4 text-amber-600" />
      case 'architecture':
        return <Network className="w-4 h-4 text-blue-600" />
      case 'ai engineering':
        return <Cpu className="w-4 h-4 text-purple-600" />
      default:
        return <Layers className="w-4 h-4 text-slate-500" />
    }
  }

  const getLevelColor = (level: string) => {
    if (level.includes('L4')) return 'bg-purple-50 text-purple-700 border-purple-200'
    if (level.includes('L3')) return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    if (level.includes('L2')) return 'bg-sky-50 text-sky-700 border-sky-200'
    if (level.includes('L1')) return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-slate-100 text-slate-600 border-slate-200'
  }

  if (profileQuery.isLoading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-2 border-[#007df0] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs font-semibold">Loading ASCEND Skills Intelligence...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-sky-600" /> ASCEND Skills Intelligence
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-400">Enterprise Competency Framework</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Skills &amp; Competency Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Granular competency tracking triangulated from automated assessments, live code execution, ASM deliverables, and architect defense boards.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/90 self-start lg:self-auto shadow-2xs">
          <button
            onClick={() => setActiveTab('PROGRESSION')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'PROGRESSION'
                ? 'bg-[#007df0] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skill Matrix ({profile?.skills.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('GAPS')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'GAPS'
                ? 'bg-[#007df0] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Skill Gaps</span>
            {gaps.length > 0 && (
              <span className="px-1.5 py-0.2 text-[9.5px] rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-200">
                {gaps.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('RECOMMENDATIONS')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'RECOMMENDATIONS'
                ? 'bg-[#007df0] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Recommendations</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Competency */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Overall Competency</span>
            <Brain className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{profile?.overall_competency}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2% MoM
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar value={(profile?.overall_competency || 0) / 100} color="bg-[#007df0]" />
          </div>
        </Card>

        {/* Total Verified Skills */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Tracked Skills</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{profile?.total_skills}</span>
            <span className="text-xs text-slate-500">across 5 domains</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            Triangulated against enterprise taxonomy
          </p>
        </Card>

        {/* Strong Skills (Target Met) */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Benchmark Met</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{profile?.strong_skills_count}</span>
            <span className="text-xs text-slate-500">/ {profile?.total_skills} skills</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            Competency score ≥ pathway benchmark
          </p>
        </Card>

        {/* Active Skill Gaps */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Active Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{profile?.gaps_count}</span>
            <span className="text-xs text-slate-500">requiring reinforcement</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            Targeted in personalized learning actions
          </p>
        </Card>
      </div>

      {/* Domain Average Cards */}
      {profile?.category_scores && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(profile.category_scores).map(([category, score]) => (
            <Card
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? 'ALL' : category)}
              className={`p-3.5 cursor-pointer transition-all ${
                selectedCategory === category
                  ? 'border-[#007df0] bg-sky-50/50 shadow-xs'
                  : 'bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {getCategoryIcon(category)}
                <span className="text-xs font-bold text-slate-800 truncate">{category}</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-black text-slate-900">{score}%</span>
                <span className="text-[10px] text-sky-700 font-semibold">Avg</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Main Tab Content */}
      {activeTab === 'PROGRESSION' && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Category Filter Pills */}
          <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills, categories, levels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#007df0] focus:bg-white"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['ALL', 'Software Engineering', 'Cloud', 'Data Engineering', 'Architecture', 'AI Engineering'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#007df0] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </Card>

          {/* Visual Skill Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.skill_id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                onClick={() => setInspectingSkill(skill)}
              >
                <Card className="p-5 hover:border-sky-300 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(skill.category)}
                        <span className="text-[11px] font-semibold text-slate-500">{skill.category}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getLevelColor(skill.current_level)}`}>
                        {skill.current_level}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#007df0] transition">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {skill.recommended_learning || `Verified in ${skill.category} domain.`}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Proficiency Score</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-slate-900">{skill.current_score}%</span>
                        <span className="text-[10px] text-slate-400">/ Target {skill.target_score}%</span>
                      </div>
                    </div>

                    <ProgressBar
                      value={skill.current_score / 100}
                      color={skill.current_score >= skill.target_score ? 'bg-emerald-500' : 'bg-[#007df0]'}
                    />

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-500">{skill.evidence_count} verified artifacts</span>
                      <span className="font-semibold text-[#007df0] flex items-center gap-0.5 hover:underline">
                        View Evidence <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: GAPS */}
      {activeTab === 'GAPS' && (
        <SkillGapAnalyzer
          gaps={gaps}
          onSelectSkill={(skillName) => {
            const match = profile?.skills.find((s) => s.name === skillName)
            if (match) setInspectingSkill(match)
          }}
        />
      )}

      {/* Tab: RECOMMENDATIONS */}
      {activeTab === 'RECOMMENDATIONS' && (
        <PersonalizedRecommendations items={recommendations} />
      )}

      {/* Skill Evidence Drawer */}
      <SkillEvidenceDrawer
        skillId={inspectingSkill?.skill_id || null}
        associateId={associateId}
        onClose={() => setInspectingSkill(null)}
      />
    </div>
  )
}
