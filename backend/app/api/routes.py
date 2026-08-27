from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.repositories.repository import get_repository
from app.services.dashboard_service import DashboardService
from app.services.assessment_service import AssessmentService
from app.services.pathway_service import PathwayService

router = APIRouter(prefix="/api", tags=["ascend"])


class StartAttemptRequest(BaseModel):
    course_id: str
    associate_id: str = "as-ananya"


class AnswerRequest(BaseModel):
    question_id: str
    selected_option: str


class MarkRequest(BaseModel):
    question_id: str


class CurrentIndexRequest(BaseModel):
    index: int


class DevelopmentPlanRequest(BaseModel):
    associate_id: str
    goal: str
    description: str
    priority: str
    target_month: int
    status: str = "NOT_STARTED"


class WaiverReviewRequest(BaseModel):
    mentor_id: str
    recommendation: str


@router.get("/health")
def health():
    return {"status": "ok", "service": "ascend-backend", "version": "1.0.0"}


@router.get("/roles")
def get_roles():
    repo = get_repository()
    return repo.get_roles()


@router.get("/users")
def get_users():
    repo = get_repository()
    return repo.get_users()


@router.get("/associates")
def get_associates():
    repo = get_repository()
    return repo.get_associates()


@router.get("/associates/{associate_id}")
def get_associate(associate_id: str):
    repo = get_repository()
    associate = repo.get_associate(associate_id)
    if not associate:
        raise HTTPException(status_code=404, detail="Associate not found")
    return associate


@router.get("/dashboard/{associate_id}")
def get_dashboard(associate_id: str):
    repo = get_repository()
    service = DashboardService(repo)
    dashboard = service.build_dashboard(associate_id)
    if not dashboard:
        raise HTTPException(status_code=404, detail="Associate not found")
    return dashboard


# ---------------------------------------------------------------------------
# Phase 5 — Mentor / Coach Portal
# ---------------------------------------------------------------------------

@router.get("/mentors/{mentor_id}/mentees")
def get_mentor_mentees(mentor_id: str):
    return get_repository().get_mentor_mentees(mentor_id)


@router.get("/mentees/{associate_id}")
def get_mentee_profile(associate_id: str):
    profile = get_repository().get_mentee_profile(associate_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Mentee not found")
    return profile


@router.get("/mentees/{associate_id}/development-plan")
def get_development_plan(associate_id: str):
    if not get_repository().get_associate(associate_id):
        raise HTTPException(status_code=404, detail="Mentee not found")
    return get_repository().get_development_plan(associate_id)


@router.post("/development-plan")
def create_development_plan(body: DevelopmentPlanRequest):
    if not get_repository().get_associate(body.associate_id):
        raise HTTPException(status_code=404, detail="Mentee not found")
    return get_repository().create_development_plan(body.model_dump())


@router.get("/waivers")
def get_waivers():
    return get_repository().get_waivers()


@router.post("/waivers/{waiver_id}/mentor-review")
def review_waiver(waiver_id: str, body: WaiverReviewRequest):
    if body.recommendation not in ("RECOMMEND", "DO_NOT_RECOMMEND"):
        raise HTTPException(status_code=400, detail="Invalid recommendation")
    waiver = get_repository().review_waiver(waiver_id, body.recommendation, body.mentor_id)
    if not waiver:
        raise HTTPException(status_code=404, detail="Waiver not found")
    return waiver


# ---------------------------------------------------------------------------
# Phase 6 — Engineering Excellence Committee Governance
# ---------------------------------------------------------------------------

@router.get("/committee/overview")
def get_committee_overview():
    return get_repository().get_committee_overview()


@router.get("/committee/question-bank")
def get_question_bank():
    return get_repository().get_question_bank()


@router.get("/committee/bank-coverage")
def get_bank_coverage():
    return get_repository().get_bank_coverage()


@router.get("/committee/admin-questions")
def get_admin_questions(course_id: Optional[str] = None):
    return get_repository().get_admin_questions(course_id)


@router.get("/pathways/already-forked")
def get_already_forked():
    return get_repository().get_already_forked()


@router.get("/committee/asm-library")
def get_asm_library():
    return get_repository().get_asm_library()


@router.get("/committee/waivers")
def get_governance_waivers():
    return get_repository().get_governance_waivers()


@router.get("/committee/difficulty")
def get_difficulty_engine():
    return get_repository().get_difficulty_engine()


@router.get("/committee/ledger")
def get_ledger_audit():
    return get_repository().get_ledger_audit()


@router.post("/committee/{area}/{item_id}/{action}")
def update_governance(area: str, item_id: str, action: str):
    result = get_repository().update_governance(area, item_id, action)
    if not result:
        raise HTTPException(status_code=404, detail="Governance item not found")
    return result


@router.get("/courses")
def get_courses():
    repo = get_repository()
    return repo.get_courses()


@router.get("/asm-milestones")
def get_asm_milestones():
    repo = get_repository()
    return repo.get_asm_milestones()


@router.get("/credits/{associate_id}")
def get_credits(associate_id: str):
    repo = get_repository()
    return repo.get_credits(associate_id)


# ---------------------------------------------------------------------------
# Phase 2 — Curriculum + Assessment Engine
# ---------------------------------------------------------------------------

@router.get("/curriculum/courses")
def get_curriculum_courses():
    repo = get_repository()
    return repo.get_curriculum_courses()


@router.get("/curriculum/courses/{course_id}")
def get_curriculum_course(course_id: str):
    repo = get_repository()
    course = repo.get_curriculum_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.get("/curriculum/courses/{course_id}/questions")
def get_course_questions(course_id: str):
    repo = get_repository()
    course = repo.get_curriculum_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    questions = repo.get_questions_by_course(course_id)
    # Strip correct_answer and explanation for the client
    return [
        {
            "id": q.id,
            "course_id": q.course_id,
            "tier": q.tier,
            "question": q.question,
            "options": q.options,
            "domain": q.domain,
        }
        for q in questions
    ]


@router.post("/assessments/start")
def start_assessment(body: StartAttemptRequest):
    repo = get_repository()
    service = AssessmentService(repo)
    summary = service.start_attempt(body.course_id, body.associate_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Course not found")
    return summary


@router.get("/assessments/{attempt_id}")
def get_assessment(attempt_id: str):
    repo = get_repository()
    service = AssessmentService(repo)
    summary = service.get_attempt(attempt_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Assessment attempt not found")
    return summary


@router.post("/assessments/{attempt_id}/answer")
def save_answer(attempt_id: str, body: AnswerRequest):
    repo = get_repository()
    service = AssessmentService(repo)
    summary = service.save_answer(attempt_id, body.question_id, body.selected_option)
    if not summary:
        raise HTTPException(status_code=404, detail="Assessment attempt not found")
    return summary


@router.post("/assessments/{attempt_id}/mark")
def toggle_mark(attempt_id: str, body: MarkRequest):
    repo = get_repository()
    service = AssessmentService(repo)
    summary = service.toggle_mark(attempt_id, body.question_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Assessment attempt not found")
    return summary


@router.post("/assessments/{attempt_id}/current")
def set_current(attempt_id: str, body: CurrentIndexRequest):
    repo = get_repository()
    attempt = repo.set_current_index(attempt_id, body.index)
    if not attempt:
        raise HTTPException(status_code=404, detail="Assessment attempt not found")
    return {"status": "ok"}


@router.post("/assessments/{attempt_id}/submit")
def submit_assessment(attempt_id: str):
    repo = get_repository()
    service = AssessmentService(repo)
    result = service.submit_attempt(attempt_id)
    if not result:
        raise HTTPException(status_code=404, detail="Assessment attempt not found")
    return result


@router.get("/assessments/{attempt_id}/result")
def get_assessment_result(attempt_id: str):
    repo = get_repository()
    service = AssessmentService(repo)
    result = service.get_result(attempt_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not available")
    return result


# ---------------------------------------------------------------------------
# Phase 3 — Pathway Selection & Recommendation Engine
# ---------------------------------------------------------------------------

class MentorReviewRequest(BaseModel):
    associate_id: str
    mentor_id: str
    mentor_name: str
    recommended_pathway: str
    confidence: float
    strengths: str
    concerns: str
    comments: str


class CommitteeDecisionRequest(BaseModel):
    associate_id: str
    system_recommendation: str
    mentor_recommendation: str = ""
    committee_decision: str
    reason: str
    status: str = "CONFIRMED"


@router.get("/pathways")
def get_pathways():
    repo = get_repository()
    service = PathwayService(repo)
    return service.get_pathways()


@router.get("/pathways/recommendation/{associate_id}")
def get_pathway_recommendation(associate_id: str):
    repo = get_repository()
    service = PathwayService(repo)
    recommendation = service.get_recommendation(associate_id)
    if not recommendation:
        raise HTTPException(status_code=404, detail="Associate not found")
    # Attach mentor review and reconciliation if available
    mentor_review = service.get_mentor_review(associate_id)
    system_code = recommendation.system_recommendation.pathway_code if recommendation.system_recommendation else ""
    mentor_code = mentor_review.recommended_pathway if mentor_review else None
    reconciliation = service.reconcile(system_code, mentor_code)
    return {
        **recommendation.model_dump(),
        "mentor_review": mentor_review.model_dump() if mentor_review else None,
        "reconciliation": reconciliation.model_dump(),
    }


@router.post("/pathways/mentor-review")
def submit_mentor_review(body: MentorReviewRequest):
    repo = get_repository()
    service = PathwayService(repo)
    from datetime import datetime, timezone
    review = MentorReview(
        associate_id=body.associate_id,
        mentor_id=body.mentor_id,
        mentor_name=body.mentor_name,
        recommended_pathway=body.recommended_pathway,
        confidence=body.confidence,
        strengths=body.strengths,
        concerns=body.concerns,
        comments=body.comments,
        submitted_at=datetime.now(timezone.utc),
    )
    saved = service.save_mentor_review(review)
    # Return reconciliation alongside the review
    recommendation = service.get_recommendation(body.associate_id)
    system_code = recommendation.system_recommendation.pathway_code if recommendation and recommendation.system_recommendation else ""
    reconciliation = service.reconcile(system_code, saved.recommended_pathway)
    return {**saved.model_dump(), "reconciliation": reconciliation.model_dump()}


@router.post("/pathways/committee-decision")
def submit_committee_decision(body: CommitteeDecisionRequest):
    repo = get_repository()
    service = PathwayService(repo)
    from datetime import datetime, timezone
    import uuid
    decision = CommitteeDecision(
        id=f"cd-{uuid.uuid4().hex[:12]}",
        associate_id=body.associate_id,
        system_recommendation=body.system_recommendation,
        mentor_recommendation=body.mentor_recommendation,
        committee_decision=body.committee_decision,
        reason=body.reason,
        timestamp=datetime.now(timezone.utc),
        status=body.status,
    )
    saved = service.save_committee_decision(decision)
    return saved.model_dump()


@router.get("/pathways/history/{associate_id}")
def get_pathway_history(associate_id: str):
    repo = get_repository()
    service = PathwayService(repo)
    return service.get_history(associate_id)


# ---------------------------------------------------------------------------
# Phase 4 — ASM Milestone Journey + Commissioning Path
# ---------------------------------------------------------------------------

from app.services.asm_service import ASMService
from app.models.schemas import StartASMRequest, SubmitASMRequest, ReviewASMRequest


@router.get("/asm")
def get_asm_milestones_v2():
    repo = get_repository()
    service = ASMService(repo)
    return [m.model_dump() for m in service.get_all_asm()]


@router.get("/asm/{milestone_id}")
def get_asm_detail(milestone_id: str):
    repo = get_repository()
    service = ASMService(repo)
    detail = service.get_asm(milestone_id)
    if not detail:
        raise HTTPException(status_code=404, detail="ASM milestone not found")
    return detail.model_dump()


@router.get("/associates/{associate_id}/asm")
def get_associate_asm(associate_id: str):
    repo = get_repository()
    service = ASMService(repo)
    detail = service.get_associate_asm(associate_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Associate not found")
    return detail.model_dump()


@router.post("/asm/{milestone_id}/start")
def start_asm(milestone_id: str, body: StartASMRequest):
    repo = get_repository()
    service = ASMService(repo)
    detail = service.start_milestone(milestone_id, body.associate_id)
    if not detail:
        raise HTTPException(status_code=404, detail="ASM milestone not found")
    return detail.model_dump()


@router.post("/asm/{milestone_id}/submit")
def submit_asm_evidence(milestone_id: str, body: SubmitASMRequest):
    repo = get_repository()
    service = ASMService(repo)
    detail = service.submit_evidence(
        milestone_id, body.associate_id, body.evidence_description, body.artifact_url
    )
    if not detail:
        raise HTTPException(status_code=404, detail="ASM milestone not found")
    return detail.model_dump()


@router.post("/asm/{milestone_id}/review")
def review_asm(milestone_id: str, body: ReviewASMRequest):
    repo = get_repository()
    service = ASMService(repo)
    detail = service.review_milestone(
        milestone_id, body.associate_id, body.mentor_id, body.mentor_name, body.decision, body.comments
    )
    if not detail:
        raise HTTPException(status_code=404, detail="ASM milestone not found")
    return detail.model_dump()


@router.get("/associates/{associate_id}/commissioning")
def get_commissioning(associate_id: str):
    repo = get_repository()
    service = ASMService(repo)
    path = service.get_commissioning(associate_id)
    if not path:
        raise HTTPException(status_code=404, detail="Associate not found")
    return path.model_dump()


@router.get("/associates/{associate_id}/credits")
def get_associate_credits(associate_id: str):
    repo = get_repository()
    return repo.get_credits(associate_id)


# ---------------------------------------------------------------------------
# Phase 7 — Senior Leader Sponsor: Demand & Pipeline Intelligence
# ---------------------------------------------------------------------------

from app.services.demand_service import DemandService


def _demand_service():
    return DemandService(get_repository())


@router.get("/demand")
def get_demand():
    return _demand_service().get_demand_overview()


@router.get("/demand/teams")
def get_demand_teams():
    return _demand_service().get_teams()


@router.get("/demand/{team_id}")
def get_demand_team(team_id: str):
    team = _demand_service().get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@router.get("/pipeline")
def get_pipeline():
    return _demand_service().get_pipeline_overview()


@router.get("/pipeline/{team_id}")
def get_pipeline_team(team_id: str):
    team = _demand_service().get_team_pipeline(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@router.get("/workforce/recommendations")
def get_workforce_recommendations():
    return _demand_service().get_recommendations()


@router.get("/sponsored-asm")
def get_sponsored_asm():
    return _demand_service().get_sponsored_asm()


# ---------------------------------------------------------------------------
# Technology Head + Approvals + Architect Board
# ---------------------------------------------------------------------------

@router.get("/techhead/readiness-heatmap")
def get_tech_readiness_heatmap():
    return get_repository().get_tech_readiness_heatmap()


@router.get("/sponsor/approvals")
def get_sponsor_approvals():
    return get_repository().get_sponsor_approvals()


@router.post("/sponsor/approvals/{approval_id}/{action}")
def decide_sponsor_approval(approval_id: str, action: str):
    result = get_repository().decide_sponsor_approval(approval_id, action)
    if not result:
        raise HTTPException(status_code=404, detail="Approval request not found")
    return result


@router.get("/architect-board/defenses")
def get_architect_defenses():
    return get_repository().get_architect_defenses()


@router.get("/architect-board/defenses/{associate_id}")
def get_associate_architect_defenses(associate_id: str):
    return get_repository().get_architect_defenses(associate_id)


class DefenseScorePayload(BaseModel):
    associate_id: str
    milestone_id: str = "asm-104"
    score: float


@router.post("/architect-board/score")
def score_architect_defense(payload: DefenseScorePayload):
    result = get_repository().score_architect_defense(payload.associate_id, payload.milestone_id, payload.score)
    if not result:
        raise HTTPException(status_code=404, detail="Defense record not found")
    return result


# ---------------------------------------------------------------------------
# HackerRank-Grade Code Execution & Coding Challenges
# ---------------------------------------------------------------------------

def _code_service():
    from app.services.code_executor import CodeExecutorService
    return CodeExecutorService(get_repository())


@router.get("/coding/challenges")
def get_coding_challenges():
    return _code_service().get_challenges()


@router.get("/coding/challenges/{challenge_id}")
def get_coding_challenge(challenge_id: str):
    c = _code_service().get_challenge(challenge_id)
    if not c:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return c


@router.post("/code/run")
def run_code(payload: CodeExecutionRequest):
    return _code_service().execute_code(payload)


@router.post("/code/submit")
def submit_code(payload: CodeSubmissionRequest):
    return _code_service().submit_code(payload)


# ---------------------------------------------------------------------------
# Administration & Studio Endpoints (User, Course, Question & Challenge CRUD)
# ---------------------------------------------------------------------------

@router.post("/users")
def create_user(payload: CreateUserPayload):
    return get_repository().create_user_and_associate(payload.model_dump())


@router.put("/users/{user_id}")
def update_user(user_id: str, payload: UpdateUserPayload):
    res = get_repository().update_user(user_id, payload.model_dump(exclude_unset=True))
    if not res:
        raise HTTPException(status_code=404, detail="User not found")
    return res


@router.delete("/users/{user_id}")
def delete_user(user_id: str):
    success = get_repository().delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "DELETED", "user_id": user_id}


@router.post("/courses")
def create_course(payload: CreateCoursePayload):
    return get_repository().create_course(payload.model_dump())


@router.put("/courses/{course_id}")
def update_course(course_id: str, payload: UpdateCoursePayload):
    res = get_repository().update_course(course_id, payload.model_dump(exclude_unset=True))
    if not res:
        raise HTTPException(status_code=404, detail="Course not found")
    return res


@router.delete("/courses/{course_id}")
def delete_course(course_id: str):
    success = get_repository().delete_course(course_id)
    if not success:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"status": "DELETED", "course_id": course_id}


@router.post("/questions")
def create_question(payload: CreateQuestionPayload):
    return get_repository().create_question(payload.model_dump())


@router.delete("/questions/{question_id}")
def delete_question(question_id: str):
    success = get_repository().delete_question(question_id)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"status": "DELETED", "question_id": question_id}


@router.post("/coding/challenges")
def create_coding_challenge(payload: CreateCodingChallengePayload):
    return _code_service().create_challenge(payload.model_dump())


@router.delete("/coding/challenges/{challenge_id}")
def delete_coding_challenge(challenge_id: str):
    success = _code_service().delete_challenge(challenge_id)
    if not success:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return {"status": "DELETED", "challenge_id": challenge_id}


# ---------------------------------------------------------------------------
# Skills Intelligence Endpoints (Phase 1)
# ---------------------------------------------------------------------------

from app.services.skill_service import get_skill_service


@router.get("/skills/taxonomy")
def get_skills_taxonomy():
    return get_skill_service().get_taxonomy()


@router.get("/skills/associate/{associate_id}/profile")
def get_associate_skill_profile(associate_id: str):
    return get_skill_service().get_profile(associate_id)


@router.get("/skills/associate/{associate_id}/gaps")
def get_associate_skill_gaps(associate_id: str):
    return get_skill_service().get_gaps(associate_id)


@router.get("/skills/associate/{associate_id}/recommendations")
def get_associate_skill_recommendations(associate_id: str):
    return get_skill_service().get_recommendations(associate_id)


@router.get("/skills/associate/{associate_id}/evidence/{skill_id}")
def get_associate_skill_evidence(associate_id: str, skill_id: str):
    evidence = get_skill_service().get_skill_evidence(associate_id, skill_id)
    if not evidence:
        raise HTTPException(status_code=404, detail="Skill evidence not found for this associate")
    return evidence


# ---------------------------------------------------------------------------
# AI Talent Intelligence Endpoints (Phase 2)
# ---------------------------------------------------------------------------

from app.services.ai_intelligence_service import get_ai_intelligence_service
from app.models.schemas import AICoachChatRequest, AIExecutiveQueryRequest


@router.get("/ai/readiness/{associate_id}")
def get_ai_readiness(associate_id: str):
    return get_ai_intelligence_service().get_readiness_breakdown(associate_id)


@router.get("/ai/predictions/{associate_id}")
def get_ai_predictions(associate_id: str):
    return get_ai_intelligence_service().get_readiness_prediction(associate_id)


@router.get("/ai/coach/history/{associate_id}")
def get_ai_coach_history(associate_id: str):
    return get_ai_intelligence_service().get_coach_history(associate_id)


@router.post("/ai/coach/chat")
def chat_with_ai_coach(req: AICoachChatRequest):
    return get_ai_intelligence_service().chat_with_coach(req)


@router.get("/ai/mentor/brief/{associate_id}")
def get_ai_mentor_brief(associate_id: str):
    return get_ai_intelligence_service().get_mentor_brief(associate_id)


@router.get("/ai/mentor/briefs")
def get_all_ai_mentor_briefs():
    return get_ai_intelligence_service().get_all_mentor_briefs()


@router.post("/ai/executive/query")
def execute_ai_executive_query(req: AIExecutiveQueryRequest):
    return get_ai_intelligence_service().execute_executive_query(req)


# ---------------------------------------------------------------------------
# Configurable Workflow Engine & SLA Escalation Endpoints (Phase 3)
# ---------------------------------------------------------------------------

from app.services.workflow_service import get_workflow_service
from app.services.notification_service import get_notification_service
from app.models.schemas import WorkflowDefinition, WorkflowTransitionRequest


@router.get("/workflows/definitions")
def get_workflow_definitions():
    return get_workflow_service().get_definitions()


@router.get("/workflows/definitions/{code}")
def get_workflow_definition(code: str):
    wf = get_workflow_service().get_definition(code)
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow definition not found")
    return wf


@router.post("/workflows/definitions")
def save_workflow_definition(payload: WorkflowDefinition):
    return get_workflow_service().save_definition(payload)


@router.get("/workflows/instances")
def get_workflow_instances(role: Optional[str] = None, associate_id: Optional[str] = None, status: Optional[str] = None):
    return get_workflow_service().get_instances(role=role, associate_id=associate_id, status=status)


@router.get("/workflows/instances/{instance_id}")
def get_workflow_instance(instance_id: str):
    inst = get_workflow_service().get_instance(instance_id)
    if not inst:
        raise HTTPException(status_code=404, detail="Workflow instance not found")
    return inst


@router.post("/workflows/instances/transition")
def transition_workflow_instance(req: WorkflowTransitionRequest):
    try:
        return get_workflow_service().transition_instance(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/workflows/sla/dashboard")
def get_sla_dashboard():
    return get_workflow_service().get_sla_dashboard()


# ---------------------------------------------------------------------------
# Enterprise Notification Center Endpoints (Phase 3)
# ---------------------------------------------------------------------------

@router.get("/notifications")
def get_notifications(user_id: Optional[str] = None, unread_only: bool = False):
    return get_notification_service().get_notifications(user_id=user_id, unread_only=unread_only)


@router.patch("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: str):
    success = get_notification_service().mark_as_read(notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "READ", "notification_id": notification_id}


@router.post("/notifications/read-all")
def mark_all_notifications_read(user_id: Optional[str] = None):
    count = get_notification_service().mark_all_as_read(user_id=user_id)
    return {"status": "ALL_READ", "count": count}


@router.get("/notifications/templates")
def get_notification_templates():
    return get_notification_service().get_templates()


# ---------------------------------------------------------------------------
# Adaptive Testing & Question Governance Endpoints (Phase 4)
# ---------------------------------------------------------------------------

from app.services.assessment_engine_service import get_assessment_engine_service
from app.models.schemas import AdaptiveStartRequest, AdaptiveAnswerSubmit, GovernanceQuestion


@router.post("/assessments/adaptive/start")
def start_adaptive_assessment(req: AdaptiveStartRequest):
    return get_assessment_engine_service().start_adaptive_session(req)


@router.post("/assessments/adaptive/submit")
def submit_adaptive_answer(req: AdaptiveAnswerSubmit):
    try:
        return get_assessment_engine_service().submit_adaptive_answer(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/assessments/governance/questions")
def get_governance_questions(domain: Optional[str] = None, status: Optional[str] = None):
    return get_assessment_engine_service().get_governance_questions(domain=domain, status=status)


@router.post("/assessments/governance/questions")
def save_governance_question(question: GovernanceQuestion):
    return get_assessment_engine_service().save_governance_question(question)


@router.patch("/assessments/governance/questions/{question_id}/status")
def update_question_status(question_id: str, status: str):
    try:
        return get_assessment_engine_service().update_question_status(question_id, status)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/assessments/proctoring/{session_id}")
def get_proctoring_telemetry(session_id: str):
    telemetry = get_assessment_engine_service().get_proctoring_telemetry(session_id)
    if not telemetry:
        raise HTTPException(status_code=404, detail="Proctoring telemetry not found for session")
    return telemetry


# ---------------------------------------------------------------------------
# ASM Lifecycle & Verifiable Digital Credentials Endpoints (Phase 5)
# ---------------------------------------------------------------------------

from app.services.asm_lifecycle_service import get_asm_lifecycle_service
from app.services.credential_service import get_credential_service
from app.models.schemas import ASMPanelMember, IssueCredentialRequest


@router.get("/asm/lifecycle/projects")
def get_asm_projects(associate_id: Optional[str] = None, stage: Optional[str] = None):
    return get_asm_lifecycle_service().get_projects(associate_id=associate_id, stage=stage)


@router.get("/asm/lifecycle/projects/{project_id}")
def get_asm_project(project_id: str):
    proj = get_asm_lifecycle_service().get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="ASM Project not found")
    return proj


@router.post("/asm/lifecycle/projects/{project_id}/panel-score")
def submit_asm_panel_score(project_id: str, member: ASMPanelMember):
    try:
        return get_asm_lifecycle_service().submit_panel_score(project_id, member)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/credentials/associate/{associate_id}")
def get_associate_credentials(associate_id: str):
    return get_credential_service().get_credentials(associate_id=associate_id)


@router.get("/credentials/verify/{credential_id}")
def verify_credential(credential_id: str):
    cred = get_credential_service().get_credential(credential_id)
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found or invalid")
    return cred


@router.post("/credentials/issue")
def issue_digital_credential(req: IssueCredentialRequest):
    return get_credential_service().issue_credential(req)


# ---------------------------------------------------------------------------
# Internal Talent Marketplace & Strategic Workforce Planning (Phase 6)
# ---------------------------------------------------------------------------

from app.services.talent_marketplace_service import get_talent_marketplace_service
from app.services.workforce_planning_service import get_workforce_planning_service
from app.models.schemas import (
    MarketplaceProject,
    MarketplaceApplyRequest,
    WorkforceScenarioRequest,
)


@router.get("/marketplace/projects")
def get_marketplace_projects():
    return get_talent_marketplace_service().get_projects()


@router.get("/marketplace/projects/{project_id}")
def get_marketplace_project(project_id: str):
    proj = get_talent_marketplace_service().get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj


@router.get("/marketplace/projects/{project_id}/matches/{associate_id}")
def get_marketplace_project_match(project_id: str, associate_id: str):
    return get_talent_marketplace_service().calculate_match_score(project_id, associate_id)


@router.get("/marketplace/applications")
def get_marketplace_applications(associate_id: Optional[str] = None, project_id: Optional[str] = None):
    return get_talent_marketplace_service().get_applications(associate_id=associate_id, project_id=project_id)


@router.post("/marketplace/apply")
def apply_for_marketplace_project(req: MarketplaceApplyRequest):
    try:
        return get_talent_marketplace_service().apply_for_project(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/marketplace/applications/{application_id}/status")
def update_application_status(application_id: str, status: str):
    try:
        return get_talent_marketplace_service().update_application_status(application_id, status)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/workforce/simulate-scenario")
def simulate_workforce_scenario(req: WorkforceScenarioRequest):
    return get_workforce_planning_service().simulate_scenario(req)


@router.get("/workforce/forecast")
def get_workforce_baseline_forecast():
    return get_workforce_planning_service().get_baseline_forecast()


# ---------------------------------------------------------------------------
# Executive Analytics, Custom Dashboard Builder & Reporting (Phase 7)
# ---------------------------------------------------------------------------

from app.services.analytics_service import get_analytics_service
from app.services.report_export_service import get_report_export_service
from app.models.schemas import (
    CustomDashboardLayout,
    ScheduledReport,
    GenerateReportRequest,
)


@router.get("/analytics/executive")
def get_executive_analytics():
    return get_analytics_service().get_executive_analytics()


@router.get("/analytics/cohorts")
def get_cohort_analytics():
    return get_analytics_service().get_cohort_analytics()


@router.get("/analytics/skills-matrix")
def get_skills_matrix_analytics():
    return get_analytics_service().get_skill_health_matrix()


@router.get("/analytics/dashboards")
def get_custom_dashboards(role: Optional[str] = None):
    return get_analytics_service().get_dashboards(role=role)


@router.get("/analytics/dashboards/{dashboard_id}")
def get_custom_dashboard(dashboard_id: str):
    dash = get_analytics_service().get_dashboard(dashboard_id)
    if not dash:
        raise HTTPException(status_code=404, detail="Dashboard layout not found")
    return dash


@router.post("/analytics/dashboards")
def save_custom_dashboard(dashboard: CustomDashboardLayout):
    return get_analytics_service().save_dashboard(dashboard)


@router.get("/reports/scheduled")
def get_scheduled_reports():
    return get_report_export_service().get_scheduled_reports()


@router.post("/reports/scheduled")
def save_scheduled_report(report: ScheduledReport):
    return get_report_export_service().save_scheduled_report(report)


@router.post("/reports/generate")
def generate_report(req: GenerateReportRequest):
    return get_report_export_service().generate_report(req)


# ---------------------------------------------------------------------------
# Data Governance, Metric Lineage & Audit Center (Phase 8)
# ---------------------------------------------------------------------------

from app.services.metric_lineage_service import get_metric_lineage_service
from app.services.audit_service import get_audit_service
from app.services.curriculum_version_service import get_curriculum_version_service
from app.models.schemas import CurriculumBranchRequest


@router.get("/governance/metrics/lineage")
def get_metric_lineage_nodes():
    return get_metric_lineage_service().get_lineage_nodes()


@router.get("/governance/metrics/{metric_key}/debug")
def debug_metric_calculation(metric_key: str):
    return get_metric_lineage_service().debug_metric(metric_key)


@router.get("/governance/audit/logs")
def get_audit_logs(
    severity: Optional[str] = None,
    action: Optional[str] = None,
    actor_id: Optional[str] = None,
):
    return get_audit_service().get_logs(severity=severity, action=action, actor_id=actor_id)


@router.post("/governance/audit/verify-chain")
def verify_audit_hash_chain():
    return get_audit_service().verify_hash_chain()


@router.get("/governance/curriculum/versions")
def get_curriculum_versions(course_id: Optional[str] = None):
    return get_curriculum_version_service().get_versions(course_id=course_id)


@router.post("/governance/curriculum/branch")
def create_curriculum_branch(req: CurriculumBranchRequest):
    return get_curriculum_version_service().create_branch(req)


# ---------------------------------------------------------------------------
# Enterprise Integration Hub, Global Command Palette & Activity Stream (Phase 9)
# ---------------------------------------------------------------------------

from app.services.integration_hub_service import get_integration_hub_service
from app.services.activity_presence_service import get_activity_presence_service
from app.models.schemas import XAPIStatement


@router.get("/integrations/lms")
def get_lms_connectors():
    return get_integration_hub_service().get_lms_connectors()


@router.post("/integrations/lms/{connector_id}/sync")
def trigger_lms_sync(connector_id: str):
    try:
        return get_integration_hub_service().trigger_lms_sync(connector_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/integrations/hris")
def get_hris_connectors():
    return get_integration_hub_service().get_hris_connectors()


@router.post("/integrations/xapi/ingest")
def ingest_xapi_statement(stmt: XAPIStatement):
    return get_integration_hub_service().ingest_xapi_statement(stmt)


@router.get("/activity/stream")
def get_activity_stream(limit: int = 20):
    return get_activity_presence_service().get_stream(limit=limit)


@router.get("/activity/presence")
def get_activity_presence():
    return get_activity_presence_service().get_presence()


@router.get("/search/global")
def search_global(q: str = ""):
    return get_activity_presence_service().search_global(query=q)


# ---------------------------------------------------------------------------
# Dynamic Scoring Rules & Control Center (Phase 10)
# ---------------------------------------------------------------------------

from app.services.control_center_service import get_control_center_service
from app.models.schemas import ScoringRuleConfig, FeatureFlagUpdate


@router.get("/control-center/health")
def get_system_health():
    return get_control_center_service().get_system_health()


@router.get("/control-center/scoring-rules")
def get_scoring_rules():
    return get_control_center_service().get_scoring_rules()


@router.post("/control-center/scoring-rules")
def update_scoring_rule(rule: ScoringRuleConfig):
    return get_control_center_service().update_scoring_rule(rule)


@router.get("/control-center/feature-flags")
def get_feature_flags():
    return get_control_center_service().get_feature_flags()


@router.post("/control-center/feature-flags")
def update_feature_flags(req: FeatureFlagUpdate):
    return get_control_center_service().update_feature_flags(req.flags)












