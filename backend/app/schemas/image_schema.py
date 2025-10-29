from pydantic import BaseModel

class ImageSchema(BaseModel):
    label: str
    image_url: str
    confidence: float