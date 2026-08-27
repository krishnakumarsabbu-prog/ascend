from __future__ import annotations

from typing import List, Dict, Any
from app.models.schemas import (
    AnalyticsKPI,
    ExecutiveAnalyticsData,
    CustomDashboardLayout,
    DashboardWidgetConfig,
    ScheduledReport,
)

# ---------------------------------------------------------------------------
# Seed Executive Analytics Dataset (Requirement 24)
# ---------------------------------------------------------------------------

DEFAULT_EXECUTIVE_KPIS: List[AnalyticsKPI] = [
    AnalyticsKPI(
        metric_key="TOTAL_ACTIVE_TALENT",
        label="Total Active Engineers",
        value=142.0,
        formatted_value="142",
        unit="Engineers",
        change_pct_30d=12.5,
        trend_direction="UP",
        category="EXECUTIVE",
    ),
    AnalyticsKPI(
        metric_key="OVERALL_READINESS_SCORE",
        label="Cohort Production Readiness",
        value=84.5,
        formatted_value="84.5%",
        unit="Percent",
        change_pct_30d=4.2,
        trend_direction="UP",
        category="EXECUTIVE",
    ),
    AnalyticsKPI(
        metric_key="AVERAGE_MILESTONE_VELOCITY",
        label="Milestone Completion Velocity",
        value=1.34,
        formatted_value="1.34x",
        unit="Speed Index",
        change_pct_30d=8.0,
        trend_direction="UP",
        category="COHORT",
    ),
    AnalyticsKPI(
        metric_key="TIME_TO_PRODUCTIVITY_REDUCTION",
        label="Time to Productivity Cut",
        value=42.0,
        formatted_value="42%",
        unit="Reduction",
        change_pct_30d=6.5,
        trend_direction="UP",
        category="EXECUTIVE",
    ),
    AnalyticsKPI(
        metric_key="ASSESSMENT_INTEGRITY_INDEX",
        label="Overall Integrity Index",
        value=97.4,
        formatted_value="97.4 / 100",
        unit="Integrity Score",
        change_pct_30d=0.8,
        trend_direction="STABLE",
        category="INTEGRITY",
    ),
    AnalyticsKPI(
        metric_key="COST_PER_READY_ENGINEER",
        label="Cost Per Ready Engineer",
        value=12400.0,
        formatted_value="$12.4K",
        unit="USD",
        change_pct_30d=-14.2,
        trend_direction="DOWN",  # Cost reduction is positive
        category="EXECUTIVE",
    ),
]

DEFAULT_COHORT_PROGRESS: List[Dict[str, Any]] = [
    {"cohort_name": "Cohort 2026-A (Spring)", "enrolled": 48, "readiness_avg": 88.5, "passed_gates": 46, "at_risk": 2, "commissioned_pct": 72},
    {"cohort_name": "Cohort 2026-B (Summer)", "enrolled": 52, "readiness_avg": 82.0, "passed_gates": 48, "at_risk": 4, "commissioned_pct": 35},
    {"cohort_name": "Cohort 2025-C (Winter)", "enrolled": 42, "readiness_avg": 94.2, "passed_gates": 42, "at_risk": 0, "commissioned_pct": 100},
]

DEFAULT_SKILL_HEALTH_MATRIX: List[Dict[str, Any]] = [
    {"domain": "Software Engineering", "health_score": 89.5, "top_skill": "Kafka Partitioning", "critical_gap": "Deadlock Profiling", "l4_masters": 18},
    {"domain": "AI Engineering", "health_score": 82.0, "top_skill": "pgvector RAG Pipelines", "critical_gap": "Model Quantization", "l4_masters": 9},
    {"domain": "Cloud & Infrastructure", "health_score": 79.4, "top_skill": "Kubernetes Ingress", "critical_gap": "Zero-Trust mTLS Mesh", "l4_masters": 11},
    {"domain": "Architecture & Defense", "health_score": 74.8, "top_skill": "Saga Orchestration", "critical_gap": "Split-Brain Resolution", "l4_masters": 6},
    {"domain": "Data Engineering", "health_score": 85.0, "top_skill": "Spark Streaming", "critical_gap": "Iceberg Schema Evolution", "l4_masters": 14},
]

DEFAULT_TIME_SERIES_VELOCITY: List[Dict[str, Any]] = [
    {"day": "Day 30", "se_velocity": 1.10, "ai_velocity": 1.05, "avg_readiness": 68.0},
    {"day": "Day 60", "se_velocity": 1.22, "ai_velocity": 1.18, "avg_readiness": 74.5},
    {"day": "Day 90", "se_velocity": 1.30, "ai_velocity": 1.25, "avg_readiness": 79.0},
    {"day": "Day 120", "se_velocity": 1.38, "ai_velocity": 1.32, "avg_readiness": 84.5},
]


# ---------------------------------------------------------------------------
# Seed Custom Dashboard Layouts (Requirement 25)
# ---------------------------------------------------------------------------

DEFAULT_DASHBOARDS: List[CustomDashboardLayout] = [
    CustomDashboardLayout(
        id="dash-exec-sponsor",
        title="Weekly Executive Sponsor Brief",
        role="SENIOR_LEADER_SPONSOR",
        is_default=True,
        widgets=[
            DashboardWidgetConfig(id="w-1", widget_type="KPI_CARD", title="Total Active Engineers", size="1x1", metric_source="TOTAL_ACTIVE_TALENT"),
            DashboardWidgetConfig(id="w-2", widget_type="RADIAL_GAUGE", title="Cohort Production Readiness", size="1x1", metric_source="OVERALL_READINESS_SCORE"),
            DashboardWidgetConfig(id="w-3", widget_type="TIME_SERIES", title="Readiness & Milestone Velocity Trajectory", size="2x1", metric_source="TIME_SERIES_VELOCITY"),
            DashboardWidgetConfig(id="w-4", widget_type="HEATMAP_MATRIX", title="Enterprise Skill Health Matrix", size="2x2", metric_source="SKILL_HEALTH_MATRIX"),
            DashboardWidgetConfig(id="w-5", widget_type="LEADERBOARD", title="Top Performing GDA Associates", size="2x1", metric_source="TOP_ASSOCIATES"),
        ],
        created_at="2026-08-01",
        updated_at="2026-08-26",
    ),
    CustomDashboardLayout(
        id="dash-sre-governance",
        title="Engineering Excellence & Integrity Deep Dive",
        role="ENGINEERING_EXCELLENCE_COMMITTEE",
        is_default=False,
        widgets=[
            DashboardWidgetConfig(id="w-6", widget_type="KPI_CARD", title="Overall Integrity Index", size="1x1", metric_source="ASSESSMENT_INTEGRITY_INDEX"),
            DashboardWidgetConfig(id="w-7", widget_type="SKILL_RADAR", title="5-Pillar Competency Radar", size="2x1", metric_source="COMPETENCY_RADAR"),
            DashboardWidgetConfig(id="w-8", widget_type="RISK_TICKER", title="At-Risk Associate Signals", size="2x1", metric_source="AT_RISK_SIGNALS"),
        ],
        created_at="2026-08-05",
        updated_at="2026-08-25",
    ),
]


# ---------------------------------------------------------------------------
# Seed Scheduled Enterprise Reports (Requirement 26)
# ---------------------------------------------------------------------------

DEFAULT_SCHEDULED_REPORTS: List[ScheduledReport] = [
    ScheduledReport(
        id="rep-101",
        title="Weekly Executive Sponsor Brief & Pipeline Progress",
        report_type="EXECUTIVE_BRIEF",
        frequency="WEEKLY",
        delivery_channels=["EMAIL", "TEAMS", "IN_APP"],
        recipients=["senior.sponsor@enterprise.com", "tech.head@enterprise.com"],
        format="PDF",
        next_run="2026-08-31 08:00",
        last_sent="2026-08-24 08:00",
        is_active=True,
    ),
    ScheduledReport(
        id="rep-102",
        title="Bi-Weekly Skill Gap & Competency Delta Analysis",
        report_type="SKILL_GAP",
        frequency="BI_WEEKLY",
        delivery_channels=["EMAIL", "SLACK"],
        recipients=["committee.lead@enterprise.com", "sre.lead@enterprise.com"],
        format="EXCEL",
        next_run="2026-09-02 09:00",
        last_sent="2026-08-19 09:00",
        is_active=True,
    ),
    ScheduledReport(
        id="rep-103",
        title="Monthly Assessment Integrity & Proctoring Audit",
        report_type="INTEGRITY_SUMMARY",
        frequency="MONTHLY",
        delivery_channels=["EMAIL", "IN_APP"],
        recipients=["governance.audit@enterprise.com"],
        format="PDF",
        next_run="2026-09-01 07:00",
        last_sent="2026-08-01 07:00",
        is_active=True,
    ),
]
