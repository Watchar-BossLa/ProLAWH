from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"
    SYSTEM = "system"
    TYPING = "typing"

class ChatType(str, Enum):
    DIRECT = "direct"
    GROUP = "group"
    STUDY_GROUP = "study_group"
    MENTORSHIP = "mentorship"

class MessageStatus(str, Enum):
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"

class ChatMessage(BaseModel):
    message_id: str
    chat_id: str
    sender_id: str
    sender_name: str
    sender_avatar: Optional[str] = None
    content: str
    message_type: MessageType = MessageType.TEXT
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    reply_to: Optional[str] = None
    status: MessageStatus = MessageStatus.SENT
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

class ChatRoom(BaseModel):
    chat_id: str
    name: Optional[str] = None
    chat_type: ChatType
    participants: List[str]  # user_ids
    created_by: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    last_message: Optional[ChatMessage] = None
    is_active: bool = True

class UserPresence(BaseModel):
    user_id: str
    is_online: bool = False
    last_seen: datetime = Field(default_factory=datetime.now)
    status: str = "offline"  # offline, online, away, busy
    current_activity: Optional[str] = None

class ChatNotification(BaseModel):
    notification_id: str
    user_id: str
    chat_id: str
    message_id: str
    title: str
    content: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.now)

class MessageCreate(BaseModel):
    chat_id: str
    content: str
    message_type: MessageType = MessageType.TEXT
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    reply_to: Optional[str] = None

class ChatCreate(BaseModel):
    name: Optional[str] = None
    chat_type: ChatType
    participants: List[str]

class TypingIndicator(BaseModel):
    chat_id: str
    user_id: str
    user_name: str
    is_typing: bool