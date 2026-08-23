from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.repositories.repository import get_repository
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/api", tags=["ascend"])


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
