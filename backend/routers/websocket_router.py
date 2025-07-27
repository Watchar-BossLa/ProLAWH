import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from jose import jwt, JWTError
from websocket_manager import manager
from services.user_service import get_user_service

# JWT settings
SECRET_KEY = "prolawh-secret-key-2025"
ALGORITHM = "HS256"

websocket_router = APIRouter()

async def get_user_from_token(token: str):
    """Extract user info from JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            return None
        
        user_service = get_user_service()
        user = await user_service.get_user(user_id)
        return user
    except JWTError:
        return None

@websocket_router.websocket("/ws/chat/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    """WebSocket endpoint for real-time chat."""
    
    # Authenticate user
    user = await get_user_from_token(token)
    if not user:
        await websocket.close(code=4001)
        return
    
    # Connect user
    connection_id = await manager.connect(websocket, user.user_id)
    
    try:
        while True:
            # Receive message
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Handle message
            await manager.handle_message(websocket, user.user_id, user.full_name, message_data)
            
    except WebSocketDisconnect:
        await manager.disconnect(connection_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await manager.disconnect(connection_id)