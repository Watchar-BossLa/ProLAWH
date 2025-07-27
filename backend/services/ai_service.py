import json
import openai
from typing import List, Dict, Optional
from datetime import datetime
from models.user import UserResponse, UserSkill
from models.course import CourseResponse
from database.connection import get_database

# Set OpenAI API key (in production, use environment variable)
# For demo purposes, we'll use mock responses
OPENAI_API_KEY = None  # Set to actual key when available

class AIRecommendationService:
    def __init__(self):
        if OPENAI_API_KEY:
            openai.api_key = OPENAI_API_KEY

    def _get_collections(self):
        """Get database collections."""
        db = get_database()
        return db.courses, db.users, db.mentors, db.opportunities

    async def generate_course_recommendations(self, user: UserResponse) -> List[Dict]:
        """Generate AI-powered course recommendations for a user."""
        courses_collection, _, _, _ = self._get_collections()
        
        # In production, this would use actual OpenAI API
        # For now, using smart logic-based recommendations
        
        user_skills = [skill.skill_name.lower() for skill in user.skills] if hasattr(user, 'skills') else []
        completed_courses = user.stats.courses_completed
        
        # Mock AI recommendations based on user profile
        if 'javascript' in user_skills or 'react' in user_skills:
            recommendations = [
                {
                    "title": "Advanced React Patterns",
                    "reason": "Based on your React experience and current skill level",
                    "match_score": 0.95,
                    "difficulty": "advanced",
                    "estimated_hours": 15,
                    "skills_gained": ["React Hooks", "Context API", "Performance Optimization"]
                },
                {
                    "title": "TypeScript Mastery",
                    "reason": "Complement your JavaScript skills with type safety",
                    "match_score": 0.88,
                    "difficulty": "intermediate",
                    "estimated_hours": 12,
                    "skills_gained": ["TypeScript", "Type Definitions", "Generics"]
                }
            ]
        elif 'python' in user_skills:
            recommendations = [
                {
                    "title": "Machine Learning with Python",
                    "reason": "Expand your Python skills into AI/ML domain",
                    "match_score": 0.92,
                    "difficulty": "intermediate",
                    "estimated_hours": 20,
                    "skills_gained": ["Scikit-learn", "TensorFlow", "Data Analysis"]
                },
                {
                    "title": "Django REST Framework",
                    "reason": "Build robust APIs with your Python knowledge",
                    "match_score": 0.85,
                    "difficulty": "intermediate",
                    "estimated_hours": 10,
                    "skills_gained": ["Django", "REST APIs", "Authentication"]
                }
            ]
        else:
            recommendations = [
                {
                    "title": "Full Stack Web Development",
                    "reason": "Popular foundational course for career growth",
                    "match_score": 0.78,
                    "difficulty": "beginner",
                    "estimated_hours": 25,
                    "skills_gained": ["HTML", "CSS", "JavaScript", "Node.js"]
                },
                {
                    "title": "Introduction to Data Science",
                    "reason": "High-demand field with excellent career prospects",
                    "match_score": 0.75,
                    "difficulty": "beginner",
                    "estimated_hours": 18,
                    "skills_gained": ["Python", "Pandas", "Data Visualization"]
                }
            ]
        
        # Add personalization based on completion rate
        if completed_courses > 5:
            recommendations.append({
                "title": "Leadership in Tech",
                "reason": "Based on your learning commitment and course completion rate",
                "match_score": 0.82,
                "difficulty": "advanced",
                "estimated_hours": 8,
                "skills_gained": ["Team Leadership", "Project Management", "Communication"]
            })
        
        return recommendations

    async def generate_mentor_recommendations(self, user: UserResponse) -> List[Dict]:
        """Generate AI-powered mentor recommendations."""
        _, _, mentors_collection, _ = self._get_collections()
        
        # Mock AI-based mentor matching
        user_skills = [skill.skill_name.lower() for skill in user.skills] if hasattr(user, 'skills') else []
        
        recommendations = [
            {
                "mentor_id": "mentor_001",
                "name": "Sarah Johnson",
                "specialty": "React Development",
                "reason": "Expert in your skill areas with 8+ years experience",
                "match_score": 0.94,
                "years_experience": 8,
                "rating": 4.9,
                "hourly_rate": 80,
                "availability": "Weekends"
            },
            {
                "mentor_id": "mentor_002", 
                "name": "Michael Chen",
                "specialty": "Full Stack Development",
                "reason": "Successful track record with similar career paths",
                "match_score": 0.87,
                "years_experience": 6,
                "rating": 4.8,
                "hourly_rate": 75,
                "availability": "Evenings"
            },
            {
                "mentor_id": "mentor_003",
                "name": "Emma Davis",
                "specialty": "Career Transition",
                "reason": "Specializes in helping professionals advance their careers",
                "match_score": 0.83,
                "years_experience": 10,
                "rating": 4.9,
                "hourly_rate": 90,
                "availability": "Flexible"
            }
        ]
        
        return recommendations

    async def generate_job_recommendations(self, user: UserResponse) -> List[Dict]:
        """Generate AI-powered job opportunity recommendations."""
        _, _, _, opportunities_collection = self._get_collections()
        
        # Mock AI job matching based on user profile
        user_skills = [skill.skill_name.lower() for skill in user.skills] if hasattr(user, 'skills') else []
        
        recommendations = [
            {
                "job_id": "job_001",
                "title": "Senior React Developer",
                "company": "TechCorp Inc.",
                "location": "Remote",
                "salary_range": "$120k - $150k",
                "reason": "Perfect match for your React and JavaScript skills",
                "match_score": 0.96,
                "required_skills": ["React", "JavaScript", "TypeScript"],
                "job_type": "full_time",
                "remote_allowed": True
            },
            {
                "job_id": "job_002",
                "title": "Frontend Engineering Lead",
                "company": "Innovation Labs", 
                "location": "San Francisco, CA",
                "salary_range": "$140k - $180k",
                "reason": "Leadership role matching your experience level",
                "match_score": 0.91,
                "required_skills": ["React", "Team Leadership", "Architecture"],
                "job_type": "full_time",
                "remote_allowed": False
            },
            {
                "job_id": "job_003",
                "title": "Full Stack Developer",
                "company": "StartupXYZ",
                "location": "New York, NY",
                "salary_range": "$100k - $130k", 
                "reason": "Startup environment for rapid skill development",
                "match_score": 0.84,
                "required_skills": ["React", "Node.js", "MongoDB"],
                "job_type": "full_time",
                "remote_allowed": True
            }
        ]
        
        return recommendations

    async def generate_skill_development_path(self, user: UserResponse, target_role: str) -> Dict:
        """Generate a personalized skill development path."""
        
        # Mock AI-generated learning path
        current_skills = [skill.skill_name.lower() for skill in user.skills] if hasattr(user, 'skills') else []
        
        if target_role.lower() == "senior developer":
            path = {
                "target_role": "Senior Developer",
                "estimated_timeline": "6-12 months",
                "current_level": "Intermediate",
                "steps": [
                    {
                        "phase": 1,
                        "title": "Advanced Programming Concepts",
                        "duration": "2-3 months",
                        "skills": ["Design Patterns", "System Architecture", "Performance Optimization"],
                        "courses": ["Advanced React Patterns", "System Design Fundamentals"],
                        "projects": ["Build a scalable web application"]
                    },
                    {
                        "phase": 2,
                        "title": "Leadership and Communication",
                        "duration": "2-3 months", 
                        "skills": ["Code Review", "Mentoring", "Technical Communication"],
                        "courses": ["Tech Leadership Essentials", "Effective Code Reviews"],
                        "projects": ["Mentor junior developers", "Lead a team project"]
                    },
                    {
                        "phase": 3,
                        "title": "Specialization",
                        "duration": "2-3 months",
                        "skills": ["Cloud Architecture", "DevOps", "Security"],
                        "courses": ["AWS Solutions Architecture", "DevOps Best Practices"],
                        "projects": ["Deploy production applications", "Implement CI/CD pipeline"]
                    }
                ]
            }
        else:
            path = {
                "target_role": target_role,
                "estimated_timeline": "3-6 months",
                "current_level": "Beginner", 
                "steps": [
                    {
                        "phase": 1,
                        "title": "Foundation Building",
                        "duration": "1-2 months",
                        "skills": ["Programming Basics", "Version Control", "Problem Solving"],
                        "courses": ["Programming Fundamentals", "Git and GitHub"],
                        "projects": ["Build simple applications"]
                    }
                ]
            }
        
        return path

    async def analyze_learning_patterns(self, user: UserResponse) -> Dict:
        """Analyze user's learning patterns and provide insights."""
        
        # Mock learning analytics
        return {
            "learning_style": "Visual and Hands-on",
            "peak_learning_hours": "Evening (6PM - 9PM)",
            "preferred_content_type": "Video tutorials with coding exercises",
            "completion_rate": 85,
            "average_session_duration": 45,  # minutes
            "strengths": [
                "Consistent daily learning habit",
                "High engagement with interactive content", 
                "Quick to apply new concepts in projects"
            ],
            "improvement_areas": [
                "Could benefit from more theory-based learning",
                "Consider longer study sessions for complex topics"
            ],
            "recommendations": [
                "Schedule learning sessions during peak hours",
                "Mix practical exercises with conceptual learning",
                "Set weekly learning goals to maintain momentum"
            ]
        }

def get_ai_service():
    """Get or create AI service instance."""
    return AIRecommendationService()

ai_service = get_ai_service()