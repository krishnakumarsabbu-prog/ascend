from __future__ import annotations

# Engineering teams with open-role demand and required pathway/skill level.
# Each team lists open roles; each role names the pathway and skill level
# required before an associate can be commissioned into it.

TEAMS = [
    {
        "id": "payments",
        "name": "Payments Engineering",
        "lead": "Karthik Iyer",
        "focus": "Ledger, settlement, payment APIs",
        "open_roles": [
            {"title": "Payments Platform Engineer", "pathway": "SE", "skill_level": "Intermediate", "priority": "P0", "target_month": 10},
            {"title": "Payments Platform Engineer", "pathway": "SE", "skill_level": "Intermediate", "priority": "P0", "target_month": 10},
            {"title": "Payments Reliability Engineer", "pathway": "IE", "skill_level": "Intermediate", "priority": "P1", "target_month": 12},
            {"title": "Payments Data Engineer", "pathway": "DE", "skill_level": "Intermediate", "priority": "P1", "target_month": 12},
            {"title": "Senior Payments Engineer", "pathway": "SE", "skill_level": "Advanced", "priority": "P2", "target_month": 18},
            {"title": "Payments Security Engineer", "pathway": "CSE", "skill_level": "Intermediate", "priority": "P1", "target_month": 14},
        ],
    },
    {
        "id": "core-banking",
        "name": "Core Banking Platform Engineering",
        "lead": "Fatima Sheikh",
        "focus": "Core ledger, accounts, regulatory reporting",
        "open_roles": [
            {"title": "Core Banking Engineer", "pathway": "SE", "skill_level": "Intermediate", "priority": "P0", "target_month": 11},
            {"title": "Core Banking Engineer", "pathway": "SE", "skill_level": "Intermediate", "priority": "P0", "target_month": 11},
            {"title": "Core Banking Engineer", "pathway": "SE", "skill_level": "Intermediate", "priority": "P0", "target_month": 11},
            {"title": "Banking Data Engineer", "pathway": "DE", "skill_level": "Intermediate", "priority": "P1", "target_month": 13},
            {"title": "Banking Reliability Engineer", "pathway": "IE", "skill_level": "Advanced", "priority": "P2", "target_month": 20},
            {"title": "Banking Security Engineer", "pathway": "CSE", "skill_level": "Intermediate", "priority": "P1", "target_month": 15},
            {"title": "Senior Core Banking Engineer", "pathway": "SE", "skill_level": "Advanced", "priority": "P2", "target_month": 19},
        ],
    },
    {
        "id": "cloud-sre",
        "name": "Cloud & Site Reliability Engineering",
        "lead": "Vikram Desai",
        "focus": "Platform reliability, observability, on-call",
        "open_roles": [
            {"title": "Site Reliability Engineer", "pathway": "IE", "skill_level": "Intermediate", "priority": "P0", "target_month": 10},
            {"title": "Site Reliability Engineer", "pathway": "IE", "skill_level": "Intermediate", "priority": "P0", "target_month": 10},
            {"title": "Cloud Platform Engineer", "pathway": "IE", "skill_level": "Intermediate", "priority": "P1", "target_month": 13},
            {"title": "Observability Engineer", "pathway": "DE", "skill_level": "Intermediate", "priority": "P1", "target_month": 14},
            {"title": "Senior SRE", "pathway": "IE", "skill_level": "Advanced", "priority": "P2", "target_month": 21},
        ],
    },
    {
        "id": "ai-decision",
        "name": "AI / Decision Engineering",
        "lead": "Priya Nair",
        "focus": "Model platforms, decisioning, feature pipelines",
        "open_roles": [
            {"title": "Decision Platform Engineer", "pathway": "SE", "skill_level": "Intermediate", "priority": "P0", "target_month": 12},
            {"title": "ML Data Engineer", "pathway": "DE", "skill_level": "Intermediate", "priority": "P0", "target_month": 12},
            {"title": "ML Data Engineer", "pathway": "DE", "skill_level": "Intermediate", "priority": "P0", "target_month": 12},
            {"title": "Decision Reliability Engineer", "pathway": "IE", "skill_level": "Intermediate", "priority": "P1", "target_month": 15},
            {"title": "Senior Decision Engineer", "pathway": "SE", "skill_level": "Advanced", "priority": "P2", "target_month": 22},
        ],
    },
    {
        "id": "data",
        "name": "Data Engineering",
        "lead": "Vikram Desai",
        "focus": "Pipelines, warehousing, data quality",
        "open_roles": [
            {"title": "Data Pipeline Engineer", "pathway": "DE", "skill_level": "Intermediate", "priority": "P0", "target_month": 11},
            {"title": "Data Pipeline Engineer", "pathway": "DE", "skill_level": "Intermediate", "priority": "P0", "target_month": 11},
            {"title": "Data Quality Engineer", "pathway": "DE", "skill_level": "Intermediate", "priority": "P1", "target_month": 13},
            {"title": "Senior Data Engineer", "pathway": "DE", "skill_level": "Advanced", "priority": "P2", "target_month": 20},
        ],
    },
    {
        "id": "security",
        "name": "Cyber Security Engineering",
        "lead": "Fatima Sheikh",
        "focus": "Threat modeling, vulnerability management, secops",
        "open_roles": [
            {"title": "Security Engineer", "pathway": "CSE", "skill_level": "Intermediate", "priority": "P0", "target_month": 12},
            {"title": "Security Engineer", "pathway": "CSE", "skill_level": "Intermediate", "priority": "P0", "target_month": 12},
            {"title": "AppSec Engineer", "pathway": "CSE", "skill_level": "Intermediate", "priority": "P1", "target_month": 14},
            {"title": "Senior Security Engineer", "pathway": "CSE", "skill_level": "Advanced", "priority": "P2", "target_month": 21},
        ],
    },
    {
        "id": "infrastructure",
        "name": "Infrastructure Engineering",
        "lead": "Priya Nair",
        "focus": "Cloud infrastructure, developer experience, platform",
        "open_roles": [
            {"title": "Infrastructure Engineer", "pathway": "IE", "skill_level": "Intermediate", "priority": "P0", "target_month": 11},
            {"title": "Infrastructure Engineer", "pathway": "IE", "skill_level": "Intermediate", "priority": "P0", "target_month": 11},
            {"title": "Developer Experience Engineer", "pathway": "SE", "skill_level": "Intermediate", "priority": "P1", "target_month": 14},
            {"title": "Senior Infrastructure Engineer", "pathway": "IE", "skill_level": "Advanced", "priority": "P2", "target_month": 20},
        ],
    },
]


# Associates who have been sponsored into an ASM milestone by a business team.
# `skills` lists the competencies the sponsored milestone is meant to build;
# `pipeline` is the associate's current readiness stage; `demand_impact` is the
# open-role count this sponsorship is expected to absorb.

SPONSORED_ASM = [
    {
        "id": "sp-1",
        "associate_id": "as-ananya",
        "associate_name": "Ananya Rao",
        "business_team": "Payments Engineering",
        "asm_code": "ASM-201",
        "asm_title": "Domain Deep Build",
        "skills": ["Ledger design", "Idempotency", "Reconciliation", "Settlement"],
        "pipeline": "In Review",
        "demand_impact": 1,
        "target_month": 10,
        "priority": "P0",
    },
    {
        "id": "sp-2",
        "associate_id": "as-rohan",
        "associate_name": "Rohan Mehta",
        "business_team": "Data Engineering",
        "asm_code": "ASM-201",
        "asm_title": "Domain Deep Build",
        "skills": ["Pipeline design", "Partitioning", "Exactly-once", "Data quality"],
        "pipeline": "In Progress",
        "demand_impact": 1,
        "target_month": 11,
        "priority": "P0",
    },
    {
        "id": "sp-3",
        "associate_id": "as-ananya",
        "associate_name": "Ananya Rao",
        "business_team": "Cloud & Site Reliability Engineering",
        "asm_code": "ASM-202",
        "asm_title": "Operational Ownership",
        "skills": ["SLOs", "On-call", "Incident command"],
        "pipeline": "Upcoming",
        "demand_impact": 1,
        "target_month": 13,
        "priority": "P1",
    },
    {
        "id": "sp-4",
        "associate_id": "as-rohan",
        "associate_name": "Rohan Mehta",
        "business_team": "AI / Decision Engineering",
        "asm_code": "ASM-202",
        "asm_title": "Operational Ownership",
        "skills": ["Feature pipelines", "Model serving reliability"],
        "pipeline": "Upcoming",
        "demand_impact": 1,
        "target_month": 15,
        "priority": "P1",
    },
]


def seed_teams() -> list[dict]:
    return [dict(team) for team in TEAMS]


def seed_sponsored_asm() -> list[dict]:
    return [dict(item) for item in SPONSORED_ASM]
