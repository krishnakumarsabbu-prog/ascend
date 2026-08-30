import React, { createContext, useContext, useEffect, useState } from 'react'
import type { RoleId, User } from '../types'

export interface EnterpriseUser extends User {
  associateId?: string
}

export interface AuthContextType {
  user: EnterpriseUser | null
  role: RoleId
  isAuthenticated: boolean
  isLoading: boolean
  login: (emailOrPersonaId: string, password?: string) => Promise<boolean>
  logout: () => void
  activeAssociateId: string
  hasPermission: (permission: string) => boolean
}

export const ENTERPRISE_USERS: Record<string, EnterpriseUser> = {
  'u-ananya': {
    id: 'u-ananya',
    name: 'Ananya Rao',
    email: 'ananya.rao@wellsfargo.com',
    role: 'EARLY_TALENT',
    title: 'Associate Software Engineer (GDA Cohort 2025)',
    team: 'Payments Platform',
    avatar_initials: 'AR',
    associateId: 'as-ananya',
  },
  'u-rohan': {
    id: 'u-rohan',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@wellsfargo.com',
    role: 'EARLY_TALENT',
    title: 'Associate Software Engineer (GDA Cohort 2025)',
    team: 'Data Infrastructure',
    avatar_initials: 'RM',
    associateId: 'as-rohan',
  },
  'u-fatima': {
    id: 'u-fatima',
    name: 'Fatima Sheikh',
    email: 'fatima.sheikh@wellsfargo.com',
    role: 'EARLY_TALENT',
    title: 'Associate Software Engineer (GDA Cohort 2025)',
    team: 'Engineering Excellence',
    avatar_initials: 'FS',
    associateId: 'as-fatima',
  },
  'u-karthik': {
    id: 'u-karthik',
    name: 'Karthik Iyer',
    email: 'karthik.iyer@wellsfargo.com',
    role: 'EARLY_TALENT',
    title: 'Associate Software Engineer (GDA Cohort 2025)',
    team: 'Cloud & Site Reliability Engineering',
    avatar_initials: 'KI',
    associateId: 'as-karthik',
  },
  'u-priya': {
    id: 'u-priya',
    name: 'Priya Nair',
    email: 'priya.nair@wellsfargo.com',
    role: 'MENTOR_COACH',
    title: 'Lead Systems Architect & Mentor Coach',
    team: 'Payments Platform',
    avatar_initials: 'PN',
  },
  'u-vikram': {
    id: 'u-vikram',
    name: 'Vikram Desai',
    email: 'vikram.desai@wellsfargo.com',
    role: 'MENTOR_COACH',
    title: 'Staff Engineer & Mentor Coach',
    team: 'Data Infrastructure',
    avatar_initials: 'VD',
  },
  'u-committee': {
    id: 'u-committee',
    name: 'Engineering Excellence Committee',
    email: 'engineering.excellence@wellsfargo.com',
    role: 'ENGINEERING_EXCELLENCE_COMMITTEE',
    title: 'Curriculum & Governance Board',
    team: 'Engineering Excellence',
    avatar_initials: 'EE',
  },
  'u-sponsor': {
    id: 'u-sponsor',
    name: 'Senior Leadership Sponsor',
    email: 'talent.sponsor@wellsfargo.com',
    role: 'SENIOR_LEADER_SPONSOR',
    title: 'Head of Engineering Talent & Sponsoring VP',
    team: 'Platform Group',
    avatar_initials: 'SL',
  },
  'u-techhead': {
    id: 'u-techhead',
    name: 'Technology Head',
    email: 'technology.head@wellsfargo.com',
    role: 'TECHNOLOGY_HEAD',
    title: 'Chief Technology Officer / Global Head of Tech',
    team: 'Technology Group',
    avatar_initials: 'TH',
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EnterpriseUser | null>(() => {
    try {
      const savedSession = localStorage.getItem('ascend_auth_session')
      if (savedSession) {
        const parsed = JSON.parse(savedSession) as EnterpriseUser
        if (parsed && parsed.id && ENTERPRISE_USERS[parsed.id]) {
          return ENTERPRISE_USERS[parsed.id]
        }
      }
    } catch {
      // ignore
    }
    return null
  })

  const [isLoading, setIsLoading] = useState(false)

  const role: RoleId = user?.role || 'EARLY_TALENT'
  const activeAssociateId: string = user?.associateId || (role === 'EARLY_TALENT' ? 'as-ananya' : 'as-ananya')

  useEffect(() => {
    if (user) {
      localStorage.setItem('ascend_auth_session', JSON.stringify(user))
      localStorage.setItem('ascend_role', user.role)
      if (user.associateId) {
        localStorage.setItem('ascend_associate_id', user.associateId)
      }
    } else {
      localStorage.removeItem('ascend_auth_session')
      localStorage.removeItem('ascend_role')
      localStorage.removeItem('ascend_associate_id')
    }
  }, [user])

  const login = async (emailOrPersonaId: string, _password?: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const query = emailOrPersonaId.trim().toLowerCase()
      const foundKey = Object.keys(ENTERPRISE_USERS).find((key) => {
        const u = ENTERPRISE_USERS[key]
        return (
          key.toLowerCase() === query ||
          u.id.toLowerCase() === query ||
          u.email.toLowerCase() === query ||
          u.role.toLowerCase() === query ||
          u.name.toLowerCase().includes(query)
        )
      })

      if (foundKey) {
        const matchedUser = ENTERPRISE_USERS[foundKey]
        setUser(matchedUser)
        setIsLoading(false)
        return true
      }

      // Default fallback if someone enters a generic email
      const defaultUser = ENTERPRISE_USERS['u-ananya']
      setUser(defaultUser)
      setIsLoading(false)
      return true
    } catch {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('ascend_auth_session')
    localStorage.removeItem('ascend_role')
    localStorage.removeItem('ascend_associate_id')
    setUser(null)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    switch (permission) {
      case 'take_assessment':
      case 'submit_code':
      case 'view_own_dashboard':
        return user.role === 'EARLY_TALENT'
      case 'review_mentees':
      case 'grade_asm':
      case 'endorse_waiver':
        return user.role === 'MENTOR_COACH'
      case 'manage_question_bank':
      case 'ratify_pathway_fork':
      case 'audit_credit_ledger':
        return user.role === 'ENGINEERING_EXCELLENCE_COMMITTEE'
      case 'view_demand_pipeline':
      case 'calibrate_difficulty':
      case 'approve_fast_track':
        return user.role === 'SENIOR_LEADER_SPONSOR'
      case 'view_tech_readiness':
      case 'commissioning_signoff':
        return user.role === 'TECHNOLOGY_HEAD'
      default:
        return true
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        activeAssociateId,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
