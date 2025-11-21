from fastapi import APIRouter, HTTPException, Query
from typing import List
from bson import ObjectId

from app.core.database import db
from app.schemas.chat_schema import ChatSchema

router = APIRouter()

@router.get("/history", response_model=List[ChatSchema])
async def get_chat_history(email: str):
    """
        Get all chat history of user and sort them by newest first.
    """

    chats = await db["chats"].find({"user_email": email}).sort("created_at", -1).to_list(length=None)

    # Convert ObjectId to string pydantic
    for chat in chats:
        chat["_id"] = str(chat["_id"])
    
    return chats

@router.get("/{chat_id}", response_model=ChatSchema)
async def get_chat_details(chat_id: str):
    """
        Get a specific chat by chat_id
    """

    try:
        chat = await db["chats"].find_one({"_id": ObjectId(chat_id)})

        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        chat["_id"] = str(chat["_id"])
        return chat
    
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Chat ID")
