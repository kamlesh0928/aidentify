from pydantic import BaseModel

class ResultSchema(BaseModel):
    user_email: str
    document_type: str  # [audio, image, video]
    label: str          # [AI, Real]
    document_url: str
    confidence: float   # [0.00, 1.00]
    reason: str
    