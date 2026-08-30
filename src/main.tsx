import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppShell } from './components/AppShell'
import { api } from './lib/api'
import { Login } from './pages/Login'
import { PracticeChallenges } from './pages/PracticeChallenges'
import { CodingWorkspace } from './pages/CodingWorkspace'
import { Assessment } from './pages/Assessment'
import { AssessmentResult } from './pages/AssessmentResult'
import { Curriculum } from './pages/Curriculum'
import { Dashboard } from './pages/Dashboard'
import { PathwaySelection } from './pages/PathwaySelection'
import { AsmJourney } from './pages/AsmJourney'
import { MentorPortal } from './pages/MentorPortal'
import { CommitteePortal } from './pages/CommitteePortal'
import { SponsorPortal } from './pages/SponsorPortal'
import { TechHeadPortal } from './pages/TechHeadPortal'
import { TakeAssessment } from './pages/TakeAssessment'
import {
  WFAssessmentsPage,
  ASMForkPage,
  AdvancedIntensivesPage,
  ArchitectBoardPage,
  CreditLedgerPage,
  ProgramOverviewPage,
} from './pages/AssociateViews'
import { UserManager } from './pages/admin/UserManager'
import { CourseStudio } from './pages/admin/CourseStudio'
import { QuestionStudio } from './pages/admin/QuestionStudio'
import { WorkflowDesigner } from './pages/admin/WorkflowDesigner'
import { QuestionLifecycleStudio } from './pages/admin/QuestionLifecycleStudio'
import { ApprovalsPage } from './pages/workflows/ApprovalsPage'
import { AdaptiveAssessmentPage } from './pages/assessments/AdaptiveAssessmentPage'
import { ASMLifecyclePage } from './pages/asm/ASMLifecyclePage'
import { CredentialsWallet } from './pages/credentials/CredentialsWallet'
import { PublicCredentialVerification } from './pages/credentials/PublicCredentialVerification'
import { TalentMarketplacePage } from './pages/marketplace/TalentMarketplacePage'
import { WorkforcePlanningStudio } from './pages/workforce/WorkforcePlanningStudio'
import { ExecutiveAnalyticsPage } from './pages/analytics/ExecutiveAnalyticsPage'
import { CustomDashboardBuilder } from './pages/analytics/CustomDashboardBuilder'
import { EnterpriseReportingPage } from './pages/reports/EnterpriseReportingPage'
import { MetricLineageStudio } from './pages/governance/MetricLineageStudio'
import { AuditCenterPage } from './pages/governance/AuditCenterPage'
import { CurriculumBranchingStudio } from './pages/governance/CurriculumBranchingStudio'
import { IntegrationHubPage } from './pages/integrations/IntegrationHubPage'
import { SystemControlCenter } from './pages/admin/SystemControlCenter'
import { MySkills } from './pages/skills/MySkills'
import { AICoachPage } from './pages/ai/AICoachPage'
import './styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

function AppRoutes() {
  const { user, role, activeAssociateId } = useAuth()
  const associatesQuery = useQuery({ queryKey: ['associates'], queryFn: api.associates })

  const associates = associatesQuery.data || []
  const userAssociateId = activeAssociateId || 'as-ananya'

  const dashboardQuery = useQuery({
    queryKey: ['dashboard', userAssociateId],
    queryFn: () => api.dashboard(userAssociateId),
    enabled: Boolean(associatesQuery.data && user && role === 'EARLY_TALENT'),
  })

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify/:credentialId" element={<PublicCredentialVerification />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell
              role={role}
              user={user!}
              associates={associates}
              activeAssociateId={userAssociateId}
            >
              <Routes>
                {/* 1. Default Role Root Route */}
                <Route
                  path="/"
                  element={
                    role === 'EARLY_TALENT' ? (
                      <Dashboard data={dashboardQuery.data} isLoading={dashboardQuery.isLoading} />
                    ) : role === 'MENTOR_COACH' ? (
                      <MentorPortal user={user!} />
                    ) : role === 'ENGINEERING_EXCELLENCE_COMMITTEE' ? (
                      <CommitteePortal />
                    ) : role === 'SENIOR_LEADER_SPONSOR' ? (
                      <SponsorPortal />
                    ) : (
                      <TechHeadPortal />
                    )
                  }
                />

                {/* 2. Intern / Early Talent Learning & Practice Workflows */}
                <Route path="/curriculum" element={<Curriculum />} />
                <Route path="/pathways" element={<PathwaySelection associateId={userAssociateId} />} />
                <Route path="/challenges" element={<PracticeChallenges />} />
                <Route path="/coding/:challengeId" element={<CodingWorkspace />} />
                <Route path="/take-assessment" element={<TakeAssessment />} />
                <Route path="/assessment/:courseId" element={<Assessment />} />
                <Route path="/assessment/result/:attemptId" element={<AssessmentResult />} />
                <Route path="/adaptive-assessment" element={<AdaptiveAssessmentPage associateId={userAssociateId} />} />
                <Route path="/asm-lifecycle" element={<ASMLifecyclePage associateId={userAssociateId} />} />
                <Route path="/my-skills" element={<MySkills associateId={userAssociateId} />} />
                <Route path="/credentials" element={<CredentialsWallet associateId={userAssociateId} />} />
                <Route path="/talent-marketplace" element={<TalentMarketplacePage associateId={userAssociateId} />} />
                <Route path="/ai-coach" element={<AICoachPage associateId={userAssociateId} />} />
                <Route path="/asm" element={<AsmJourney associateId={userAssociateId} />} />
                <Route path="/commissioning" element={<AsmJourney associateId={userAssociateId} />} />
                <Route path="/wf-assessments" element={<WFAssessmentsPage />} />
                <Route path="/asm-fork" element={<ASMForkPage />} />
                <Route path="/advanced-intensives" element={<AdvancedIntensivesPage />} />
                <Route path="/architect-board" element={<ArchitectBoardPage />} />
                <Route path="/credit-ledger" element={<CreditLedgerPage />} />
                <Route path="/program-overview" element={<ProgramOverviewPage />} />

                {/* 3. Mentor / Coach Dedicated Workflows */}
                <Route
                  path="/mentor"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR_COACH', 'ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <MentorPortal user={user!} />
                    </ProtectedRoute>
                  }
                />

                {/* 4. Engineering Excellence Committee Governance & Content Studios */}
                <Route
                  path="/committee"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <CommitteePortal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/questions"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <QuestionStudio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/question-governance"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <QuestionLifecycleStudio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/courses"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <CourseStudio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/curriculum-versions"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <CurriculumBranchingStudio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <UserManager />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/control-center"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <SystemControlCenter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/workflows"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <WorkflowDesigner />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/metric-lineage"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <MetricLineageStudio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/audit-center"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <AuditCenterPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/integrations"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <IntegrationHubPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard-builder"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE', 'SENIOR_LEADER_SPONSOR', 'TECHNOLOGY_HEAD']}>
                      <CustomDashboardBuilder />
                    </ProtectedRoute>
                  }
                />

                {/* 5. Senior Leader Sponsor Portal */}
                <Route
                  path="/sponsor"
                  element={
                    <ProtectedRoute allowedRoles={['SENIOR_LEADER_SPONSOR', 'TECHNOLOGY_HEAD']}>
                      <SponsorPortal />
                    </ProtectedRoute>
                  }
                />

                {/* 6. Technology Head Portal */}
                <Route
                  path="/techhead"
                  element={
                    <ProtectedRoute allowedRoles={['TECHNOLOGY_HEAD']}>
                      <TechHeadPortal />
                    </ProtectedRoute>
                  }
                />

                {/* 7. Executive Decision & Workforce Analytics */}
                <Route
                  path="/workforce-planning"
                  element={
                    <ProtectedRoute allowedRoles={['SENIOR_LEADER_SPONSOR', 'TECHNOLOGY_HEAD', 'ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <WorkforcePlanningStudio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE', 'SENIOR_LEADER_SPONSOR', 'TECHNOLOGY_HEAD']}>
                      <ExecutiveAnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE', 'SENIOR_LEADER_SPONSOR', 'TECHNOLOGY_HEAD']}>
                      <EnterpriseReportingPage />
                    </ProtectedRoute>
                  }
                />

                {/* 8. Enterprise Approvals & SLA Center */}
                <Route
                  path="/approvals"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR_COACH', 'ENGINEERING_EXCELLENCE_COMMITTEE', 'SENIOR_LEADER_SPONSOR', 'TECHNOLOGY_HEAD']}>
                      <ApprovalsPage currentRole={role} currentUserId={user?.id} currentUserName={user?.name} />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
