from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import List, Dict, Optional

from app.models.schemas import (
    WorkflowDefinition,
    WorkflowInstance,
    WorkflowHistoryEntry,
    WorkflowTransitionRequest,
    SLADashboardMetrics,
)
from app.seed.workflows import DEFAULT_WORKFLOWS, ACTIVE_WORKFLOW_INSTANCES


class WorkflowService:
    def __init__(self) -> None:
        self._definitions: Dict[str, WorkflowDefinition] = {w.code: w for w in DEFAULT_WORKFLOWS}
        self._instances: Dict[str, WorkflowInstance] = {inst.id: inst for inst in ACTIVE_WORKFLOW_INSTANCES}

    def get_definitions(self) -> List[WorkflowDefinition]:
        return list(self._definitions.values())

    def get_definition(self, code: str) -> Optional[WorkflowDefinition]:
        return self._definitions.get(code)

    def save_definition(self, definition: WorkflowDefinition) -> WorkflowDefinition:
        definition.updated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        definition.version += 1
        self._definitions[definition.code] = definition
        return definition

    def get_instances(
        self,
        role: Optional[str] = None,
        associate_id: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[WorkflowInstance]:
        results = list(self._instances.values())
        if role:
            results = [inst for inst in results if inst.current_assignee_role == role or role == "ADMIN"]
        if associate_id:
            results = [inst for inst in results if inst.associate_id == associate_id]
        if status:
            results = [inst for inst in results if inst.status == status]
        return results

    def get_instance(self, instance_id: str) -> Optional[WorkflowInstance]:
        return self._instances.get(instance_id)

    def transition_instance(self, req: WorkflowTransitionRequest) -> WorkflowInstance:
        inst = self._instances.get(req.instance_id)
        if not inst:
            raise ValueError(f"Workflow instance {req.instance_id} not found")

        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
        
        # Record history
        history_entry = WorkflowHistoryEntry(
            id=f"h-{uuid.uuid4().hex[:6]}",
            step_id=inst.current_step_id,
            step_name=inst.current_step_name,
            actor_id=req.actor_id,
            actor_name=req.actor_name,
            actor_role=req.actor_role,
            action=req.action,
            decision_reason=req.reason or f"Action {req.action} executed by {req.actor_name}",
            comments=req.comments,
            timestamp=timestamp,
            sla_met=inst.sla_status != "BREACHED_ESCALATED",
        )
        inst.history.append(history_entry)

        # Handle Action State Machine
        if req.action == "APPROVE":
            # Advance to next step in workflow definition if any
            wf_def = self._definitions.get(inst.workflow_code)
            if wf_def:
                # Find outgoing edge from current step
                next_edge = next((e for e in wf_def.edges if e.source == inst.current_step_id), None)
                if next_edge:
                    next_node = next((n for n in wf_def.nodes if n.id == next_edge.target), None)
                    if next_node and next_node.type != "END":
                        inst.current_step_id = next_node.id
                        inst.current_step_name = next_node.label
                        inst.current_assignee_role = next_node.role
                        inst.status = "IN_REVIEW"
                    else:
                        inst.status = "APPROVED"
                        inst.current_step_name = "Workflow Completed & Approved"
                else:
                    inst.status = "APPROVED"
            else:
                inst.status = "APPROVED"

        elif req.action == "REJECT":
            inst.status = "REJECTED"
            inst.current_step_name = "Workflow Terminated (Rejected)"

        elif req.action == "REQUEST_REWORK":
            inst.status = "REWORK"
            inst.current_assignee_role = "EARLY_TALENT"
            inst.current_step_name = "Rework Requested — Awaiting Associate Update"

        elif req.action == "ESCALATE":
            inst.status = "ESCALATED"
            inst.sla_status = "BREACHED_ESCALATED"
            inst.current_assignee_role = "TECHNOLOGY_HEAD"
            inst.current_step_name = f"Escalated to Executive Sign-off ({req.comments})"

        elif req.action == "DELEGATE":
            if req.delegate_to:
                inst.current_assignee_role = req.delegate_to
                inst.current_step_name = f"Delegated to {req.delegate_to}"

        self._instances[inst.id] = inst
        return inst

    def get_sla_dashboard(self) -> SLADashboardMetrics:
        instances = list(self._instances.values())
        active = [i for i in instances if i.status in ["PENDING", "IN_REVIEW", "REWORK", "ESCALATED"]]
        within = sum(1 for i in active if i.sla_status == "HEALTHY")
        warning = sum(1 for i in active if i.sla_status == "WARNING")
        breached = sum(1 for i in active if i.sla_status == "BREACHED_ESCALATED")
        escalations = [i for i in instances if i.status == "ESCALATED" or i.sla_status == "BREACHED_ESCALATED"]

        return SLADashboardMetrics(
            total_active=len(active),
            within_sla=within,
            warning_count=warning,
            breached_count=breached,
            average_cycle_time_hours=28.4,
            recent_escalations=escalations,
        )


# Global singleton
_workflow_service: Optional[WorkflowService] = None


def get_workflow_service() -> WorkflowService:
    global _workflow_service
    if _workflow_service is None:
        _workflow_service = WorkflowService()
    return _workflow_service
