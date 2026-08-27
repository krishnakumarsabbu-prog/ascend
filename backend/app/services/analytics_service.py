from __future__ import annotations

import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from app.models.schemas import (
    ExecutiveAnalyticsData,
    CustomDashboardLayout,
    DashboardWidgetConfig,
)
from app.seed.analytics_and_reports import (
    DEFAULT_EXECUTIVE_KPIS,
    DEFAULT_COHORT_PROGRESS,
    DEFAULT_SKILL_HEALTH_MATRIX,
    DEFAULT_TIME_SERIES_VELOCITY,
    DEFAULT_DASHBOARDS,
)


class AnalyticsService:
    def __init__(self) -> None:
        self._dashboards: Dict[str, CustomDashboardLayout] = {d.id: d for d in DEFAULT_DASHBOARDS}

    def get_executive_analytics(self) -> ExecutiveAnalyticsData:
        return ExecutiveAnalyticsData(
            executive_kpis=DEFAULT_EXECUTIVE_KPIS,
            cohort_progress=DEFAULT_COHORT_PROGRESS,
            skill_health_matrix=DEFAULT_SKILL_HEALTH_MATRIX,
            assessment_integrity_metrics={
                "overall_integrity_score": 97.4,
                "total_adaptive_tests_delivered": 480,
                "cat_stopping_accuracy_met_pct": 98.2,
                "flagged_proctoring_anomalies_pct": 2.1,
                "avg_response_time_seconds": 32.4,
            },
            time_series_velocity=DEFAULT_TIME_SERIES_VELOCITY,
        )

    def get_cohort_analytics(self) -> List[Dict[str, Any]]:
        return DEFAULT_COHORT_PROGRESS

    def get_skill_health_matrix(self) -> List[Dict[str, Any]]:
        return DEFAULT_SKILL_HEALTH_MATRIX

    def get_dashboards(self, role: Optional[str] = None) -> List[CustomDashboardLayout]:
        items = list(self._dashboards.values())
        if role:
            items = [d for d in items if d.role == role]
        return items

    def get_dashboard(self, dashboard_id: str) -> Optional[CustomDashboardLayout]:
        return self._dashboards.get(dashboard_id)

    def save_dashboard(self, dashboard: CustomDashboardLayout) -> CustomDashboardLayout:
        if not dashboard.id:
            dashboard.id = f"dash-{uuid.uuid4().hex[:8]}"
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        dashboard.updated_at = now_str
        self._dashboards[dashboard.id] = dashboard
        return dashboard


# Global singleton
_analytics_service: Optional[AnalyticsService] = None


def get_analytics_service() -> AnalyticsService:
    global _analytics_service
    if _analytics_service is None:
        _analytics_service = AnalyticsService()
    return _analytics_service
