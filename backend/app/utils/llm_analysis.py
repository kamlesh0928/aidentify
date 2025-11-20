import google.generativeai as genai
import time

from app.config import Config
from app.utils.parse_llm_response import parse_llm_response
from app.utils.logger import logger

genai.configure(api_key=Config.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-pro")

def analyze_image_with_llm(temp_file_path: str, features: dict, mime_type: str) -> str:
    """
        Analyzes the image using a large language model(Gemini) to classify it as 'AI' or 'Real'.
    """

    # Upload the image to Gemini
    uploaded_image = genai.upload_file(temp_file_path, mime_type=mime_type)

    prompt = f"""
        You are an expert visual content analyst. Your task is to determine whether the provided image is 'AI' or 'Real'.

        You are given:
        - An input image file (uploaded separately).
        - A summary of its extracted computer vision features:
        {features}

        ### Instructions:
        1. Carefully analyze the image and the provided features.
        2. Decide whether the image is **AI** or **Real**.
        3. Estimate your **confidence score** between 0 and 1.
        4. Provide a **concise reason (≤ 30 words)** supporting your classification.

        ### Response Format (strictly follow this JSON structure):
        {{
        "label": "AI" | "Real",
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

def analyze_video_with_llm(temp_file_path: str, features: dict, mime_type: str) -> str:
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

        prompt = f"""
            You are an expert visual content analyst. Your task is to determine whether the provided image is 'AI' or 'Real'.

            You are given:
            - An input video file (uploaded separately).
            - A summary of its extracted computer vision features:
            {features}

            ### Instructions:
            1. Carefully analyze the image and the provided features.
            2. Decide whether the video is **AI** or **Real**.
            3. Estimate your **confidence score** between 0 and 1.
            4. Provide a **concise reason (≤ 30 words)** supporting your classification.

            ### Response Format (strictly follow this JSON structure):
            {{
            "label": "AI" | "Real",
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

def analyze_audio_with_llm(temp_file_path: str, features: dict, mime_type: str) -> str:
    """
        Analyzes the audio using a large language model(Gemini) to classify it as 'AI' or 'Real'.
    """

    uploaded_audio = None

    try:
        # Upload the audio to Gemini
        uploaded_audio = genai.upload_file(temp_file_path, mime_type=mime_type)

        prompt = f"""
            You are an expert audio forensics and content authenticity analyst.

            Your task is to determine whether the provided audio file was **AI** or **Real**.

            You are given:
            - An input audio file (uploaded separately)
            - Extracted low-level and spectral features from the audio signal:
            {features}

            ---

            ### Your analysis should consider:
            1. **Sound Type** — The audio could be anything: human voice, animal call, crowd sound, environmental noise, instrumental sound, or synthetic tone.  
            - Do NOT assume it is human speech.
            2. **Acoustic Realism** — Analyze whether the texture, dynamics, and noise patterns sound physically natural or digitally produced.
            3. **Artifacts & Anomalies** — Look for unnatural transitions, overly clean frequency bands, looping noise, repetitive textures, or artifacts typical of AI audio generation.
            4. **Statistical Cues** — Use the provided features (e.g., spectral centroid, MFCC smoothness, entropy, and RMS variation) to reason about naturalness and authenticity.
            5. **Broad Context Awareness** — Even if the sound has no words or recognizable meaning, judge its realism, depth, and recording consistency.

            ---

            ### Decision Task:
            Determine whether the audio is:
            - **"AI"** → if it shows synthetic or algorithmic characteristics, even if realistic.
            - **"Real"** → if it appears to be a naturally recorded or unaltered real-world sound.

            ---

            ### Response Format (strict JSON only):
            {{
            "label": "AI" | "Real",
            "confidence": float,  # between 0 and 1
            "reason": "string (≤ 30 words, explaining the key cues)"
            }}

            Return **only** the JSON object, with no explanations outside it.
        """

        response = model.generate_content([uploaded_audio, prompt])
        parsed_response = parse_llm_response(response.text)

        label = parsed_response.get("label")
        confidence = parsed_response.get("confidence")
        reason = parsed_response.get("reason")

        return label, confidence, reason

    except Exception as e:
        logger.error(f"Error in LLM analysis: {str(e)}")
        return f"Error in LLM analysis: {str(e)}"
    
    finally:
        # Clean up the uploaded audio from Gemini
        if uploaded_audio:
            genai.delete_file(uploaded_audio)
            logger.info("Cleaned up uploaded audio from Gemini.")
