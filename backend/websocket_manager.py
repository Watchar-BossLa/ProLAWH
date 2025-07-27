import json
import uuid
from typing import Dict, Set, List, Optional
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime
from models.chat import TypingIndicator, MessageCreate, MessageType
from services.chat_service import chat_service

class ConnectionManager:
    def __init__(self):
        # Active WebSocket connections: {user_id: {connection_id: WebSocket}}
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}
        # User to connection mapping: {connection_id: user_id}
        self.connection_to_user: Dict[str, str] = {}
        # Chat room subscriptions: {chat_id: {user_id}}
        self.chat_subscriptions: Dict[str, Set[str]] = {}
        # Typing indicators: {chat_id: {user_id: timestamp}}
        self.typing_indicators: Dict[str, Dict[str, datetime]] = {}

    async def connect(self, websocket: WebSocket, user_id: str) -> str:
        """Accept a WebSocket connection and register user."""
        await websocket.accept()
        
        connection_id = str(uuid.uuid4())
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = {}
        
        self.active_connections[user_id][connection_id] = websocket
        self.connection_to_user[connection_id] = user_id
        
        # Update user presence
        await chat_service.update_user_presence(user_id, is_online=True)
        
        # Notify about user coming online
        await self.broadcast_user_status(user_id, "online")
        
        return connection_id

    async def disconnect(self, connection_id: str):
        """Disconnect and unregister user."""
        if connection_id in self.connection_to_user:
            user_id = self.connection_to_user[connection_id]
            
            # Remove connection
            if user_id in self.active_connections:
                self.active_connections[user_id].pop(connection_id, None)
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
                    
                    # Update user presence to offline
                    await chat_service.update_user_presence(user_id, is_online=False, status="offline")
                    
                    # Notify about user going offline
                    await self.broadcast_user_status(user_id, "offline")
            
            del self.connection_to_user[connection_id]
            
            # Remove from chat subscriptions
            for chat_id in list(self.chat_subscriptions.keys()):
                self.chat_subscriptions[chat_id].discard(user_id)
                if not self.chat_subscriptions[chat_id]:
                    del self.chat_subscriptions[chat_id]

    async def subscribe_to_chat(self, user_id: str, chat_id: str):
        """Subscribe user to a chat room."""
        if chat_id not in self.chat_subscriptions:
            self.chat_subscriptions[chat_id] = set()
        
        self.chat_subscriptions[chat_id].add(user_id)

    async def unsubscribe_from_chat(self, user_id: str, chat_id: str):
        """Unsubscribe user from a chat room."""
        if chat_id in self.chat_subscriptions:
            self.chat_subscriptions[chat_id].discard(user_id)

    async def send_personal_message(self, message: dict, user_id: str):
        """Send message to a specific user (all their connections)."""
        if user_id in self.active_connections:
            for websocket in self.active_connections[user_id].values():
                try:
                    await websocket.send_text(json.dumps(message))
                except:
                    pass

    async def broadcast_to_chat(self, message: dict, chat_id: str, exclude_user: Optional[str] = None):
        """Broadcast message to all users in a chat room."""
        if chat_id in self.chat_subscriptions:
            for user_id in self.chat_subscriptions[chat_id]:
                if exclude_user and user_id == exclude_user:
                    continue
                await self.send_personal_message(message, user_id)

    async def broadcast_user_status(self, user_id: str, status: str):
        """Broadcast user online/offline status to relevant users."""
        # Get all chats the user is part of
        user_chats = await chat_service.get_user_chats(user_id)
        
        notified_users = set()
        for chat in user_chats:
            for participant_id in chat.participants:
                if participant_id != user_id and participant_id not in notified_users:
                    await self.send_personal_message({
                        "type": "user_status",
                        "user_id": user_id,
                        "status": status,
                        "timestamp": datetime.now().isoformat()
                    }, participant_id)
                    notified_users.add(participant_id)

    async def handle_typing_indicator(self, user_id: str, user_name: str, chat_id: str, is_typing: bool):
        """Handle typing indicators."""
        if chat_id not in self.typing_indicators:
            self.typing_indicators[chat_id] = {}
        
        if is_typing:
            self.typing_indicators[chat_id][user_id] = datetime.now()
        else:
            self.typing_indicators[chat_id].pop(user_id, None)
        
        # Broadcast typing status to chat participants
        await self.broadcast_to_chat({
            "type": "typing",
            "chat_id": chat_id,
            "user_id": user_id,
            "user_name": user_name,
            "is_typing": is_typing,
            "timestamp": datetime.now().isoformat()
        }, chat_id, exclude_user=user_id)

    async def handle_message(self, websocket: WebSocket, user_id: str, user_name: str, data: dict):
        """Handle incoming WebSocket messages."""
        message_type = data.get("type")
        
        if message_type == "join_chat":
            chat_id = data.get("chat_id")
            await self.subscribe_to_chat(user_id, chat_id)
            await websocket.send_text(json.dumps({
                "type": "joined_chat",
                "chat_id": chat_id,
                "status": "success"
            }))
        
        elif message_type == "leave_chat":
            chat_id = data.get("chat_id")
            await self.unsubscribe_from_chat(user_id, chat_id)
            await websocket.send_text(json.dumps({
                "type": "left_chat",
                "chat_id": chat_id,
                "status": "success"
            }))
        
        elif message_type == "send_message":
            message_data = MessageCreate(
                chat_id=data.get("chat_id"),
                content=data.get("content"),
                message_type=MessageType(data.get("message_type", "text")),
                reply_to=data.get("reply_to")
            )
            
            # Save message to database
            message = await chat_service.send_message(user_id, user_name, message_data)
            
            # Broadcast to chat participants
            await self.broadcast_to_chat({
                "type": "new_message",
                "message": message.dict(),
                "timestamp": datetime.now().isoformat()
            }, message_data.chat_id)
        
        elif message_type == "typing":
            chat_id = data.get("chat_id")
            is_typing = data.get("is_typing", False)
            await self.handle_typing_indicator(user_id, user_name, chat_id, is_typing)
        
        elif message_type == "mark_read":
            chat_id = data.get("chat_id")
            message_ids = data.get("message_ids", [])
            await chat_service.mark_messages_as_read(chat_id, user_id, message_ids)
            
            # Notify other participants
            await self.broadcast_to_chat({
                "type": "messages_read",
                "chat_id": chat_id,
                "user_id": user_id,
                "message_ids": message_ids
            }, chat_id, exclude_user=user_id)

# Global connection manager instance
manager = ConnectionManager()