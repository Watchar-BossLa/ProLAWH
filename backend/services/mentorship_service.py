import uuid
from datetime import datetime
from typing import List, Optional
from models.mentorship import (
    MentorProfile, MentorshipConnection, MentorshipSession,
    MentorshipRequest, SessionBooking, MentorResponse,
    MentorshipStatus, SessionStatus
)
from database.connection import get_database

class MentorshipService:
    def __init__(self):
        self.db = get_database()
        self.mentors_collection = self.db.mentors
        self.connections_collection = self.db.mentorship_connections
        self.sessions_collection = self.db.mentorship_sessions

    async def create_mentor_profile(self, user_id: str, profile_data: dict) -> MentorProfile:
        """Create a mentor profile."""
        mentor_id = str(uuid.uuid4())
        
        mentor = MentorProfile(
            mentor_id=mentor_id,
            user_id=user_id,
            **profile_data
        )
        
        mentor_doc = mentor.dict()
        mentor_doc["_id"] = mentor_id
        
        await self.mentors_collection.insert_one(mentor_doc)
        return mentor

    async def get_mentor_profile(self, mentor_id: str) -> Optional[MentorProfile]:
        """Get mentor profile by ID."""
        mentor_doc = await self.mentors_collection.find_one({"_id": mentor_id})
        if not mentor_doc:
            return None
        return MentorProfile(**mentor_doc)

    async def get_all_mentors(self, specialties: Optional[List[str]] = None, skip: int = 0, limit: int = 20) -> List[MentorResponse]:
        """Get all mentors with optional specialty filtering."""
        filter_query = {"is_accepting_mentees": True}
        
        if specialties:
            filter_query["specialties"] = {"$in": specialties}
        
        # Join with users collection to get user details
        pipeline = [
            {"$match": filter_query},
            {"$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }},
            {"$unwind": "$user"},
            {"$project": {
                "mentor_id": "$_id",
                "user_id": 1,
                "full_name": "$user.full_name",
                "avatar_url": "$user.avatar_url",
                "specialties": 1,
                "years_experience": 1,
                "rating": 1,
                "total_sessions": 1,
                "hourly_rate": 1,
                "bio": 1,
                "is_accepting_mentees": 1
            }},
            {"$skip": skip},
            {"$limit": limit}
        ]
        
        mentors = []
        async for mentor_doc in self.mentors_collection.aggregate(pipeline):
            mentors.append(MentorResponse(**mentor_doc))
        return mentors

    async def request_mentorship(self, mentee_id: str, request: MentorshipRequest) -> MentorshipConnection:
        """Create a mentorship request."""
        connection_id = str(uuid.uuid4())
        
        connection = MentorshipConnection(
            connection_id=connection_id,
            mentor_id=request.mentor_id,
            mentee_id=mentee_id,
            status=MentorshipStatus.PENDING,
            goals=request.goals
        )
        
        connection_doc = connection.dict()
        connection_doc["_id"] = connection_id
        
        await self.connections_collection.insert_one(connection_doc)
        return connection

    async def accept_mentorship(self, connection_id: str) -> Optional[MentorshipConnection]:
        """Accept a mentorship request."""
        result = await self.connections_collection.update_one(
            {"_id": connection_id},
            {
                "$set": {
                    "status": MentorshipStatus.ACTIVE,
                    "accepted_at": datetime.now()
                }
            }
        )
        
        if result.matched_count == 0:
            return None
            
        connection_doc = await self.connections_collection.find_one({"_id": connection_id})
        return MentorshipConnection(**connection_doc)

    async def book_session(self, booking: SessionBooking) -> MentorshipSession:
        """Book a mentorship session."""
        session_id = str(uuid.uuid4())
        
        # Get connection details
        connection_doc = await self.connections_collection.find_one({"_id": booking.connection_id})
        if not connection_doc:
            raise ValueError("Connection not found")
        
        session = MentorshipSession(
            session_id=session_id,
            connection_id=booking.connection_id,
            mentor_id=connection_doc["mentor_id"],
            mentee_id=connection_doc["mentee_id"],
            scheduled_at=booking.scheduled_at,
            duration_minutes=booking.duration_minutes,
            agenda=booking.agenda
        )
        
        session_doc = session.dict()
        session_doc["_id"] = session_id
        
        await self.sessions_collection.insert_one(session_doc)
        return session

    async def get_user_mentorships(self, user_id: str) -> dict:
        """Get user's mentorship connections as mentor and mentee."""
        # As mentor
        mentor_connections = []
        async for doc in self.connections_collection.find({"mentor_id": user_id}):
            mentor_connections.append(MentorshipConnection(**doc))
        
        # As mentee
        mentee_connections = []
        async for doc in self.connections_collection.find({"mentee_id": user_id}):
            mentee_connections.append(MentorshipConnection(**doc))
        
        return {
            "as_mentor": mentor_connections,
            "as_mentee": mentee_connections
        }

    async def get_upcoming_sessions(self, user_id: str) -> List[MentorshipSession]:
        """Get upcoming sessions for a user."""
        filter_query = {
            "$or": [
                {"mentor_id": user_id},
                {"mentee_id": user_id}
            ],
            "status": SessionStatus.SCHEDULED,
            "scheduled_at": {"$gte": datetime.now()}
        }
        
        sessions = []
        async for session_doc in self.sessions_collection.find(filter_query).sort("scheduled_at", 1):
            sessions.append(MentorshipSession(**session_doc))
        return sessions

mentorship_service = MentorshipService()