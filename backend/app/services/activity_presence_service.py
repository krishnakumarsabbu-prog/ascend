from __future__ import annotations

from typing import List, Dict, Optional, Any
from app.models.schemas import ActivityStreamEvent, PresenceSession, GlobalSearchResult
from app.seed.integrations_and_stream import DEFAULT_ACTIVITY_STREAM, DEFAULT_PRESENCE_SESSIONS


class ActivityPresenceService:
    def __init__(self) -> None:
        self._stream: List[ActivityStreamEvent] = list(DEFAULT_ACTIVITY_STREAM)
        self._presence: List[PresenceSession] = list(DEFAULT_PRESENCE_SESSIONS)

    def get_stream(self, limit: int = 20) -> List[ActivityStreamEvent]:
        return self._stream[:limit]

    def get_presence(self) -> List[PresenceSession]:
        return self._presence

    def search_global(self, query: str) -> List[GlobalSearchResult]:
        q = query.lower().strip()
        if not q:
            return [
                GlobalSearchResult(id="res-1", title="My Skills Profile", subtitle="Competency progression & evidence ledger", category="PAGE", url="/my-skills", badge="REQ 1"),
                GlobalSearchResult(id="res-2", title="Adaptive IRT Assessment", subtitle="2PL Computerized Adaptive Testing engine", category="PAGE", url="/adaptive-assessment", badge="REQ 16"),
                GlobalSearchResult(id="res-3", title="Talent Marketplace Gigs", subtitle="Internal gig board & matching engine", category="PAGE", url="/talent-marketplace", badge="REQ 22"),
                GlobalSearchResult(id="res-4", title="Executive Analytics", subtitle="4-pillar executive metrics & throughput", category="PAGE", url="/analytics", badge="REQ 24"),
                GlobalSearchResult(id="res-5", title="Audit Center & Hash Chain", subtitle="Cryptographic tamper-evident trail", category="PAGE", url="/admin/audit-center", badge="REQ 28"),
            ]

        results: List[GlobalSearchResult] = []

        # 1. Search Associates
        associates = [
            ("Ananya Rao", "Early Talent • Backend Distributed Systems", "/my-skills", "ASSOCIATE"),
            ("Rohan Mehta", "Early Talent • Cloud Infrastructure", "/my-skills", "ASSOCIATE"),
            ("Priya Nair", "Committee Lead • Systems Architecture", "/committee", "EXECUTIVE"),
            ("Vikram Desai", "Technology Head • Core Engineering", "/techhead", "EXECUTIVE"),
        ]
        for name, sub, url, cat in associates:
            if q in name.lower() or q in sub.lower():
                results.append(GlobalSearchResult(id=f"assoc-{name}", title=name, subtitle=sub, category=cat, url=url))

        # 2. Search Skills
        skills = [
            ("Kafka Partitioning", "Software Engineering • Advanced Streaming", "/my-skills", "SKILL"),
            ("pgvector RAG Pipelines", "AI Engineering • Embeddings & Vector Search", "/my-skills", "SKILL"),
            ("Kubernetes Ingress & Mesh", "Cloud & Infrastructure", "/my-skills", "SKILL"),
            ("Two-Phase Commit & Sagas", "Architecture & Defense", "/my-skills", "SKILL"),
        ]
        for title, sub, url, cat in skills:
            if q in title.lower() or q in sub.lower():
                results.append(GlobalSearchResult(id=f"sk-{title}", title=title, subtitle=sub, category=cat, url=url))

        # 3. Search Pages & Studios
        pages = [
            ("Adaptive CAT Assessment", "Computerized Adaptive Testing Room", "/adaptive-assessment", "PAGE"),
            ("ASM Project Lifecycle", "8-Stage Milestone & Artifact Defense Panel", "/asm-lifecycle", "PAGE"),
            ("Talent Marketplace", "Open Production Engineering Gigs", "/talent-marketplace", "PAGE"),
            ("Workforce Planning Simulator", "Strategic Headcount & What-If Capacity", "/workforce-planning", "PAGE"),
            ("Executive Analytics", "Operational Throughput & KPIs", "/analytics", "PAGE"),
            ("Custom Dashboard Builder", "Modular Widget Grid Studio", "/admin/dashboard-builder", "PAGE"),
            ("Scheduled Reports & Export", "Multi-format PDF/Excel generator", "/reports", "PAGE"),
            ("Metric Lineage DAG", "Calculation Provenance & LaTeX formulas", "/admin/metric-lineage", "PAGE"),
            ("Audit Center & Hash Chain", "Cryptographic compliance logs", "/admin/audit-center", "PAGE"),
            ("Curriculum Version Control", "SemVer branching studio", "/admin/curriculum-versions", "PAGE"),
            ("Enterprise Integrations", "LMS (xAPI) & HRIS (Workday) Connectors", "/admin/integrations", "PAGE"),
        ]
        for title, sub, url, cat in pages:
            if q in title.lower() or q in sub.lower():
                results.append(GlobalSearchResult(id=f"pg-{title}", title=title, subtitle=sub, category=cat, url=url))

        return results


# Global singleton
_activity_presence_service: Optional[ActivityPresenceService] = None


def get_activity_presence_service() -> ActivityPresenceService:
    global _activity_presence_service
    if _activity_presence_service is None:
        _activity_presence_service = ActivityPresenceService()
    return _activity_presence_service
