from bson import ObjectId
import re

from app.core.cloudinary_client import delete_resource
from app.core.database import db
from app.utils.logger import logger

def extract_public_id_from_url(url: str) -> str:
    """
        Extracts the public_id from a Cloudinary URL.
        Example URL: https://res.cloudinary.com/.../upload/v12345/AIdentify/images/xyz.png
        Returns: AIdentify/images/xyz
    """

    regex = r"upload/(?:v\d+/)?(.+)\.[a-zA-Z0-9]+$"
    match = re.search(regex, url)

    if match:
        return match.group(1)
    
    return None

async def delete_media_for_chat_id(chat_id: str):
    """
        Deletes all media which was used in a specific chat.
    """

    try:
        chat = await db["chats"].find_one({ "_id": ObjectId(chat_id) })

        if not chat:
            logger.error(f"Chat with chat_id: {chat_id} not found for media cleanup")
            return
        
        messages = chat.get("messages", [])

        for message in messages:
            if message["role"] == "user":
                media_url = message["content"]
                media_type = message["type"]

                if media_type == "audio":
                    media_type = "video" # Cloudinary uses resource_type "video" for audio files as well

                public_id = extract_public_id_from_url(media_url)

                if public_id:
                    await delete_resource(public_id, media_type)

        return

    except Exception as e:
        logger.error(f"Failed to delete media for chat_id: {chat_id}. Error: {e}")
        return

async def clear_media_for_user(email: str):
    """
        Deletes all media which is associated with a specific user.
    """

    try:
        chats = await db["chats"].find({ "user_email": email }).to_list(length=None)

        for chat in chats:
            await delete_media_for_chat_id(str(chat["_id"]))
        
        return
    
    except Exception as e:
        logger.error(f"Failed to clear media for user: {email}. Error: {e}")
        return
