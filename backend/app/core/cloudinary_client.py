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
        Uploads image to Cloudinary.
    """

    folder_name = "AIdentify/images"
    response = cloudinary.uploader.upload(file_path, folder = folder_name, resource_type = "image")
    return response["secure_url"]

def upload_video(file_path: str) -> str:
    """
        Uploads video to Cloudinary.
    """

    folder_name = "AIdentify/videos"
    response = cloudinary.uploader.upload(file_path, folder = folder_name, resource_type = "video")
    return response["secure_url"]

def upload_audio(file_path: str) -> str:
    """
        Uploads audio to Cloudinary.
        Only .mp3 and .wav formats are supported.
    """

    folder_name = "AIdentify/audios"

    # Cloudinary uses resource_type "video" to store audio files.
    response = cloudinary.uploader.upload(file_path, folder = folder_name, resource_type = "video")
    return response["secure_url"]
