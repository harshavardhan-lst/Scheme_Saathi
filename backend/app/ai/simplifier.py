import logging
from app.ai.gemini_client import generate_text

logger = logging.getLogger(__name__)

LANGUAGE_NAMES = {"en": "English", "hi": "Hindi", "te": "Telugu"}

SIMPLIFY_PROMPT = """You are a plain-language rewriter for government scheme information targeting citizens with low literacy in India.

TASK: Rewrite the following official text in simple, clear {language}. 
- Use short sentences.
- Avoid bureaucratic jargon.
- Do NOT add any new facts, amounts, or requirements not present in the original text.
- Preserve all numbers, dates, and amounts exactly as given.
- Aim for a reading level of Class 7.

ORIGINAL TEXT:
{original_text}

SIMPLIFIED VERSION (in {language} only):"""


def simplify_text(original_text: str, language: str = "en") -> str:
    """
    Rewrite official scheme eligibility/benefits text into plain language.
    language: one of 'en', 'hi', 'te'
    Raises AIServiceError on Gemini failure.
    """
    language_name = LANGUAGE_NAMES.get(language, "English")
    prompt = SIMPLIFY_PROMPT.format(
        language=language_name,
        original_text=original_text,
    )
    return generate_text(prompt, max_tokens=512)
