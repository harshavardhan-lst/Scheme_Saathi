import os
import logging
from typing import Any
import google.generativeai as genai
from dotenv import load_dotenv
from app.utils.exceptions import AIServiceError

load_dotenv()

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
genai.configure(api_key=GEMINI_API_KEY)

CHAT_MODEL = "models/gemini-3.5-flash"
EMBED_MODEL = "models/gemini-embedding-001"


def generate_text(prompt: str, max_tokens: int = 1024) -> str:
    """
    Call Gemini to generate text for a given prompt.
    Raises AIServiceError on failure.
    """
    try:
        model = genai.GenerativeModel(CHAT_MODEL)
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(max_output_tokens=max_tokens),
        )
        return response.text
    except Exception as e:
        logger.error(f"Gemini generate_text failed: {e}")
        raise AIServiceError(f"Gemini API error: {str(e)}")


def generate_embedding(text: str) -> list[float]:
    """
    Generate a text embedding vector using Gemini embeddings.
    Returns a list of floats (dimension depends on model, ~768).
    Raises AIServiceError on failure.
    """
    try:
        result = genai.embed_content(
            model=EMBED_MODEL,
            content=text,
            task_type="retrieval_document",
        )
        return result["embedding"]
    except Exception as e:
        logger.error(f"Gemini embed_content failed: {e}")
        raise AIServiceError(f"Gemini embedding error: {str(e)}")
