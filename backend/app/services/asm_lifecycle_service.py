from __future__ import annotations

from typing import List, Dict, Optional
from datetime import datetime, timezone

from app.models.schemas import ASMProjectLifecycle, ASMPanelMember
from app.seed.credentials_and_asm import DEFAULT_ASM_PROJECTS


class ASMLifecycleService:
    def __init__(self) -> None:
        self._projects: Dict[str, ASMProjectLifecycle] = {p.id: p for p in DEFAULT_ASM_PROJECTS}

    def get_projects(
        self, associate_id: Optional[str] = None, stage: Optional[str] = None
    ) -> List[ASMProjectLifecycle]:
        items = list(self._projects.values())
        if associate_id:
            items = [p for p in items if p.associate_id == associate_id]
        if stage:
            items = [p for p in items if p.current_stage == stage]
        return items

    def get_project(self, project_id: str) -> Optional[ASMProjectLifecycle]:
        return self._projects.get(project_id)

    def submit_panel_score(self, project_id: str, member: ASMPanelMember) -> ASMProjectLifecycle:
        proj = self._projects.get(project_id)
        if not proj:
            raise ValueError(f"ASM Project {project_id} not found")

        member.signed_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
        
        # Calculate overall score for member from weighted rubric
        if member.rubric_scores:
            member.overall_score = round(
                sum(r.score * r.weight for r in member.rubric_scores), 2
            )

        # Replace or add member in panel
        proj.panel_examiners = [m for m in proj.panel_examiners if m.examiner_id != member.examiner_id]
        proj.panel_examiners.append(member)

        # Compute composite score
        if proj.panel_examiners:
            proj.composite_score = round(
                sum(m.overall_score for m in proj.panel_examiners) / len(proj.panel_examiners), 2
            )

        if proj.composite_score >= 3.5:
            proj.status = "DEFENDED"
            proj.current_stage = "PRODUCTION_GATE"

        self._projects[proj.id] = proj
        return proj

    def advance_stage(self, project_id: str, target_stage: str) -> ASMProjectLifecycle:
        proj = self._projects.get(project_id)
        if not proj:
            raise ValueError(f"ASM Project {project_id} not found")
        proj.current_stage = target_stage
        return proj


# Global singleton
_asm_lifecycle_service: Optional[ASMLifecycleService] = None


def get_asm_lifecycle_service() -> ASMLifecycleService:
    global _asm_lifecycle_service
    if _asm_lifecycle_service is None:
        _asm_lifecycle_service = ASMLifecycleService()
    return _asm_lifecycle_service
