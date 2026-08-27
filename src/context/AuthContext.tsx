import React, { createContext, useContext, useEffect, useState } from 'react'
import type { RoleId, User } from '../types'

export interface AuthContextType {
  user: User | null
  role: RoleId
  isAuthenticated: boolean
  isLoading: boolean
  login: (emailOrPersonaId: string) => Promise<boolean>
  logout: () => void
  switchRole: (newRole: RoleId) => void
  switchAssociate: (associateId: string) => void
  activeAssociateId: string
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_USERS_BY_ROLE: Record<RoleId, { id: string; name: string; email: string; title: string; avatar_initials: string }> = {
  EARLY_TALENT: {
    id: 'u-ananya',
    name: 'Ananya Rao',
    email: 'ananya.rao@wellsfargo.com',
    title: 'Associate Software Engineer (GDA Cohort 2025)',
    avatar_initials: 'AR',
  },
  MENTOR_COACH: {
    id: 'u-priya',
    name: 'Priya Nair',
    email: 'priya.nair@wellsfargo.com',
    title: 'Lead Systems Architect & Mentor Coach',
    avatar_initials: 'PN',
  },
  ENGINEERING_EXCELLENCE_COMMITTEE: {
    id: 'u-committee',
    name: 'Engineering Excellence Committee',
    email: 'engineering.excellence@wellsfargo.com',
    title: 'Curriculum & Governance Board',
    avatar_initials: 'EE',
  },
  SENIOR_LEADER_SPONSOR: {
    id: 'u-sponsor',
    name: 'Senior Leadership Sponsor',
    email: 'talent.sponsor@wellsfargo.com',
    title: 'Head of Engineering Talent & Sponsoring VP',
    avatar_initials: 'SL',
  },
  TECHNOLOGY_HEAD: {
    id: 'u-techhead',
    name: 'Technology Head',
    email: 'technology.head@wellsfargo.com',
    title: 'Chief Technology Officer / Global Head of Tech',
    avatar_initials: 'TH',
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<RoleId>(() => {
    const saved = localStorage.getItem('ascend_role')
    return (saved as RoleId) || 'EARLY_TALENT'
  })

  const [activeAssociateId, setActiveAssociateId] = useState<string>(() => {
    return localStorage.getItem('ascend_associate_id') || 'as-ananya'
  })

  const [user, setUser] = useState<User | null>(() => {
    const defaultUser = DEFAULT_USERS_BY_ROLE[role]
    return { ...defaultUser, role }
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('ascend_role', role)
    const defaultUser = DEFAULT_USERS_BY_ROLE[role]
    setUser({ ...defaultUser, role })
  }, [role])

  useEffect(() => {
    localStorage.setItem('ascend_associate_id', activeAssociateId)
  }, [activeAssociateId])

  const login = async (emailOrPersonaId: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const foundRole = Object.keys(DEFAULT_USERS_BY_ROLE).find(
        (r) =>
          r === emailOrPersonaId ||
          DEFAULT_USERS_BY_ROLE[r as RoleId].id === emailOrPersonaId ||
          DEFAULT_USERS_BY_ROLE[r as RoleId].email.toLowerCase() === emailOrPersonaId.toLowerCase()
      ) as RoleId | undefined

      if (foundRole) {
        setRole(foundRole)
        setUser({ ...DEFAULT_USERS_BY_ROLE[foundRole], role: foundRole })
        setIsLoading(false)
        return true
      }

      setRole('EARLY_TALENT')
      setUser({ ...DEFAULT_USERS_BY_ROLE.EARLY_TALENT, role: 'EARLY_TALENT' })
      setIsLoading(false)
      return true
    } catch {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('ascend_role')
    localStorage.removeItem('ascend_associate_id')
    setUser(null)
  }

  const switchRole = (newRole: RoleId) => {
    setRole(newRole)
    const nextUser = DEFAULT_USERS_BY_ROLE[newRole]
    setUser({ ...nextUser, role: newRole })
  }

  const switchAssociate = (associateId: string) => {
    setActiveAssociateId(associateId)
  }

  const hasPermission = (permission: string): boolean => {
    switch (permission) {
      case 'take_assessment':
      case 'submit_code':
      case 'view_own_dashboard':
        return role === 'EARLY_TALENT'
      case 'review_mentees':
      case 'grade_asm':
      case 'endorse_waiver':
        return role === 'MENTOR_COACH'
      case 'manage_question_bank':
      case 'ratify_pathway_fork':
      case 'audit_credit_ledger':
        return role === 'ENGINEERING_EXCELLENCE_COMMITTEE'
      case 'view_demand_pipeline':
      case 'calibrate_difficulty':
      case 'approve_fast_track':
        return role === 'SENIOR_LEADER_SPONSOR'
      case 'view_tech_readiness':
      case 'commissioning_signoff':
        return role === 'TECHNOLOGY_HEAD'
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
        switchRole,
        switchAssociate,
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
