from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from app.models.schemas import (
    ASMDetail,
    ASMMilestoneStatus,
    AssociateASMDetail,
    CommissioningPath,
    CommissioningStep,
)
from app.repositories.repository import Repository


class ASMService:
    """Builds the ASM milestone journey and commissioning path for an associate."""

    def __init__(self, repo: Repository) -> None:
        self.repo = repo

    # -- ASM Library (all milestones) -------------------------------------

    def get_all_asm(self) -> list[ASMDetail]:
        return self.repo.get_asm_details()

    def get_asm(self, milestone_id: str) -> Optional[ASMDetail]:
        return self.repo.get_asm_detail(milestone_id)

    # -- Associate ASM Journey --------------------------------------------

    def get_associate_asm(self, associate_id: str) -> Optional[AssociateASMDetail]:
        associate = self.repo.get_associate(associate_id)
        if not associate:
            return None

        milestones = self.repo.get_associate_asm_details(associate_id)
        credits_earned = self.repo.get_credit_balance(associate_id)
        pathway = self.repo.get_associate_pathway(associate_id)
        credits_target = pathway.total_credits if pathway else 120

        completed = sum(1 for m in milestones if m.status == ASMMilestoneStatus.COMPLETED)
        total = len(milestones)
        overall_progress = round(completed / total, 2) if total > 0 else 0.0

        return AssociateASMDetail(
            associate_id=associate_id,
            associate_name=associate.name,
            milestones=milestones,
            credits_earned=credits_earned,
            credits_target=credits_target,
            current_month=associate.current_month,
            overall_progress=overall_progress,
        )

    # -- Actions -----------------------------------------------------------

    def start_milestone(self, milestone_id: str, associate_id: str) -> Optional[ASMDetail]:
        return self.repo.start_asm_milestone(milestone_id, associate_id)

    def submit_evidence(
        self,
        milestone_id: str,
        associate_id: str,
        description: str,
        artifact_url: str,
    ) -> Optional[ASMDetail]:
        return self.repo.submit_asm_evidence(
            milestone_id, associate_id, description, artifact_url
        )

    def review_milestone(
        self,
        milestone_id: str,
        associate_id: str,
        mentor_id: str,
        mentor_name: str,
        decision: str,
        comments: str,
    ) -> Optional[ASMDetail]:
        return self.repo.review_asm_milestone(
            milestone_id, associate_id, mentor_id, mentor_name, decision, comments
        )

    # -- Commissioning Path ------------------------------------------------

    def get_commissioning(self, associate_id: str) -> Optional[CommissioningPath]:
        data = self.repo.get_commissioning_path(associate_id)
        if not data:
            return None

        steps: list[CommissioningStep] = []
        # Foundation
        steps.append(CommissioningStep(
            id="foundation",
            label="Foundation",
            kind="foundation",
            status="COMPLETED",
        ))
        # Assessment Gate
        steps.append(CommissioningStep(
            id="assessment-gate",
            label="Assessment Gate",
            kind="gate",
            status="COMPLETED",
        ))
        # Pathway
        steps.append(CommissioningStep(
            id="pathway",
            label=data["pathway_name"],
            kind="pathway",
            status="COMPLETED",
        ))
        # ASM milestones
        status_order = {"COMPLETED": 0, "CURRENT": 1, "AT_RISK": 2, "BLOCKED": 3, "WAIVED": 4, "UPCOMING": 5}
        for m in data["steps"]:
            steps.append(CommissioningStep(
                id=m.id,
                label=f"{m.code} — {m.title}",
                kind="asm",
                status=m.status.value if hasattr(m.status, "value") else str(m.status),
                month=m.month,
                milestone_code=m.code,
                credits=m.credits,
            ))
        # Commission Ready
        steps.append(CommissioningStep(
            id="commission-ready",
            label="Commission Ready",
            kind="commission",
            status="COMPLETED" if data["commission_ready"] else "UPCOMING",
        ))

        return CommissioningPath(
            associate_id=associate_id,
            associate_name=data["associate_name"],
            steps=steps,
            commission_ready=data["commission_ready"],
            readiness=data["readiness"],
            completed_steps=data["completed_steps"],
            total_steps=data["total_steps"],
        )
