from app.schemas.result_schema import ResultSchema
from app.core.database import db
from app.utils.logger import logger

collection = db.get_collection("results")

async def save_analysis_result(result: ResultSchema, file_type: str):
    """
        Save the analysis result of audio, image and video to the database.
    """

    try:
        # Determine document structure based on file type
        if (file_type == "image"):      # Save image result
            document = {
                "user_id": result.user_id,
                "document_type": "image",
                "label": result.label,
                "document_url": result.document_url,
                "confidence": result.confidence,
                "reason": result.reason,
            }

            result = await collection.insert_one(document)

            logger.info(f"Image analysis result saved with id: {result.inserted_id}")
            return str(result.inserted_id)
        
        elif (file_type == "video"):    # Save video result
            document = {
                "user_id": result.user_id,
                "document_type": "video",
                "label": result.label,
                "document_url": result.document_url,
                "confidence": result.confidence,
                "reason": result.reason,
            }

            result = await collection.insert_one(document)

            logger.info(f"Video analysis result saved with id: {result.inserted_id}")
            return str(result.inserted_id)
        
        elif (file_type == "audio"):    # Save audio result
            document = {
                "user_id": result.user_id,
                "document_type": "audio",
                "label": result.label,
                "document_url": result.document_url,
                "confidence": result.confidence,
                "reason": result.reason,
            }

            result = await collection.insert_one(document)

            logger.info(f"Audio result saved with id: {result.inserted_id}")
            return str(result.inserted_id)
    
    except Exception as e:
        logger.error(f"Error saving {file_type} analysis result: {str(e)}")
        return None
