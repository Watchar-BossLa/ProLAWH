import uuid
import hashlib
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from collections import defaultdict
from models.security import (
    AuditLog, SecurityEvent, Permission, Role, UserRole,
    AccessControl, LoginAttempt, SecuritySettings, ActionType, Severity
)
from models.user import UserRole as UserRoleEnum
from database.connection import get_database

class SecurityService:
    def __init__(self):
        self.failed_attempts = defaultdict(int)  # ip -> count
        self.attempt_timestamps = defaultdict(list)  # ip -> [timestamps]

    def _get_collections(self):
        """Get security collections."""
        db = get_database()
        return (
            db.audit_logs,
            db.security_events,
            db.permissions,
            db.roles,
            db.user_roles,
            db.access_control,
            db.login_attempts
        )

    async def log_audit_event(
        self,
        user_id: Optional[str],
        action: ActionType,
        resource: str,
        resource_id: Optional[str] = None,
        details: Dict[str, Any] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        endpoint: Optional[str] = None,
        method: Optional[str] = None,
        status_code: Optional[int] = None,
        severity: Severity = Severity.LOW
    ):
        """Log an audit event."""
        audit_collection, _, _, _, _, _, _ = self._get_collections()
        
        log_id = str(uuid.uuid4())
        
        audit_log = AuditLog(
            log_id=log_id,
            user_id=user_id,
            action=action,
            resource=resource,
            resource_id=resource_id,
            details=details or {},
            ip_address=ip_address,
            user_agent=user_agent,
            endpoint=endpoint,
            method=method,
            status_code=status_code,
            severity=severity
        )
        
        audit_doc = audit_log.dict()
        audit_doc["_id"] = log_id
        
        await audit_collection.insert_one(audit_doc)

    async def log_security_event(
        self,
        event_type: str,
        severity: Severity,
        description: str,
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        metadata: Dict[str, Any] = None
    ):
        """Log a security event."""
        _, events_collection, _, _, _, _, _ = self._get_collections()
        
        event_id = str(uuid.uuid4())
        
        security_event = SecurityEvent(
            event_id=event_id,
            user_id=user_id,
            event_type=event_type,
            severity=severity,
            description=description,
            ip_address=ip_address,
            metadata=metadata or {}
        )
        
        event_doc = security_event.dict()
        event_doc["_id"] = event_id
        
        await events_collection.insert_one(event_doc)

    async def check_rate_limit(self, ip_address: str, limit_per_minute: int = 100) -> bool:
        """Check if IP address is within rate limits."""
        now = datetime.now()
        minute_ago = now - timedelta(minutes=1)
        
        # Clean old timestamps
        self.attempt_timestamps[ip_address] = [
            ts for ts in self.attempt_timestamps[ip_address] 
            if ts > minute_ago
        ]
        
        # Check current count
        current_count = len(self.attempt_timestamps[ip_address])
        
        if current_count >= limit_per_minute:
            await self.log_security_event(
                event_type="rate_limit_exceeded",
                severity=Severity.MEDIUM,
                description=f"Rate limit exceeded for IP {ip_address}",
                ip_address=ip_address,
                metadata={"attempts": current_count, "limit": limit_per_minute}
            )
            return False
        
        # Add current attempt
        self.attempt_timestamps[ip_address].append(now)
        return True

    async def record_login_attempt(
        self,
        email: str,
        ip_address: str,
        user_agent: str,
        success: bool,
        failure_reason: Optional[str] = None
    ):
        """Record a login attempt."""
        _, _, _, _, _, _, attempts_collection = self._get_collections()
        
        attempt_id = str(uuid.uuid4())
        
        attempt = LoginAttempt(
            attempt_id=attempt_id,
            email=email,
            ip_address=ip_address,
            user_agent=user_agent,
            success=success,
            failure_reason=failure_reason
        )
        
        attempt_doc = attempt.dict()
        attempt_doc["_id"] = attempt_id
        
        await attempts_collection.insert_one(attempt_doc)
        
        # Track failed attempts for account lockout
        if not success:
            self.failed_attempts[email] += 1
            
            if self.failed_attempts[email] >= 5:  # Configurable
                await self.log_security_event(
                    event_type="account_lockout",
                    severity=Severity.HIGH,
                    description=f"Account locked due to failed login attempts: {email}",
                    ip_address=ip_address,
                    metadata={"email": email, "attempts": self.failed_attempts[email]}
                )
        else:
            # Reset failed attempts on successful login
            self.failed_attempts[email] = 0

    async def is_account_locked(self, email: str) -> bool:
        """Check if account is locked due to failed attempts."""
        return self.failed_attempts[email] >= 5

    async def initialize_default_roles(self):
        """Initialize default system roles."""
        _, _, permissions_collection, roles_collection, _, _, _ = self._get_collections()
        
        # Default permissions
        default_permissions = [
            {"_id": "read_courses", "name": "Read Courses", "description": "View courses", "resource": "course", "action": "read"},
            {"_id": "enroll_course", "name": "Enroll in Course", "description": "Enroll in courses", "resource": "course", "action": "enroll"},
            {"_id": "create_course", "name": "Create Course", "description": "Create new courses", "resource": "course", "action": "create"},
            {"_id": "manage_users", "name": "Manage Users", "description": "Manage user accounts", "resource": "user", "action": "manage"},
            {"_id": "view_analytics", "name": "View Analytics", "description": "Access analytics data", "resource": "analytics", "action": "read"},
            {"_id": "mentor_access", "name": "Mentor Access", "description": "Access mentorship features", "resource": "mentorship", "action": "mentor"},
            {"_id": "admin_access", "name": "Admin Access", "description": "Full system access", "resource": "system", "action": "admin"},
        ]
        
        # Insert permissions if they don't exist
        for permission in default_permissions:
            existing = await permissions_collection.find_one({"_id": permission["_id"]})
            if not existing:
                await permissions_collection.insert_one(permission)
        
        # Default roles
        default_roles = [
            {
                "_id": "learner",
                "name": "Learner",
                "description": "Standard learner role",
                "permissions": ["read_courses", "enroll_course"],
                "is_system_role": True
            },
            {
                "_id": "mentor",
                "name": "Mentor",
                "description": "Mentor role with additional privileges",
                "permissions": ["read_courses", "enroll_course", "mentor_access"],
                "is_system_role": True
            },
            {
                "_id": "instructor",
                "name": "Instructor",
                "description": "Course instructor role",
                "permissions": ["read_courses", "enroll_course", "create_course", "mentor_access"],
                "is_system_role": True
            },
            {
                "_id": "admin",
                "name": "Administrator",
                "description": "Full system administrator",
                "permissions": ["read_courses", "enroll_course", "create_course", "manage_users", "view_analytics", "mentor_access", "admin_access"],
                "is_system_role": True
            }
        ]
        
        # Insert roles if they don't exist
        for role in default_roles:
            existing = await roles_collection.find_one({"_id": role["_id"]})
            if not existing:
                role["created_at"] = datetime.now()
                await roles_collection.insert_one(role)

    async def assign_role_to_user(self, user_id: str, role_id: str, assigned_by: str):
        """Assign a role to a user."""
        _, _, _, _, user_roles_collection, _, _ = self._get_collections()
        
        # Remove existing role assignment
        await user_roles_collection.delete_many({"user_id": user_id})
        
        # Add new role
        user_role = UserRole(
            user_id=user_id,
            role_id=role_id,
            assigned_by=assigned_by
        )
        
        user_role_doc = user_role.dict()
        user_role_doc["_id"] = f"{user_id}_{role_id}"
        
        await user_roles_collection.insert_one(user_role_doc)
        
        await self.log_audit_event(
            user_id=assigned_by,
            action=ActionType.UPDATE,
            resource="user_role",
            resource_id=user_id,
            details={"role_assigned": role_id},
            severity=Severity.MEDIUM
        )

    async def get_user_permissions(self, user_id: str) -> List[str]:
        """Get all permissions for a user based on their roles."""
        _, _, permissions_collection, roles_collection, user_roles_collection, _, _ = self._get_collections()
        
        # Get user's roles
        user_roles_cursor = user_roles_collection.find({"user_id": user_id})
        role_ids = []
        async for user_role_doc in user_roles_cursor:
            role_ids.append(user_role_doc["role_id"])
        
        if not role_ids:
            return []
        
        # Get permissions from roles
        roles_cursor = roles_collection.find({"_id": {"$in": role_ids}})
        permissions = set()
        async for role_doc in roles_cursor:
            permissions.update(role_doc.get("permissions", []))
        
        return list(permissions)

    async def has_permission(self, user_id: str, permission: str) -> bool:
        """Check if user has a specific permission."""
        user_permissions = await self.get_user_permissions(user_id)
        return permission in user_permissions

    async def get_security_summary(self) -> Dict[str, Any]:
        """Get security summary dashboard."""
        audit_collection, events_collection, _, _, _, _, attempts_collection = self._get_collections()
        
        # Recent security events (last 24 hours)
        yesterday = datetime.now() - timedelta(days=1)
        
        recent_events = []
        async for event_doc in events_collection.find({"timestamp": {"$gte": yesterday}}).sort("timestamp", -1).limit(10):
            recent_events.append(SecurityEvent(**event_doc))
        
        # Failed login attempts (last 24 hours)
        failed_attempts_cursor = attempts_collection.find({
            "success": False,
            "timestamp": {"$gte": yesterday}
        })
        
        failed_attempts_count = await failed_attempts_cursor.count()
        
        # High severity events
        high_severity_count = await events_collection.count_documents({
            "severity": {"$in": ["high", "critical"]},
            "timestamp": {"$gte": yesterday}
        })
        
        return {
            "recent_events": [event.dict() for event in recent_events],
            "failed_login_attempts_24h": failed_attempts_count,
            "high_severity_events_24h": high_severity_count,
            "total_audit_logs": await audit_collection.count_documents({}),
            "account_lockouts": len([k for k, v in self.failed_attempts.items() if v >= 5])
        }

def get_security_service():
    """Get or create security service instance."""
    return SecurityService()

security_service = get_security_service()