from __future__ import annotations

from typing import List, Dict
from app.models.schemas import (
    AIReadinessBreakdown,
    RiskIndicator,
    AIReadinessPrediction,
    AIMentorBrief,
    AIExecutiveQueryResult,
)

# ---------------------------------------------------------------------------
# Seed AI Readiness & Prediction Profiles (Requirement 7 & 8)
# ---------------------------------------------------------------------------

ANANYA_READINESS_BREAKDOWN = AIReadinessBreakdown(
    associate_id="as-ananya",
    associate_name="Ananya Rao",
    overall=82.0,
    technical=88.0,
    architecture=74.0,
    cloud=79.0,
    production=84.0,
    leadership=81.0,
    commissioning_ready=False,
    readiness_tier="PRACTITIONER",
    trajectory="FAST_TRACK",
    last_updated="2026-08-27",
)

ANANYA_RISK_INDICATORS: List[RiskIndicator] = [
    RiskIndicator(
        id="risk-1",
        label="Architecture Readiness Risk",
        probability=38.5,
        level="MEDIUM",
        explanation="Distributed Systems competency (61.0%) is 24 points below the Architect Board pathway threshold (85.0%).",
        primary_factor="Recent WF-202 exam dropped points on Consensus & Split-brain scenarios.",
        action_suggestion="Schedule Architect Board trial defense coaching and review Raft quorum math.",
    ),
    RiskIndicator(
        id="risk-2",
        label="Streaming Concurrency Bottleneck",
        probability=32.0,
        level="MEDIUM",
        explanation="Kafka partition rebalancing challenge timed out on race condition test cases.",
        primary_factor="Lock striping and volatile memory visibility gaps in payment pipeline.",
        action_suggestion="Attempt Practice Challenge CC-103 (Kafka Stream Lag Optimizer).",
    ),
    RiskIndicator(
        id="risk-3",
        label="Milestone Schedule Delay",
        probability=14.0,
        level="LOW",
        explanation="ASM-102 milestone completed on time; ASM-103 is on track with 3 days buffer.",
        primary_factor="Consistent PR velocity and mentor checkin cadence.",
        action_suggestion="Maintain current weekly commit pacing.",
    ),
]

ANANYA_HISTORICAL_TRAJECTORY = [
    {"month": 1, "readiness": 58.0, "technical": 62.0, "architecture": 48.0},
    {"month": 2, "readiness": 66.0, "technical": 72.0, "architecture": 58.0},
    {"month": 3, "readiness": 74.0, "technical": 80.0, "architecture": 65.0},
    {"month": 4, "readiness": 82.0, "technical": 88.0, "architecture": 74.0},
]

ANANYA_PREDICTION = AIReadinessPrediction(
    associate_id="as-ananya",
    associate_name="Ananya Rao",
    readiness_breakdown=ANANYA_READINESS_BREAKDOWN,
    predicted_commission_date="January 15, 2027",
    graduation_readiness_probability=88.5,
    at_risk_probability=14.2,
    risk_indicators=ANANYA_RISK_INDICATORS,
    score_change_explanation="Readiness is at 82%. Technical readiness is high (+88%), but Architecture readiness (74%) is currently lowering your overall score by 6% because your Distributed Systems assessment and Kafka stream rebalancing tests had lower confidence marks.",
    historical_trajectory=ANANYA_HISTORICAL_TRAJECTORY,
)


# ---------------------------------------------------------------------------
# Seed AI Mentor Briefs (Requirement 10)
# ---------------------------------------------------------------------------

MENTOR_BRIEFS: Dict[str, AIMentorBrief] = {
    "as-ananya": AIMentorBrief(
        associate_id="as-ananya",
        associate_name="Ananya Rao",
        cohort="Cohort 2025",
        pathway="Software Engineering (SE)",
        status="NEEDS_ATTENTION",
        overall_readiness=82.0,
        primary_concern="Distributed Systems & Concurrency Architecture Gap",
        evidence_summary={
            "Assessment Score": "61% (WF-202 Cloud & Distributed Systems)",
            "Coding Challenge": "72% (Payments Idempotency Concurrent Hash Lock)",
            "ASM Milestone": "Delayed 4 days on ASM-103 Partition Rebalancing",
            "PR Quality": "High (Approved without significant refactors)",
        },
        recommended_actions=[
            "Schedule a 45-minute Architecture Defense coaching session on Raft quorum protocols.",
            "Assign Practice Challenge CC-103 (Kafka Stream Lag Optimizer).",
            "Review ASM-103 thread pool configuration before final sign-off.",
        ],
        talking_points=[
            "Discuss deadlock prevention strategies using atomic references vs synchronized blocks.",
            "Walk through split-brain scenario mitigation in distributed consensus.",
            "Celebrate strong performance in Java 21 Virtual Threads (91% coding score).",
        ],
        generated_at="2026-08-27 10:15 UTC",
    ),
    "as-rohan": AIMentorBrief(
        associate_id="as-rohan",
        associate_name="Rohan Mehta",
        cohort="Cohort 2025",
        pathway="Data Engineering (DE)",
        status="FAST_TRACK",
        overall_readiness=87.5,
        primary_concern="None — Candidate is trending 3 weeks ahead of milestone pace",
        evidence_summary={
            "Assessment Score": "92% (WF-203 Database Architecture & SQL)",
            "Coding Challenge": "95% (Vector Similarity Top-K Retrieval)",
            "ASM Milestone": "Completed 12 days ahead of target",
            "PR Quality": "Exemplary",
        },
        recommended_actions=[
            "Nominate for Senior Leader Fast-Track Waiver consideration.",
            "Pair with Ananya Rao for cross-peer data pipeline architecture reviews.",
        ],
        talking_points=[
            "Explore Stretch Assignment in Real-Time Payments OLAP team.",
            "Discuss preparation for L3 Practitioner digital certification defense.",
        ],
        generated_at="2026-08-27 09:30 UTC",
    ),
    "as-fatima": AIMentorBrief(
        associate_id="as-fatima",
        associate_name="Fatima Sheikh",
        cohort="Cohort 2025",
        pathway="Cyber Security & SRE (CSE)",
        status="ON_TRACK",
        overall_readiness=78.0,
        primary_concern="Cloud Networking Subnetting & TLS termination",
        evidence_summary={
            "Assessment Score": "78% (WF-202 Cloud Infrastructure)",
            "Coding Challenge": "80% (Zero Trust Policy Engine)",
            "ASM Milestone": "On Track",
            "PR Quality": "Consistent",
        },
        recommended_actions=[
            "Assign AWS KMS & IAM Policy Sandbox intensive module.",
        ],
        talking_points=[
            "Review CIDR subnet design and Transit Gateway routing tables.",
        ],
        generated_at="2026-08-27 08:45 UTC",
    ),
}


# ---------------------------------------------------------------------------
# Seed AI Executive Intelligence Answers (Requirement 11)
# ---------------------------------------------------------------------------

EXECUTIVE_QUERY_KNOWLEDGE = {
    "cohort_risk": AIExecutiveQueryResult(
        query="Which cohort is most at risk?",
        answer_markdown="### Cohort Risk & Velocity Analysis\n\nBased on real-time assessment scores, ASM milestone lag, and code execution pass rates:\n\n* **Cohort 2025 (Active, Month 4)**: **Low-to-Moderate Risk (12% At-Risk Index)**. Overall completion rate is **91.4%**. The primary risk cluster is concentrated in **Distributed Systems Architecture** (Cohort average: 68%), specifically in consumer partition rebalancing.\n* **Cohort 2024 (Month 16)**: **96.2% on track**, with 4 associates already nominated for Senior Sponsor fast-tracking.\n\n**Actionable Recommendation**: Deploy automated remediation modules for Distributed Systems to Cohort 2025 to prevent ASM-104 defense bottlenecks.",
        key_metrics=[
            {"label": "Cohort 2025 At-Risk Index", "value": "12.4%"},
            {"label": "Milestone Velocity", "value": "94.2% On Time"},
            {"label": "Avg Competency Score", "value": "78.6%"},
        ],
        recommended_decisions=[
            "Authorize 2 additional Architecture Coaching hours per week for Cohort 2025.",
            "Deploy Kafka Sandbox Intensives to payments stream associates.",
        ],
        affected_cohorts=["Cohort 2025", "Cohort 2024"],
        generated_at="2026-08-27 11:00 UTC",
    ),
    "skill_gap": AIExecutiveQueryResult(
        query="Where do we have the largest skill gap?",
        answer_markdown="### Enterprise Skill Shortage Analysis\n\nCross-analyzing 40 enterprise skills across all active GDA Associates reveals the top 3 critical bottlenecks:\n\n1. **Distributed Systems & Consensus Protocols**: **-21.4 pt Enterprise Gap** (Target: 85.0%, Current: 63.6%).\n2. **Apache Kafka Stream Rebalancing**: **-17.8 pt Enterprise Gap** (Target: 80.0%, Current: 62.2%).\n3. **Cloud Infrastructure Security (IAM/KMS)**: **-11.2 pt Enterprise Gap** (Target: 80.0%, Current: 68.8%).\n\nIn contrast, **Java 21 Core (+86%)** and **Prompt Engineering / RAG (+87%)** exceed benchmark targets by +7.2%.",
        key_metrics=[
            {"label": "Largest Skill Gap", "value": "Distributed Systems (-21.4 pts)"},
            {"label": "Strongest Skill Area", "value": "AI Engineering / RAG (+7.2% vs target)"},
            {"label": "Skills Below Benchmark", "value": "6 of 40 (15%)"},
        ],
        recommended_decisions=[
            "Prioritize Distributed Systems masterclasses in Month 5 curriculum.",
            "Incentivize ASM project forks focused on fault-tolerant event streams.",
        ],
        affected_cohorts=["Cohort 2025"],
        generated_at="2026-08-27 11:05 UTC",
    ),
    "commission_ready": AIExecutiveQueryResult(
        query="How many associates are commission-ready?",
        answer_markdown="### Commissioning Pipeline & Production Readiness\n\n* **Commission-Ready Associates**: **3 Associates** (Rohan Mehta, Fatima Sheikh, Priya Verma) have passed foundational gates, cleared L3 competency benchmarks, and completed their capstone RFC defense.\n* **Commissioning Track Pipeline**: **14 Associates** currently within 60 days of graduation criteria.\n* **Fast-Track Eligible**: **2 Associates** pending Sponsor Approval for one-level-up promotion into Payments Engineering.",
        key_metrics=[
            {"label": "Commission Ready Now", "value": "3 Associates"},
            {"label": "Pipeline (60-Day)", "value": "14 Associates"},
            {"label": "Readiness Conversion Rate", "value": "92.8%"},
        ],
        recommended_decisions=[
            "Approve pending Fast-Track waiver requests in Sponsor Portal inbox.",
            "Initiate placement matching in Internal Talent Marketplace.",
        ],
        affected_cohorts=["Cohort 2024", "Cohort 2025"],
        generated_at="2026-08-27 11:10 UTC",
    ),
}
