import google.generativeai as genai
import time

from app.config import Config
from app.utils.detect_mime_type import detect_mime_type
from app.utils.parse_llm_response import parse_llm_response
from app.utils.logger import logger

genai.configure(api_key=Config.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-pro")

def analyze_image_with_llm(temp_file_path: str, features: dict) -> str:
    """
        Generates a reason for the classification using a large language model(Gemini).
    """

    # Detect the MIME type of the image
    mime_type = detect_mime_type(temp_file_path)

    # Upload the image to Gemini
    uploaded_image = genai.upload_file(temp_file_path, mime_type=mime_type)

    prompt = f"""
        You are an expert visual content analyst. Your task is to determine whether the provided image is 'AI Generated' or 'Not AI Generated'.

        You are given:
        - An input image file (uploaded separately).
        - A summary of its extracted computer vision features:
        {features}

        ### Instructions:
        1. Carefully analyze the image and the provided features.
        2. Decide whether the image is **AI Generated** or **Not AI Generated**.
        3. Estimate your **confidence score** between 0 and 1.
        4. Provide a **concise reason (≤ 30 words)** supporting your classification.

        ### Response Format (strictly follow this JSON structure):
        {{
        "label": "AI Generated" | "Not AI Generated",
        "confidence": float,  # between 0 and 1
        "reason": "string (≤ 30 words)"
        }}

        Return **only** the JSON object, with no extra text or explanation.
    """

    try:
        response = model.generate_content([uploaded_image, prompt])
        parsed_response = parse_llm_response(response.text)

        label = parsed_response.get("label")
        confidence = parsed_response.get("confidence")
        reason = parsed_response.get("reason")

        return label, confidence, reason

    except Exception as e:
        logger.error(f"Error in LLM analysis: {str(e)}")
        return f"Error in LLM analysis: {str(e)}"
    
    finally:
        # Clean up the uploaded image from Gemini
        if uploaded_image:
            genai.delete_file(uploaded_image)
            logger.info("Cleaned up uploaded image from Gemini.")

def analyze_video_with_llm(temp_file_path: str, features: dict) -> str:
    """
        Generates a reason for the classification using a large language model(Gemini).
    """

    mime_type = detect_mime_type(temp_file_path)    # Detect the MIME type of the video
    uploaded_video = None

    try:
        # Upload the video to Gemini
        uploaded_video = genai.upload_file(temp_file_path, mime_type=mime_type)

        # Wait until the video is fully processed
        while uploaded_video.state.name != "ACTIVE":
            time.sleep(2)
            uploaded_video = genai.get_file(uploaded_video.name)

        prompt = f"""
            You are an expert visual content analyst. Your task is to determine whether the provided image is 'AI Generated' or 'Not AI Generated'.

            You are given:
            - An input video file (uploaded separately).
            - A summary of its extracted computer vision features:
            {features}

            ### Instructions:
            1. Carefully analyze the image and the provided features.
            2. Decide whether the video is **AI Generated** or **Not AI Generated**.
            3. Estimate your **confidence score** between 0 and 1.
            4. Provide a **concise reason (≤ 30 words)** supporting your classification.

            ### Response Format (strictly follow this JSON structure):
            {{
            "label": "AI Generated" | "Not AI Generated",
            "confidence": float,  # between 0 and 1
            "reason": "string (≤ 30 words)"
            }}

            Return **only** the JSON object, with no extra text or explanation.
        """

        response = model.generate_content([uploaded_video, prompt])
        parsed_response = parse_llm_response(response.text)

        label = parsed_response.get("label")
        confidence = parsed_response.get("confidence")
        reason = parsed_response.get("reason")

        return label, confidence, reason

    except Exception as e:
        logger.error(f"Error in LLM analysis: {str(e)}")
        return f"Error in LLM analysis: {str(e)}"
    
    finally:
        # Clean up the uploaded video from Gemini
        if uploaded_video:
            genai.delete_file(uploaded_video)
            logger.info("Cleaned up uploaded video from Gemini.")
