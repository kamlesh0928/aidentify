import google.generativeai as genai
import time

from app.config import Config
from app.utils.parse_llm_response import parse_llm_response
from app.utils.logger import logger

genai.configure(api_key=Config.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-3-flash-preview")

def analyze_image_with_llm(temp_file_path: str, mime_type: str) -> str:
    """
        Analyzes the image using a large language model(Gemini) to classify it as 'AI' or 'Real'.
    """

    uploaded_image = None
    
    try:
        # Upload the image to Gemini
        uploaded_image = genai.upload_file(temp_file_path, mime_type=mime_type)

        prompt = """
            You are an expert visual content analyst. Your task is to determine whether the provided image is 'AI' or 'Real'.

            ### Instructions:
            1. Carefully analyze the visual details of the image.
            2. Decide whether the image is **AI-generated** or **Real**.
            3. Estimate your **confidence score** between 0 and 1.
            4. Provide a **concise reason (≤ 30 words)** supporting your classification. Use simple English to ensure clarity.

            ### Response Format (strictly follow this JSON structure):
            {
            "label": "AI" | "Real",
            "confidence": float,
            "reason": "string (≤ 30 words)"
            }

            Return **only** the JSON object, with no extra text.
        """

        response = model.generate_content([uploaded_image, prompt])
        parsed_response = parse_llm_response(response.text)

        label = parsed_response.get("label")
        confidence = parsed_response.get("confidence")
        reason = parsed_response.get("reason")

        return label, confidence, reason

    except Exception as e:
        logger.error(f"Error in LLM analysis: {str(e)}")
        return "Unknown", 0.0, f"Error: {str(e)}"
    
    finally:
        if uploaded_image:
            genai.delete_file(uploaded_image)
            logger.info("Cleaned up uploaded image from Gemini.")

def analyze_video_with_llm(temp_file_path: str, mime_type: str) -> str:
    """
        Analyzes the video using a large language model(Gemini) to classify it as 'AI' or 'Real'.
    """
    
    uploaded_video = None
    
    try:
        # Upload the video to Gemini
        uploaded_video = genai.upload_file(temp_file_path, mime_type=mime_type)

        # Wait until the video is fully processed
        while uploaded_video.state.name != "ACTIVE":
            time.sleep(2)
            uploaded_video = genai.get_file(uploaded_video.name)

        prompt = """
            You are an expert visual content analyst. Your task is to determine whether the provided video is 'AI' or 'Real'.

            ### Instructions:
            1. Carefully analyze the visual consistency, physics, and artifacts in the video.
            2. Decide whether the video is **AI-generated** or **Real**.
            3. Estimate your **confidence score** between 0 and 1.
            4. Provide a **concise reason (≤ 30 words)** supporting your classification. Use simple English to ensure clarity.

            ### Response Format (strictly follow this JSON structure):
            {
            "label": "AI" | "Real",
            "confidence": float,
            "reason": "string (≤ 30 words)"
            }

            Return **only** the JSON object, with no extra text.
        """

        response = model.generate_content([uploaded_video, prompt])
        parsed_response = parse_llm_response(response.text)

        label = parsed_response.get("label")
        confidence = parsed_response.get("confidence")
        reason = parsed_response.get("reason")

        return label, confidence, reason

    except Exception as e:
        logger.error(f"Error in LLM analysis: {str(e)}")
        return "Unknown", 0.0, f"Error: {str(e)}"
    
    finally:
        if uploaded_video:
            genai.delete_file(uploaded_video)
            logger.info("Cleaned up uploaded video from Gemini.")

def analyze_audio_with_llm(temp_file_path: str, mime_type: str) -> str:
    """
        Analyzes the audio using a large language model(Gemini) to classify it as 'AI' or 'Real'.
    """
    
    uploaded_audio = None
    
    try:
        # Upload the audio to Gemini
        uploaded_audio = genai.upload_file(temp_file_path, mime_type=mime_type)

        prompt = """
            You are an expert audio forensics analyst. Your task is to determine whether the provided audio file is **AI** or **Real**.

            ### Instructions:
            1. Listen for acoustic realism, breathing patterns, artifacts, and digital anomalies.
            2. Decide whether the audio is **AI-generated** or **Real**.
            3. Estimate your **confidence score** between 0 and 1.
            4. Provide a **concise reason (≤ 30 words)** supporting your classification. Use simple English to ensure clarity.

            ### Response Format (strictly follow this JSON structure):
            {
            "label": "AI" | "Real",
            "confidence": float,
            "reason": "string (≤ 30 words)"
            }

            Return **only** the JSON object, with no extra text.
        """

        response = model.generate_content([uploaded_audio, prompt])
        parsed_response = parse_llm_response(response.text)

        label = parsed_response.get("label")
        confidence = parsed_response.get("confidence")
        reason = parsed_response.get("reason")

        return label, confidence, reason

    except Exception as e:
        logger.error(f"Error in LLM analysis: {str(e)}")
        return "Unknown", 0.0, f"Error: {str(e)}"
    
    finally:
        if uploaded_audio:
            genai.delete_file(uploaded_audio)
            logger.info("Cleaned up uploaded audio from Gemini.")