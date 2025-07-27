from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    LEARNER = "learner"
    MENTOR = "mentor"
    ADMIN = "admin"
    HR = "hr"
    ENTERPRISE = "enterprise"

class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class UserSkill(BaseModel):
    skill_name: str
    level: SkillLevel
    progress: int = Field(ge=0, le=100)
    verified: bool = False
    certificates: List[str] = []

class UserPreferences(BaseModel):
    learning_style: Optional[str] = None
    career_goals: List[str] = []
    interests: List[str] = []
    availability: Optional[str] = None
    timezone: Optional[str] = None

class UserStats(BaseModel):
    courses_completed: int = 0
    skills_verified: int = 0
    network_connections: int = 0
    learning_streak: int = 0
    total_learning_hours: float = 0.0
    mentorship_sessions: int = 0
    
class UserProfile(BaseModel):
    user_id: str
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.LEARNER
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    skills: List[UserSkill] = []
    preferences: UserPreferences = UserPreferences()
    stats: UserStats = UserStats()
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    last_active: Optional[datetime] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.LEARNER

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    avatar_url: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    user_id: str
    email: str
    full_name: str
    role: UserRole
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    stats: UserStats
    is_active: bool
    created_at: datetime