import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    database = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Create database connection."""
    mongodb.client = AsyncIOMotorClient(os.environ.get("MONGO_URL", "mongodb://localhost:27017"))
    mongodb.database = mongodb.client[os.environ.get("DB_NAME", "prolawh_db")]
    print("Connected to MongoDB")

async def close_mongo_connection():
    """Close database connection."""
    if mongodb.client:
        mongodb.client.close()
        print("Disconnected from MongoDB")

def get_database():
    """Get database instance."""
    return mongodb.database