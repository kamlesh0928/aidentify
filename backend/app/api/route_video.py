from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.cloudinary_client import upload_video
import tempfile

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
        
        video_url = upload_video(temp_file_path)

        return {
            "message": "Video uploaded successfully",
            "video_url": video_url
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
