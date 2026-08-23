from __future__ import annotations

from app.seed.demand import seed_teams, seed_sponsored_asm


class DemandService:
    """Phase 7 — Demand & Pipeline Intelligence.

    Computes demand, ready-supply, shortfall, readiness and workforce
    intelligence (risk band) for each engineering team, plus backend
    recommendations and sponsored-ASM impact. All calculation lives here.
    """

    LEVEL_ORDER = {"Foundation": 0, "Intermediate": 1, "Advanced": 2}

    def __init__(self, repo) -> None:
        self._repo = repo
        self._teams = seed_teams()
        self._sponsored = seed_sponsored_asm()

    # -- helpers --------------------------------------------------------

    def _associates(self):
        return self._repo.get_associates()

    def _readiness_for(self, associate) -> float:
        return self._repo._mentor_readiness(associate.id)

    def _meets_level(self, associate, required_level: str) -> bool:
        # Approximate skill level from journey progress: completion of the
        # Foundation milestones => Intermediate readiness; full pathway
        # completion => Advanced. Associates past month 6 with strong
        # readiness count toward Intermediate demand.
        readiness = self._readiness_for(associate)
        req = self.LEVEL_ORDER.get(required_level, 1)
        if req <= 1:
            return readiness >= 0.45
        return readiness >= 0.70

    def _ready_associates_for(self, team: dict) -> list[dict]:
        pathway = None
        required_level = None
        roles = team["open_roles"]
        if not roles:
            return []
        # Aggregate readiness across the pathways/levels the team demands.
        ready: list[dict] = []
        for associate in self._associates():
            # Only early-talent associates on the accelerator are candidates.
            if associate.current_month >= 90:
                continue
            for role in roles:
                if associate.pathway_code == role["pathway"] and self._meets_level(associate, role["skill_level"]):
                    ready.append({
                        "id": associate.id,
                        "name": associate.name,
                        "pathway": associate.pathway_code,
                        "readiness": round(self._readiness_for(associate) * 100),
                        "current_month": associate.current_month,
                        "standing": associate.standing.value,
                    })
                    break
        # Deduplicate by associate id.
        seen: set[str] = set()
        unique: list[dict] = []
        for entry in ready:
            if entry["id"] not in seen:
                seen.add(entry["id"])
                unique.append(entry)
        return unique

    # -- risk band -------------------------------------------------------

    @staticmethod
    def _risk_band(shortfall: int, demand: int) -> str:
        if demand <= 0:
            return "Healthy"
        ratio = shortfall / demand
        if ratio >= 0.50:
            return "Critical Shortfall"
        if ratio >= 0.30:
            return "High Demand"
        if ratio >= 0.10:
            return "Watch"
        return "Healthy"

    # -- builders --------------------------------------------------------

    def _team_pipeline(self, team: dict) -> dict:
        roles = team["open_roles"]
        demand = len(roles)
        ready = self._ready_associates_for(team)
        ready_count = len(ready)
        shortfall = max(0, demand - ready_count)
        readiness_pct = round((ready_count / demand) * 100) if demand else 100
        risk = self._risk_band(shortfall, demand)
        pathway_demand: dict[str, int] = {}
        for role in roles:
            pathway_demand[role["pathway"]] = pathway_demand.get(role["pathway"], 0) + 1
        return {
            "id": team["id"],
            "name": team["name"],
            "lead": team["lead"],
            "focus": team["focus"],
            "demand": demand,
            "ready": ready_count,
            "shortfall": shortfall,
            "readiness": readiness_pct,
            "risk": risk,
            "pathway_demand": pathway_demand,
            "open_roles": roles,
            "ready_associates": ready,
        }

    # -- public API -----------------------------------------------------

    def get_demand_overview(self) -> dict:
        pipelines = [self._team_pipeline(t) for t in self._teams]
        total_demand = sum(p["demand"] for p in pipelines)
        total_ready = sum(p["ready"] for p in pipelines)
        total_shortfall = sum(p["shortfall"] for p in pipelines)
        readiness = round((total_ready / total_demand) * 100) if total_demand else 100
        bands = {"Healthy": 0, "Watch": 0, "High Demand": 0, "Critical Shortfall": 0}
        for p in pipelines:
            bands[p["risk"]] += 1
        return {
            "total_demand": total_demand,
            "total_ready": total_ready,
            "total_shortfall": total_shortfall,
            "readiness": readiness,
            "team_count": len(pipelines),
            "risk_distribution": bands,
            "teams": pipelines,
        }

    def get_teams(self) -> list[dict]:
        return [
            {
                "id": t["id"],
                "name": t["name"],
                "lead": t["lead"],
                "focus": t["focus"],
                "open_role_count": len(t["open_roles"]),
            }
            for t in self._teams
        ]

    def get_team(self, team_id: str):
        team = next((t for t in self._teams if t["id"] == team_id), None)
        if not team:
            return None
        return self._team_pipeline(team)

    def get_pipeline_overview(self) -> dict:
        pipelines = [self._team_pipeline(t) for t in self._teams]
        return {
            "total_demand": sum(p["demand"] for p in pipelines),
            "total_ready": sum(p["ready"] for p in pipelines),
            "total_shortfall": sum(p["shortfall"] for p in pipelines),
            "teams": pipelines,
        }

    def get_team_pipeline(self, team_id: str):
        return self.get_team(team_id)

    def get_sponsored_asm(self) -> list[dict]:
        return list(self._sponsored)

    # -- recommendations ------------------------------------------------

    def get_recommendations(self) -> list[dict]:
        pipelines = [self._team_pipeline(t) for t in self._teams]
        recs: list[dict] = []
        for p in pipelines:
            if p["risk"] == "Critical Shortfall":
                recs.append({
                    "id": f"rec-{p['id']}-1",
                    "team": p["name"],
                    "priority": "P0",
                    "action": "Increase targeted ASM capacity",
                    "detail": f"{p['shortfall']} of {p['demand']} open roles unfilled. Sponsor additional ASM milestone capacity and accelerate the nearest-ready associates.",
                    "impact": "High",
                })
                recs.append({
                    "id": f"rec-{p['id']}-2",
                    "team": p["name"],
                    "priority": "P0",
                    "action": "Sponsor additional milestone capacity",
                    "detail": f"Fund extra {', '.join(sorted(set(r['pathway'] for r in p['open_roles'])))} milestone cohorts to close the {p['shortfall']}-role gap.",
                    "impact": "High",
                })
            elif p["risk"] == "High Demand":
                recs.append({
                    "id": f"rec-{p['id']}-1",
                    "team": p["name"],
                    "priority": "P1",
                    "action": "Prioritize pathway candidates",
                    "detail": f"{p['shortfall']}-role shortfall. Prioritize the next {p['shortfall']} {', '.join(sorted(set(r['pathway'] for r in p['open_roles'])))} candidates into the relevant pathway.",
                    "impact": "Medium",
                })
                recs.append({
                    "id": f"rec-{p['id']}-2",
                    "team": p["name"],
                    "priority": "P1",
                    "action": "Accelerate eligible associates",
                    "detail": f"Accelerate {p['shortfall']} associates who are close to the required skill level via waiver review and milestone fast-tracking.",
                    "impact": "Medium",
                })
            elif p["risk"] == "Watch":
                recs.append({
                    "id": f"rec-{p['id']}-1",
                    "team": p["name"],
                    "priority": "P2",
                    "action": "Increase mentor allocation",
                    "detail": f"Shortfall of {p['shortfall']}. Add mentor capacity to keep the next cohort on track for the target month.",
                    "impact": "Low",
                })
            else:
                recs.append({
                    "id": f"rec-{p['id']}-1",
                    "team": p["name"],
                    "priority": "P3",
                    "action": "Maintain pipeline health",
                    "detail": "Demand is well covered by ready associates. Continue monitoring and keep mentor allocation steady.",
                    "impact": "Low",
                })
        recs.sort(key=lambda r: {"P0": 0, "P1": 1, "P2": 2, "P3": 3}[r["priority"]])
        return recs
