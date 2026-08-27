from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

from app.models.schemas import (
    ASMMilestone,
    Assessment,
    Associate,
    AssociateASMMilestone,
    AssociateAssessment,
    AssociatePathway,
    AssessmentStatus,
    Course,
    CreditEntry,
    MilestoneStatus,
    Pathway,
    Role,
    Standing,
    Team,
    User,
)

UTC = timezone.utc


def _dt(year: int, month: int, day: int, hour: int = 9) -> datetime:
    return datetime(year, month, day, hour, tzinfo=UTC)


def _d(year: int, month: int, day: int) -> date:
    return date(year, month, day)


def seed_users() -> list[User]:
    return [
        User(
            id="u-ananya",
            name="Ananya Rao",
            email="ananya.rao@ascend.io",
            role=Role.EARLY_TALENT,
            title="Graduate Developer",
            team="Payments Platform",
            avatar_initials="AR",
        ),
        User(
            id="u-rohan",
            name="Rohan Mehta",
            email="rohan.mehta@ascend.io",
            role=Role.EARLY_TALENT,
            title="Graduate Developer",
            team="Data Infrastructure",
            avatar_initials="RM",
        ),
        User(
            id="u-priya",
            name="Priya Nair",
            email="priya.nair@ascend.io",
            role=Role.MENTOR_COACH,
            title="Senior Engineering Mentor",
            team="Payments Platform",
            avatar_initials="PN",
        ),
        User(
            id="u-fatima",
            name="Fatima Sheikh",
            email="fatima.sheikh@ascend.io",
            role=Role.EARLY_TALENT,
            title="Graduate Developer",
            team="Engineering Excellence",
            avatar_initials="FS",
        ),
        User(
            id="u-karthik",
            name="Karthik Iyer",
            email="karthik.iyer@ascend.io",
            role=Role.EARLY_TALENT,
            title="Graduate Developer",
            team="Payments Platform",
            avatar_initials="KI",
        ),
        User(
            id="u-committee",
            name="Engineering Excellence Committee",
            email="committee@ascend.io",
            role=Role.ENGINEERING_EXCELLENCE_COMMITTEE,
            title="Standards & Calibration Council",
            team="Engineering Excellence",
            avatar_initials="EE",
        ),
        User(
            id="u-sponsor",
            name="Senior Leader Sponsor",
            email="sponsor@ascend.io",
            role=Role.SENIOR_LEADER_SPONSOR,
            title="VP Engineering",
            team="Platform Group",
            avatar_initials="SL",
        ),
        User(
            id="u-techhead",
            name="Technology Head",
            email="techhead@ascend.io",
            role=Role.TECHNOLOGY_HEAD,
            title="Global Head of Technology",
            team="Technology Group",
            avatar_initials="TH",
        ),
        User(
            id="u-vikram",
            name="Vikram Desai",
            email="vikram.desai@ascend.io",
            role=Role.MENTOR_COACH,
            title="Staff Engineer",
            team="Data Infrastructure",
            avatar_initials="VD",
        ),
    ]


def seed_roles() -> list[dict]:
    return [
        {
            "id": "EARLY_TALENT",
            "name": "Early Talent",
            "description": "Graduate developer on the accelerator pathway.",
            "scope": "Personal development, assessments, milestones, credits.",
        },
        {
            "id": "MENTOR_COACH",
            "name": "Mentor Coach",
            "description": "Guides and reviews assigned associates.",
            "scope": "Mentees, development plans, waivers, architect board.",
        },
        {
            "id": "ENGINEERING_EXCELLENCE_COMMITTEE",
            "name": "Engineering Excellence Committee",
            "description": "Owns assessment standards and pathway governance.",
            "scope": "Cohorts, question bank, ASM library, difficulty engine, audit.",
        },
        {
            "id": "SENIOR_LEADER_SPONSOR",
            "name": "Senior Leader Sponsor",
            "description": "Funds and commissions talent for business demand.",
            "scope": "Demand pipeline, sponsored milestones, approvals.",
        },
        {
            "id": "TECHNOLOGY_HEAD",
            "name": "Technology Head",
            "description": "Owns the D2/D3 readiness bar and final technology sign-off before commissioning.",
            "scope": "Cloud & platform readiness, stack coverage, ASM pipeline, sign-off.",
        },
    ]


def seed_teams() -> list[Team]:
    return [
        Team(id="t-payments", name="Payments Platform", lead="Karthik Iyer", focus="Payments, ledger, settlement", member_count=12),
        Team(id="t-data", name="Data Infrastructure", lead="Vikram Desai", focus="Pipelines, warehousing, quality", member_count=9),
        Team(id="t-excellence", name="Engineering Excellence", lead="Fatima Sheikh", focus="Standards, assessment, governance", member_count=6),
        Team(id="t-platform", name="Platform Group", lead="Priya Nair", focus="Platform strategy, sponsorship", member_count=18),
    ]


def seed_pathways() -> list[Pathway]:
    return [
        Pathway(
            id="p-de",
            code="DE",
            name="Data Engineering",
            description="Distributed data systems, pipelines, warehousing, and data quality engineering.",
            focus="Data",
            duration_months=24,
            total_credits=120,
            milestones=["ASM-101", "ASM-102", "ASM-201D", "ASM-202D", "ASM-301"],
        ),
        Pathway(
            id="p-se",
            code="SE",
            name="Software Engineering",
            description="Application engineering, microservices, APIs, and production system reliability.",
            focus="Software",
            duration_months=24,
            total_credits=120,
            milestones=["ASM-101", "ASM-102", "ASM-201", "ASM-202", "ASM-301"],
        ),
        Pathway(
            id="p-cse",
            code="CSE",
            name="Cyber Security Engineering",
            description="Secure engineering, threat modeling, vulnerability management, and security operations.",
            focus="Security",
            duration_months=24,
            total_credits=120,
            milestones=["ASM-101", "ASM-102", "ASM-201S", "ASM-202S", "ASM-301"],
        ),
        Pathway(
            id="p-ie",
            code="IE",
            name="Infrastructure Engineering",
            description="Cloud infrastructure, platform reliability, observability, and developer experience.",
            focus="Infrastructure",
            duration_months=24,
            total_credits=120,
            milestones=["ASM-101", "ASM-102", "ASM-201P", "ASM-202P", "ASM-301"],
        ),
    ]


def seed_courses() -> list[Course]:
    return [
        Course(id="c-wf101", code="WF-101", title="Engineering Foundations", track="Foundation", level="Core", duration_weeks=4, description="Version control, testing, code review, and engineering fundamentals.", credits=6),
        Course(id="c-wf102", code="WF-102", title="Production Systems", track="Foundation", level="Core", duration_weeks=4, description="Observability, incident response, and production readiness.", credits=6),
        Course(id="c-pay201", code="PAY-201", title="Payments Domain Engineering", track="Payments", level="Intermediate", duration_weeks=6, description="Ledger design, idempotency, reconciliation, and settlement.", credits=12),
        Course(id="c-data201", code="DATA-201", title="Distributed Data Systems", track="Data", level="Intermediate", duration_weeks=6, description="Pipeline design, partitioning, exactly-once, and data quality.", credits=12),
        Course(id="c-arch301", code="ARCH-301", title="System Architecture", track="Advanced", level="Advanced", duration_weeks=8, description="Architecture review, trade-offs, and scalable system design.", credits=18),
        Course(id="c-sec201", code="SEC-201", title="Secure Engineering", track="Foundation", level="Core", duration_weeks=3, description="Threat modeling, secure coding, and dependency governance.", credits=6),
    ]


def seed_assessments() -> list[Assessment]:
    return [
        Assessment(id="a-wf101", course_id="c-wf101", title="WF-101 Assessment", type="Online Proctored", difficulty="Foundational", duration_minutes=90, passing_score=75, description="Engineering fundamentals assessment covering testing, VCS, and review."),
        Assessment(id="a-wf102", course_id="c-wf102", title="WF-102 Assessment", type="Online Proctored", difficulty="Foundational", duration_minutes=90, passing_score=75, description="Production systems assessment covering observability and incident response."),
        Assessment(id="a-pay201", course_id="c-pay201", title="PAY-201 Assessment", type="Lab + Oral", difficulty="Intermediate", duration_minutes=180, passing_score=80, description="Payments engineering assessment with hands-on ledger and reconciliation tasks."),
        Assessment(id="a-data201", course_id="c-data201", title="DATA-201 Assessment", type="Lab + Oral", difficulty="Intermediate", duration_minutes=180, passing_score=80, description="Data systems assessment covering pipeline design and quality."),
        Assessment(id="a-arch301", course_id="c-arch301", title="ARCH-301 Assessment", type="Architect Board", difficulty="Advanced", duration_minutes=240, passing_score=85, description="Architecture board review and system design defense."),
        Assessment(id="a-sec201", course_id="c-sec201", title="SEC-201 Assessment", type="Online Proctored", difficulty="Foundational", duration_minutes=60, passing_score=75, description="Secure engineering assessment covering threat modeling and secure coding."),
    ]


def seed_asm_milestones() -> list[ASMMilestone]:
    return [
        ASMMilestone(id="m-asm101", code="ASM-101", title="Foundation Build", phase="Foundation", description="First production-ready service with tests, CI, and observability.", target_week=8, credits=12, status=MilestoneStatus.COMPLETED, fork="foundation", environment="staging"),
        ASMMilestone(id="m-asm102", code="ASM-102", title="Integration Milestone", phase="Foundation", description="Integrate with a downstream system under contract and SLA.", target_week=16, credits=12, status=MilestoneStatus.CURRENT, fork="foundation", environment="staging"),
        ASMMilestone(id="m-asm201", code="ASM-201", title="Domain Deep Build", phase="Intermediate", description="Domain-specific engineering build with performance and reliability targets.", target_week=40, credits=24, status=MilestoneStatus.UPCOMING, fork="domain", environment="preprod"),
        ASMMilestone(id="m-asm202", code="ASM-202", title="Operational Ownership", phase="Intermediate", description="Own a service in production: on-call, SLOs, and incident command.", target_week=52, credits=18, status=MilestoneStatus.UPCOMING, fork="domain", environment="production"),
        ASMMilestone(id="m-asm301", code="ASM-301", title="Architect Board Certification", phase="Advanced", description="Defend a system design before the Architect Board for certification.", target_week=88, credits=30, status=MilestoneStatus.UPCOMING, fork="advanced", environment="production"),
    ]


def seed_associates() -> list[Associate]:
    return [
        Associate(
            id="as-ananya",
            user_id="u-ananya",
            name="Ananya Rao",
            email="ananya.rao@ascend.io",
            title="Graduate Developer",
            team_id="t-payments",
            team_name="Payments Platform",
            cohort="2025-A",
            standing=Standing.FAST_TRACK,
            pathway_code="SE",
            current_month=7,
            start_date=_d(2025, 1, 6),
            mentor_id="u-priya",
            mentor_name="Priya Nair",
            sponsor_id="u-sponsor",
            sponsor_name="Senior Leader Sponsor",
        ),
        Associate(
            id="as-fatima",
            user_id="u-fatima",
            name="Fatima Sheikh",
            email="fatima.sheikh@ascend.io",
            title="Graduate Developer",
            team_id="t-excellence",
            team_name="Engineering Excellence",
            cohort="2025-A",
            standing=Standing.ON_TRACK,
            pathway_code="DE",
            current_month=4,
            start_date=_d(2025, 1, 6),
            mentor_id="u-priya",
            mentor_name="Priya Nair",
            sponsor_id="u-sponsor",
            sponsor_name="Senior Leader Sponsor",
        ),
        Associate(
            id="as-rohan",
            user_id="u-rohan",
            name="Rohan Mehta",
            email="rohan.mehta@ascend.io",
            title="Graduate Developer",
            team_id="t-data",
            team_name="Data Infrastructure",
            cohort="2025-A",
            standing=Standing.ON_TRACK,
            pathway_code="CSE",
            current_month=7,
            start_date=_d(2025, 1, 6),
            mentor_id="u-vikram",
            mentor_name="Vikram Desai",
            sponsor_id="u-sponsor",
            sponsor_name="Senior Leader Sponsor",
        ),
        Associate(
            id="as-karthik",
            user_id="u-karthik",
            name="Karthik Iyer",
            email="karthik.iyer@ascend.io",
            title="Graduate Developer",
            team_id="t-payments",
            team_name="Cloud & Site Reliability Engineering",
            cohort="2025-A",
            standing=Standing.FAST_TRACK,
            pathway_code="IE",
            current_month=12,
            start_date=_d(2024, 8, 1),
            mentor_id="u-priya",
            mentor_name="Priya Nair",
            sponsor_id="u-sponsor",
            sponsor_name="Senior Leader Sponsor",
        ),
    ]


def seed_associate_assessments() -> list[AssociateAssessment]:
    return [
        AssociateAssessment(id="aa-1", associate_id="as-ananya", assessment_id="a-wf101", assessment_title="WF-101 Assessment", status=AssessmentStatus.COMPLETED, score=88, attempted_at=_dt(2025, 2, 10), completed_at=_dt(2025, 2, 10)),
        AssociateAssessment(id="aa-2", associate_id="as-ananya", assessment_id="a-wf102", assessment_title="WF-102 Assessment", status=AssessmentStatus.COMPLETED, score=82, attempted_at=_dt(2025, 3, 14), completed_at=_dt(2025, 3, 14)),
        AssociateAssessment(id="aa-3", associate_id="as-ananya", assessment_id="a-sec201", assessment_title="SEC-201 Assessment", status=AssessmentStatus.COMPLETED, score=79, attempted_at=_dt(2025, 4, 18), completed_at=_dt(2025, 4, 18)),
        AssociateAssessment(id="aa-4", associate_id="as-ananya", assessment_id="a-pay201", assessment_title="PAY-201 Assessment", status=AssessmentStatus.IN_PROGRESS, attempted_at=_dt(2025, 8, 5)),
        AssociateAssessment(id="aa-5", associate_id="as-ananya", assessment_id="a-arch301", assessment_title="ARCH-301 Assessment", status=AssessmentStatus.NOT_STARTED),
        AssociateAssessment(id="aa-6", associate_id="as-rohan", assessment_id="a-wf101", assessment_title="WF-101 Assessment", status=AssessmentStatus.COMPLETED, score=81, attempted_at=_dt(2025, 2, 11), completed_at=_dt(2025, 2, 11)),
        AssociateAssessment(id="aa-7", associate_id="as-rohan", assessment_id="a-wf102", assessment_title="WF-102 Assessment", status=AssessmentStatus.IN_PROGRESS, attempted_at=_dt(2025, 7, 20)),
        AssociateAssessment(id="aa-8", associate_id="as-rohan", assessment_id="a-data201", assessment_title="DATA-201 Assessment", status=AssessmentStatus.NOT_STARTED),
    ]


def seed_associate_asm_milestones() -> list[AssociateASMMilestone]:
    return [
        AssociateASMMilestone(id="aam-1", associate_id="as-ananya", milestone_id="m-asm101", code="ASM-101", title="Foundation Build", phase="Foundation", status=MilestoneStatus.COMPLETED, target_week=8, credits=12, fork="foundation", environment="staging", started_at=_dt(2025, 2, 1), completed_at=_dt(2025, 3, 1)),
        AssociateASMMilestone(id="aam-2", associate_id="as-ananya", milestone_id="m-asm102", code="ASM-102", title="Integration Milestone", phase="Foundation", status=MilestoneStatus.CURRENT, target_week=16, credits=12, fork="foundation", environment="staging", started_at=_dt(2025, 6, 15)),
        AssociateASMMilestone(id="aam-3", associate_id="as-ananya", milestone_id="m-asm201", code="ASM-201", title="Domain Deep Build", phase="Intermediate", status=MilestoneStatus.UPCOMING, target_week=40, credits=24, fork="domain", environment="preprod"),
        AssociateASMMilestone(id="aam-4", associate_id="as-ananya", milestone_id="m-asm202", code="ASM-202", title="Operational Ownership", phase="Intermediate", status=MilestoneStatus.AT_RISK, target_week=52, credits=18, fork="domain", environment="production"),
        AssociateASMMilestone(id="aam-5", associate_id="as-ananya", milestone_id="m-asm301", code="ASM-301", title="Architect Board Certification", phase="Advanced", status=MilestoneStatus.BLOCKED, target_week=88, credits=30, fork="advanced", environment="production"),
        AssociateASMMilestone(id="aam-6", associate_id="as-rohan", milestone_id="m-asm101", code="ASM-101", title="Foundation Build", phase="Foundation", status=MilestoneStatus.COMPLETED, target_week=8, credits=12, fork="foundation", environment="staging", started_at=_dt(2025, 2, 5), completed_at=_dt(2025, 3, 10)),
        AssociateASMMilestone(id="aam-7", associate_id="as-rohan", milestone_id="m-asm102", code="ASM-102", title="Integration Milestone", phase="Foundation", status=MilestoneStatus.CURRENT, target_week=16, credits=12, fork="foundation", environment="staging", started_at=_dt(2025, 7, 1)),
    ]


def seed_credits() -> list[CreditEntry]:
    return [
        CreditEntry(id="cr-1", associate_id="as-ananya", source="WF-101 Assessment", description="Passed WF-101 Assessment", amount=6, balance_after=6, awarded_at=_dt(2025, 2, 10)),
        CreditEntry(id="cr-2", associate_id="as-ananya", source="WF-102 Assessment", description="Passed WF-102 Assessment", amount=6, balance_after=12, awarded_at=_dt(2025, 3, 14)),
        CreditEntry(id="cr-3", associate_id="as-ananya", source="SEC-201 Assessment", description="Passed SEC-201 Assessment", amount=6, balance_after=18, awarded_at=_dt(2025, 4, 18)),
        CreditEntry(id="cr-4", associate_id="as-ananya", source="ASM-101", description="Completed ASM-101 Foundation Build", amount=12, balance_after=30, awarded_at=_dt(2025, 3, 1)),
        CreditEntry(id="cr-5", associate_id="as-ananya", source="Mentor Check-in", description="Q2 mentor check-in bonus", amount=2, balance_after=32, awarded_at=_dt(2025, 6, 30)),
        CreditEntry(id="cr-6", associate_id="as-rohan", source="WF-101 Assessment", description="Passed WF-101 Assessment", amount=6, balance_after=6, awarded_at=_dt(2025, 2, 11)),
        CreditEntry(id="cr-7", associate_id="as-rohan", source="ASM-101", description="Completed ASM-101 Foundation Build", amount=12, balance_after=18, awarded_at=_dt(2025, 3, 10)),
    ]


def seed_associate_pathways() -> list[AssociatePathway]:
    return [
        AssociatePathway(pathway_id="p-de", code="DE", name="Data Engineering", status="ACTIVE", progress=0.27, started_at=_dt(2025, 1, 6), target_completion=_d(2027, 1, 6)),
        AssociatePathway(pathway_id="p-se", code="SE", name="Software Engineering", status="ACTIVE", progress=0.18, started_at=_dt(2025, 1, 6), target_completion=_d(2027, 1, 6)),
    ]
