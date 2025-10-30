from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile

from app.core.cloudinary_client import upload_video
from app.schemas.result_schema import ResultSchema
from app.crud.store_result import save_analysis_result
from app.utils.logger import logger

router = APIRouter()

@router.post("/analyze")
async def analyze_video(file: UploadFile = File(...)):
    """
        Endpoint to upload and analyze the given video.
    """

    # Currently only uploads the video and returns the URL.
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        document_url = upload_video(temp_file_path)
        logger.info(f"Video uploaded to Cloudinary: {document_url}")

        result = ResultSchema(
            user_id="example_user_id",
            document_type="video",
            label="example_label",
            document_url=document_url,
            confidence=0.95,
            reason="example_reason"
        )

        await save_analysis_result(result, "video")
        return result
    
    except Exception as e:
        logger.error(f"Error in uploading or analyzing video: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
