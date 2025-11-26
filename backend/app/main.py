from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import Config
from app.api.image_route import router as image_router
from app.api.video_route import router as video_router
from app.api.audio_route import router as audio_router
from app.api.chat_route import router as chat_router
from app.api.webhook_route import router as webhook_router

app = FastAPI(title="AIdentify Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.CLIENT_URL,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(image_router, prefix="/api/image", tags=["Image Analysis"])
app.include_router(video_router, prefix="/api/video", tags=["Video Analysis"])
app.include_router(audio_router, prefix="/api/audio", tags=["Audio Analysis"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat History"])
app.include_router(webhook_router, prefix="/api/webhook", tags=["Webhooks"])

@app.get("/")
def root():
    return {"message": f"Server is running on Port 5001"}
