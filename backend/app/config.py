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
    CLIENT_URL_1=os.getenv("CLIENT_URL_1")
    CLIENT_URL_2=os.getenv("CLIENT_URL_2")
    CLIENT_URL_3=os.getenv("CLIENT_URL_3")
    CLERK_WEBHOOK_SECRET=os.getenv("CLERK_WEBHOOK_SECRET")
