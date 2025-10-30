from motor.motor_asyncio import AsyncIOMotorClient

from app.config import Config

client = AsyncIOMotorClient(Config.MONGO_URL)
db = client[Config.MONGO_DB_NAME]
