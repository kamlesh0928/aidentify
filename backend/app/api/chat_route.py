from fastapi import APIRouter, HTTPException, Body
from typing import List
from bson import ObjectId

from app.core.database import db
from app.schemas.chat_schema import ChatSchema
from app.utils.logger import logger

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
    
    logger.info(f"Fetched chat history for user: {email}, total chats: {len(chats)}")
    return chats

@router.get("/{chat_id}", response_model=ChatSchema)
async def get_chat_details(chat_id: str):
    """
        Get a specific chat by chat_id
    """

    try:
        chat = await db["chats"].find_one({"_id": ObjectId(chat_id)})

        if not chat:
            logger.warning(f"Chat with chat_id: {chat_id} not found")
            raise HTTPException(status_code=404, detail="Chat not found")
        
        chat["_id"] = str(chat["_id"])
        logger.info(f"Fetched chat details for chat_id: {chat_id}")
        return chat
    
    except Exception:
        logger.error(f"Failed to get chat details for chat_id: {chat_id}")
        raise HTTPException(status_code=400, detail="Failed to get chat details")

@router.delete("/delete", response_model=dict)
async def delete_chat(
    email: str,
    chatId: str
):
    """
        Delete a specific chat by chat_id
    """

    try:
        result = await db["chats"].delete_one({"_id": ObjectId(chatId), "user_email": email})

        if result.deleted_count == 0:
            logger.warning(f"Chat with chat_id: {chatId} for user: {email} not found")
            raise HTTPException(status_code=404, detail="Chat not found")

        logger.info(f"Deleted chat with chat_id: {chatId} for user: {email}")
        return {"message": "Chat deleted successfully"}

    except Exception:
        logger.error(f"Failed to delete chat with chat_id: {chatId} for user: {email}")
        raise HTTPException(status_code=400, detail="Failed to delete chat")
