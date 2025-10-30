from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.cloudinary_client import upload_audio
import tempfile

router = APIRouter()

@router.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    """
        Endpoint to upload and analyze the given audio.
        Only .mp3 and .wav formats are supported.
    """
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        audio_url = upload_audio(temp_file_path)

        return {
            "message": "Audio uploaded successfully",
            "audio_url": audio_url
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
