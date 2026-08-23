from __future__ import annotations

from datetime import datetime, timezone

from app.models.schemas import (
    ASMDetail,
    ASMMilestoneStatus,
    ASMReview,
    ASMSkillMaturity,
    ASMEvidence,
)

UTC = timezone.utc


def _dt(year: int, month: int, day: int, hour: int = 9) -> datetime:
    return datetime(year, month, day, hour, tzinfo=UTC)


# ---------------------------------------------------------------------------
# Canonical 7-milestone ASM journey (24 months)
# Each milestone maps to a month target and carries full evaluation metadata.
# ---------------------------------------------------------------------------

ASM_MILESTONE_DEFS: list[dict] = [
    {
        "id": "asm-101",
        "code": "ASM-101",
        "title": "Hacker Kitchen",
        "phase": "Foundation",
        "month": 3,
        "credits": 10,
        "objective": "Build a production-quality microservice from scratch under time pressure, demonstrating clean code, test coverage, and CI/CD fluency.",
        "skills_evaluated": ["API Design", "Testing", "CI/CD", "Code Quality", "Version Control"],
        "prerequisites": ["WF-101 Engineering Foundations", "WF-102 Production Systems"],
        "expected_outcome": "A deployable service with >80% test coverage, automated pipeline, and passing code review.",
        "assessment_criteria": [
            "Service builds and deploys via CI without manual intervention",
            "Unit + integration test coverage >= 80%",
            "Code review passes with no blocking comments",
            "README and runbook are complete and accurate",
        ],
        "mentor": "Karthik Iyer",
        "skill_maturity": [
            {"skill": "API Design", "domain": "Engineering", "maturity": 0.82},
            {"skill": "Testing", "domain": "Engineering", "maturity": 0.78},
            {"skill": "CI/CD", "domain": "Infrastructure", "maturity": 0.75},
            {"skill": "Code Quality", "domain": "Engineering", "maturity": 0.80},
            {"skill": "Version Control", "domain": "Foundation", "maturity": 0.90},
        ],
        "fork": "foundation",
        "environment": "staging",
    },
    {
        "id": "asm-102",
        "title": "Database Duel",
        "phase": "Foundation",
        "month": 6,
        "credits": 12,
        "objective": "Design and optimize a data store under competing constraints (consistency, scale, latency), defending trade-off decisions in a live review.",
        "skills_evaluated": ["Data Modeling", "Query Optimization", "Indexing", "Transaction Safety", "Performance Analysis"],
        "prerequisites": ["ASM-101 Hacker Kitchen", "DATA-201 Distributed Data Systems"],
        "expected_outcome": "A schema + query set that meets SLO under load, with a documented trade-off rationale.",
        "assessment_criteria": [
            "Schema supports the required access patterns without full scans",
            "p95 query latency under load meets the stated SLO",
            "Transaction boundaries are correct under concurrency",
            "Trade-off document defends choices with benchmark data",
        ],
        "mentor": "Vikram Desai",
        "skill_maturity": [
            {"skill": "Data Modeling", "domain": "Data", "maturity": 0.72},
            {"skill": "Query Optimization", "domain": "Data", "maturity": 0.68},
            {"skill": "Indexing", "domain": "Data", "maturity": 0.65},
            {"skill": "Transaction Safety", "domain": "Engineering", "maturity": 0.70},
            {"skill": "Performance Analysis", "domain": "Engineering", "maturity": 0.66},
        ],
        "fork": "foundation",
        "environment": "staging",
    },
    {
        "id": "asm-103",
        "code": "ASM-103",
        "title": "AWS Sandbox Deploy",
        "phase": "Foundation",
        "month": 9,
        "credits": 14,
        "objective": "Provision and deploy infrastructure on AWS using Infrastructure-as-Code, with secure defaults and cost guardrails.",
        "skills_evaluated": ["IaC", "Cloud Networking", "Security Baselines", "Cost Management", "Observability Setup"],
        "prerequisites": ["ASM-102 Database Duel", "SEC-201 Secure Engineering"],
        "expected_outcome": "A reproducible AWS environment with IaC, monitoring, and a documented cost model.",
        "assessment_criteria": [
            "Environment is fully reproducible from IaC with no console steps",
            "Security baseline enforced (least-privilege IAM, encrypted storage)",
            "Monitoring and alerting cover the critical paths",
            "Monthly cost estimate is within the stated budget",
        ],
        "mentor": "Karthik Iyer",
        "skill_maturity": [
            {"skill": "IaC", "domain": "Infrastructure", "maturity": 0.60},
            {"skill": "Cloud Networking", "domain": "Infrastructure", "maturity": 0.55},
            {"skill": "Security Baselines", "domain": "Security", "maturity": 0.62},
            {"skill": "Cost Management", "domain": "Infrastructure", "maturity": 0.50},
            {"skill": "Observability Setup", "domain": "Infrastructure", "maturity": 0.58},
        ],
        "fork": "foundation",
        "environment": "preprod",
    },
    {
        "id": "asm-104",
        "code": "ASM-104",
        "title": "RFC Board Defense",
        "phase": "Foundation",
        "month": 12,
        "credits": 16,
        "objective": "Author and defend a technical RFC before a review board, justifying architecture decisions against non-functional requirements.",
        "skills_evaluated": ["Technical Writing", "Architecture Reasoning", "Trade-off Analysis", "Stakeholder Communication", "Risk Identification"],
        "prerequisites": ["ASM-103 AWS Sandbox Deploy", "ARCH-301 System Architecture"],
        "expected_outcome": "An approved RFC with a clear decision record, risk register, and implementation plan.",
        "assessment_criteria": [
            "RFC follows the org template and is internally consistent",
            "Trade-offs are analyzed against NFRs with evidence",
            "Risks are identified with mitigations and owners",
            "Board approves with no blocking objections",
        ],
        "mentor": "Fatima Sheikh",
        "skill_maturity": [
            {"skill": "Technical Writing", "domain": "Foundation", "maturity": 0.55},
            {"skill": "Architecture Reasoning", "domain": "Engineering", "maturity": 0.50},
            {"skill": "Trade-off Analysis", "domain": "Engineering", "maturity": 0.48},
            {"skill": "Stakeholder Communication", "domain": "Foundation", "maturity": 0.60},
            {"skill": "Risk Identification", "domain": "Security", "maturity": 0.52},
        ],
        "fork": "domain",
        "environment": "preprod",
    },
    {
        "id": "asm-201",
        "code": "ASM-201",
        "title": "Drill",
        "phase": "Intermediate",
        "month": 15,
        "credits": 18,
        "objective": "Execute a structured operational drill simulating a production incident, demonstrating incident command and recovery discipline.",
        "skills_evaluated": ["Incident Command", "Root Cause Analysis", "Runbook Execution", "Communication Under Pressure", "Post-incident Review"],
        "prerequisites": ["ASM-104 RFC Board Defense"],
        "expected_outcome": "A completed drill with timeline, RCA, and a signed-off post-incident review.",
        "assessment_criteria": [
            "Incident command role is clearly held and handed off",
            "Root cause is identified with evidence within the timebox",
            "Communication log is complete and accurate",
            "Post-incident review has concrete, owned action items",
        ],
        "mentor": "Karthik Iyer",
        "skill_maturity": [
            {"skill": "Incident Command", "domain": "Engineering", "maturity": 0.45},
            {"skill": "Root Cause Analysis", "domain": "Engineering", "maturity": 0.42},
            {"skill": "Runbook Execution", "domain": "Infrastructure", "maturity": 0.48},
            {"skill": "Communication Under Pressure", "domain": "Foundation", "maturity": 0.50},
            {"skill": "Post-incident Review", "domain": "Engineering", "maturity": 0.40},
        ],
        "fork": "domain",
        "environment": "production",
    },
    {
        "id": "asm-202",
        "code": "ASM-202",
        "title": "Live Fire — Resilience Chaos Simulation",
        "phase": "Intermediate",
        "month": 18,
        "credits": 20,
        "objective": "Run a chaos engineering simulation against a live system, demonstrating resilience patterns, automated recovery, and SLO adherence.",
        "skills_evaluated": ["Chaos Engineering", "Resilience Patterns", "SLO Management", "Automated Remediation", "Observability"],
        "prerequisites": ["ASM-201 Drill"],
        "expected_outcome": "A chaos experiment report showing the system absorbing failure within SLO, with documented recovery automation.",
        "assessment_criteria": [
            "Experiment is designed with clear hypotheses and blast radius",
            "System maintains SLO during injected failure",
            "Automated remediation triggers correctly",
            "Findings feed back into the resilience backlog",
        ],
        "mentor": "Vikram Desai",
        "skill_maturity": [
            {"skill": "Chaos Engineering", "domain": "Infrastructure", "maturity": 0.35},
            {"skill": "Resilience Patterns", "domain": "Engineering", "maturity": 0.38},
            {"skill": "SLO Management", "domain": "Infrastructure", "maturity": 0.40},
            {"skill": "Automated Remediation", "domain": "Engineering", "maturity": 0.32},
            {"skill": "Observability", "domain": "Infrastructure", "maturity": 0.45},
        ],
        "fork": "domain",
        "environment": "production",
    },
    {
        "id": "asm-203",
        "code": "ASM-203",
        "title": "Capstone — Secure AI Banking Agent",
        "phase": "Advanced",
        "month": 24,
        "credits": 30,
        "objective": "Design, build, and defend a secure AI banking agent that handles transactions under regulatory, security, and reliability constraints.",
        "skills_evaluated": ["AI Integration", "Secure Engineering", "Transaction Integrity", "Regulatory Compliance", "System Design Defense"],
        "prerequisites": ["ASM-202 Live Fire", "ARCH-301 System Architecture"],
        "expected_outcome": "A working secure AI banking agent with a defended architecture, passing security review and a live transaction test.",
        "assessment_criteria": [
            "Agent handles transactions with idempotency and audit trail",
            "Security review passes with no critical findings",
            "Architecture defense is coherent under board questioning",
            "Regulatory constraints are demonstrably enforced",
        ],
        "mentor": "Fatima Sheikh",
        "skill_maturity": [
            {"skill": "AI Integration", "domain": "AI", "maturity": 0.25},
            {"skill": "Secure Engineering", "domain": "Security", "maturity": 0.30},
            {"skill": "Transaction Integrity", "domain": "Engineering", "maturity": 0.35},
            {"skill": "Regulatory Compliance", "domain": "Security", "maturity": 0.22},
            {"skill": "System Design Defense", "domain": "Engineering", "maturity": 0.28},
        ],
        "fork": "advanced",
        "environment": "production",
    },
]

# Fix ASM-101 code (was missing in the dict above for clarity)
ASM_MILESTONE_DEFS[0]["code"] = "ASM-101"


def _default_evidence(milestone_id: str, associate_id: str) -> list[ASMEvidence]:
    return []


def _default_review(milestone_id: str, associate_id: str) -> ASMReview | None:
    return None


def seed_asm_details() -> list[ASMDetail]:
    """Return the canonical ASM milestone definitions with default (empty) evidence/review."""
    details: list[ASMDetail] = []
    for d in ASM_MILESTONE_DEFS:
        details.append(
            ASMDetail(
                id=d["id"],
                code=d.get("code", d["id"].replace("asm-", "ASM-")),
                title=d["title"],
                phase=d["phase"],
                month=d["month"],
                credits=d["credits"],
                status=ASMMilestoneStatus.UPCOMING,
                objective=d["objective"],
                skills_evaluated=d["skills_evaluated"],
                prerequisites=d["prerequisites"],
                expected_outcome=d["expected_outcome"],
                assessment_criteria=d["assessment_criteria"],
                mentor=d["mentor"],
                skill_maturity=[
                    ASMSkillMaturity(**sm) for sm in d["skill_maturity"]
                ],
                evidence=[],
                review=None,
                fork=d.get("fork"),
                environment=d.get("environment"),
            )
        )
    return details


# ---------------------------------------------------------------------------
# Per-associate ASM state — which milestones are completed/current/etc.
# ---------------------------------------------------------------------------

ASSOCIATE_ASM_STATE: dict[str, list[dict]] = {
    "as-ananya": [
        {"id": "asm-101", "status": "COMPLETED", "started_at": _dt(2025, 2, 1), "completed_at": _dt(2025, 3, 1),
         "evidence": [{"id": "ev-101-1", "description": "Hacker Kitchen service repo with CI pipeline", "artifact_url": "https://git.ascend.io/ananya/hacker-kitchen", "submitted_at": _dt(2025, 2, 28)}],
         "review": {"id": "rv-101", "mentor_id": "u-karthik", "mentor_name": "Karthik Iyer", "decision": "APPROVED", "comments": "Strong execution. CI pipeline was exemplary.", "reviewed_at": _dt(2025, 3, 1)}},
        {"id": "asm-102", "status": "CURRENT", "started_at": _dt(2025, 6, 15), "completed_at": None,
         "evidence": [{"id": "ev-102-1", "description": "Initial schema and query benchmarks", "artifact_url": "https://git.ascend.io/ananya/db-duel/-/tree/v1", "submitted_at": _dt(2025, 7, 10)}],
         "review": None},
        {"id": "asm-103", "status": "UPCOMING", "started_at": None, "completed_at": None, "evidence": [], "review": None},
        {"id": "asm-104", "status": "UPCOMING", "started_at": None, "completed_at": None, "evidence": [], "review": None},
        {"id": "asm-201", "status": "UPCOMING", "started_at": None, "completed_at": None, "evidence": [], "review": None},
        {"id": "asm-202", "status": "AT_RISK", "started_at": None, "completed_at": None, "evidence": [], "review": None},
        {"id": "asm-203", "status": "BLOCKED", "started_at": None, "completed_at": None, "evidence": [], "review": None},
    ],
    "as-rohan": [
        {"id": "asm-101", "status": "COMPLETED", "started_at": _dt(2025, 2, 5), "completed_at": _dt(2025, 3, 10),
         "evidence": [{"id": "ev-r101-1", "description": "Hacker Kitchen service", "artifact_url": "https://git.ascend.io/rohan/hacker-kitchen", "submitted_at": _dt(2025, 3, 8)}],
         "review": {"id": "rv-r101", "mentor_id": "u-vikram", "mentor_name": "Vikram Desai", "decision": "APPROVED", "comments": "Good work, watch test coverage on edge cases.", "reviewed_at": _dt(2025, 3, 10)}},
        {"id": "asm-102", "status": "CURRENT", "started_at": _dt(2025, 7, 1), "completed_at": None, "evidence": [], "review": None},
        {"id": "asm-103", "status": "UPCOMING", "started_at": None, "completed_at": None, "evidence": [], "review": None},
        {"id": "asm-104", "status": "UPCOMING", "started_at": None, "completed_at": None, "evidence": [], "review": None},
        {"id": "asm-201", "status": "UPCOMING", "started_at": None, "completed_at": None, "evidence": [], "review": None},
        {"id": "asm-202", "status": "UPCOMING", "started_at": None, "completed_at": None, "evidence": [], "review": None},
        {"id": "asm-203", "status": "UPCOMING", "started_at": None, "completed_at": None, "evidence": [], "review": None},
    ],
}
