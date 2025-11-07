import json
import re

def parse_llm_response(response: str) -> dict:
    """
        Parses the LLM response string into a dictionary.
        Expects the response to be a JSON string with keys: label, confidence, reason.
    """

    match = re.search(r'\{.*\}', response, re.DOTALL)

    if not match:
        raise ValueError("No JSON object found in the response.")
    
    json_str = match.group(0)
    data = json.loads(json_str)

    label = data.get("label")
    confidence = data.get("confidence")
    reason = data.get("reason")

    return {
        "label": label,
        "confidence": confidence,
        "reason": reason
    }
