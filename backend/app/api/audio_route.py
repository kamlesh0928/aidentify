from fastapi import APIRouter, UploadFile, Form, File, HTTPException
from typing import Annotated, Optional
import tempfile
import os
from bson import ObjectId
from datetime import datetime
import uuid

from app.core.cloudinary_client import upload_audio
from app.core.database import db
from app.feature_extraction.audio_features import extract_audio_features
from app.utils.llm_analysis import analyze_audio_with_llm
from app.utils.logger import logger

router = APIRouter()

@router.post("/analyze")
async def analyze_audio(
    email: Annotated[str, Form()], 
    mime_type: Annotated[str, Form()],
    chat_id: Annotated[Optional[str], Form()] = None,
    file: UploadFile = File(...)
):
    """
        Endpoint to upload and analyze the given audio file.
        Only .mp3 and .wav formats are supported.
    """

    try:
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Upload audio to Cloudinary
        document_url = upload_audio(temp_file_path)
        logger.info(f"Audio uploaded to Cloudinary: {document_url}")

        # Extract audio features
        features = extract_audio_features(temp_file_path)

        # Get the (label, confidence, reason) with the help of LLM + audio features
        label, confidence, reason = analyze_audio_with_llm(temp_file_path, features, mime_type)

        user_msg_id = str(uuid.uuid4())
        ai_msg_id = str(uuid.uuid4())

        user_message = {
            "id": user_msg_id,
            "role": "user",
            "type": "audio",
            "content": document_url,
            "created_at": datetime.now()
        }

        ai_message = {
            "id": ai_msg_id,
            "role": "aidentify",
            "type": "audio",
            "content": document_url,
            "label": label,
            "confidence": confidence,
            "reason": reason,
            "created_at": datetime.now()
        }

        if not chat_id or chat_id == "null" or chat_id == "":
            new_chat = {
                "user_email": email,
                "title": f"Audio Analysis {datetime.now().strftime('%H:%M')}",
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
        logger.error(f"Error in uploading or analyzing audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            logger.info(f"Temporary file {temp_file_path} deleted.")
