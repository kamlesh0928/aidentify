from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.image_route import router as image_router
from app.api.video_route import router as video_router
from app.api.audio_route import router as audio_router

app = FastAPI(title="AIdentify Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(image_router, prefix="/api/image", tags=["Image Analysis"])
app.include_router(video_router, prefix="/api/video", tags=["Video Analysis"])
app.include_router(audio_router, prefix="/api/audio", tags=["Audio Analysis"])

@app.get("/")
def root():
    return {"message": f"Server is running on Port 5001"}
