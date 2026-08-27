from __future__ import annotations

from typing import List, Dict, Optional, Any
from app.models.schemas import MetricLineageNode
from app.seed.governance_and_audit import DEFAULT_METRIC_LINEAGE_NODES


class MetricLineageService:
    def __init__(self) -> None:
        self._nodes: Dict[str, MetricLineageNode] = {n.id: n for n in DEFAULT_METRIC_LINEAGE_NODES}

    def get_lineage_nodes(self) -> List[MetricLineageNode]:
        return list(self._nodes.values())

    def debug_metric(self, node_id: str) -> Dict[str, Any]:
        node = self._nodes.get(node_id)
        if not node:
            node = self._nodes["comp-readiness"]

        return {
            "node_id": node.id,
            "metric_name": node.name,
            "category": node.category,
            "current_value": node.current_value,
            "formula_latex": node.formula_latex,
            "input_sources": node.input_sources,
            "owner": node.owner,
            "sensitivity_analysis": {
                "highest_impact_parent": node.parent_node_ids[0] if node.parent_node_ids else "None",
                "sensitivity_weight": node.sensitivity_weight,
                "confidence_interval": "95% (±1.4%)",
            },
        }


# Global singleton
_metric_lineage_service: Optional[MetricLineageService] = None


def get_metric_lineage_service() -> MetricLineageService:
    global _metric_lineage_service
    if _metric_lineage_service is None:
        _metric_lineage_service = MetricLineageService()
    return _metric_lineage_service
