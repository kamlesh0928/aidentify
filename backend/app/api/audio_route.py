from fastapi import APIRouter, UploadFile, Form, File, HTTPException
from typing import Annotated
import tempfile
import os

from app.core.cloudinary_client import upload_audio
from app.schemas.result_schema import ResultSchema
from app.crud.store_result import save_analysis_result
from app.feature_extraction.audio_features import extract_audio_features
from app.utils.llm_analysis import analyze_audio_with_llm
from app.utils.logger import logger

router = APIRouter()

@router.post("/analyze", response_model=ResultSchema)
async def analyze_audio(
    email: Annotated[str, Form()], 
    mime_type: Annotated[str, Form()],
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

        result = ResultSchema(
            user_email=email,
            document_type="audio",
            label=label,
            document_url=document_url,
            confidence=confidence,
            reason=reason
        )

        logger.info(f"Analysis result: {result}")

        # Save the analysis result to the database
        await save_analysis_result(result, "audio")
        return result
    
    except Exception as e:
        logger.error(f"Error in uploading or analyzing audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            logger.info(f"Temporary file {temp_file_path} deleted.")
