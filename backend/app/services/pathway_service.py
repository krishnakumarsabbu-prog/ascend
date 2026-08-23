from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from app.models.schemas import (
    AssessmentPerformance,
    Associate,
    CommitteeDecision,
    MentorReview,
    PathwayHistoryEntry,
    PathwayInfo,
    PathwayRecommendation,
    PathwayScore,
    Reconciliation,
    SkillContribution,
)
from app.repositories.repository import Repository


# ---------------------------------------------------------------------------
# Configurable domain-to-pathway weight matrix.
#
# Each row is a curriculum/assessment domain. Each column is a pathway code.
# The value is the weight that domain performance contributes to that pathway.
# Weights are configurable — change these numbers to retune the engine.
# ---------------------------------------------------------------------------

DOMAIN_WEIGHTS: dict[str, dict[str, float]] = {
    "Foundation": {"DE": 0.7, "SE": 0.8, "CSE": 0.6, "IE": 0.7},
    "Engineering": {"DE": 0.9, "SE": 1.0, "CSE": 0.5, "IE": 0.85},
    "AI": {"DE": 0.85, "SE": 0.7, "CSE": 0.5, "IE": 0.6},
    "Security": {"DE": 0.5, "SE": 0.6, "CSE": 1.0, "IE": 0.7},
    "Infrastructure": {"DE": 0.75, "SE": 0.65, "CSE": 0.6, "IE": 1.0},
    "Data": {"DE": 1.0, "SE": 0.6, "CSE": 0.4, "IE": 0.65},
}

# Global scaling factors per domain — how much each domain matters overall.
DOMAIN_SCALE: dict[str, float] = {
    "Foundation": 1.0,
    "Engineering": 1.2,
    "AI": 0.9,
    "Security": 1.0,
    "Infrastructure": 1.0,
    "Data": 1.1,
}

PATHWAY_CODES = ["DE", "SE", "CSE", "IE"]


class PathwayService:
    """Computes transparent weighted pathway recommendations from assessment results."""

    def __init__(self, repo: Repository) -> None:
        self.repo = repo

    # -- Pathways -----------------------------------------------------------

    def get_pathways(self) -> list[PathwayInfo]:
        return [
            PathwayInfo(
                id=p.id, code=p.code, name=p.name, description=p.description,
                focus=p.focus, duration_months=p.duration_months, total_credits=p.total_credits,
            )
            for p in self.repo.get_pathways()
        ]

    # -- Recommendation -----------------------------------------------------

    def get_recommendation(self, associate_id: str) -> Optional[PathwayRecommendation]:
        associate = self.repo.get_associate(associate_id)
        if not associate:
            return None

        assessments = self.repo.get_associate_assessments(associate_id)

        # Build assessment performance entries
        perf: list[AssessmentPerformance] = []
        for a in assessments:
            course = self.repo.get_course(a.assessment_id.replace("a-", "c-")) if a.assessment_id.startswith("a-") else None
            domain = course.track if course else self._infer_domain(a.assessment_title)
            perf.append(AssessmentPerformance(
                assessment_id=a.assessment_id,
                assessment_title=a.assessment_title,
                status=a.status.value if hasattr(a.status, "value") else str(a.status),
                score=a.score,
                domain=domain,
            ))

        # Aggregate domain scores (0-100)
        domain_scores: dict[str, float] = {}
        domain_counts: dict[str, int] = {}
        for p in perf:
            if p.score is not None:
                domain_scores[p.domain] = domain_scores.get(p.domain, 0) + p.score
                domain_counts[p.domain] = domain_counts.get(p.domain, 0) + 1

        domain_avg: dict[str, float] = {}
        for d, total in domain_scores.items():
            cnt = domain_counts[d]
            domain_avg[d] = round(total / cnt, 1) if cnt > 0 else 0

        # If no assessment data, use a synthetic baseline so the engine still produces output
        if not domain_avg:
            domain_avg = {"Foundation": 50.0, "Engineering": 50.0, "Security": 50.0, "Data": 50.0}

        # Compute weighted score per pathway
        pathway_scores: list[PathwayScore] = []
        raw_totals: dict[str, float] = {}

        for code in PATHWAY_CODES:
            total_weighted = 0.0
            total_weight = 0.0
            contributing: list[SkillContribution] = []

            for domain, avg_score in domain_avg.items():
                weight = DOMAIN_WEIGHTS.get(domain, {}).get(code, 0.0)
                scale = DOMAIN_SCALE.get(domain, 1.0)
                effective_weight = weight * scale
                contribution = avg_score * effective_weight
                total_weighted += contribution
                total_weight += effective_weight
                contributing.append(SkillContribution(
                    skill=domain,
                    domain=domain,
                    percentage=avg_score,
                    weight=weight,
                    contribution=round(contribution, 2),
                ))

            raw_score = total_weighted
            raw_totals[code] = raw_score
            # Normalize to 0-100 scale
            normalized = round((raw_score / total_weight) if total_weight > 0 else 0, 1)
            pathway_scores.append(PathwayScore(
                pathway_code=code,
                pathway_name=self._pathway_name(code),
                score=round(raw_score, 1),
                normalized_score=normalized,
                confidence=0.0,  # computed after ranking
                rank=0,
                contributing_skills=sorted(contributing, key=lambda c: c.contribution, reverse=True),
            ))

        # Rank by normalized score descending
        pathway_scores.sort(key=lambda p: p.normalized_score, reverse=True)
        max_score = pathway_scores[0].normalized_score if pathway_scores else 0
        min_score = pathway_scores[-1].normalized_score if pathway_scores else 0
        spread = max_score - min_score

        for i, ps in enumerate(pathway_scores):
            ps.rank = i + 1
            # Confidence: top pathway gets higher confidence when spread is larger
            if i == 0:
                ps.confidence = round(0.5 + min(spread / 200, 0.45), 2)
            else:
                drop = max_score - ps.normalized_score
                ps.confidence = round(max(0.3, 0.7 - drop / 100), 2)

        system_rec = pathway_scores[0] if pathway_scores else None

        return PathwayRecommendation(
            associate_id=associate_id,
            associate_name=associate.name,
            assessment_performance=perf,
            ranked_pathways=pathway_scores,
            system_recommendation=system_rec,
            weights={"domain_weights": DOMAIN_WEIGHTS, "domain_scale": DOMAIN_SCALE},
            generated_at=datetime.now(timezone.utc),
        )

    # -- Reconciliation -----------------------------------------------------

    def reconcile(
        self,
        system_recommendation: str,
        mentor_recommendation: Optional[str],
    ) -> Reconciliation:
        if not mentor_recommendation:
            return Reconciliation(
                system_recommendation=system_recommendation,
                mentor_recommendation=None,
                alignment="PENDING",
                reason="Mentor review has not been submitted yet.",
            )

        if system_recommendation == mentor_recommendation:
            alignment = "ALIGNED"
            reason = "The algorithmic recommendation and mentor recommendation match."
        elif self._pathway_family(system_recommendation) == self._pathway_family(mentor_recommendation):
            alignment = "PARTIALLY_ALIGNED"
            reason = "Recommendations differ but fall within a related engineering family."
        else:
            alignment = "DIVERGENT"
            reason = "The algorithmic and mentor recommendations diverge significantly. Human review is required."

        return Reconciliation(
            system_recommendation=system_recommendation,
            mentor_recommendation=mentor_recommendation,
            alignment=alignment,
            reason=reason,
        )

    # -- Mentor Review ------------------------------------------------------

    def save_mentor_review(self, review: MentorReview) -> MentorReview:
        self.repo.save_mentor_review(review)
        return review

    def get_mentor_review(self, associate_id: str) -> Optional[MentorReview]:
        return self.repo.get_mentor_review(associate_id)

    # -- Committee Decision -------------------------------------------------

    def save_committee_decision(self, decision: CommitteeDecision) -> CommitteeDecision:
        self.repo.save_committee_decision(decision)
        return decision

    def get_history(self, associate_id: str) -> list[PathwayHistoryEntry]:
        return self.repo.get_pathway_history(associate_id)

    # -- Helpers ------------------------------------------------------------

    def _pathway_name(self, code: str) -> str:
        names = {"DE": "Data Engineering", "SE": "Software Engineering", "CSE": "Cyber Security Engineering", "IE": "Infrastructure Engineering"}
        return names.get(code, code)

    def _pathway_family(self, code: str) -> str:
        # Group pathways into families for partial-alignment logic
        families = {"DE": "data", "SE": "software", "CSE": "security", "IE": "infra"}
        return families.get(code, code)

    def _infer_domain(self, title: str) -> str:
        t = title.lower()
        if "sec" in t or "security" in t:
            return "Security"
        if "data" in t:
            return "Data"
        if "arch" in t or "system" in t:
            return "Engineering"
        if "wf" in t or "foundation" in t:
            return "Foundation"
        return "Engineering"
