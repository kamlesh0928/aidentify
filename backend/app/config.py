import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    CLOUDINARY_CLOUD_NAME=os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY=os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET=os.getenv("CLOUDINARY_API_SECRET")
    MONGO_URL=os.getenv("MONGO_URL")
    MONGO_DB_NAME=os.getenv("MONGO_DB_NAME")
    GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")
    CLIENT_URL=os.getenv("CLIENT_URL")
