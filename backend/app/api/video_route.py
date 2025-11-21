from fastapi import APIRouter, UploadFile, Form, File, HTTPException
from typing import Annotated, Optional
import tempfile
import os
from bson import ObjectId
from datetime import datetime
import uuid

from app.core.cloudinary_client import upload_video
from app.core.database import db
from app.feature_extraction.video_features import extract_video_features
from app.utils.llm_analysis import analyze_video_with_llm
from app.utils.logger import logger

router = APIRouter()

@router.post("/analyze")
async def analyze_video(
    email: Annotated[str, Form()], 
    mime_type: Annotated[str, Form()],
    chat_id: Annotated[Optional[str], Form()] = None,
    file: UploadFile = File(...)
):
    """
        Endpoint to upload and analyze the given video.
    """

    try:
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Upload video to Cloudinary
        document_url = upload_video(temp_file_path)
        logger.info(f"Video uploaded to Cloudinary: {document_url}")

        # Extract image features
        features = extract_video_features(temp_file_path)

        # Get the (label, confidence, reason) with the help of LLM + video features
        label, confidence, reason = analyze_video_with_llm(temp_file_path, features, mime_type)

        user_msg_id = str(uuid.uuid4())
        ai_msg_id = str(uuid.uuid4())

        user_message = {
            "id": user_msg_id,
            "role": "user",
            "type": "video",
            "content": document_url,
            "created_at": datetime.now()
        }

        ai_message = {
            "id": ai_msg_id,
            "role": "aidentify",
            "type": "video",
            "content": document_url,
            "label": label,
            "confidence": confidence,
            "reason": reason,
            "created_at": datetime.now()
        }

        if not chat_id or chat_id == "null" or chat_id == "":
            new_chat = {
                "user_email": email,
                "title": f"Video Analysis {datetime.now().strftime('%H:%M')}",
                "created_at": datetime.now(),
                "messages": [user_message, ai_message]
            }

            result = await db["chats"].insert_one(new_chat)
            chat_id = str(result.inserted_id)
        else:
            result = await db["chats"].update_one(
                {"_id": ObjectId(chat_id)},
                {"$push": {"messages": {"$each": [user_message, ai_message]}}}
            )

        logger.info(f"Analysis result: {result}")

        # Save the analysis result to the database
        return {
            "chat_id": chat_id,
            "user_message": user_message,
            "ai_message": ai_message
        }
    
    except Exception as e:
        logger.error(f"Error in uploading or analyzing video: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            logger.info(f"Temporary file {temp_file_path} deleted.")
