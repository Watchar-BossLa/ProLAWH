from typing import Dict, List, Optional
from datetime import datetime, timedelta
from database.connection import get_database

class AnalyticsService:
    def __init__(self):
        pass

    def _get_collections(self):
        """Get analytics collections."""
        db = get_database()
        return (
            db.users,
            db.course_progress,
            db.mentorship_sessions,
            db.chat_messages,
            db.user_activities
        )

    async def get_platform_statistics(self) -> Dict:
        """Get overall platform statistics."""
        users_col, courses_col, mentorship_col, chat_col, activities_col = self._get_collections()
        
        # Mock statistics - would calculate from real data
        return {
            "total_users": 15420,
            "active_monthly_users": 8930,
            "total_courses": 347,
            "courses_completed": 12850,
            "mentorship_sessions": 5670,
            "chat_messages": 89340,
            "avg_course_completion_rate": 78.5,
            "user_satisfaction": 4.6,
            "growth_metrics": {
                "new_users_this_month": 890,
                "course_enrollments_this_month": 2340,
                "mentorship_requests_this_month": 456
            }
        }

    async def get_user_learning_analytics(self, user_id: str) -> Dict:
        """Get detailed learning analytics for a user."""
        users_col, courses_col, mentorship_col, chat_col, activities_col = self._get_collections()
        
        # Mock user analytics
        return {
            "learning_streak": 15,  # days
            "total_learning_hours": 87.5,
            "courses_completed": 8,
            "courses_in_progress": 3,
            "average_session_duration": 42,  # minutes
            "learning_velocity": "Fast",  # Based on completion rate
            "skill_progress": {
                "React": {"current": 85, "target": 95, "progress": "+12 this month"},
                "JavaScript": {"current": 90, "target": 95, "progress": "+5 this month"},
                "TypeScript": {"current": 70, "target": 85, "progress": "+15 this month"}
            },
            "weekly_activity": [
                {"day": "Monday", "hours": 2.5, "courses": 1},
                {"day": "Tuesday", "hours": 1.8, "courses": 1},
                {"day": "Wednesday", "hours": 3.2, "courses": 2},
                {"day": "Thursday", "hours": 2.1, "courses": 1},
                {"day": "Friday", "hours": 1.5, "courses": 1},
                {"day": "Saturday", "hours": 4.0, "courses": 2},
                {"day": "Sunday", "hours": 2.8, "courses": 2}
            ],
            "achievements": [
                {"name": "Week Warrior", "description": "7 days learning streak", "earned_date": "2025-01-20"},
                {"name": "React Master", "description": "Completed React advanced course", "earned_date": "2025-01-18"},
                {"name": "Helper", "description": "Helped 5 peers in community", "earned_date": "2025-01-15"}
            ]
        }

    async def get_course_analytics(self, course_id: str) -> Dict:
        """Get analytics for a specific course."""
        # Mock course analytics
        return {
            "total_enrollments": 1250,
            "active_learners": 340,
            "completion_rate": 82.3,
            "average_rating": 4.7,
            "average_completion_time": 18.5,  # hours
            "dropout_points": [
                {"lesson": "Advanced Hooks", "dropout_rate": 15.2},
                {"lesson": "State Management", "dropout_rate": 12.8},
                {"lesson": "Performance Optimization", "dropout_rate": 8.5}
            ],
            "engagement_metrics": {
                "video_completion_rate": 89.2,
                "quiz_participation": 76.8,
                "discussion_posts": 892,
                "peer_interactions": 2340
            },
            "learner_feedback": {
                "most_helpful": "Hands-on projects and real-world examples",
                "needs_improvement": "More advanced debugging techniques",
                "overall_satisfaction": 4.6
            }
        }

    async def get_mentorship_analytics(self, user_id: str) -> Dict:
        """Get mentorship analytics for a user."""
        # Mock mentorship analytics
        return {
            "as_mentor": {
                "total_mentees": 5,
                "active_mentees": 3,
                "total_sessions": 28,
                "average_rating": 4.8,
                "specialties": ["React", "Career Development", "System Design"],
                "success_stories": 12
            },
            "as_mentee": {
                "current_mentors": 2,
                "total_sessions": 15,
                "skills_developed": ["Leadership", "Advanced React", "System Architecture"],
                "goals_achieved": 4,
                "career_advancement": "Promoted to Senior Developer"
            },
            "session_history": [
                {"date": "2025-01-25", "type": "Code Review", "duration": 60, "rating": 5},
                {"date": "2025-01-22", "type": "Career Planning", "duration": 45, "rating": 5},
                {"date": "2025-01-18", "type": "Technical Discussion", "duration": 90, "rating": 4}
            ]
        }

    async def generate_progress_report(self, user_id: str, period: str = "monthly") -> Dict:
        """Generate a comprehensive progress report."""
        # Mock progress report
        return {
            "period": period,
            "generated_at": datetime.now().isoformat(),
            "summary": {
                "courses_completed": 3,
                "new_skills_acquired": 5,
                "mentorship_sessions": 4,
                "peer_connections": 12,
                "learning_hours": 32.5
            },
            "achievements": [
                "Completed Advanced React course",
                "Earned TypeScript certification", 
                "Mentored 2 junior developers",
                "Contributed to 3 community discussions"
            ],
            "goals_progress": [
                {
                    "goal": "Master React Advanced Patterns",
                    "progress": 100,
                    "status": "Completed",
                    "completion_date": "2025-01-20"
                },
                {
                    "goal": "Learn System Design",
                    "progress": 65,
                    "status": "In Progress", 
                    "target_date": "2025-02-15"
                },
                {
                    "goal": "Build Full Stack Project",
                    "progress": 30,
                    "status": "In Progress",
                    "target_date": "2025-03-01"
                }
            ],
            "recommendations": [
                "Consider taking System Design course to complement your development skills",
                "Join React community study group for peer learning",
                "Schedule regular mentorship sessions for career guidance"
            ],
            "next_month_focus": [
                "Complete System Design fundamentals",
                "Start advanced database optimization course",
                "Participate in hackathon or coding challenge"
            ]
        }

def get_analytics_service():
    """Get or create analytics service instance."""
    return AnalyticsService()

analytics_service = get_analytics_service()