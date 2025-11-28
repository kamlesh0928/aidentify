from fastapi import APIRouter, UploadFile, Form, File, HTTPException
from typing import Annotated, Optional
import tempfile
import os
from bson import ObjectId
from datetime import datetime
import uuid
import shutil
import gc

from app.core.cloudinary_client import upload_audio
from app.core.database import db
from app.utils.llm_analysis import analyze_audio_with_llm
from app.utils.logger import logger

router = APIRouter()

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB in bytes

@router.post("/analyze")
async def analyze_audio(
    clerk_user_id: Annotated[str, Form()],
    email: Annotated[str, Form()], 
    mime_type: Annotated[str, Form()],
    chat_id: Annotated[Optional[str], Form()] = None,
    file: UploadFile = File(...)
):
    """
        Endpoint to upload and analyze the given audio file.
        Only .mp3 and .wav formats are supported.
    """
    
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size exceeds the 50MB limit.")

    try:
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
        
        # Verify size after saving (double check for safety)
        if os.path.getsize(temp_file_path) > MAX_FILE_SIZE:
             os.remove(temp_file_path)
             raise HTTPException(status_code=413, detail="File size exceeds the 50MB limit.")

        # Free up memory
        del file
        gc.collect()
        
        # Upload audio to Cloudinary
        document_url = upload_audio(temp_file_path)
        logger.info(f"Audio uploaded to Cloudinary: {document_url}")
        gc.collect() 

        # Get the (label, confidence, reason) from LLM
        label, confidence, reason = analyze_audio_with_llm(temp_file_path, mime_type)
        gc.collect()
        
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
                "clerk_user_id": clerk_user_id,
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

        return {
            "chat_id": chat_id,
            "user_message": user_message,
            "ai_message": ai_message
        }
    
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in uploading or analyzing audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            logger.info(f"Temporary file {temp_file_path} deleted.")
        gc.collect()