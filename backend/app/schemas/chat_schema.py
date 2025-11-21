from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class MessageSchema(BaseModel):
    id: str = Field(..., description="Unique ID for the message")
    role: str       # [user, aidentify]
    type: str       # [image, video, audio]
    content: str    # URL of media uploaded
    label: Optional[str] = None   # [AI, Real]
    confidence: Optional[float] = None
    reason: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

class ChatSchema(BaseModel):
    id: str = Field(..., alias="_id")
    user_email: str
    title: str
    created_at: datetime = Field(default_factory=datetime.now)
    messages: List[MessageSchema] = []

class ChatCreate(BaseModel):
    email: str
