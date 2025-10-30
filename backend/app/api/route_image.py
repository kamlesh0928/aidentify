from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.cloudinary_client import upload_image
import tempfile

router = APIRouter()

@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """
        Endpoint to upload and analyze the given image.
    """

    # Currently only uploads the image and returns the URL.
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        image_url = upload_image(temp_file_path)

        return {
            "message": "Image uploaded successfully",
            "image_url": image_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
