from __future__ import annotations

from typing import Optional

from app.models.schemas import (
    Associate,
    AssociateASMMilestone,
    AssociateAssessment,
    AssociatePathway,
    AssessmentStatus,
    CreditEntry,
    DashboardData,
    MilestoneStatus,
    MonthProgress,
    NextAction,
    ProgressSegment,
    Standing,
)
from app.repositories.repository import Repository


class DashboardService:
    """Computes dashboard and progression data from the repository."""

    def __init__(self, repo: Repository) -> None:
        self.repo = repo

    def build_dashboard(self, associate_id: str) -> Optional[DashboardData]:
        associate = self.repo.get_associate(associate_id)
        if not associate:
            return None

        assessments = self.repo.get_associate_assessments(associate_id)
        asm_milestones = self.repo.get_associate_asm_milestones(associate_id)
        credits = self.repo.get_credits(associate_id)
        pathway = self.repo.get_associate_pathway(associate_id)
        pathway_obj = self.repo.get_pathway_by_code(associate.pathway_code) if associate.pathway_code else None

        assessment_progress = self._assessment_progress(assessments)
        asm_progress = self._asm_progress(asm_milestones)
        overall_progress = self._overall_progress(assessment_progress, asm_progress, associate.current_month)
        credits_earned = self.repo.get_credit_balance(associate_id)
        credits_target = pathway_obj.total_credits if pathway_obj else 120

        next_milestone = self._next_milestone(asm_milestones)
        readiness = self._readiness(assessment_progress, asm_progress, associate.standing)

        progress_segments = self._progress_segments(
            associate, assessments, asm_milestones, credits_earned, credits_target
        )
        next_actions = self._next_actions(associate, assessments, asm_milestones, pathway)
        month_progress = self._month_progress(asm_milestones, associate.current_month)
        recent_credits = sorted(credits, key=lambda c: c.awarded_at, reverse=True)[:5]

        return DashboardData(
            associate=associate,
            current_month=associate.current_month,
            pathway=pathway if pathway else self._fallback_pathway(associate),
            overall_progress=overall_progress,
            assessment_progress=assessment_progress,
            asm_progress=asm_progress,
            credits_earned=credits_earned,
            credits_target=credits_target,
            next_milestone=next_milestone,
            readiness=readiness,
            standing=associate.standing,
            progress_segments=progress_segments,
            next_actions=next_actions,
            month_progress=month_progress,
            recent_credits=recent_credits,
            assessments=assessments,
        )

    def _assessment_progress(self, assessments: list[AssociateAssessment]) -> float:
        if not assessments:
            return 0.0
        completed = sum(1 for a in assessments if a.status == AssessmentStatus.COMPLETED)
        return round(completed / len(assessments), 3)

    def _asm_progress(self, milestones: list[AssociateASMMilestone]) -> float:
        if not milestones:
            return 0.0
        completed = sum(1 for m in milestones if m.status == MilestoneStatus.COMPLETED)
        return round(completed / len(milestones), 3)

    def _overall_progress(self, assessment_progress: float, asm_progress: float, current_month: int) -> float:
        # Weighted: assessments 30%, asm 50%, time 20% over 24 months
        time_progress = min(current_month / 24.0, 1.0)
        return round(assessment_progress * 0.3 + asm_progress * 0.5 + time_progress * 0.2, 3)

    def _next_milestone(self, milestones: list[AssociateASMMilestone]) -> Optional[AssociateASMMilestone]:
        for m in milestones:
            if m.status in (MilestoneStatus.CURRENT, MilestoneStatus.UPCOMING):
                return m
        for m in milestones:
            if m.status == MilestoneStatus.AT_RISK:
                return m
        return None

    def _readiness(self, assessment_progress: float, asm_progress: float, standing: Standing) -> float:
        base = assessment_progress * 0.4 + asm_progress * 0.6
        if standing == Standing.FAST_TRACK:
            base = min(base + 0.05, 1.0)
        elif standing == Standing.AT_RISK:
            base = max(base - 0.1, 0.0)
        elif standing == Standing.BLOCKED:
            base = max(base - 0.2, 0.0)
        return round(base, 3)

    def _progress_segments(
        self,
        associate: Associate,
        assessments: list[AssociateAssessment],
        milestones: list[AssociateASMMilestone],
        credits_earned: int,
        credits_target: int,
    ) -> list[ProgressSegment]:
        foundation_total = 2
        foundation_done = sum(1 for a in assessments if a.status == AssessmentStatus.COMPLETED and "WF" in a.assessment_title)
        assessment_total = len(assessments) if assessments else 1
        assessment_done = sum(1 for a in assessments if a.status == AssessmentStatus.COMPLETED)
        asm_total = len(milestones) if milestones else 1
        asm_done = sum(1 for m in milestones if m.status == MilestoneStatus.COMPLETED)

        return [
            ProgressSegment(label="Foundation", value=foundation_done, target=foundation_total, status="COMPLETED" if foundation_done >= foundation_total else "IN_PROGRESS"),
            ProgressSegment(label="Assessments", value=assessment_done, target=assessment_total, status="IN_PROGRESS"),
            ProgressSegment(label="Pathway", value=associate.current_month, target=24, status="IN_PROGRESS"),
            ProgressSegment(label="ASM", value=asm_done, target=asm_total, status="IN_PROGRESS"),
            ProgressSegment(label="Credits", value=credits_earned, target=credits_target, status="IN_PROGRESS"),
        ]

    def _next_actions(
        self,
        associate: Associate,
        assessments: list[AssociateAssessment],
        milestones: list[AssociateASMMilestone],
        pathway: Optional[AssociatePathway],
    ) -> list[NextAction]:
        actions: list[NextAction] = []

        for a in assessments:
            if a.status == AssessmentStatus.IN_PROGRESS:
                actions.append(NextAction(
                    id=f"act-{a.id}",
                    title=f"Complete {a.assessment_title}",
                    detail="Assessment in progress — finish before the window closes.",
                    due="This week",
                    priority="HIGH",
                    kind="assessment",
                ))
            elif a.status == AssessmentStatus.NOT_STARTED:
                actions.append(NextAction(
                    id=f"act-{a.id}",
                    title=f"Start {a.assessment_title}",
                    detail="Assessment not yet started — schedule a slot.",
                    due="Next 2 weeks",
                    priority="MEDIUM",
                    kind="assessment",
                ))

        for m in milestones:
            if m.status == MilestoneStatus.CURRENT:
                actions.append(NextAction(
                    id=f"act-{m.id}",
                    title=f"Prepare for {m.code}",
                    detail=f"{m.title} — review the milestone brief and prepare the required evidence.",
                    due=f"Week {m.target_week}",
                    priority="HIGH",
                    kind="milestone",
                ))
            elif m.status == MilestoneStatus.AT_RISK:
                actions.append(NextAction(
                    id=f"act-{m.id}",
                    title=f"Address risk on {m.code}",
                    detail=f"{m.title} is at risk — review with mentor.",
                    due=f"Week {m.target_week}",
                    priority="HIGH",
                    kind="milestone",
                ))

        actions.append(NextAction(
            id="act-mentor",
            title="Complete mentor check-in",
            detail=f"Biweekly check-in with {associate.mentor_name or 'mentor'}.",
            due="This week",
            priority="MEDIUM",
            kind="mentor",
        ))

        if pathway:
            actions.append(NextAction(
                id="act-pathway",
                title="Review pathway recommendation",
                detail=f"Confirm focus areas for {pathway.name}.",
                due="Next 2 weeks",
                priority="LOW",
                kind="pathway",
            ))

        return actions[:6]

    def _month_progress(self, milestones: list[AssociateASMMilestone], current_month: int) -> list[MonthProgress]:
        """Build a 24-month progression visualization."""
        months: list[MonthProgress] = []
        # Map milestones to approximate months (target_week / ~4.33)
        milestone_months: dict[int, AssociateASMMilestone] = {}
        for m in milestones:
            m_month = max(1, round(m.target_week / 4.33))
            milestone_months[m_month] = m

        for i in range(1, 25):
            label = f"M{i}"
            status = MilestoneStatus.UPCOMING
            milestone = None
            credits = 0

            if i < current_month:
                status = MilestoneStatus.COMPLETED
            elif i == current_month:
                status = MilestoneStatus.CURRENT

            if i in milestone_months:
                m = milestone_months[i]
                milestone = m.code
                credits = m.credits if m.status == MilestoneStatus.COMPLETED else 0
                if m.status == MilestoneStatus.AT_RISK:
                    status = MilestoneStatus.AT_RISK
                elif m.status == MilestoneStatus.BLOCKED:
                    status = MilestoneStatus.BLOCKED
                elif m.status == MilestoneStatus.COMPLETED and i < current_month:
                    status = MilestoneStatus.COMPLETED
                elif m.status == MilestoneStatus.CURRENT:
                    status = MilestoneStatus.CURRENT

            months.append(MonthProgress(month=i, label=label, status=status, milestone=milestone, credits=credits))

        return months

    def _fallback_pathway(self, associate: Associate) -> AssociatePathway:
        return AssociatePathway(
            pathway_id="p-payments",
            code=associate.pathway_code or "PAY-ENG",
            name="Payments Engineering Pathway",
            status="ACTIVE",
            progress=0.0,
            started_at=__import__("datetime").datetime(2025, 1, 6, tzinfo=__import__("datetime").timezone.utc),
            target_completion=__import__("datetime").date(2027, 1, 6),
        )
