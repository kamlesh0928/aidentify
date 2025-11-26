from fastapi import APIRouter, Request, HTTPException, Header
from svix.webhooks import Webhook, WebhookVerificationError

from app.config import Config
from app.core.database import db
from app.crud.media_cleanup import delete_media_for_chat_id
from app.utils.logger import logger

router = APIRouter()

@router.post("/clerk")
async def clerk_webhook(
    request: Request,
    svix_id: str = Header(..., alias="svix_id"),
    svix_timestamp: str = Header(..., alias="svix-timestamp"),
    svix_signature: str = Header(..., alias="svix-signature")
):
    """
        This endpoint handles Clerk webhooks when a user deletes their account.
        So that we can delete all media associated and chats with that user.
    """

    headers = {
        "svix_id": svix_id,
        "svix_timestamp": svix_timestamp,
        "svix_signature": svix_signature
    }

    payload = await request.body()

    try:
        wehbook = Webhook(Config.CLERK_WEBHOOK_SECRET)
        event = wehbook.verify(payload, headers)
    
    except WebhookVerificationError as e:
        logger.error(f"Clerk Webhook verification failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
    
    event_type = event["type"]

    if event_type == "user.deleted":
        user_id = event["data"]["id"]

        # Delete all media and chats associated with this user
        chats = await db["chats"].find({ "clerk_user_id": user_id }).to_list(length=None)

        for chat in chats:
            chat_id = str(chat["_id"])
            await delete_media_for_chat_id(chat_id)

        result = await db["chats"].delete_many({ "clerk_user_id": user_id })
        logger.info(f"Deleted {result.deleted_count} chats for Clerk user ID: {user_id}")
    
    return {"status": "success"}
