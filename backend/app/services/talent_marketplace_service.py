from __future__ import annotations

import uuid
from typing import List, Dict, Optional
from datetime import datetime, timezone

from app.models.schemas import (
    MarketplaceProject,
    MarketplaceApplication,
    MarketplaceApplyRequest,
)
from app.seed.marketplace_and_workforce import (
    DEFAULT_MARKETPLACE_PROJECTS,
    DEFAULT_MARKETPLACE_APPLICATIONS,
)


class TalentMarketplaceService:
    def __init__(self) -> None:
        self._projects: Dict[str, MarketplaceProject] = {p.id: p for p in DEFAULT_MARKETPLACE_PROJECTS}
        self._applications: Dict[str, MarketplaceApplication] = {a.id: a for a in DEFAULT_MARKETPLACE_APPLICATIONS}

    def get_projects(self) -> List[MarketplaceProject]:
        return list(self._projects.values())

    def get_project(self, project_id: str) -> Optional[MarketplaceProject]:
        return self._projects.get(project_id)

    def calculate_match_score(self, project_id: str, associate_id: str) -> Dict[str, Any]:
        proj = self._projects.get(project_id)
        if not proj:
            return {"match_score": 50.0, "match_breakdown": {}}

        # Match factor simulation based on associate profile & stack overlap
        if associate_id == "as-ananya":
            if "Kafka" in proj.technical_stack or "Java 21" in proj.technical_stack:
                score = 94.5
            else:
                score = 78.0
        elif associate_id == "as-rohan":
            if "Python" in proj.technical_stack or "FastAPI" in proj.technical_stack or "Bedrock" in str(proj.technical_stack):
                score = 91.0
            else:
                score = 72.5
        else:
            score = 82.0

        breakdown = {
            "Skill Overlap (40%)": round(score * 0.40, 1),
            "Pathway Alignment (20%)": round(score * 0.20, 1),
            "Capacity & Allocation (15%)": round(score * 0.15, 1),
            "Readiness Rating (15%)": round(score * 0.15, 1),
            "Growth Opportunity (10%)": round(score * 0.10, 1),
        }

        return {
            "match_score": score,
            "match_breakdown": breakdown,
        }

    def get_applications(
        self, associate_id: Optional[str] = None, project_id: Optional[str] = None
    ) -> List[MarketplaceApplication]:
        apps = list(self._applications.values())
        if associate_id:
            apps = [a for a in apps if a.associate_id == associate_id]
        if project_id:
            apps = [a for a in apps if a.project_id == project_id]
        return apps

    def apply_for_project(self, req: MarketplaceApplyRequest) -> MarketplaceApplication:
        proj = self._projects.get(req.project_id)
        if not proj:
            raise ValueError(f"Project {req.project_id} not found")

        match_info = self.calculate_match_score(req.project_id, req.associate_id)
        app_id = f"app-{uuid.uuid4().hex[:6]}"
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")

        candidate_name = "Ananya Rao" if req.associate_id == "as-ananya" else "Rohan Mehta" if req.associate_id == "as-rohan" else "Associate"
        pathway = "Software Engineering (SE)" if req.associate_id == "as-ananya" else "AI Engineering (AIE)"

        new_app = MarketplaceApplication(
            id=app_id,
            project_id=proj.id,
            project_title=proj.title,
            associate_id=req.associate_id,
            associate_name=candidate_name,
            pathway=pathway,
            match_score=match_info["match_score"],
            match_breakdown=match_info["match_breakdown"],
            candidate_pitch=req.candidate_pitch or f"Enthusiastic to contribute to {proj.title} leveraging my verified competency skills.",
            status="APPLIED",
            applied_at=now_str,
        )

        self._applications[new_app.id] = new_app
        return new_app

    def update_application_status(self, application_id: str, status: str) -> MarketplaceApplication:
        app = self._applications.get(application_id)
        if not app:
            raise ValueError(f"Application {application_id} not found")
        app.status = status
        return app


# Global singleton
_talent_marketplace_service: Optional[TalentMarketplaceService] = None


def get_talent_marketplace_service() -> TalentMarketplaceService:
    global _talent_marketplace_service
    if _talent_marketplace_service is None:
        _talent_marketplace_service = TalentMarketplaceService()
    return _talent_marketplace_service
