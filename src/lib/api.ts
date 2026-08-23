import type { ASMMilestone, Associate, AttemptResult, AttemptSummary, Course, CreditEntry, CurriculumCourse, DashboardData, Question, Role, User } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, options)
  if (!response.ok) throw new Error(`ASCEND service returned ${response.status}`)
  return response.json() as Promise<T>
}

function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export const api = {
  roles: () => request<Role[]>('/roles'),
  users: () => request<User[]>('/users'),
  associates: () => request<Associate[]>('/associates'),
  dashboard: (id: string) => request<DashboardData>(`/dashboard/${id}`),
  courses: () => request<Course[]>('/courses'),
  milestones: () => request<ASMMilestone[]>('/asm-milestones'),
  credits: (id: string) => request<CreditEntry[]>(`/credits/${id}`),

  // Phase 2
  curriculumCourses: () => request<CurriculumCourse[]>('/curriculum/courses'),
  curriculumCourse: (id: string) => request<CurriculumCourse>(`/curriculum/courses/${id}`),
  courseQuestions: (id: string) => request<Question[]>(`/curriculum/courses/${id}/questions`),
  startAssessment: (courseId: string, associateId: string) => postJson<AttemptSummary>('/assessments/start', { course_id: courseId, associate_id: associateId }),
  getAssessment: (attemptId: string) => request<AttemptSummary>(`/assessments/${attemptId}`),
  saveAnswer: (attemptId: string, questionId: string, selectedOption: string) => postJson<AttemptSummary>(`/assessments/${attemptId}/answer`, { question_id: questionId, selected_option: selectedOption }),
  toggleMark: (attemptId: string, questionId: string) => postJson<AttemptSummary>(`/assessments/${attemptId}/mark`, { question_id: questionId }),
  setCurrentIndex: (attemptId: string, index: number) => postJson<{ status: string }>(`/assessments/${attemptId}/current`, { index }),
  submitAssessment: (attemptId: string) => postJson<AttemptResult>(`/assessments/${attemptId}/submit`, {}),
  getAssessmentResult: (attemptId: string) => request<AttemptResult>(`/assessments/${attemptId}/result`),
}
