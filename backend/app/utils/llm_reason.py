import google.generativeai as genai
import os

from app.config import Config
from app.utils.logger import logger

genai.configure(api_key=Config.GEMINI_API_KEY)

def generate_reason(label: str, confidence: float, features: dict) -> str:
    """
        Generates a reason for the classification using a large language model(Gemini).
    """

    prompt = f"""
        An AI detection model classified an image as "{label}" with confidence {confidence:.2f}.
        Image feature summary: {features}.
        Explain briefly and clearly why the model might think this image is {label.lower()}.
        Use one or two sentences.
    """

    try:
        response = genai.GenerativeModel("gemini-2.5-flash").generate_content(prompt)
        return response.text.strip()

    except Exception as e:
        if label.lower().startswith("ai"):
            return "Detected synthetic patterns and smooth regions typical of AI generation."
        else:
            return "Image contains organic textures and lighting consistent with human photography."  
