import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict
from models.chat import (
    ChatRoom, ChatMessage, UserPresence, ChatNotification,
    MessageCreate, ChatCreate, MessageType, ChatType, MessageStatus
)
from database.connection import get_database

class ChatService:
    def __init__(self):
        pass

    def _get_collections(self):
        """Get chat collections from database."""
        db = get_database()
        return (
            db.chat_rooms,
            db.chat_messages, 
            db.user_presence,
            db.chat_notifications
        )

    async def create_chat_room(self, creator_id: str, chat_data: ChatCreate) -> ChatRoom:
        """Create a new chat room."""
        rooms_collection, _, _, _ = self._get_collections()
        
        chat_id = str(uuid.uuid4())
        participants = list(set([creator_id] + chat_data.participants))
        
        chat_room = ChatRoom(
            chat_id=chat_id,
            name=chat_data.name,
            chat_type=chat_data.chat_type,
            participants=participants,
            created_by=creator_id
        )
        
        chat_doc = chat_room.dict()
        chat_doc["_id"] = chat_id
        
        await rooms_collection.insert_one(chat_doc)
        return chat_room

    async def get_user_chats(self, user_id: str) -> List[ChatRoom]:
        """Get all chat rooms for a user."""
        rooms_collection, messages_collection, _, _ = self._get_collections()
        
        # Get user's chat rooms
        cursor = rooms_collection.find({
            "participants": user_id,
            "is_active": True
        }).sort("updated_at", -1)
        
        chats = []
        async for chat_doc in cursor:
            # Get last message for each chat
            last_message_doc = await messages_collection.find_one(
                {"chat_id": chat_doc["_id"]},
                sort=[("created_at", -1)]
            )
            
            chat_room = ChatRoom(**chat_doc)
            if last_message_doc:
                chat_room.last_message = ChatMessage(**last_message_doc)
            
            chats.append(chat_room)
        
        return chats

    async def send_message(self, sender_id: str, sender_name: str, message_data: MessageCreate) -> ChatMessage:
        """Send a message to a chat room."""
        _, messages_collection, _, _ = self._get_collections()
        
        message_id = str(uuid.uuid4())
        
        message = ChatMessage(
            message_id=message_id,
            chat_id=message_data.chat_id,
            sender_id=sender_id,
            sender_name=sender_name,
            content=message_data.content,
            message_type=message_data.message_type,
            file_url=message_data.file_url,
            file_name=message_data.file_name,
            reply_to=message_data.reply_to
        )
        
        message_doc = message.dict()
        message_doc["_id"] = message_id
        
        await messages_collection.insert_one(message_doc)
        
        # Update chat room's last message and updated_at
        rooms_collection, _, _, _ = self._get_collections()
        await rooms_collection.update_one(
            {"_id": message_data.chat_id},
            {
                "$set": {
                    "updated_at": datetime.now(),
                    "last_message": message.dict()
                }
            }
        )
        
        return message

    async def get_chat_messages(self, chat_id: str, skip: int = 0, limit: int = 50) -> List[ChatMessage]:
        """Get messages from a chat room."""
        _, messages_collection, _, _ = self._get_collections()
        
        cursor = messages_collection.find({
            "chat_id": chat_id,
            "deleted_at": None
        }).sort("created_at", -1).skip(skip).limit(limit)
        
        messages = []
        async for message_doc in cursor:
            messages.append(ChatMessage(**message_doc))
        
        return list(reversed(messages))

    async def mark_messages_as_read(self, chat_id: str, user_id: str, message_ids: List[str]):
        """Mark messages as read by a user."""
        _, messages_collection, _, _ = self._get_collections()
        
        await messages_collection.update_many(
            {
                "_id": {"$in": message_ids},
                "chat_id": chat_id,
                "sender_id": {"$ne": user_id}
            },
            {"$set": {"status": MessageStatus.READ}}
        )

    async def update_user_presence(self, user_id: str, is_online: bool, status: str = "online"):
        """Update user's online presence."""
        _, _, presence_collection, _ = self._get_collections()
        
        presence_data = {
            "user_id": user_id,
            "is_online": is_online,
            "last_seen": datetime.now(),
            "status": status
        }
        
        await presence_collection.update_one(
            {"user_id": user_id},
            {"$set": presence_data},
            upsert=True
        )

    async def get_user_presence(self, user_ids: List[str]) -> Dict[str, UserPresence]:
        """Get presence status for multiple users."""
        _, _, presence_collection, _ = self._get_collections()
        
        cursor = presence_collection.find({"user_id": {"$in": user_ids}})
        
        presence_map = {}
        async for presence_doc in cursor:
            presence_map[presence_doc["user_id"]] = UserPresence(**presence_doc)
        
        return presence_map

    async def get_online_users(self) -> List[str]:
        """Get list of currently online users."""
        _, _, presence_collection, _ = self._get_collections()
        
        # Users online in the last 5 minutes
        threshold = datetime.now() - timedelta(minutes=5)
        cursor = presence_collection.find({
            "is_online": True,
            "last_seen": {"$gte": threshold}
        })
        
        online_users = []
        async for presence_doc in cursor:
            online_users.append(presence_doc["user_id"])
        
        return online_users

    async def create_notification(self, user_id: str, chat_id: str, message_id: str, title: str, content: str):
        """Create a chat notification."""
        _, _, _, notifications_collection = self._get_collections()
        
        notification_id = str(uuid.uuid4())
        
        notification = ChatNotification(
            notification_id=notification_id,
            user_id=user_id,
            chat_id=chat_id,
            message_id=message_id,
            title=title,
            content=content
        )
        
        notification_doc = notification.dict()
        notification_doc["_id"] = notification_id
        
        await notifications_collection.insert_one(notification_doc)

    async def get_unread_notifications(self, user_id: str) -> List[ChatNotification]:
        """Get unread notifications for a user."""
        _, _, _, notifications_collection = self._get_collections()
        
        cursor = notifications_collection.find({
            "user_id": user_id,
            "is_read": False
        }).sort("created_at", -1).limit(20)
        
        notifications = []
        async for notification_doc in cursor:
            notifications.append(ChatNotification(**notification_doc))
        
        return notifications

def get_chat_service():
    """Get or create chat service instance."""
    return ChatService()

chat_service = get_chat_service()