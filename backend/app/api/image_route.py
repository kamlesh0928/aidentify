from fastapi import APIRouter, UploadFile, File, HTTPException
from transformers import pipeline
import tempfile

from app.core.cloudinary_client import upload_image
from app.schemas.result_schema import ResultSchema
from app.crud.store_result import save_analysis_result
from app.utils.image_features import extract_image_features
from app.utils.llm_reason import generate_reason
from app.utils.logger import logger
from app.config import Config

router = APIRouter()

MODEL_NAME = Config.IMAGE_ANALYSIS_MODEL_NAME
detector = pipeline("image-classification", model=MODEL_NAME)

@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """
        Endpoint to upload and analyze the given image.
    """

    try:
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        # Upload image to Cloudinary
        document_url = upload_image(temp_file_path)
        logger.info(f"Image uploaded to Cloudinary: {document_url}")

        # Analyze image using the pre-trained model
        results = detector(temp_file_path)
        top_result = results[0]
        label = top_result["label"]
        confidence = round(top_result["score"], 2)

        # Extract image features
        features = extract_image_features(temp_file_path)

        # Generate reason using LLM
        reason = generate_reason(label, confidence, features)

        result = ResultSchema(
            user_id="example_user_id",
            document_type="image",
            label=label,
            document_url=document_url,
            confidence=confidence,
            reason=reason
        )

        logger.info(f"Analysis result: {result}")

        # Save the analysis result to the database
        await save_analysis_result(result, "image")
        return result

    except Exception as e:
        logger.error(f"Error in uploading or analyzing image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
