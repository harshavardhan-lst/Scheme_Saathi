import logging
import numpy as np
from sqlalchemy.orm import Session
from app.models.scheme import Scheme
from app.ai.gemini_client import generate_embedding

logger = logging.getLogger(__name__)


def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Compute cosine similarity between two vectors."""
    va = np.array(a, dtype=float)
    vb = np.array(b, dtype=float)
    norm_a = np.linalg.norm(va)
    norm_b = np.linalg.norm(vb)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(va, vb) / (norm_a * norm_b))


def embed_and_store_scheme(db: Session, scheme: Scheme) -> None:
    """Generate and store an embedding for a single scheme (used during seeding)."""
    text = f"{scheme.scheme_name}. {scheme.description}. {scheme.benefits}"
    embedding = generate_embedding(text)
    scheme.embedding = embedding
    db.commit()
    logger.info(f"Stored embedding for scheme: {scheme.scheme_name}")


def semantic_search(db: Session, query: str, top_k: int = 5) -> list[Scheme]:
    """
    Retrieve top-k schemes most semantically similar to the query.
    Falls back to application-layer cosine similarity if pgvector is unavailable.
    """
    query_embedding = generate_embedding(query)
    all_schemes = db.query(Scheme).filter(Scheme.embedding.isnot(None)).all()

    scored = []
    for scheme in all_schemes:
        emb = scheme.embedding
        if emb is None:
            continue
        # Handle both pgvector native type and JSONB-stored lists
        emb_list = emb if isinstance(emb, list) else list(emb)
        score = cosine_similarity(query_embedding, emb_list)
        scored.append((score, scheme))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [s for _, s in scored[:top_k]]
