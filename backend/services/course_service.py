import uuid
from datetime import datetime
from typing import List, Optional
from models.course import Course, CourseCreate, CourseResponse, CourseProgress
from database.connection import get_database

class CourseService:
    def __init__(self):
        pass

    def _get_collections(self):
        """Get course collections from database."""
        db = get_database()
        return db.courses, db.course_progress

    async def create_course(self, course_data: CourseCreate, instructor_name: str) -> CourseResponse:
        """Create a new course."""
        courses_collection, _ = self._get_collections()
        course_id = str(uuid.uuid4())
        
        course = Course(
            course_id=course_id,
            title=course_data.title,
            description=course_data.description,
            instructor_id=course_data.instructor_id,
            instructor_name=instructor_name,
            difficulty=course_data.difficulty,
            category=course_data.category,
            tags=course_data.tags,
            price=course_data.price
        )
        
        course_doc = course.dict()
        course_doc["_id"] = course_id
        
        await courses_collection.insert_one(course_doc)
        
        return CourseResponse(**course.dict())

    async def get_course(self, course_id: str) -> Optional[CourseResponse]:
        """Get course by ID."""
        courses_collection, _ = self._get_collections()
        course_doc = await courses_collection.find_one({"_id": course_id})
        if not course_doc:
            return None
        return CourseResponse(**course_doc)

    async def get_all_courses(self, skip: int = 0, limit: int = 20) -> List[CourseResponse]:
        """Get all courses with pagination."""
        courses_collection, _ = self._get_collections()
        cursor = courses_collection.find({"status": "published"}).skip(skip).limit(limit)
        courses = []
        async for course_doc in cursor:
            courses.append(CourseResponse(**course_doc))
        return courses

    async def search_courses(self, query: str, category: Optional[str] = None) -> List[CourseResponse]:
        """Search courses by title, description, or tags."""
        courses_collection, _ = self._get_collections()
        filter_query = {
            "$and": [
                {"status": "published"},
                {
                    "$or": [
                        {"title": {"$regex": query, "$options": "i"}},
                        {"description": {"$regex": query, "$options": "i"}},
                        {"tags": {"$in": [query]}}
                    ]
                }
            ]
        }
        
        if category:
            filter_query["$and"].append({"category": category})
        
        cursor = courses_collection.find(filter_query)
        courses = []
        async for course_doc in cursor:
            courses.append(CourseResponse(**course_doc))
        return courses

    async def enroll_user(self, user_id: str, course_id: str) -> CourseProgress:
        """Enroll user in a course."""
        _, progress_collection = self._get_collections()
        progress = CourseProgress(
            user_id=user_id,
            course_id=course_id
        )
        
        progress_doc = progress.dict()
        progress_doc["_id"] = f"{user_id}_{course_id}"
        
        await progress_collection.insert_one(progress_doc)
        return progress

    async def get_user_progress(self, user_id: str, course_id: str) -> Optional[CourseProgress]:
        """Get user's progress in a course."""
        progress_doc = await self.progress_collection.find_one({"_id": f"{user_id}_{course_id}"})
        if not progress_doc:
            return None
        return CourseProgress(**progress_doc)

    async def update_progress(self, user_id: str, course_id: str, lesson_id: str, time_spent: int):
        """Update user's course progress."""
        await self.progress_collection.update_one(
            {"_id": f"{user_id}_{course_id}"},
            {
                "$addToSet": {"completed_lessons": lesson_id},
                "$inc": {"time_spent_minutes": time_spent},
                "$set": {"last_accessed": datetime.now()}
            }
        )

    async def get_user_courses(self, user_id: str) -> List[dict]:
        """Get all courses user is enrolled in with progress."""
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$lookup": {
                "from": "courses",
                "localField": "course_id",
                "foreignField": "_id",
                "as": "course"
            }},
            {"$unwind": "$course"},
            {"$project": {
                "course_id": 1,
                "title": "$course.title",
                "instructor_name": "$course.instructor_name",
                "thumbnail_url": "$course.thumbnail_url",
                "completion_percentage": 1,
                "last_accessed": 1,
                "is_completed": 1
            }}
        ]
        
        result = []
        async for doc in self.progress_collection.aggregate(pipeline):
            result.append(doc)
        return result

    async def get_popular_courses(self, limit: int = 10) -> List[CourseResponse]:
        """Get popular courses based on enrollment count."""
        cursor = self.courses_collection.find({"status": "published"}).sort("enrollment_count", -1).limit(limit)
        courses = []
        async for course_doc in cursor:
            courses.append(CourseResponse(**course_doc))
        return courses

course_service = CourseService()