from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class CourseStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class LessonType(str, Enum):
    VIDEO = "video"
    TEXT = "text"
    INTERACTIVE = "interactive"
    QUIZ = "quiz"

class Lesson(BaseModel):
    lesson_id: str
    title: str
    description: Optional[str] = None
    type: LessonType
    content_url: Optional[str] = None
    duration_minutes: int = 0
    order: int
    is_mandatory: bool = True

class CourseModule(BaseModel):
    module_id: str
    title: str
    description: Optional[str] = None
    lessons: List[Lesson] = []
    order: int

class Course(BaseModel):
    course_id: str
    title: str
    description: str
    instructor_id: str
    instructor_name: str
    thumbnail_url: Optional[str] = None
    difficulty: DifficultyLevel
    category: str
    tags: List[str] = []
    modules: List[CourseModule] = []
    total_duration_hours: float = 0.0
    price: float = 0.0
    rating: float = 0.0
    total_ratings: int = 0
    enrollment_count: int = 0
    status: CourseStatus = CourseStatus.DRAFT
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class CourseProgress(BaseModel):
    user_id: str
    course_id: str
    enrollment_date: datetime = Field(default_factory=datetime.now)
    completion_percentage: int = Field(ge=0, le=100, default=0)
    completed_lessons: List[str] = []
    current_module: Optional[str] = None
    current_lesson: Optional[str] = None
    time_spent_minutes: int = 0
    last_accessed: Optional[datetime] = None
    is_completed: bool = False
    completion_date: Optional[datetime] = None
    certificate_issued: bool = False

class CourseCreate(BaseModel):
    title: str
    description: str
    instructor_id: str
    difficulty: DifficultyLevel
    category: str
    tags: List[str] = []
    price: float = 0.0

class CourseResponse(BaseModel):
    course_id: str
    title: str
    description: str
    instructor_name: str
    thumbnail_url: Optional[str] = None
    difficulty: DifficultyLevel
    category: str
    tags: List[str]
    total_duration_hours: float
    rating: float
    enrollment_count: int
    price: float