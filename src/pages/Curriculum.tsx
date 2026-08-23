import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, CircleCheck as CheckCircle2, Circle, Clock3, GraduationCap, Layers, Lock, Play, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { CurriculumCourse } from '../types'
import { api } from '../lib/api'
import { Badge, Card, ProgressBar, Skeleton } from '../components/ui'
import { percent } from '../lib/utils'

const domainStyles: Record<string, { bg: string; text: string; icon: typeof BookOpen }> = {
  Foundation: { bg: 'bg-blue-50', text: 'text-blue-600', icon: BookOpen },
  Engineering: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: Layers },
  AI: { bg: 'bg-amber-50', text: 'text-amber-600', icon: GraduationCap },
  Cloud: { bg: 'bg-sky-50', text: 'text-sky-600', icon: Layers },
  Security: { bg: 'bg-rose-50', text: 'text-rose-600', icon: Lock },
  'Advanced Engineering': { bg: 'bg-slate-100', text: 'text-slate-700', icon: Trophy },
}

const statusStyles: Record<string, { badge: string; dot: string }> = {
  Completed: { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  'In Progress': { badge: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  'Not Started': { badge: 'bg-slate-100 text-slate-500', dot: 'bg-slate-300' },
}

export function Curriculum() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['curriculum'], queryFn: api.curriculumCourses })
  if (isLoading) return <CurriculumSkeleton />
  if (isError || !data) return <div className="flex flex-col items-center justify-center py-20 text-center"><p className="text-sm font-medium text-slate-500">Unable to load the curriculum. Please ensure the backend service is running.</p></div>

  const domains = [...new Set(data.map((c) => c.domain))]
  const completed = data.filter((c) => c.status === 'Completed').length
  const inProgress = data.filter((c) => c.status === 'In Progress').length
  const totalCredits = data.reduce((sum, c) => sum + c.credits, 0)

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><span>Workspace</span><span>/</span><span className="text-blue-600">Integrated Curriculum</span></div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Integrated Curriculum</h1>
        <p className="mt-1 text-sm text-slate-500">Your technical assessment pathway across foundation, engineering, AI, and cloud domains.</p>
      </div>
      <div className="flex gap-3">
        <Card className="px-4 py-3"><div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /><div><p className="text-lg font-bold text-slate-950">{completed}</p><p className="text-[10px] text-slate-400">Completed</p></div></div></Card>
        <Card className="px-4 py-3"><div className="flex items-center gap-2"><Play size={16} className="text-blue-500" /><div><p className="text-lg font-bold text-slate-950">{inProgress}</p><p className="text-[10px] text-slate-400">In Progress</p></div></div></Card>
        <Card className="px-4 py-3"><div className="flex items-center gap-2"><Trophy size={16} className="text-amber-500" /><div><p className="text-lg font-bold text-slate-950">{totalCredits}</p><p className="text-[10px] text-slate-400">Total Credits</p></div></div></Card>
      </div>
    </div>

    {domains.map((domain) => {
      const courses = data.filter((c) => c.domain === domain)
      const style = domainStyles[domain] || domainStyles['Foundation']
      const Icon = style.icon
      return <div key={domain}>
        <div className="mb-3 flex items-center gap-2"><div className={`flex h-7 w-7 items-center justify-center rounded-md ${style.bg}`}><Icon size={15} className={style.text} /></div><h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">{domain}</h2><span className="text-xs text-slate-400">({courses.length} courses)</span></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, i) => <CourseCard key={course.id} course={course} index={i} domainStyle={style} />)}
        </div>
      </div>
    })}
  </div>
}

function CourseCard({ course, index, domainStyle }: { course: CurriculumCourse; index: number; domainStyle: { bg: string; text: string } }) {
  const navigate = useNavigate()
  const status = statusStyles[course.status] || statusStyles['Not Started']
  const isLocked = course.status === 'Not Started' && course.progress === 0

  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
    <Card className="group flex h-full flex-col p-5 transition-all hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400">{course.code}</span>
          <h3 className="mt-1 text-base font-bold leading-snug text-slate-950">{course.name}</h3>
        </div>
        <Badge className={status.badge}><span className={`mr-1 h-1.5 w-1.5 rounded-full ${status.dot}`} />{course.status}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className="bg-slate-100 text-slate-600">{course.difficulty}</Badge>
        <Badge className={`${domainStyle.bg} ${domainStyle.text}`}>{course.domain}</Badge>
        <Badge className="bg-slate-100 text-slate-600">{course.credits} credits</Badge>
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-[11px]"><span className="font-medium text-slate-500">Progress</span><span className="font-bold text-slate-700">{percent(course.progress)}</span></div>
        <ProgressBar value={course.progress} color={course.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'} />
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500"><Clock3 size={12} />Assessment: <span className="font-semibold text-slate-700">{course.assessment}</span></div>
      </div>

      <div className="mt-auto pt-4">
        <button onClick={() => navigate(`/assessment/${course.id}`)} className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
          {course.status === 'Completed' ? 'Review Assessment' : course.status === 'In Progress' ? 'Continue Assessment' : 'Start Assessment'}<ArrowRight size={14} />
        </button>
      </div>
    </Card>
  </motion.div>
}

function CurriculumSkeleton() {
  return <div className="space-y-6"><div><Skeleton className="h-3 w-32" /><Skeleton className="mt-3 h-8 w-72" /><Skeleton className="mt-2 h-4 w-96" /></div><div className="grid gap-4 md:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-56" />)}</div></div>
}
