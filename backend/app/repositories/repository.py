from __future__ import annotations

from datetime import date, datetime, timezone

from typing import Optional
import uuid

from app.models.schemas import (
    ASMDetail,
    ASMEvidence,
    ASMMilestone,
    ASMMilestoneStatus,
    ASMReview,
    Assessment,
    Associate,
    AssociateASMMilestone,
    AssociateAssessment,
    AssociatePathway,
    AttemptResult,
    AttemptSummary,
    CommitteeDecision,
    Course,
    CreditEntry,
    CurriculumCourse,
    DomainScore,
    MentorReview,
    PathwayHistoryEntry,
    PerformanceInsight,
    Question,
    QuestionOption,
    Tier,
    TierPerformance,
    Pathway,
    Role,
    Standing,
    Team,
    User,
)
from app.seed.data import (
    seed_asm_milestones,
    seed_associate_asm_milestones,
    seed_associate_assessments,
    seed_associate_pathways,
    seed_associates,
    seed_assessments,
    seed_courses,
    seed_credits,
    seed_pathways,
    seed_roles,
    seed_teams,
    seed_users,
)
from app.seed.curriculum import (
    COURSE_META,
    seed_curriculum_courses,
    seed_questions,
)
from app.seed.asm import (
    seed_asm_details,
    ASSOCIATE_ASM_STATE,
)


class Repository:
    """In-memory data layer.

    Behaves like a real data layer (query, get-by-id, filter) so it can be
    swapped for a real database later without changing service code.
    """

    def __init__(self) -> None:
        self._users: list[User] = seed_users()
        self._roles: list[dict] = seed_roles()
        self._teams: list[Team] = seed_teams()
        self._pathways: list[Pathway] = seed_pathways()
        self._courses: list[Course] = seed_courses()
        self._assessments: list[Assessment] = seed_assessments()
        self._asm_milestones: list[ASMMilestone] = seed_asm_milestones()
        self._associates: list[Associate] = seed_associates()
        self._associate_assessments: list[AssociateAssessment] = seed_associate_assessments()
        self._associate_asm_milestones: list[AssociateASMMilestone] = seed_associate_asm_milestones()
        self._credits: list[CreditEntry] = seed_credits()
        self._associate_pathways: list[AssociatePathway] = seed_associate_pathways()
        # Phase 2
        self._curriculum_courses: list[CurriculumCourse] = seed_curriculum_courses()
        self._questions: list[Question] = seed_questions()
        self._attempts: dict[str, dict] = {}
        # Phase 3
        self._mentor_reviews: dict[str, MentorReview] = {}
        self._committee_decisions: list[CommitteeDecision] = []
        # Phase 4
        self._asm_details: list[ASMDetail] = seed_asm_details()
        self._associate_asm_state: dict[str, list[dict]] = {
            k: [dict(v) for v in states] for k, states in ASSOCIATE_ASM_STATE.items()
        }
        self._asm_reviews: dict[str, ASMReview] = {}
        self._asm_evidence: dict[str, list[ASMEvidence]] = {}
        self._development_plans: dict[str, list[dict]] = {
            "as-ananya": [
                {"id": "goal-ananya-1", "associate_id": "as-ananya", "goal": "Lead a production data integration", "description": "Own the design review and delivery of the next payments data integration.", "priority": "High", "target_month": 10, "status": "IN_PROGRESS", "updated_at": "2025-08-12"},
                {"id": "goal-ananya-2", "associate_id": "as-ananya", "goal": "Strengthen operational storytelling", "description": "Present a concise incident review with clear trade-offs and follow-up ownership.", "priority": "Medium", "target_month": 9, "status": "NOT_STARTED", "updated_at": "2025-08-08"},
            ],
            "as-rohan": [
                {"id": "goal-rohan-1", "associate_id": "as-rohan", "goal": "Build confidence in system design", "description": "Pair on two architecture reviews and document the key decisions made.", "priority": "High", "target_month": 9, "status": "AT_RISK", "updated_at": "2025-08-14"},
            ],
        }
        self._mentor_notes: dict[str, list[dict]] = {
            "as-ananya": [{"id": "note-ananya-1", "author": "Priya Nair", "text": "Strong momentum on delivery. Use the next check-in to unblock the database milestone.", "created_at": "2025-08-15"}],
            "as-fatima": [{"id": "note-fatima-1", "author": "Priya Nair", "text": "Fatima is tracking well for the DE fork reconciliation.", "created_at": "2025-08-16"}],
            "as-rohan": [{"id": "note-rohan-1", "author": "Vikram Desai", "text": "Needs a tighter weekly rhythm around the assessment backlog.", "created_at": "2025-08-13"}],
        }
        self._waivers: list[dict] = [
            {"id": "waiver-fatima", "associate_id": "as-fatima", "associate": "Fatima Sheikh", "current_milestone": "WF-101 Java 21 & Secure AI Prompting", "eligible_course": "Associate-initiated (Pre-Assessment opt-in)", "system_recommendation": "Recommend review", "reason": "When a mentee clears an ASM milestone, the system automatically suggests waiving the next tier of the matching WF course. As mentor, you confirm genuine readiness before it moves to the Engineering Excellence Committee.", "mentor_recommendation": "RECOMMEND", "status": "PENDING_REVIEW", "history": [{"label": "System suggestion", "detail": "Eligible after Foundational milestone", "date": "2025-08-01"}]},
            {"id": "waiver-ananya", "associate_id": "as-ananya", "associate": "Ananya Rao", "current_milestone": "ASM-101 · Foundation Build", "eligible_course": "WF-102 Spring Boot & Data Integrity", "system_recommendation": "Recommend review", "reason": "ASM-101 was cleared with strong evidence and an 88% WF-101 assessment score.", "mentor_recommendation": None, "status": "PENDING_REVIEW", "history": [{"label": "System suggestion", "detail": "Eligible after ASM-101 clearance", "date": "2025-03-01"}]},
        ]
        self._question_bank = [
            {"id": "qb-wf101-basic", "course": "WF-101 Java 21 & Secure AI Prompting", "tier": "Basic", "question_count": 100, "coverage": 100, "pass_rate": 91, "last_rotation": "Q2 2026", "live_sample_status": "LIVE", "status": "LIVE"},
            {"id": "qb-wf102-novice", "course": "WF-102 Spring Boot & Data Integrity", "tier": "Novice", "question_count": 100, "coverage": 100, "pass_rate": 84, "last_rotation": "Q2 2026", "live_sample_status": "LIVE", "status": "LIVE"},
            {"id": "qb-wf103-apprentice", "course": "WF-103 Spring Security & Cloud Foundations", "tier": "Apprentice", "question_count": 100, "coverage": 100, "pass_rate": 79, "last_rotation": "Q2 2026", "live_sample_status": "LIVE", "status": "LIVE"},
            {"id": "qb-wf104-expert", "course": "WF-104 Event Integration & Observability", "tier": "Expert", "question_count": 100, "coverage": 100, "pass_rate": 72, "last_rotation": "Q1 2026", "live_sample_status": "DRAFT", "status": "DRAFT"},
            {"id": "qb-wf203-master", "course": "WF-203 Spring AI & Enterprise RAG", "tier": "Master", "question_count": 100, "coverage": 100, "pass_rate": 68, "last_rotation": "Q2 2026", "live_sample_status": "LIVE", "status": "LIVE"},
        ]
        self._bank_coverage = [
            {"id": "bc-wf101", "course": "WF-101 Java 21 & Secure AI Prompting", "basic": 100, "novice": 100, "apprentice": 100, "expert": 100, "master": 100, "total": 500, "live_sample_status": "Yes"},
            {"id": "bc-wf102", "course": "WF-102 Spring Boot & Data Integrity", "basic": 100, "novice": 100, "apprentice": 100, "expert": 100, "master": 100, "total": 500, "live_sample_status": "Yes"},
            {"id": "bc-wf103", "course": "WF-103 Spring Security & Cloud Foundations", "basic": 100, "novice": 100, "apprentice": 100, "expert": 100, "master": 100, "total": 500, "live_sample_status": "Yes"},
            {"id": "bc-wf104", "course": "WF-104 Event Integration & Observability", "basic": 100, "novice": 100, "apprentice": 100, "expert": 100, "master": 100, "total": 500, "live_sample_status": "Bank pending"},
            {"id": "bc-wf201", "course": "WF-201 Microservices at Cloud Scale", "basic": 100, "novice": 100, "apprentice": 100, "expert": 100, "master": 100, "total": 500, "live_sample_status": "Bank pending"},
            {"id": "bc-wf202", "course": "WF-202 Distributed Resilience Engineering", "basic": 100, "novice": 100, "apprentice": 100, "expert": 100, "master": 100, "total": 500, "live_sample_status": "Bank pending"},
            {"id": "bc-wf203", "course": "WF-203 Spring AI & Enterprise RAG", "basic": 100, "novice": 100, "apprentice": 100, "expert": 100, "master": 100, "total": 500, "live_sample_status": "Yes"},
        ]
        self._admin_questions = [
            {"id": "q1", "number": 1, "question": "What is the JVM primarily responsible for?", "correct_answer": "Executing compiled Java bytecode and managing memory/runtime resources"},
            {"id": "q2", "number": 2, "question": "What does the Java Stream API let you do?", "correct_answer": "Process sequences of elements with functional-style operations like map and filter"},
            {"id": "q3", "number": 3, "question": "Why should a developer set boundaries on AI coding-assistant prompts?", "correct_answer": "To prevent leaking proprietary code or sensitive data into external prompts"},
            {"id": "q4", "number": 4, "question": "What is a \"memory leak\" in a Java application?", "correct_answer": "Objects that are no longer needed but remain reachable, preventing garbage collection"},
            {"id": "q5", "number": 5, "question": "What does \"IP\" refer to in secure AI prompting rules at a bank?", "correct_answer": "Intellectual Property — proprietary code, data, or business logic"},
        ]
        self._asm_library = [
            {"id": "asm-lib-101", "code": "ASM-101", "milestone": "Hacker Kitchen", "month": "M3", "wf_course": "WF-101", "rubric_focus": "AI Tooling & Safety", "credits": 10, "status": "LIVE"},
            {"id": "asm-lib-102", "code": "ASM-102", "milestone": "Database Duel", "month": "M6", "wf_course": "WF-102", "rubric_focus": "Independence", "credits": 12, "status": "LIVE"},
            {"id": "asm-lib-103", "code": "ASM-103", "milestone": "AWS Sandbox Deploy", "month": "M9", "wf_course": "WF-103", "rubric_focus": "Cloud Resilience", "credits": 14, "status": "LIVE"},
            {"id": "asm-lib-104", "code": "ASM-104", "milestone": "The RFC Board Defense", "month": "M12", "wf_course": "WF-104", "rubric_focus": "Independence", "credits": 16, "status": "LIVE"},
            {"id": "asm-lib-201", "code": "ASM-201", "milestone": "Drill", "month": "M15", "wf_course": "WF-201", "rubric_focus": "Cloud Resilience", "credits": 18, "status": "LIVE"},
            {"id": "asm-lib-202", "code": "ASM-202", "milestone": "Live Fire — Resilience Chaos Simulation", "month": "M18", "wf_course": "WF-202", "rubric_focus": "Cloud Resilience", "credits": 20, "status": "LIVE"},
            {"id": "asm-lib-203", "code": "ASM-203", "milestone": "Capstone — Secure AI Banking Agent", "month": "M24", "wf_course": "WF-203", "rubric_focus": "AI Tooling & Safety", "credits": 30, "status": "LIVE"},
        ]
        self._difficulty_engine = [
            {"id": "diff-wf101", "course": "WF-101 Java 21 & Secure AI Prompting", "tier": "Basic", "average_score": 86, "pass_rate": 91, "difficulty": "Too Easy", "calibration": 2},
            {"id": "diff-wf102", "course": "WF-102 Spring Boot & Data Integrity", "tier": "Novice", "average_score": 79, "pass_rate": 84, "difficulty": "Balanced", "calibration": 0},
            {"id": "diff-wf103", "course": "WF-103 Spring Security & Cloud Foundations", "tier": "Apprentice", "average_score": 74, "pass_rate": 76, "difficulty": "Balanced", "calibration": -1},
            {"id": "diff-wf104", "course": "WF-104 Event Integration & Observability", "tier": "Expert", "average_score": 68, "pass_rate": 68, "difficulty": "Too Difficult", "calibration": -3},
            {"id": "diff-wf203", "course": "WF-203 Spring AI & Enterprise RAG", "tier": "Master", "average_score": 65, "pass_rate": 61, "difficulty": "Too Difficult", "calibration": -2},
        ]
        self._ledger_audit = [
            {"id": "ledger-001", "associate": "Ananya Rao", "date": "Feb 10", "domain": "D1", "instrument": "WF-101 Assessment", "level": "L300", "credits": 23, "source": "Assessment pass", "status": "APPROVED"},
            {"id": "ledger-002", "associate": "Ananya Rao", "date": "Mar 15", "domain": "D4", "instrument": "ASM-101 Hacker Kitchen", "level": "L300", "credits": 23, "source": "Milestone completion", "status": "APPROVED"},
            {"id": "ledger-003", "associate": "Ananya Rao", "date": "May 20", "domain": "D1", "instrument": "WF-102 Assessment", "level": "L300", "credits": 23, "source": "Assessment pass", "status": "APPROVED"},
            {"id": "ledger-004", "associate": "Ananya Rao", "date": "Jun 05", "domain": "D4", "instrument": "ASM-102 Database Duel", "level": "L300", "credits": 23, "source": "Milestone completion", "status": "APPROVED"},
            {"id": "ledger-005", "associate": "Ananya Rao", "date": "Jul 12", "domain": "D2", "instrument": "ASM-103 AWS Sandbox Deploy", "level": "L300", "credits": 23, "source": "Milestone completion", "status": "APPROVED"},
            {"id": "ledger-006", "associate": "Rohan Mehta", "date": "Jan 15", "domain": "D1", "instrument": "WF-101 Assessment", "level": "L300", "credits": 15, "source": "Assessment pass", "status": "APPROVED"},
            {"id": "ledger-007", "associate": "Rohan Mehta", "date": "Feb 20", "domain": "D4", "instrument": "ASM-101 Hacker Kitchen", "level": "L300", "credits": 15, "source": "Milestone completion", "status": "APPROVED"},
            {"id": "ledger-008", "associate": "Rohan Mehta", "date": "May 10", "domain": "D1", "instrument": "WF-102 Assessment", "level": "L200", "credits": 10, "source": "Assessment pass", "status": "APPROVED"},
            {"id": "ledger-009", "associate": "Rohan Mehta", "date": "Jun 08", "domain": "D4", "instrument": "ASM-102 Database Duel", "level": "L200", "credits": 10, "source": "Milestone completion", "status": "APPROVED"},
            {"id": "ledger-010", "associate": "Fatima Sheikh", "date": "Mar 28", "domain": "D1", "instrument": "Gate 1 - Foundational Certification", "level": "L100", "credits": 15, "source": "Foundational Gate", "status": "APPROVED"},
            {"id": "ledger-011", "associate": "Karthik Iyer", "date": "Sep 12", "domain": "D2", "instrument": "WF-201 Assessment", "level": "L400", "credits": 20, "source": "Assessment pass", "status": "APPROVED"},
            {"id": "ledger-012", "associate": "Karthik Iyer", "date": "Oct 30", "domain": "D4", "instrument": "ASM-201 Drill", "level": "L400", "credits": 28, "source": "Milestone completion", "status": "APPROVED"},
            {"id": "ledger-013", "associate": "Karthik Iyer", "date": "Jan 18", "domain": "D2", "instrument": "WF-202 Assessment", "level": "L400", "credits": 20, "source": "Assessment pass", "status": "APPROVED"},
            {"id": "ledger-014", "associate": "Karthik Iyer", "date": "Feb 14", "domain": "D4", "instrument": "ASM-202 Live Fire", "level": "L400", "credits": 28, "source": "Milestone completion", "status": "APPROVED"},
            {"id": "ledger-015", "associate": "Karthik Iyer", "date": "Jun 10", "domain": "D3", "instrument": "WF-203 Assessment", "level": "L400", "credits": 20, "source": "Assessment pass", "status": "APPROVED"},
        ]
        self._sponsor_approvals = [
            {"id": "app-ananya", "associate_id": "as-ananya", "associate_name": "Ananya Rao", "type": "Fast-Track", "requested_date": "Jun 28", "cohort": "GDA Cohort 2025", "target_team": "Payments Engineering", "status": "PENDING"},
            {"id": "app-karthik", "associate_id": "as-karthik", "associate_name": "Karthik Iyer", "type": "One-Level-Up", "requested_date": "Jul 10", "cohort": "GDA Cohort 2025", "target_team": "Cloud & Site Reliability Engineering", "status": "APPROVED"},
        ]
        self._architect_defenses = [
            {"id": "def-ananya", "associate_id": "as-ananya", "associate_name": "Ananya Rao", "milestone": "ASM-104 RFC Board Defense", "topic": "Payment reconciler — technology & security architecture", "panel": "Lead Architects", "date": "Aug 20", "status": "Scheduled", "stream": "STREAM 04/05", "score": 4.5},
            {"id": "def-karthik", "associate_id": "as-karthik", "associate_name": "Karthik Iyer", "milestone": "ASM-202 Live Fire", "topic": "Resilience chaos simulation & failover runbook", "panel": "SRE Council", "date": "Aug 28", "status": "Scheduled", "stream": "STREAM 02/05", "score": None},
        ]
        self._tech_readiness_heatmap = [
            {"id": "th-ananya", "associate": "Ananya Rao", "track": "GDA Cohort 2025 · Target: Payments Engineering", "d2_level": "L300", "d2_status": "green", "d3_level": "L100", "d3_status": "red"},
            {"id": "th-rohan", "associate": "Rohan Mehta", "track": "GDA Cohort 2025 · Target: Core Banking Platform Engineering", "d2_level": "L100", "d2_status": "red", "d3_level": "L100", "d3_status": "red"},
            {"id": "th-fatima", "associate": "Fatima Sheikh", "track": "GDA Cohort 2025 · Target: AI / Bedrock Enablement", "d2_level": "L0", "d2_status": "red", "d3_level": "L0", "d3_status": "red"},
            {"id": "th-karthik", "associate": "Karthik Iyer", "track": "GDA Cohort 2025 · Target: Cloud & Site Reliability Engineering", "d2_level": "L400", "d2_status": "green", "d3_level": "L400", "d3_status": "green"},
        ]
        self._already_forked = [
            {"id": "fork-ananya", "name": "Ananya Rao", "detail": "Forked into SE — Software Engineering at Month 4", "initials": "AR"},
            {"id": "fork-rohan", "name": "Rohan Mehta", "detail": "Forked into CSE — Cyber Security Engineering at Month 4", "initials": "RM"},
            {"id": "fork-karthik", "name": "Karthik Iyer", "detail": "Forked into IE — Infrastructure Engineering at Month 4", "initials": "KI"},
        ]

    # Roles
    def get_roles(self) -> list[dict]:
        return list(self._roles)

    # Users
    def get_users(self) -> list[User]:
        return list(self._users)

    def get_user(self, user_id: str) -> Optional[User]:
        for u in self._users:
            if u.id == user_id:
                return u
        return None

    def get_users_by_role(self, role: Role) -> list[User]:
        return [u for u in self._users if u.role == role]

    # Teams
    def get_teams(self) -> list[Team]:
        return list(self._teams)

    # Pathways
    def get_pathways(self) -> list[Pathway]:
        return list(self._pathways)

    def get_pathway(self, pathway_id: str) -> Optional[Pathway]:
        for p in self._pathways:
            if p.id == pathway_id:
                return p
        return None

    def get_pathway_by_code(self, code: str) -> Optional[Pathway]:
        for p in self._pathways:
            if p.code == code:
                return p
        return None

    def get_associate_pathway(self, associate_id: str) -> Optional[AssociatePathway]:
        for ap in self._associate_pathways:
            if ap.code and associate_id == self._associate_id_for_pathway(ap):
                return ap
        # fallback: match by pathway code on associate
        assoc = self.get_associate(associate_id)
        if not assoc:
            return None
        for ap in self._associate_pathways:
            if ap.code == assoc.pathway_code:
                return ap
        return None

    def _associate_id_for_pathway(self, ap: AssociatePathway) -> Optional[str]:
        # associate_pathways are ordered to match associates list
        idx = self._associate_pathways.index(ap)
        if idx < len(self._associates):
            return self._associates[idx].id
        return None

    # Courses
    def get_courses(self) -> list[Course]:
        return list(self._courses)

    def get_course(self, course_id: str) -> Optional[Course]:
        for c in self._courses:
            if c.id == course_id:
                return c
        return None

    # Assessments
    def get_assessments(self) -> list[Assessment]:
        return list(self._assessments)

    def get_assessment(self, assessment_id: str) -> Optional[Assessment]:
        for a in self._assessments:
            if a.id == assessment_id:
                return a
        return None

    def get_associate_assessments(self, associate_id: str) -> list[AssociateAssessment]:
        return [a for a in self._associate_assessments if a.associate_id == associate_id]

    # ASM Milestones
    def get_asm_milestones(self) -> list[ASMMilestone]:
        return list(self._asm_milestones)

    def get_asm_milestone(self, milestone_id: str) -> Optional[ASMMilestone]:
        for m in self._asm_milestones:
            if m.id == milestone_id:
                return m
        return None

    def get_associate_asm_milestones(self, associate_id: str) -> list[AssociateASMMilestone]:
        return [m for m in self._associate_asm_milestones if m.associate_id == associate_id]

    # Associates
    def get_associates(self) -> list[Associate]:
        return list(self._associates)

    def get_associate(self, associate_id: str) -> Optional[Associate]:
        for a in self._associates:
            if a.id == associate_id:
                return a
        return None

    def get_associate_by_user(self, user_id: str) -> Optional[Associate]:
        for a in self._associates:
            if a.user_id == user_id:
                return a
        return None

    def get_associates_by_mentor(self, mentor_user_id: str) -> list[Associate]:
        return [a for a in self._associates if a.mentor_id == mentor_user_id]

    def get_associates_by_sponsor(self, sponsor_user_id: str) -> list[Associate]:
        return [a for a in self._associates if a.sponsor_id == sponsor_user_id]

    # Credits
    def get_credits(self, associate_id: str) -> list[CreditEntry]:
        return [c for c in self._credits if c.associate_id == associate_id]

    def get_credit_balance(self, associate_id: str) -> int:
        entries = self.get_credits(associate_id)
        if not entries:
            return 0
        return max(c.balance_after for c in entries)

    def add_credit_entry(self, entry: CreditEntry) -> None:
        self._credits.append(entry)
        self._ledger_audit.insert(0, {
            "id": f"ledger-{len(self._ledger_audit) + 1:03d}",
            "associate": self.get_associate(entry.associate_id).name if self.get_associate(entry.associate_id) else entry.associate_id,
            "date": entry.awarded_at.strftime("%b %d"),
            "domain": "D1",
            "instrument": entry.source,
            "level": "L300",
            "credits": entry.amount,
            "source": entry.description,
            "status": "APPROVED",
        })

    # ------------------------------------------------------------------
    # Phase 2 — Curriculum, Question Bank, Assessment Attempts
    # ------------------------------------------------------------------

    def get_curriculum_courses(self) -> list[CurriculumCourse]:
        return list(self._curriculum_courses)

    def get_curriculum_course(self, course_id: str) -> Optional[CurriculumCourse]:
        for c in self._curriculum_courses:
            if c.id == course_id:
                return c
        return None

    def get_course_meta(self, course_id: str) -> Optional[dict]:
        return COURSE_META.get(course_id)

    def get_questions_by_course(self, course_id: str) -> list[Question]:
        return [q for q in self._questions if q.course_id == course_id]

    def get_question(self, question_id: str) -> Optional[Question]:
        for q in self._questions:
            if q.id == question_id:
                return q
        return None

    def create_attempt(self, course_id: str, associate_id: str) -> dict:
        meta = self.get_course_meta(course_id)
        if not meta:
            return {}
        questions = self.get_questions_by_course(course_id)
        attempt_id = f"att-{uuid.uuid4().hex[:12]}"
        attempt = {
            "id": attempt_id,
            "course_id": course_id,
            "course_code": meta["code"],
            "course_name": meta["name"],
            "domain": meta["domain"],
            "associate_id": associate_id,
            "status": "IN_PROGRESS",
            "started_at": datetime.now(timezone.utc),
            "time_limit_minutes": meta["time_limit"],
            "passing_score": meta["passing_score"],
            "questions": questions,
            "answers": {},
            "marked": [],
            "current_index": 0,
        }
        self._attempts[attempt_id] = attempt
        return attempt

    def get_attempt(self, attempt_id: str) -> Optional[dict]:
        return self._attempts.get(attempt_id)

    def save_answer(self, attempt_id: str, question_id: str, selected_option: str) -> Optional[dict]:
        attempt = self._attempts.get(attempt_id)
        if not attempt:
            return None
        attempt["answers"][question_id] = selected_option
        return attempt

    def toggle_mark(self, attempt_id: str, question_id: str) -> Optional[dict]:
        attempt = self._attempts.get(attempt_id)
        if not attempt:
            return None
        if question_id in attempt["marked"]:
            attempt["marked"].remove(question_id)
        else:
            attempt["marked"].append(question_id)
        return attempt

    def set_current_index(self, attempt_id: str, index: int) -> Optional[dict]:
        attempt = self._attempts.get(attempt_id)
        if not attempt:
            return None
        attempt["current_index"] = index
        return attempt

    def submit_attempt(self, attempt_id: str) -> Optional[dict]:
        attempt = self._attempts.get(attempt_id)
        if not attempt:
            return None
        attempt["status"] = "SUBMITTED"
        attempt["completed_at"] = datetime.now(timezone.utc)
        return attempt

    def compute_result(self, attempt_id: str) -> Optional[AttemptResult]:
        attempt = self._attempts.get(attempt_id)
        if not attempt:
            return None
        questions: list[Question] = attempt["questions"]
        answers: dict[str, str] = attempt["answers"]
        total = len(questions)
        correct = 0
        incorrect = 0
        skipped = 0
        domain_map: dict[str, dict] = {}
        tier_map: dict[str, dict] = {}

        for q in questions:
            selected = answers.get(q.id)
            domain = q.domain
            tier = q.tier.value

            if domain not in domain_map:
                domain_map[domain] = {"total": 0, "correct": 0, "incorrect": 0, "skipped": 0}
            if tier not in tier_map:
                tier_map[tier] = {"total": 0, "correct": 0, "incorrect": 0, "skipped": 0}

            domain_map[domain]["total"] += 1
            tier_map[tier]["total"] += 1

            if selected is None:
                skipped += 1
                domain_map[domain]["skipped"] += 1
                tier_map[tier]["skipped"] += 1
            elif selected == q.correct_answer:
                correct += 1
                domain_map[domain]["correct"] += 1
                tier_map[tier]["correct"] += 1
            else:
                incorrect += 1
                domain_map[domain]["incorrect"] += 1
                tier_map[tier]["incorrect"] += 1

        score = round((correct / total * 100)) if total > 0 else 0
        passing_score = attempt["passing_score"]
        passed = score >= passing_score

        domain_scores = [
            DomainScore(
                domain=d,
                total=v["total"],
                correct=v["correct"],
                incorrect=v["incorrect"],
                skipped=v["skipped"],
                percentage=round((v["correct"] / v["total"] * 100)) if v["total"] > 0 else 0,
            )
            for d, v in domain_map.items()
        ]
        tier_performance = [
            TierPerformance(
                tier=t,
                total=v["total"],
                correct=v["correct"],
                incorrect=v["incorrect"],
                skipped=v["skipped"],
                percentage=round((v["correct"] / v["total"] * 100)) if v["total"] > 0 else 0,
            )
            for t, v in tier_map.items()
        ]

        strongest = max(domain_scores, key=lambda d: d.percentage, default=None)
        weakest = min(domain_scores, key=lambda d: d.percentage, default=None)
        strongest_area = strongest.domain if strongest else "N/A"
        improvement_area = weakest.domain if weakest else "N/A"

        if passed:
            recommended = f"Advance to the next course in the {attempt['domain']} track."
        else:
            recommended = f"Review {improvement_area} concepts and retake the assessment."

        insights = PerformanceInsight(
            strongest_area=strongest_area,
            improvement_area=improvement_area,
            recommended_next_action=recommended,
        )

        return AttemptResult(
            attempt_id=attempt_id,
            course_id=attempt["course_id"],
            course_code=attempt["course_code"],
            course_name=attempt["course_name"],
            associate_id=attempt["associate_id"],
            status="COMPLETED",
            score=score,
            correct=correct,
            incorrect=incorrect,
            skipped=skipped,
            total_questions=total,
            passing_score=passing_score,
            passed=passed,
            gate_status="PASSED" if passed else "NEEDS_IMPROVEMENT",
            domain_scores=domain_scores,
            tier_performance=tier_performance,
            insights=insights,
            completed_at=attempt.get("completed_at") or datetime.now(timezone.utc),
        )


    # ------------------------------------------------------------------
    # Phase 3 — Mentor Reviews & Committee Decisions
    # ------------------------------------------------------------------

    def save_mentor_review(self, review: MentorReview) -> None:
        self._mentor_reviews[review.associate_id] = review

    def get_mentor_review(self, associate_id: str) -> Optional[MentorReview]:
        return self._mentor_reviews.get(associate_id)

    def save_committee_decision(self, decision: CommitteeDecision) -> None:
        self._committee_decisions.append(decision)

    def get_pathway_history(self, associate_id: str) -> list[PathwayHistoryEntry]:
        history: list[PathwayHistoryEntry] = []
        for d in self._committee_decisions:
            if d.associate_id == associate_id:
                mentor_rec = self._mentor_reviews.get(associate_id)
                history.append(PathwayHistoryEntry(
                    id=d.id,
                    associate_id=d.associate_id,
                    system_recommendation=d.system_recommendation,
                    mentor_recommendation=mentor_rec.recommended_pathway if mentor_rec else None,
                    committee_decision=d.committee_decision,
                    reason=d.reason,
                    timestamp=d.timestamp,
                    status=d.status,
                ))
        history.sort(key=lambda h: h.timestamp, reverse=True)
        return history

    # ------------------------------------------------------------------
    # Phase 5 — Mentor / Coach Portal
    # ------------------------------------------------------------------

    def get_mentor_mentees(self, mentor_id: str) -> list[dict]:
        associates = self.get_associates_by_mentor(mentor_id)
        if not associates:
            # Fallback for demo: show active accelerator associates
            associates = [a for a in self._associates if a.id in ("as-ananya", "as-fatima", "as-rohan")]
        result = []
        for associate in associates:
            assessments = self.get_associate_assessments(associate.id)
            completed = [a.score for a in assessments if a.score is not None]
            milestones = self.get_associate_asm_details(associate.id)
            result.append({
                "id": associate.id,
                "name": associate.name,
                "title": associate.title,
                "email": associate.email,
                "pathway": associate.pathway_code,
                "pathway_name": self.get_pathway_by_code(associate.pathway_code).name if self.get_pathway_by_code(associate.pathway_code) else associate.pathway_code,
                "current_month": associate.current_month,
                "readiness": round(self._mentor_readiness(associate.id) * 100),
                "assessment_score": round(sum(completed) / len(completed)) if completed else 82,
                "asm_progress": round(sum(1 for m in milestones if m.status.value == "COMPLETED") / max(1, len(milestones)) * 100) if milestones else 25,
                "pending_requests": sum(1 for w in self._waivers if w["associate_id"] == associate.id and w["status"] == "PENDING_REVIEW"),
                "risk": "AT_RISK" if associate.standing in (Standing.AT_RISK, Standing.BLOCKED) else ("NEEDS_ATTENTION" if any(a.status.value == "IN_PROGRESS" for a in assessments) else "ON_TRACK"),
            })
        return result

    def _mentor_readiness(self, associate_id: str) -> float:
        assessments = self.get_associate_assessments(associate_id)
        completed = [a.score for a in assessments if a.score is not None]
        assessment_score = (sum(completed) / len(completed) / 100) if completed else 0.8
        milestones = self.get_associate_asm_details(associate_id)
        asm_score = sum(1 for m in milestones if m.status.value == "COMPLETED") / max(1, len(milestones)) if milestones else 0.25
        return round(assessment_score * 0.45 + asm_score * 0.55, 2)

    def get_mentee_profile(self, associate_id: str) -> Optional[dict]:
        associate = self.get_associate(associate_id)
        if not associate:
            return None
        pathway = self.get_associate_pathway(associate_id)
        assessments = self.get_associate_assessments(associate_id)
        milestones = self.get_associate_asm_details(associate_id)
        return {"profile": associate.model_dump(mode="json"), "progress": {"overall": round(self._mentor_readiness(associate_id) * 100), "assessment": round(sum(a.score for a in assessments if a.score is not None) / max(1, len([a for a in assessments if a.score is not None]))), "asm": round(sum(1 for m in milestones if m.status.value == "COMPLETED") / max(1, len(milestones)) * 100)}, "assessment": [a.model_dump(mode="json") for a in assessments], "pathway": pathway.model_dump(mode="json") if pathway else None, "asm": [m.model_dump(mode="json") for m in milestones], "credits": [c.model_dump(mode="json") for c in self.get_credits(associate_id)], "development_plan": self._development_plans.get(associate_id, []), "mentor_notes": self._mentor_notes.get(associate_id, [])}

    def get_development_plan(self, associate_id: str) -> list[dict]:
        return list(self._development_plans.get(associate_id, []))

    def create_development_plan(self, payload: dict) -> dict:
        item = {"id": f"goal-{uuid.uuid4().hex[:10]}", "updated_at": datetime.now(timezone.utc).date().isoformat(), **payload}
        self._development_plans.setdefault(payload["associate_id"], []).append(item)
        return item

    # ------------------------------------------------------------------
    # Phase 6 — Engineering Excellence Committee Governance
    # ------------------------------------------------------------------

    def get_committee_overview(self) -> dict:
        total = len(self._associates)
        completed_assessments = [a for a in self._associate_assessments if a.status.value == "COMPLETED"]
        total_assessments = len(self._associate_assessments)
        completed_asm = [m for m in self._associate_asm_milestones if m.status.value == "COMPLETED"]
        pathway_counts = {code: sum(1 for a in self._associates if a.pathway_code == code) for code in ("DE", "SE", "CSE", "IE")}
        pathway_names = {"DE": "Data Engineering", "SE": "Software Engineering", "CSE": "Cyber Security", "IE": "Infrastructure"}
        colors = {"DE": "bg-blue-500", "SE": "bg-emerald-500", "CSE": "bg-amber-500", "IE": "bg-slate-500"}
        return {
            "total_associates": total,
            "assessment_progress": round(len(completed_assessments) / total_assessments * 100) if total_assessments else 0,
            "pathway_distribution": [{"label": pathway_names[code], "value": round(count / total * 100) if total else 0, "color": colors[code]} for code, count in pathway_counts.items() if count],
            "asm_completion": round(len(completed_asm) / len(self._associate_asm_milestones) * 100) if self._associate_asm_milestones else 0,
            "at_risk": sum(1 for a in self._associates if a.standing.value in ("AT_RISK", "BLOCKED")),
            "pending_waivers": sum(1 for w in self._waivers if w["status"] == "PENDING_REVIEW"),
            "commission_ready": 1,
            "audit_events": [
                {"title": "Question rotation completed", "detail": "WF-101 live sample rotated and approved by the standards council.", "time": "2h ago", "tone": "bg-emerald-500"},
                {"title": "Waiver entered review", "detail": "Fatima Sheikh · WF-101 waiver acceleration request is awaiting decision.", "time": "5h ago", "tone": "bg-amber-500"},
                {"title": "ASM standard updated", "detail": "ASM-202 rubric now includes incident command evidence.", "time": "Yesterday", "tone": "bg-blue-500"},
                {"title": "Ledger reconciliation passed", "detail": "All credit entries matched their source instruments for the latest run.", "time": "2d ago", "tone": "bg-slate-500"},
            ],
        }

    def get_question_bank(self) -> list[dict]: return list(self._question_bank)
    def get_bank_coverage(self) -> list[dict]: return list(self._bank_coverage)
    def get_admin_questions(self, course_id: Optional[str] = None) -> list[dict]: return list(self._admin_questions)
    def get_already_forked(self) -> list[dict]: return list(self._already_forked)
    def get_asm_library(self) -> list[dict]: return list(self._asm_library)
    def get_governance_waivers(self) -> list[dict]:
        return [{"id": w["id"], "associate": w["associate"], "course": w["eligible_course"], "milestone": w["current_milestone"], "mentor_recommendation": w["mentor_recommendation"] or "Awaiting mentor", "system_reason": w["reason"], "status": "PENDING" if w["status"] == "PENDING_REVIEW" else ("APPROVED" if w["mentor_recommendation"] == "RECOMMEND" else "REJECTED"), "history": w["history"]} for w in self._waivers]
    def get_difficulty_engine(self) -> list[dict]: return list(self._difficulty_engine)
    def get_ledger_audit(self) -> list[dict]: return list(self._ledger_audit)

    def get_tech_readiness_heatmap(self) -> list[dict]: return list(self._tech_readiness_heatmap)

    def get_sponsor_approvals(self) -> list[dict]: return list(self._sponsor_approvals)
    def decide_sponsor_approval(self, approval_id: str, action: str) -> Optional[dict]:
        for app in self._sponsor_approvals:
            if app["id"] == approval_id:
                app["status"] = "APPROVED" if action == "approve" else "REJECTED"
                return app
        return None

    def get_architect_defenses(self, associate_id: Optional[str] = None) -> list[dict]:
        if associate_id:
            return [d for d in self._architect_defenses if d["associate_id"] == associate_id]
        return list(self._architect_defenses)

    def score_architect_defense(self, associate_id: str, milestone_id: str, score: float) -> Optional[dict]:
        for d in self._architect_defenses:
            if d["associate_id"] == associate_id:
                d["score"] = score
                d["status"] = "Scored"
                return d
        return None

    def update_governance(self, area: str, item_id: str, action: str) -> Optional[dict]:
        collections = {"question-bank": self._question_bank, "asm-library": self._asm_library, "difficulty": self._difficulty_engine}
        collection = collections.get(area)
        if collection is None and area == "waivers":
            for waiver in self._waivers:
                if waiver["id"] == item_id:
                    waiver["status"] = "MENTOR_RECOMMENDED" if action == "approve" else "MENTOR_DECLINED" if action == "reject" else waiver["status"]
                    waiver["mentor_recommendation"] = "RECOMMEND" if action == "approve" else "DO_NOT_RECOMMEND" if action == "reject" else waiver["mentor_recommendation"]
                    waiver["history"].append({"label": "Committee decision", "detail": action.replace("-", " ").title(), "date": datetime.now(timezone.utc).date().isoformat()})
                    return {"status": "ok", "id": item_id}
            return None
        if collection is None: return None
        for item in collection:
            if item["id"] == item_id:
                if action == "deactivate": item["status"] = "DEACTIVATED"
                elif action == "activate": item["status"] = "LIVE"
                elif action == "rotate": item["last_rotation"] = datetime.now(timezone.utc).date().isoformat() if "last_rotation" in item else item.get("last_rotation")
                return {"status": "ok", "id": item_id}
        return None

    def get_waivers(self) -> list[dict]:
        return list(self._waivers)

    def review_waiver(self, waiver_id: str, recommendation: str, mentor_id: str) -> Optional[dict]:
        for waiver in self._waivers:
            if waiver["id"] == waiver_id:
                waiver["mentor_recommendation"] = recommendation
                waiver["status"] = "MENTOR_RECOMMENDED" if recommendation == "RECOMMEND" else "MENTOR_DECLINED"
                waiver["history"].append({"label": "Mentor review", "detail": f"{recommendation.replace('_', ' ').title()} by {self.get_user(mentor_id).name if self.get_user(mentor_id) else 'Mentor'}", "date": datetime.now(timezone.utc).date().isoformat()})
                return waiver
        return None

    # ------------------------------------------------------------------
    # Phase 4 — ASM Milestone Journey + Commissioning Path
    # ------------------------------------------------------------------

    def get_asm_details(self) -> list[ASMDetail]:
        return list(self._asm_details)

    def get_asm_detail(self, milestone_id: str) -> Optional[ASMDetail]:
        for m in self._asm_details:
            if m.id == milestone_id:
                return m
        return None

    def get_associate_asm_details(self, associate_id: str) -> list[ASMDetail]:
        states = self._associate_asm_state.get(associate_id, [])
        result: list[ASMDetail] = []
        for state in states:
            base = self.get_asm_detail(state["id"])
            if not base:
                continue
            detail = base.model_copy(deep=True)
            detail.status = ASMMilestoneStatus(state["status"])
            detail.started_at = state.get("started_at")
            detail.completed_at = state.get("completed_at")
            # Attach evidence
            ev_list = self._asm_evidence.get(f"{associate_id}:{state['id']}", [])
            if not ev_list and state.get("evidence"):
                ev_list = [
                    ASMEvidence(
                        id=e["id"],
                        milestone_id=state["id"],
                        associate_id=associate_id,
                        description=e["description"],
                        artifact_url=e["artifact_url"],
                        submitted_at=e["submitted_at"],
                    )
                    for e in state["evidence"]
                ]
            detail.evidence = ev_list
            # Attach review
            review_key = f"{associate_id}:{state['id']}"
            review = self._asm_reviews.get(review_key)
            if not review and state.get("review"):
                r = state["review"]
                review = ASMReview(
                    id=r["id"],
                    milestone_id=state["id"],
                    associate_id=associate_id,
                    mentor_id=r["mentor_id"],
                    mentor_name=r["mentor_name"],
                    decision=r["decision"],
                    comments=r["comments"],
                    reviewed_at=r["reviewed_at"],
                )
            detail.review = review
            result.append(detail)
        return result

    def start_asm_milestone(self, milestone_id: str, associate_id: str) -> Optional[ASMDetail]:
        states = self._associate_asm_state.get(associate_id, [])
        for state in states:
            if state["id"] == milestone_id:
                if state["status"] in ("UPCOMING", "AT_RISK", "BLOCKED"):
                    state["status"] = "CURRENT"
                    state["started_at"] = datetime.now(timezone.utc)
                break
        return self.get_associate_asm_details(associate_id) and self._find_detail(milestone_id, associate_id)

    def _find_detail(self, milestone_id: str, associate_id: str) -> Optional[ASMDetail]:
        for d in self.get_associate_asm_details(associate_id):
            if d.id == milestone_id:
                return d
        return None

    def submit_asm_evidence(
        self,
        milestone_id: str,
        associate_id: str,
        description: str,
        artifact_url: str,
    ) -> Optional[ASMDetail]:
        key = f"{associate_id}:{milestone_id}"
        evidence = ASMEvidence(
            id=f"ev-{uuid.uuid4().hex[:10]}",
            milestone_id=milestone_id,
            associate_id=associate_id,
            description=description,
            artifact_url=artifact_url,
            submitted_at=datetime.now(timezone.utc),
        )
        self._asm_evidence.setdefault(key, []).append(evidence)
        return self._find_detail(milestone_id, associate_id)

    def review_asm_milestone(
        self,
        milestone_id: str,
        associate_id: str,
        mentor_id: str,
        mentor_name: str,
        decision: str,
        comments: str,
    ) -> Optional[ASMDetail]:
        key = f"{associate_id}:{milestone_id}"
        review = ASMReview(
            id=f"rv-{uuid.uuid4().hex[:10]}",
            milestone_id=milestone_id,
            associate_id=associate_id,
            mentor_id=mentor_id,
            mentor_name=mentor_name,
            decision=decision,
            comments=comments,
            reviewed_at=datetime.now(timezone.utc),
        )
        self._asm_reviews[key] = review
        # If approved, mark milestone as completed and award credits
        if decision == "APPROVED":
            states = self._associate_asm_state.get(associate_id, [])
            for state in states:
                if state["id"] == milestone_id:
                    state["status"] = "COMPLETED"
                    state["completed_at"] = datetime.now(timezone.utc)
                    # Award credits
                    detail = self.get_asm_detail(milestone_id)
                    if detail:
                        balance = self.get_credit_balance(associate_id)
                        credit = CreditEntry(
                            id=f"cr-{uuid.uuid4().hex[:10]}",
                            associate_id=associate_id,
                            source=detail.code,
                            description=f"Completed {detail.code} {detail.title}",
                            amount=detail.credits,
                            balance_after=balance + detail.credits,
                            awarded_at=datetime.now(timezone.utc),
                        )
                        self._credits.append(credit)
                    break
        elif decision == "REJECTED":
            states = self._associate_asm_state.get(associate_id, [])
            for state in states:
                if state["id"] == milestone_id:
                    state["status"] = "BLOCKED"
                    break
        elif decision == "REQUEST_CHANGES":
            states = self._associate_asm_state.get(associate_id, [])
            for state in states:
                if state["id"] == milestone_id:
                    state["status"] = "CURRENT"
                    break
        return self._find_detail(milestone_id, associate_id)

    def get_commissioning_path(self, associate_id: str) -> Optional[dict]:
        associate = self.get_associate(associate_id)
        if not associate:
            return None
        details = self.get_associate_asm_details(associate_id)
        pathway = self.get_associate_pathway(associate_id)
        completed_count = sum(1 for d in details if d.status == ASMMilestoneStatus.COMPLETED)
        total = len(details)
        readiness = round(completed_count / total, 2) if total > 0 else 0.0
        commission_ready = completed_count == total
        return {
            "associate_id": associate_id,
            "associate_name": associate.name,
            "pathway_code": associate.pathway_code,
            "pathway_name": pathway.name if pathway else associate.pathway_code,
            "steps": details,
            "commission_ready": commission_ready,
            "readiness": readiness,
            "completed_steps": completed_count,
            "total_steps": total,
        }

    # ------------------------------------------------------------------
    # CRUD Operations: Users, Associates, Courses, Questions & Challenges
    # ------------------------------------------------------------------

    def create_user_and_associate(self, payload: dict) -> dict:
        import uuid
        user_id = f"u-{uuid.uuid4().hex[:6]}"
        initials = payload.get("avatar_initials") or "".join([w[0].upper() for w in payload["name"].split()[:2]])

        new_user = User(
            id=user_id,
            name=payload["name"],
            email=payload["email"],
            role=payload["role"],
            title=payload["title"],
            avatar_initials=initials,
        )
        self._users.append(new_user)

        new_assoc = None
        if payload["role"] == "EARLY_TALENT":
            assoc_id = f"as-{uuid.uuid4().hex[:6]}"
            new_assoc = Associate(
                id=assoc_id,
                user_id=user_id,
                name=payload["name"],
                email=payload["email"],
                title=payload.get("title", "Associate Software Engineer"),
                team_id="team-payments",
                team_name=payload.get("team_name", "Payments Engineering"),
                cohort=payload.get("cohort", "Cohort 2025"),
                standing=payload.get("standing", Standing.ON_TRACK),
                pathway_code=payload.get("pathway_code", "SE"),
                current_month=payload.get("current_month", 1),
                start_date=date.today(),
                mentor_id=payload.get("mentor_id", "u-priya"),
                mentor_name="Priya Nair",
                sponsor_id=payload.get("sponsor_id", "u-sponsor"),
                sponsor_name="Senior Leadership Sponsor",
            )
            self._associates.append(new_assoc)

        return {"user": new_user, "associate": new_assoc}


    def update_user(self, user_id: str, updates: dict) -> Optional[User]:
        for i, u in enumerate(self._users):
            if u.id == user_id:
                data = u.model_dump()
                for k, v in updates.items():
                    if v is not None and k in data:
                        data[k] = v
                updated = User(**data)
                self._users[i] = updated
                return updated
        return None

    def delete_user(self, user_id: str) -> bool:
        initial_len = len(self._users)
        self._users = [u for u in self._users if u.id != user_id]
        self._associates = [a for a in self._associates if a.user_id != user_id]
        return len(self._users) < initial_len

    def create_course(self, payload: dict) -> dict:
        import uuid
        course_id = f"course-{uuid.uuid4().hex[:6]}"
        new_course = Course(
            id=course_id,
            code=payload["code"],
            title=payload["title"],
            track=payload.get("domain", "D1"),
            level=payload.get("tier", "Apprentice"),
            duration_weeks=payload.get("duration_weeks", 4),
            description=payload["description"],
            credits=payload.get("credits", 15),
        )
        self._courses.append(new_course)


        new_curr = CurriculumCourse(
            id=payload["code"].lower().replace(" ", "-"),
            code=payload["code"],
            name=payload["title"],
            domain=payload.get("domain", "D1"),
            difficulty=payload.get("tier", "Core"),
            progress=0.0,
            assessment="Not Started",
            credits=payload.get("credits", 15),
            status="Not Started",
        )
        self._curriculum_courses.append(new_curr)
        return {"course": new_course, "curriculum_course": new_curr}


    def update_course(self, course_id: str, updates: dict) -> Optional[Course]:
        for i, c in enumerate(self._courses):
            if c.id == course_id or c.code == course_id:
                data = c.model_dump()
                for k, v in updates.items():
                    if v is not None and k in data:
                        data[k] = v
                updated = Course(**data)
                self._courses[i] = updated
                return updated
        return None

    def delete_course(self, course_id: str) -> bool:
        init_len = len(self._courses)
        self._courses = [c for c in self._courses if c.id != course_id and c.code != course_id]
        self._curriculum_courses = [c for c in self._curriculum_courses if c.id != course_id and c.code != course_id]
        return len(self._courses) < init_len

    def create_question(self, payload: dict) -> Question:
        q_id = f"q-{uuid.uuid4().hex[:6]}"
        tier_str = payload.get("tier", "Apprentice")
        try:
            tier_enum = Tier(tier_str.title())
        except Exception:
            tier_enum = Tier.APPRENTICE

        raw_options = payload.get("options", [])
        parsed_options: list[QuestionOption] = []
        for i, opt in enumerate(raw_options):
            if isinstance(opt, QuestionOption):
                parsed_options.append(opt)
            elif isinstance(opt, dict):
                parsed_options.append(QuestionOption(id=opt.get("id", chr(65 + i)), text=opt.get("text", "")))
            else:
                parsed_options.append(QuestionOption(id=chr(65 + i), text=str(opt)))

        correct_idx = payload.get("correct_option_index", 0)
        correct_answer = ""
        if 0 <= correct_idx < len(raw_options):
            opt_val = raw_options[correct_idx]
            correct_answer = opt_val if isinstance(opt_val, str) else (opt_val.get("text", "") if isinstance(opt_val, dict) else str(opt_val))
        elif raw_options:
            correct_answer = str(raw_options[0])

        new_q = Question(
            id=q_id,
            course_id=payload.get("course_id", "WF-101"),
            tier=tier_enum,
            question=payload.get("question_text", ""),
            options=parsed_options,
            correct_answer=correct_answer,
            explanation=payload.get("explanation", ""),
            domain=payload.get("domain", "D1"),
        )
        self._questions.append(new_q)
        self._admin_questions.append({
            "id": q_id,
            "number": len(self._admin_questions) + 1,
            "question": payload.get("question_text", ""),
            "correct_answer": correct_answer,
        })
        return new_q

    def delete_question(self, question_id: str) -> bool:
        init_len = len(self._questions)
        self._questions = [q for q in self._questions if q.id != question_id]
        self._admin_questions = [q for q in self._admin_questions if q["id"] != question_id]
        return len(self._questions) < init_len



# Module-level singleton so data persists across requests within a process.
_repo: Optional[Repository] = None


def get_repository() -> Repository:
    global _repo
    if _repo is None:
        _repo = Repository()
    return _repo
