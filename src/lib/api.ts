import type { ASMMilestone, Associate, Course, CreditEntry, DashboardData, Role, User } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api'

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) throw new Error(`ASCEND service returned ${response.status}`)
  return response.json() as Promise<T>
}

export const api = {
  roles: () => request<Role[]>('/roles'),
  users: () => request<User[]>('/users'),
  associates: () => request<Associate[]>('/associates'),
  dashboard: (id: string) => request<DashboardData>(`/dashboard/${id}`),
  courses: () => request<Course[]>('/courses'),
  milestones: () => request<ASMMilestone[]>('/asm-milestones'),
  credits: (id: string) => request<CreditEntry[]>(`/credits/${id}`),
}
