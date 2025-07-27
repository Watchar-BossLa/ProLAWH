from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
from typing import List, Optional
import uvicorn
from jose import JWTError, jwt
import os

# Import models and services (lazy loading)
from models.user import UserCreate, UserLogin, UserResponse, UserUpdate
from models.course import CourseCreate, CourseResponse, CourseProgress
from models.mentorship import MentorshipRequest, SessionBooking, MentorResponse
from models.opportunity import JobCreate, JobResponse, ApplicationCreate
from models.chat import ChatCreate, MessageCreate, ChatRoom, ChatMessage
from database.connection import connect_to_mongo, close_mongo_connection
from routers.websocket_router import websocket_router

# JWT settings
SECRET_KEY = "prolawh-secret-key-2025"
ALGORITHM = "HS256"

security = HTTPBearer()

# Lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="ProLAWH API",
    description="Professional Learning & Workforce Hub - Complete Backend API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """Get current authenticated user."""
    from services.user_service import user_service
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await user_service.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# Optional auth dependency (for public endpoints that can use auth)
async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[UserResponse]:
    """Get current user if authenticated, None otherwise."""
    try:
        return await get_current_user(credentials)
    except:
        return None

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "ProLAWH API - Professional Learning & Workforce Hub",
        "version": "1.0.0",
        "status": "operational"
    }

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2025-01-27"}

# ==================== AUTHENTICATION ENDPOINTS ====================

@app.post("/api/auth/register", response_model=dict)
async def register(user_data: UserCreate):
    """Register a new user."""
    from services.user_service import user_service
    
    try:
        user = await user_service.create_user(user_data)
        
        # Create JWT token
        token_data = {"sub": user.user_id}
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user.dict()
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login", response_model=dict)
async def login(login_data: UserLogin):
    """Authenticate user and return token."""
    from services.user_service import user_service
    
    user = await user_service.authenticate_user(login_data)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last active
    await user_service.update_last_active(user.user_id)
    
    # Create JWT token
    token_data = {"sub": user.user_id}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user.dict()
    }

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_profile(current_user: UserResponse = Depends(get_current_user)):
    """Get current user profile."""
    return current_user

# ==================== USER MANAGEMENT ENDPOINTS ====================

@app.get("/api/users", response_model=List[UserResponse])
async def get_users(
    skip: int = 0, 
    limit: int = 50,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get all users."""
    from services.user_service import user_service
    return await user_service.get_all_users(skip, limit)

@app.get("/api/users/search", response_model=List[UserResponse])
async def search_users(
    q: str,
    skip: int = 0,
    limit: int = 20,
    current_user: UserResponse = Depends(get_current_user)
):
    """Search users."""
    from services.user_service import user_service
    return await user_service.search_users(q, skip, limit)

@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user by ID."""
    from services.user_service import user_service
    user = await user_service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/users/me", response_model=UserResponse)
async def update_profile(
    user_data: UserUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update current user's profile."""
    from services.user_service import user_service
    updated_user = await user_service.update_user(current_user.user_id, user_data)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

# ==================== COURSE ENDPOINTS ====================

@app.get("/api/courses", response_model=List[CourseResponse])
async def get_courses(skip: int = 0, limit: int = 20):
    """Get all published courses."""
    from services.course_service import course_service
    return await course_service.get_all_courses(skip, limit)

@app.get("/api/courses/search", response_model=List[CourseResponse])
async def search_courses(q: str, category: Optional[str] = None):
    """Search courses."""
    from services.course_service import course_service
    return await course_service.search_courses(q, category)

@app.get("/api/courses/popular", response_model=List[CourseResponse])
async def get_popular_courses(limit: int = 10):
    """Get popular courses."""
    from services.course_service import course_service
    return await course_service.get_popular_courses(limit)

@app.get("/api/courses/{course_id}", response_model=CourseResponse)
async def get_course(course_id: str):
    """Get course by ID."""
    from services.course_service import course_service
    course = await course_service.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.post("/api/courses/{course_id}/enroll")
async def enroll_in_course(
    course_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Enroll in a course."""
    from services.course_service import course_service
    try:
        progress = await course_service.enroll_user(current_user.user_id, course_id)
        return {"message": "Successfully enrolled", "progress": progress.dict()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/courses/{course_id}/progress")
async def get_course_progress(
    course_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get user's progress in a course."""
    from services.course_service import course_service
    progress = await course_service.get_user_progress(current_user.user_id, course_id)
    if not progress:
        raise HTTPException(status_code=404, detail="Not enrolled in course")
    return progress.dict()

@app.get("/api/my/courses", response_model=List[dict])
async def get_my_courses(current_user: UserResponse = Depends(get_current_user)):
    """Get user's enrolled courses."""
    from services.course_service import course_service
    return await course_service.get_user_courses(current_user.user_id)

# ==================== MENTORSHIP ENDPOINTS ====================

@app.get("/api/mentors", response_model=List[MentorResponse])
async def get_mentors(
    specialties: Optional[List[str]] = None,
    skip: int = 0,
    limit: int = 20
):
    """Get available mentors."""
    from services.mentorship_service import mentorship_service
    return await mentorship_service.get_all_mentors(specialties, skip, limit)

@app.post("/api/mentorship/request")
async def request_mentorship(
    request: MentorshipRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """Request mentorship from a mentor."""
    from services.mentorship_service import mentorship_service
    connection = await mentorship_service.request_mentorship(current_user.user_id, request)
    return {"message": "Mentorship request sent", "connection": connection.dict()}

@app.get("/api/my/mentorships")
async def get_my_mentorships(current_user: UserResponse = Depends(get_current_user)):
    """Get user's mentorship connections."""
    from services.mentorship_service import mentorship_service
    return await mentorship_service.get_user_mentorships(current_user.user_id)

@app.get("/api/my/sessions")
async def get_my_sessions(current_user: UserResponse = Depends(get_current_user)):
    """Get upcoming mentorship sessions."""
    from services.mentorship_service import mentorship_service
    sessions = await mentorship_service.get_upcoming_sessions(current_user.user_id)
    return [session.dict() for session in sessions]

@app.post("/api/mentorship/sessions")
async def book_session(
    booking: SessionBooking,
    current_user: UserResponse = Depends(get_current_user)
):
    """Book a mentorship session."""
    from services.mentorship_service import mentorship_service
    try:
        session = await mentorship_service.book_session(booking)
        return {"message": "Session booked", "session": session.dict()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== OPPORTUNITIES/JOBS ENDPOINTS ====================

@app.get("/api/opportunities")
async def get_opportunities(
    skip: int = 0,
    limit: int = 20,
    job_type: Optional[str] = None,
    location: Optional[str] = None
):
    """Get job opportunities."""
    # Mock data for now - would connect to real job database
    opportunities = [
        {
            "job_id": "1",
            "title": "Senior Frontend Developer",
            "company_name": "TechCorp Inc.",
            "location": "Remote",
            "job_type": "full_time",
            "experience_level": "senior",
            "salary_range": "$120k - $150k",
            "remote_allowed": True,
            "posted_date": "2025-01-25T00:00:00",
            "application_count": 23
        },
        {
            "job_id": "2",
            "title": "UX Designer",
            "company_name": "Design Studio",
            "location": "New York, NY",
            "job_type": "contract",
            "experience_level": "mid",
            "salary_range": "$80/hour",
            "remote_allowed": False,
            "posted_date": "2025-01-20T00:00:00",
            "application_count": 15
        },
        {
            "job_id": "3",
            "title": "Full Stack Engineer",
            "company_name": "StartupXYZ",
            "location": "San Francisco, CA",
            "job_type": "full_time",
            "experience_level": "mid",
            "salary_range": "$100k - $130k",
            "remote_allowed": True,
            "posted_date": "2025-01-24T00:00:00",
            "application_count": 31
        }
    ]
    return opportunities[skip:skip+limit]

@app.get("/api/opportunities/{job_id}")
async def get_opportunity(job_id: str):
    """Get job opportunity details."""
    # Mock detailed job data
    return {
        "job_id": job_id,
        "title": "Senior Frontend Developer",
        "company": {
            "name": "TechCorp Inc.",
            "logo_url": None,
            "size": "500-1000 employees",
            "industry": "Technology"
        },
        "description": "Join our team building next-generation web applications...",
        "requirements": ["React", "TypeScript", "5+ years experience"],
        "location": "Remote",
        "job_type": "full_time",
        "salary_range": "$120k - $150k",
        "benefits": ["Health Insurance", "401k", "Remote Work"]
    }

@app.post("/api/opportunities/{job_id}/apply")
async def apply_to_job(
    job_id: str,
    application: ApplicationCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Apply to a job opportunity."""
    return {
        "message": "Application submitted successfully",
        "application_id": f"app_{job_id}_{current_user.user_id}",
        "status": "submitted"
    }

# ==================== ANALYTICS/DASHBOARD ENDPOINTS ====================

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: UserResponse = Depends(get_current_user)):
    """Get user dashboard statistics."""
    from services.course_service import course_service
    from services.mentorship_service import mentorship_service
    
    # Get user courses
    user_courses = await course_service.get_user_courses(current_user.user_id)
    completed_courses = len([c for c in user_courses if c.get('is_completed', False)])
    
    # Get mentorship data
    mentorships = await mentorship_service.get_user_mentorships(current_user.user_id)
    upcoming_sessions = await mentorship_service.get_upcoming_sessions(current_user.user_id)
    
    return {
        "courses_completed": completed_courses,
        "courses_in_progress": len(user_courses) - completed_courses,
        "skills_verified": current_user.stats.skills_verified,
        "network_connections": current_user.stats.network_connections,
        "learning_streak": current_user.stats.learning_streak,
        "mentorship_connections": len(mentorships.get('as_mentee', [])),
        "upcoming_sessions": len(upcoming_sessions),
        "total_learning_hours": current_user.stats.total_learning_hours
    }

@app.get("/api/dashboard/recommendations")
async def get_recommendations(current_user: UserResponse = Depends(get_current_user)):
    """Get AI-powered recommendations for the user."""
    # Mock recommendations - would use AI service in production
    return {
        "courses": [
            {
                "title": "React Advanced Patterns",
                "reason": "Based on your JavaScript progress",
                "match_score": 0.92
            },
            {
                "title": "System Design Fundamentals",
                "reason": "Popular among senior developers",
                "match_score": 0.87
            }
        ],
        "mentors": [
            {
                "name": "Sarah Johnson",
                "specialty": "React Development",
                "reason": "Expert in your learning areas",
                "match_score": 0.95
            }
        ],
        "opportunities": [
            {
                "title": "Senior React Developer",
                "company": "Tech Corp",
                "reason": "Matches your skill set",
                "match_score": 0.89
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
