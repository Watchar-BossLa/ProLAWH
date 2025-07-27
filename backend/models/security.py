from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class ActionType(str, Enum):
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    LOGIN = "login"
    LOGOUT = "logout"
    ACCESS_DENIED = "access_denied"
    API_CALL = "api_call"

class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AuditLog(BaseModel):
    log_id: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    action: ActionType
    resource: str  # e.g., "course", "user", "mentorship"
    resource_id: Optional[str] = None
    details: Dict[str, Any] = {}
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    endpoint: Optional[str] = None
    method: Optional[str] = None
    status_code: Optional[int] = None
    severity: Severity = Severity.LOW
    timestamp: datetime = Field(default_factory=datetime.now)
    session_id: Optional[str] = None

class SecurityEvent(BaseModel):
    event_id: str
    user_id: Optional[str] = None
    event_type: str  # e.g., "failed_login", "suspicious_activity"
    severity: Severity
    description: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    metadata: Dict[str, Any] = {}
    resolved: bool = False
    timestamp: datetime = Field(default_factory=datetime.now)

class Permission(BaseModel):
    permission_id: str
    name: str
    description: str
    resource: str
    action: str

class Role(BaseModel):
    role_id: str
    name: str
    description: str
    permissions: List[str] = []  # permission_ids
    is_system_role: bool = False
    created_at: datetime = Field(default_factory=datetime.now)

class UserRole(BaseModel):
    user_id: str
    role_id: str
    assigned_by: str
    assigned_at: datetime = Field(default_factory=datetime.now)
    expires_at: Optional[datetime] = None

class AccessControl(BaseModel):
    user_id: str
    resource: str
    resource_id: Optional[str] = None
    permissions: List[str] = []
    granted_by: str
    granted_at: datetime = Field(default_factory=datetime.now)
    expires_at: Optional[datetime] = None

class LoginAttempt(BaseModel):
    attempt_id: str
    email: str
    ip_address: str
    user_agent: str
    success: bool
    failure_reason: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class SecuritySettings(BaseModel):
    max_failed_attempts: int = 5
    lockout_duration_minutes: int = 30
    session_timeout_minutes: int = 480  # 8 hours
    require_strong_passwords: bool = True
    enable_2fa: bool = False
    allowed_domains: List[str] = []
    blocked_ips: List[str] = []
    rate_limit_per_minute: int = 100