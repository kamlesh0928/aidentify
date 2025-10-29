from fastapi import FastAPI

from app.config import Config
from app.api.routes_image import router as image_router

app = FastAPI(title="AIdentify Backend")

app.include_router(image_router, prefix = "/api/analyze-image", tags = ["Image Analysis"])

@app.get("/")
def root():
    return {"message": f"Server is running on Port 5001"}
