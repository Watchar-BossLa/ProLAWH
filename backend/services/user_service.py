import uuid
from datetime import datetime
from typing import List, Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from models.user import UserProfile, UserCreate, UserUpdate, UserResponse, UserLogin
from database.connection import get_database
from pymongo.errors import DuplicateKeyError

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Global user service instance (will be initialized when needed)
user_service = None

class UserService:
    def __init__(self):
        pass

    def _get_collection(self):
        """Get users collection from database."""
        db = get_database()
        return db.users

    async def create_user(self, user_data: UserCreate) -> UserResponse:
        """Create a new user."""
        collection = self._get_collection()
        try:
            # Hash password
            hashed_password = pwd_context.hash(user_data.password)
            
            # Create user profile
            user_id = str(uuid.uuid4())
            user_profile = UserProfile(
                user_id=user_id,
                email=user_data.email,
                full_name=user_data.full_name,
                role=user_data.role
            )
            
            # Prepare document for MongoDB
            user_doc = user_profile.dict()
            user_doc["hashed_password"] = hashed_password
            user_doc["_id"] = user_id
            
            # Insert into database
            await collection.insert_one(user_doc)
            
            return UserResponse(**user_profile.dict())
        except DuplicateKeyError:
            raise ValueError("User with this email already exists")

    async def authenticate_user(self, login_data: UserLogin) -> Optional[UserResponse]:
        """Authenticate user and return user data."""
        collection = self._get_collection()
        user_doc = await collection.find_one({"email": login_data.email})
        if not user_doc:
            return None
            
        if not pwd_context.verify(login_data.password, user_doc["hashed_password"]):
            return None
            
        return UserResponse(**user_doc)

    async def get_user(self, user_id: str) -> Optional[UserResponse]:
        """Get user by ID."""
        collection = self._get_collection()
        user_doc = await collection.find_one({"_id": user_id})
        if not user_doc:
            return None
        return UserResponse(**user_doc)

    async def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        """Get user by email."""
        collection = self._get_collection()
        user_doc = await collection.find_one({"email": email})
        if not user_doc:
            return None
        return UserResponse(**user_doc)

    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[UserResponse]:
        """Update user profile."""
        collection = self._get_collection()
        update_data = {k: v for k, v in user_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.now()
        
        result = await collection.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return None
            
        return await self.get_user(user_id)

    async def update_last_active(self, user_id: str):
        """Update user's last active timestamp."""
        collection = self._get_collection()
        await collection.update_one(
            {"_id": user_id},
            {"$set": {"last_active": datetime.now()}}
        )

    async def get_all_users(self, skip: int = 0, limit: int = 50) -> List[UserResponse]:
        """Get all users with pagination."""
        collection = self._get_collection()
        cursor = collection.find({}).skip(skip).limit(limit)
        users = []
        async for user_doc in cursor:
            users.append(UserResponse(**user_doc))
        return users

    async def search_users(self, query: str, skip: int = 0, limit: int = 20) -> List[UserResponse]:
        """Search users by name or email."""
        collection = self._get_collection()
        filter_query = {
            "$or": [
                {"full_name": {"$regex": query, "$options": "i"}},
                {"email": {"$regex": query, "$options": "i"}},
                {"company": {"$regex": query, "$options": "i"}},
                {"job_title": {"$regex": query, "$options": "i"}}
            ]
        }
        
        cursor = collection.find(filter_query).skip(skip).limit(limit)
        users = []
        async for user_doc in cursor:
            users.append(UserResponse(**user_doc))
        return users

def get_user_service():
    """Get or create user service instance."""
    global user_service
    if user_service is None:
        user_service = UserService()
    return user_service

# Export service instance
user_service = get_user_service()