import { StrictMode, useMemo } from 'react'
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
import type { RoleId } from './types'
import './styles.css'


const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } })

function AppRoutes() {
  const { user, role, switchRole, activeAssociateId, switchAssociate } = useAuth()
  const associatesQuery = useQuery({ queryKey: ['associates'], queryFn: api.associates })

  const associates = associatesQuery.data || []
  const dashboardAssociateId = role === 'EARLY_TALENT' ? activeAssociateId : 'as-ananya'

  const dashboardQuery = useQuery({
    queryKey: ['dashboard', dashboardAssociateId],
    queryFn: () => api.dashboard(dashboardAssociateId),
    enabled: Boolean(associatesQuery.data && user),
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
              onRoleChange={switchRole}
              associates={associates}
              activeAssociateId={activeAssociateId}
              onAssociateChange={switchAssociate}
            >
              <Routes>
                {/* Default Role Root Route */}
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

                {/* HackerRank-Grade Coding IDE & Problem Catalog */}
                <Route path="/challenges" element={<PracticeChallenges />} />
                <Route path="/coding/:challengeId" element={<CodingWorkspace />} />

                {/* Role Specific Portals */}
                <Route
                  path="/mentor"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR_COACH', 'ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <MentorPortal user={user!} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/committee"
                  element={
                    <ProtectedRoute allowedRoles={['ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <CommitteePortal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sponsor"
                  element={
                    <ProtectedRoute allowedRoles={['SENIOR_LEADER_SPONSOR']}>
                      <SponsorPortal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/techhead"
                  element={
                    <ProtectedRoute allowedRoles={['TECHNOLOGY_HEAD', 'ENGINEERING_EXCELLENCE_COMMITTEE']}>
                      <TechHeadPortal />
                    </ProtectedRoute>
                  }
                />

                {/* Early Talent Subpages & Workflows */}
                <Route path="/my-skills" element={<MySkills associateId={dashboardAssociateId} />} />
                <Route path="/talent-marketplace" element={<TalentMarketplacePage associateId={dashboardAssociateId} />} />
                <Route path="/credentials" element={<CredentialsWallet associateId={dashboardAssociateId} />} />
                <Route path="/ai-coach" element={<AICoachPage associateId={dashboardAssociateId} />} />
                <Route path="/adaptive-assessment" element={<AdaptiveAssessmentPage associateId={dashboardAssociateId} />} />
                <Route path="/asm-lifecycle" element={<ASMLifecyclePage associateId={dashboardAssociateId} />} />
                <Route path="/workforce-planning" element={<WorkforcePlanningStudio />} />
                <Route path="/pathways" element={<PathwaySelection associateId={dashboardAssociateId} />} />
                <Route path="/asm" element={<AsmJourney associateId={dashboardAssociateId} />} />
                <Route path="/commissioning" element={<AsmJourney associateId={dashboardAssociateId} />} />
                <Route path="/curriculum" element={<Curriculum />} />
                <Route path="/take-assessment" element={<TakeAssessment />} />
                <Route path="/wf-assessments" element={<WFAssessmentsPage />} />
                <Route path="/asm-fork" element={<ASMForkPage />} />
                <Route path="/advanced-intensives" element={<AdvancedIntensivesPage />} />
                <Route path="/architect-board" element={<ArchitectBoardPage />} />
                <Route path="/credit-ledger" element={<CreditLedgerPage />} />
                <Route path="/program-overview" element={<ProgramOverviewPage />} />
                <Route path="/assessment/:courseId" element={<Assessment />} />
                <Route path="/assessment/result/:attemptId" element={<AssessmentResult />} />

                {/* Product Administration & Authoring Studios */}
                <Route path="/admin/users" element={<UserManager />} />
                <Route path="/admin/courses" element={<CourseStudio />} />
                <Route path="/admin/questions" element={<QuestionStudio />} />
                <Route path="/admin/workflows" element={<WorkflowDesigner />} />
                <Route path="/admin/question-governance" element={<QuestionLifecycleStudio />} />
                <Route path="/admin/dashboard-builder" element={<CustomDashboardBuilder />} />
                <Route path="/admin/metric-lineage" element={<MetricLineageStudio />} />
                <Route path="/admin/audit-center" element={<AuditCenterPage />} />
                <Route path="/admin/curriculum-versions" element={<CurriculumBranchingStudio />} />
                <Route path="/admin/integrations" element={<IntegrationHubPage />} />
                <Route path="/admin/control-center" element={<SystemControlCenter />} />

                {/* Executive Analytics & Scheduled Reporting */}
                <Route path="/analytics" element={<ExecutiveAnalyticsPage />} />
                <Route path="/reports" element={<EnterpriseReportingPage />} />

                {/* Enterprise Approvals & SLA Dashboard */}
                <Route path="/approvals" element={<ApprovalsPage currentRole={role} currentUserId={user?.id} currentUserName={user?.name} />} />

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

