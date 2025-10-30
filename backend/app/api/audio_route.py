from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile

from app.core.cloudinary_client import upload_audio
from app.schemas.result_schema import ResultSchema
from app.crud.store_result import save_analysis_result
from app.utils.logger import logger

router = APIRouter()

@router.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    """
        Endpoint to upload and analyze the given audio.
        Only .mp3 and .wav formats are supported.
    """

    # Currently only uploads the audio and returns the URL.
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        document_url = upload_audio(temp_file_path)
        logger.info(f"Audio uploaded to Cloudinary: {document_url}")

        result = ResultSchema(
            user_id="example_user_id",
            document_type="audio",
            label="example_label",
            document_url=document_url,
            confidence=0.95,
            reason="example_reason"
        )

        await save_analysis_result(result, "audio")
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
