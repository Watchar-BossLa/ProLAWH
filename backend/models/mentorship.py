from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class MentorshipStatus(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class SessionStatus(str, Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class MentorProfile(BaseModel):
    mentor_id: str
    user_id: str
    specialties: List[str]
    years_experience: int
    hourly_rate: Optional[float] = None
    availability_hours: List[str] = []
    max_mentees: int = 10
    current_mentees: int = 0
    rating: float = 0.0
    total_sessions: int = 0
    response_time_hours: float = 24.0
    is_accepting_mentees: bool = True
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

class MentorshipConnection(BaseModel):
    connection_id: str
    mentor_id: str
    mentee_id: str
    status: MentorshipStatus
    requested_at: datetime = Field(default_factory=datetime.now)
    accepted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    goals: List[str] = []
    notes: Optional[str] = None

class MentorshipSession(BaseModel):
    session_id: str
    connection_id: str
    mentor_id: str
    mentee_id: str
    scheduled_at: datetime
    duration_minutes: int = 60
    status: SessionStatus = SessionStatus.SCHEDULED
    meeting_url: Optional[str] = None
    agenda: Optional[str] = None
    notes: Optional[str] = None
    mentor_feedback: Optional[str] = None
    mentee_feedback: Optional[str] = None
    rating: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.now)

class MentorshipRequest(BaseModel):
    mentor_id: str
    goals: List[str]
    message: Optional[str] = None

class SessionBooking(BaseModel):
    connection_id: str
    scheduled_at: datetime
    duration_minutes: int = 60
    agenda: Optional[str] = None

class MentorResponse(BaseModel):
    mentor_id: str
    user_id: str
    full_name: str
    avatar_url: Optional[str] = None
    specialties: List[str]
    years_experience: int
    rating: float
    total_sessions: int
    hourly_rate: Optional[float] = None
    bio: Optional[str] = None
    is_accepting_mentees: bool