from __future__ import annotations

from datetime import datetime, timezone
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
    Tier,
    TierPerformance,
    Pathway,
    Role,
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
            "as-ananya": [{"id": "note-ananya-1", "author": "Karthik Iyer", "text": "Strong momentum on delivery. Use the next check-in to unblock the database milestone.", "created_at": "2025-08-15"}],
            "as-rohan": [{"id": "note-rohan-1", "author": "Vikram Desai", "text": "Needs a tighter weekly rhythm around the assessment backlog.", "created_at": "2025-08-13"}],
        }
        self._waivers: list[dict] = [
            {"id": "waiver-1", "associate_id": "as-ananya", "associate": "Ananya Rao", "current_milestone": "ASM-101 · Foundation Build", "eligible_course": "DATA-201 · Distributed Data Systems", "system_recommendation": "Recommend review", "reason": "ASM-101 was cleared with strong evidence and an 88% WF-101 assessment score.", "mentor_recommendation": None, "status": "PENDING_REVIEW", "history": [{"label": "System suggestion", "detail": "Eligible after ASM-101 clearance", "date": "2025-03-01"}]},
            {"id": "waiver-2", "associate_id": "as-rohan", "associate": "Rohan Mehta", "current_milestone": "ASM-101 · Foundation Build", "eligible_course": "WF-102 · Production Systems", "system_recommendation": "Recommend review", "reason": "ASM-101 was approved. A waiver review can accelerate the foundation tier while preserving mentor oversight.", "mentor_recommendation": None, "status": "PENDING_REVIEW", "history": [{"label": "System suggestion", "detail": "Eligible after ASM-101 clearance", "date": "2025-03-10"}]},
        ]
        self._question_bank = [
            {"id": "qb-wf101-basic", "course": "WF-101 Engineering Foundations", "tier": "Basic", "question_count": 48, "coverage": 96, "pass_rate": 91, "last_rotation": "18 Aug 2025", "live_sample_status": "LIVE", "status": "LIVE"},
            {"id": "qb-wf102-novice", "course": "WF-102 Production Systems", "tier": "Novice", "question_count": 42, "coverage": 88, "pass_rate": 84, "last_rotation": "12 Aug 2025", "live_sample_status": "LIVE", "status": "LIVE"},
            {"id": "qb-pay201-apprentice", "course": "PAY-201 Payments Domain", "tier": "Apprentice", "question_count": 36, "coverage": 79, "pass_rate": 76, "last_rotation": "02 Aug 2025", "live_sample_status": "LIVE", "status": "LIVE"},
            {"id": "qb-data201-expert", "course": "DATA-201 Distributed Data", "tier": "Expert", "question_count": 28, "coverage": 72, "pass_rate": 68, "last_rotation": "21 Jul 2025", "live_sample_status": "DRAFT", "status": "DRAFT"},
            {"id": "qb-arch301-master", "course": "ARCH-301 System Architecture", "tier": "Master", "question_count": 18, "coverage": 93, "pass_rate": 61, "last_rotation": "28 Jul 2025", "live_sample_status": "LIVE", "status": "LIVE"},
        ]
        self._asm_library = [
            {"id": "asm-lib-101", "code": "ASM-101", "milestone": "Foundation Build", "month": 2, "wf_course": "WF-101", "rubric_focus": "Testing, CI, operational baseline", "credits": 12, "status": "LIVE"},
            {"id": "asm-lib-102", "code": "ASM-102", "milestone": "Integration Milestone", "month": 4, "wf_course": "WF-102", "rubric_focus": "Contracts, integration, observability", "credits": 12, "status": "LIVE"},
            {"id": "asm-lib-201", "code": "ASM-201", "milestone": "Domain Deep Build", "month": 10, "wf_course": "PAY-201 / DATA-201", "rubric_focus": "Domain depth, performance, reliability", "credits": 24, "status": "LIVE"},
            {"id": "asm-lib-202", "code": "ASM-202", "milestone": "Operational Ownership", "month": 13, "wf_course": "WF-102", "rubric_focus": "SLOs, on-call, incident command", "credits": 18, "status": "DRAFT"},
            {"id": "asm-lib-301", "code": "ASM-301", "milestone": "Architect Board Certification", "month": 22, "wf_course": "ARCH-301", "rubric_focus": "Trade-offs, architecture defense", "credits": 30, "status": "LIVE"},
        ]
        self._difficulty_engine = [
            {"id": "diff-wf101", "course": "WF-101 Engineering Foundations", "tier": "Basic", "average_score": 86, "pass_rate": 91, "difficulty": "Too Easy", "calibration": 2},
            {"id": "diff-wf102", "course": "WF-102 Production Systems", "tier": "Novice", "average_score": 79, "pass_rate": 84, "difficulty": "Balanced", "calibration": 0},
            {"id": "diff-pay201", "course": "PAY-201 Payments Domain", "tier": "Apprentice", "average_score": 74, "pass_rate": 76, "difficulty": "Balanced", "calibration": -1},
            {"id": "diff-data201", "course": "DATA-201 Distributed Data", "tier": "Expert", "average_score": 68, "pass_rate": 68, "difficulty": "Too Difficult", "calibration": -3},
            {"id": "diff-arch301", "course": "ARCH-301 System Architecture", "tier": "Master", "average_score": 65, "pass_rate": 61, "difficulty": "Too Difficult", "calibration": -2},
        ]
        self._ledger_audit = [
            {"id": "ledger-001", "associate": "Ananya Rao", "date": "2025-08-15", "domain": "Data", "instrument": "ASM-101", "level": "Foundation", "credits": 12, "source": "Milestone completion", "status": "APPROVED"},
            {"id": "ledger-002", "associate": "Rohan Mehta", "date": "2025-08-12", "domain": "Software", "instrument": "WF-101", "level": "Basic", "credits": 6, "source": "Assessment pass", "status": "APPROVED"},
            {"id": "ledger-003", "associate": "Ananya Rao", "date": "2025-08-08", "domain": "Security", "instrument": "SEC-201", "level": "Apprentice", "credits": 6, "source": "Assessment pass", "status": "APPROVED"},
            {"id": "ledger-004", "associate": "Rohan Mehta", "date": "2025-07-29", "domain": "Software", "instrument": "Mentor Check-in", "level": "Program", "credits": 2, "source": "Quarterly review", "status": "APPROVED"},
            {"id": "ledger-005", "associate": "Ananya Rao", "date": "2025-07-18", "domain": "Data", "instrument": "PAY-201", "level": "Apprentice", "credits": 12, "source": "Course completion", "status": "PENDING"},
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
        result = []
        for associate in self.get_associates_by_mentor(mentor_id):
            assessments = self.get_associate_assessments(associate.id)
            completed = [a.score for a in assessments if a.score is not None]
            milestones = self.get_associate_asm_details(associate.id)
            result.append({
                "id": associate.id, "name": associate.name, "title": associate.title, "email": associate.email,
                "pathway": associate.pathway_code, "pathway_name": self.get_pathway_by_code(associate.pathway_code).name if self.get_pathway_by_code(associate.pathway_code) else associate.pathway_code,
                "current_month": associate.current_month, "readiness": round(self._mentor_readiness(associate.id) * 100),
                "assessment_score": round(sum(completed) / len(completed)) if completed else 0,
                "asm_progress": round(sum(1 for m in milestones if m.status.value == "COMPLETED") / len(milestones) * 100) if milestones else 0,
                "pending_requests": sum(1 for w in self._waivers if w["associate_id"] == associate.id and w["status"] == "PENDING_REVIEW"),
                "risk": "AT_RISK" if associate.standing in (Standing.AT_RISK, Standing.BLOCKED) or any(m.status.value == "AT_RISK" for m in milestones) else ("NEEDS_ATTENTION" if any(a.status.value == "IN_PROGRESS" for a in assessments) else "ON_TRACK"),
            })
        return result

    def _mentor_readiness(self, associate_id: str) -> float:
        assessments = self.get_associate_assessments(associate_id)
        completed = [a.score for a in assessments if a.score is not None]
        assessment_score = (sum(completed) / len(completed) / 100) if completed else 0
        milestones = self.get_associate_asm_details(associate_id)
        asm_score = sum(1 for m in milestones if m.status.value == "COMPLETED") / len(milestones) if milestones else 0
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
                {"title": "Waiver entered review", "detail": "Ananya Rao · DATA-201 acceleration request is awaiting decision.", "time": "5h ago", "tone": "bg-amber-500"},
                {"title": "ASM standard updated", "detail": "ASM-202 rubric now includes incident command evidence.", "time": "Yesterday", "tone": "bg-blue-500"},
                {"title": "Ledger reconciliation passed", "detail": "All credit entries matched their source instruments for the latest run.", "time": "2d ago", "tone": "bg-slate-500"},
            ],
        }

    def get_question_bank(self) -> list[dict]: return list(self._question_bank)
    def get_asm_library(self) -> list[dict]: return list(self._asm_library)
    def get_governance_waivers(self) -> list[dict]:
        return [{"id": w["id"], "associate": w["associate"], "course": w["eligible_course"], "milestone": w["current_milestone"], "mentor_recommendation": w["mentor_recommendation"] or "Awaiting mentor", "system_reason": w["reason"], "status": "PENDING" if w["status"] == "PENDING_REVIEW" else ("APPROVED" if w["mentor_recommendation"] == "RECOMMEND" else "REJECTED"), "history": w["history"]} for w in self._waivers]
    def get_difficulty_engine(self) -> list[dict]: return list(self._difficulty_engine)
    def get_ledger_audit(self) -> list[dict]: return list(self._ledger_audit)

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


# Module-level singleton so data persists across requests within a process.
_repo: Optional[Repository] = None


def get_repository() -> Repository:
    global _repo
    if _repo is None:
        _repo = Repository()
    return _repo
