from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os

from app.core.cloudinary_client import upload_video
from app.schemas.result_schema import ResultSchema
from app.crud.store_result import save_analysis_result
from app.feature_extraction.video_features import extract_video_features
from app.utils.llm_analysis import analyze_video_with_llm
from app.utils.logger import logger

router = APIRouter()

@router.post("/analyze")
async def analyze_video(file: UploadFile = File(...)):
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
        label, confidence, reason = analyze_video_with_llm(temp_file_path, features)

        result = ResultSchema(
            user_id="example_user_id",
            document_type="video",
            label=label,
            document_url=document_url,
            confidence=confidence,
            reason=reason
        )

        logger.info(f"Analysis result: {result}")

        # Save the analysis result to the database
        await save_analysis_result(result, "video")
        return result
    
    except Exception as e:
        logger.error(f"Error in uploading or analyzing video: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            logger.info(f"Temporary file {temp_file_path} deleted.")
