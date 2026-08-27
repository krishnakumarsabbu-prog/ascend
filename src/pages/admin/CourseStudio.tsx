import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  X,
  Layers,
  Sparkles,
  Clock,
  Coins,
  CheckCircle2,
  ListPlus,
  ArrowRight,
} from 'lucide-react'
import { api } from '../../lib/api'
import type { CurriculumCourse, CreateCoursePayload } from '../../types'
import { Button, Card, Badge, Skeleton } from '../../components/ui'

const DOMAIN_STYLES: Record<string, string> = {
  D1: 'bg-blue-50 text-blue-700 border-blue-200',
  D2: 'bg-purple-50 text-purple-700 border-purple-200',
  D3: 'bg-amber-50 text-amber-700 border-amber-200',
  D4: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export function CourseStudio() {
  const queryClient = useQueryClient()
  const { data: courses, isLoading } = useQuery({
    queryKey: ['curriculum-courses'],
    queryFn: api.curriculumCourses,
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Form State for Create Course
  const [formData, setFormData] = useState<CreateCoursePayload>({
    code: '',
    title: '',
    description: '',
    focus: 'Production Engineering & Resilience',
    domain: 'D1',
    tier: 'Apprentice',
    duration_weeks: 4,
    target_week: 8,
    credits: 15,
    modules: ['Core Architecture', 'Fault Injection & Chaos', 'Production Verification'],
    prerequisites: [],
  })

  const [moduleInput, setModuleInput] = useState('')

  const createCourseMutation = useMutation({
    mutationFn: (payload: CreateCoursePayload) => api.createCourse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum-courses'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setIsCreateModalOpen(false)
      setFormData({
        code: '',
        title: '',
        description: '',
        focus: 'Production Engineering & Resilience',
        domain: 'D1',
        tier: 'Apprentice',
        duration_weeks: 4,
        target_week: 8,
        credits: 15,
        modules: ['Core Architecture', 'Fault Injection & Chaos', 'Production Verification'],
        prerequisites: [],
      })
    },
  })

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: string) => api.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum-courses'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })

  const handleAddModule = () => {
    if (moduleInput.trim()) {
      setFormData({
        ...formData,
        modules: [...(formData.modules || []), moduleInput.trim()],
      })
      setModuleInput('')
    }
  }

  const handleRemoveModule = (idx: number) => {
    const updated = [...(formData.modules || [])]
    updated.splice(idx, 1)
    setFormData({ ...formData, modules: updated })
  }

  const filteredCourses = (courses || []).filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDomain = selectedDomain === 'ALL' || c.domain === selectedDomain
    return matchesSearch && matchesDomain
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-purple-700">
            <span className="h-2 w-2 rounded-full bg-purple-600" />
            CURRICULUM &amp; COURSE AUTHORING STUDIO
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            Course &amp; Curriculum Studio
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-slate-500">
            Author and publish new enterprise training modules, map competencies to domains (D1–D4), configure credit incentives, and structure course module syllabi.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20 shrink-0"
        >
          <PlusCircle size={15} />
          Author New Course
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by code or title (e.g. WF-101, Kafka)..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Domain:</span>
            <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              {['ALL', 'Foundation', 'Engineering', 'AI', 'D1', 'D2', 'D3', 'D4'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-colors ${
                    selectedDomain === d
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Courses Catalog Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="flex flex-col justify-between h-full p-5 border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 group">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="rounded bg-purple-50 px-2 py-0.5 font-mono text-xs font-bold text-purple-700 border border-purple-100">
                      {course.code}
                    </span>
                    <Badge className={DOMAIN_STYLES[course.domain] || 'bg-slate-100 text-slate-700'}>
                      {course.domain} · {course.difficulty}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors mt-1">
                    {course.name}
                  </h3>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <Coins size={13} />
                      {course.credits} Credits
                    </span>
                    <Badge className="bg-slate-100 text-slate-600">{course.status}</Badge>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete course ${course.code}?`)) {
                          deleteCourseMutation.mutate(course.id)
                        }
                      }}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal: Author New Course */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                    <BookOpen size={16} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Author &amp; Publish New Course</h2>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!formData.code || !formData.title) {
                    alert('Please provide course code and title.')
                    return
                  }
                  createCourseMutation.mutate(formData)
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Course Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. WF-105"
                      className="w-full rounded-lg border border-slate-300 p-2.5 font-mono font-bold text-purple-700 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Course Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Advanced Kafka &amp; Event Stream Architecture"
                      className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide overview of competencies, architectural patterns, and production outcomes..."
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Domain Competency</label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 outline-none font-semibold text-slate-800"
                    >
                      <option value="D1">D1: Core Java &amp; AI Prompting</option>
                      <option value="D2">D2: Cloud &amp; Distributed Systems</option>
                      <option value="D3">D3: Platform &amp; Vendor Stacks</option>
                      <option value="D4">D4: Production Live Fire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Difficulty Tier</label>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 outline-none font-semibold text-slate-800"
                    >
                      <option value="Basic">Basic (L100)</option>
                      <option value="Novice">Novice (L200)</option>
                      <option value="Apprentice">Apprentice (L300)</option>
                      <option value="Expert">Expert (L400)</option>
                      <option value="Master">Master (L500)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Credit Allocation</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 font-bold text-emerald-700 outline-none"
                    />
                  </div>
                </div>

                {/* Syllabus Modules Builder */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Syllabus Modules ({formData.modules?.length || 0})</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={moduleInput}
                      onChange={(e) => setModuleInput(e.target.value)}
                      placeholder="Add module outline (e.g. Distributed Lock Manager with Redis)..."
                      className="flex-1 rounded-lg border border-slate-300 bg-white p-2 text-xs outline-none"
                    />
                    <Button
                      type="button"
                      onClick={handleAddModule}
                      variant="outline"
                      className="text-xs shrink-0"
                    >
                      <ListPlus size={14} /> Add
                    </Button>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {formData.modules?.map((mod, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-slate-200 text-xs text-slate-700">
                        <span>{idx + 1}. {mod}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(idx)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCourseMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    {createCourseMutation.isPending ? 'Publishing...' : 'Publish Course'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
