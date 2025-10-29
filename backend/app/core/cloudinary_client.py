import cloudinary
import cloudinary.uploader
from app.config import Config

cloudinary.config(
    cloud_name = Config.CLOUDINARY_CLOUD_NAME,
    api_key = Config.CLOUDINARY_API_KEY,
    api_secret = Config.CLOUDINARY_API_SECRET
)

def upload_image(file_path: str) -> str:
    """
        Uploads image to Clodinary.
    """

    folder_name = "AIdentify/images"
    response = cloudinary.uploader.upload(file_path, folder_name = folder_name)
    return response["secure_url"]