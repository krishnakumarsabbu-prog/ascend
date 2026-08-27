from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import List, Dict, Optional

from app.models.schemas import NotificationItem, NotificationTemplate
from app.seed.workflows import DEFAULT_NOTIFICATIONS, NOTIFICATION_TEMPLATES


class NotificationService:
    def __init__(self) -> None:
        self._notifications: List[NotificationItem] = list(DEFAULT_NOTIFICATIONS)
        self._templates: List[NotificationTemplate] = list(NOTIFICATION_TEMPLATES)
        self._user_preferences: Dict[str, Dict[str, bool]] = {
            "default": {"IN_APP": True, "EMAIL": True, "TEAMS": True, "SLACK": True}
        }

    def get_notifications(self, user_id: Optional[str] = None, unread_only: bool = False) -> List[NotificationItem]:
        results = self._notifications
        if user_id:
            results = [n for n in results if n.user_id == user_id or n.user_id == "ALL"]
        if unread_only:
            results = [n for n in results if not n.is_read]
        return results

    def mark_as_read(self, notif_id: str) -> bool:
        for n in self._notifications:
            if n.id == notif_id:
                n.is_read = True
                return True
        return False

    def mark_all_as_read(self, user_id: Optional[str] = None) -> int:
        count = 0
        for n in self._notifications:
            if not user_id or n.user_id == user_id:
                if not n.is_read:
                    n.is_read = True
                    count += 1
        return count

    def get_templates(self) -> List[NotificationTemplate]:
        return self._templates

    def dispatch_notification(
        self,
        user_id: str,
        title: str,
        message: str,
        channel: str = "IN_APP",
        event_type: str = "APPROVAL_REQUIRED",
        urgency: str = "NORMAL",
        action_url: Optional[str] = None,
        metadata: Optional[Dict[str, str]] = None,
    ) -> NotificationItem:
        new_notif = NotificationItem(
            id=f"notif-{uuid.uuid4().hex[:6]}",
            user_id=user_id,
            title=title,
            message=message,
            channel=channel,
            event_type=event_type,
            is_read=False,
            urgency=urgency,
            created_at="Just now",
            action_url=action_url,
            metadata=metadata or {},
        )
        self._notifications.insert(0, new_notif)
        return new_notif


# Global singleton
_notification_service: Optional[NotificationService] = None


def get_notification_service() -> NotificationService:
    global _notification_service
    if _notification_service is None:
        _notification_service = NotificationService()
    return _notification_service
