from __future__ import annotations

from typing import List, Dict, Any, Optional
from app.models.schemas import WorkforceScenarioRequest, WorkforceScenarioResult


class WorkforcePlanningService:
    def simulate_scenario(self, req: WorkforceScenarioRequest) -> WorkforceScenarioResult:
        base_intake = 80
        total_intake = base_intake + req.cohort_intake_delta
        
        # Calculate attrition leakage
        attrition_count = int(total_intake * (req.simulated_attrition_rate / 100.0))
        projected_graduates = max(10, total_intake - attrition_count)

        # Baseline readiness is 84.0%, accelerated timeline or higher intake shifts it slightly
        readiness_boost = (req.accelerated_weeks * 0.5) - (req.cohort_intake_delta * 0.05)
        projected_avg_readiness = round(min(96.0, max(75.0, 84.0 + readiness_boost)), 1)

        # Domain surplus/deficit calculations
        # SE baseline: 40, AI baseline: 15, Cloud: 15, Data: 10
        shifted_to_ai = int(40 * (req.ai_shift_percentage / 100.0))
        se_count = 40 - shifted_to_ai + int(req.cohort_intake_delta * 0.4)
        ai_count = 15 + shifted_to_ai + int(req.cohort_intake_delta * 0.3)
        cloud_count = 15 + int(req.cohort_intake_delta * 0.2)
        data_count = 10 + int(req.cohort_intake_delta * 0.1)

        # Target demand: SE=35, AI=28, Cloud=16, Data=12
        domain_balance = {
            "Software Engineering (SE)": se_count - 35,
            "AI Engineering (AIE)": ai_count - 28,
            "Cloud Infrastructure (CIE)": cloud_count - 16,
            "Data Engineering (DE)": data_count - 12,
        }

        # Projected quarterly throughput pipeline
        quarterly = [
            {"quarter": "2026-Q3", "intake": total_intake, "in_training": total_intake - 12, "production_ready": 12, "demand_met_pct": 78},
            {"quarter": "2026-Q4", "intake": total_intake + 10, "in_training": total_intake, "production_ready": projected_graduates // 2, "demand_met_pct": 89},
            {"quarter": "2027-Q1", "intake": total_intake + 15, "in_training": total_intake + 5, "production_ready": projected_graduates, "demand_met_pct": 98},
            {"quarter": "2027-Q2", "intake": total_intake + 20, "in_training": total_intake + 10, "production_ready": int(projected_graduates * 1.15), "demand_met_pct": 104},
        ]

        timeline_weeks = max(16, 24 - req.accelerated_weeks)

        return WorkforceScenarioResult(
            scenario_name=req.scenario_name,
            projected_graduates=projected_graduates,
            projected_avg_readiness=projected_avg_readiness,
            domain_surplus_deficit=domain_balance,
            timeline_weeks=timeline_weeks,
            quarterly_pipeline=quarterly,
        )

    def get_baseline_forecast(self) -> Dict[str, Any]:
        default_req = WorkforceScenarioRequest(
            scenario_name="Baseline Corporate Plan 2026",
            cohort_intake_delta=0,
            ai_shift_percentage=0.0,
            accelerated_weeks=0,
            simulated_attrition_rate=5.0,
        )
        return self.simulate_scenario(default_req).model_dump()


# Global singleton
_workforce_planning_service: Optional[WorkforcePlanningService] = None


def get_workforce_planning_service() -> WorkforcePlanningService:
    global _workforce_planning_service
    if _workforce_planning_service is None:
        _workforce_planning_service = WorkforcePlanningService()
    return _workforce_planning_service
