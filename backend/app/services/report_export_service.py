from __future__ import annotations

import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from app.models.schemas import ScheduledReport, GenerateReportRequest
from app.seed.analytics_and_reports import DEFAULT_SCHEDULED_REPORTS


class ReportExportService:
    def __init__(self) -> None:
        self._reports: Dict[str, ScheduledReport] = {r.id: r for r in DEFAULT_SCHEDULED_REPORTS}

    def get_scheduled_reports(self) -> List[ScheduledReport]:
        return list(self._reports.values())

    def save_scheduled_report(self, report: ScheduledReport) -> ScheduledReport:
        if not report.id:
            report.id = f"rep-{uuid.uuid4().hex[:6]}"
        self._reports[report.id] = report
        return report

    def generate_report(self, req: GenerateReportRequest) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        
        # Build comprehensive report metadata & structured payload
        return {
            "report_id": f"gen-rep-{uuid.uuid4().hex[:8]}",
            "report_type": req.report_type,
            "format": req.format,
            "generated_at": now_str,
            "time_range_days": req.time_range_days,
            "executive_summary": "Overall cohort velocity is 1.34x baseline with 84.5% production readiness. Zero critical compliance or integrity deviations recorded.",
            "metrics_snapshot": {
                "active_engineers": 142,
                "readiness_index": 84.5,
                "gates_passed_pct": 95.8,
                "p99_latency_sla_compliance": 99.4,
                "integrity_score": 97.4,
            },
            "download_url": f"/api/reports/download/report-{req.report_type.lower()}-{uuid.uuid4().hex[:6]}.{req.format.lower()}",
            "status": "READY",
        }


# Global singleton
_report_export_service: Optional[ReportExportService] = None


def get_report_export_service() -> ReportExportService:
    global _report_export_service
    if _report_export_service is None:
        _report_export_service = ReportExportService()
    return _report_export_service
