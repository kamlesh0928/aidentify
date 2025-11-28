import cloudinary
import cloudinary.uploader

from app.config import Config
from app.utils.logger import logger

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
    response = cloudinary.uploader.upload_large(file_path, folder = folder_name, resource_type = "video")
    return response["secure_url"]

def delete_resource(public_id: str, resource_type: str) -> dict:
    """
        Deletes image, video or audio from Clodinary.
    """

    try:
        response = cloudinary.uploader.destroy(public_id=public_id, resource_type=resource_type)
        
        logger.info(f"Deleted resource with public_id: {public_id} from Cloudinary.")
        return response
    
    except Exception as e:
        logger.error(f"Failed to delete resource with public_id: {public_id}. Error: {e}")
        return None
