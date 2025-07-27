from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class JobType(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"

class ExperienceLevel(str, Enum):
    ENTRY = "entry"
    MID = "mid"
    SENIOR = "senior"
    LEAD = "lead"
    EXECUTIVE = "executive"

class ApplicationStatus(str, Enum):
    DRAFT = "draft"
    APPLIED = "applied"
    UNDER_REVIEW = "under_review"
    INTERVIEW_SCHEDULED = "interview_scheduled"
    OFFER_RECEIVED = "offer_received"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class Company(BaseModel):
    company_id: str
    name: str
    logo_url: Optional[str] = None
    website: Optional[str] = None
    size: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None

class JobOpportunity(BaseModel):
    job_id: str
    title: str
    company: Company
    description: str
    requirements: List[str]
    preferred_skills: List[str] = []
    job_type: JobType
    experience_level: ExperienceLevel
    location: str
    remote_allowed: bool = False
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: str = "USD"
    benefits: List[str] = []
    application_deadline: Optional[datetime] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    posted_by: str
    view_count: int = 0
    application_count: int = 0

class JobApplication(BaseModel):
    application_id: str
    job_id: str
    user_id: str
    status: ApplicationStatus = ApplicationStatus.DRAFT
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    additional_documents: List[str] = []
    applied_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    notes: Optional[str] = None

class JobCreate(BaseModel):
    title: str
    company_id: str
    description: str
    requirements: List[str]
    preferred_skills: List[str] = []
    job_type: JobType
    experience_level: ExperienceLevel
    location: str
    remote_allowed: bool = False
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    benefits: List[str] = []
    application_deadline: Optional[datetime] = None

class JobResponse(BaseModel):
    job_id: str
    title: str
    company_name: str
    company_logo: Optional[str] = None
    location: str
    job_type: JobType
    experience_level: ExperienceLevel
    salary_range: Optional[str] = None
    remote_allowed: bool
    posted_date: datetime
    application_count: int

class ApplicationCreate(BaseModel):
    job_id: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None