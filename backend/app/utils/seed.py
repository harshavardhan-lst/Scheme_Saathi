"""
Seed script: loads datasets/schemes.json into the database and generates embeddings.
Run from the backend/ directory:
    python -m app.utils.seed
"""
import json
import os
import sys
import logging
from pathlib import Path

# Add backend root to path so imports resolve
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from dotenv import load_dotenv
load_dotenv()

from app.database.session import SessionLocal
from app.database.base import Base  # noqa — ensures all models are registered
from app.database.session import engine
from app.models.scheme import Scheme
from app.ai.embeddings import embed_and_store_scheme

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATASETS_PATH = Path(__file__).parent.parent.parent.parent / "datasets" / "schemes.json"


def seed():
    logger.info("Creating tables if not exist...")
    Base.metadata.create_all(bind=engine)

    with open(DATASETS_PATH, "r", encoding="utf-8") as f:
        schemes_data = json.load(f)

    db = SessionLocal()
    try:
        existing_count = db.query(Scheme).count()
        if existing_count == 0:
            logger.info(f"Seeding {len(schemes_data)} schemes...")
            for item in schemes_data:
                scheme = Scheme(
                    scheme_name=item["scheme_name"],
                    description=item["description"],
                    benefits=item["benefits"],
                    documents=item["documents"],
                    application_link=item.get("application_link"),
                    state=item.get("state", "Central"),
                    deadline=item.get("deadline"),
                    eligibility=item["eligibility"],
                )
                db.add(scheme)
            db.commit()
            logger.info("Schemes committed.")

        # Embed any scheme that lacks an embedding
        schemes_to_embed = db.query(Scheme).filter(Scheme.embedding.is_(None)).all()
        if schemes_to_embed:
            logger.info(f"Generating embeddings for {len(schemes_to_embed)} schemes...")
            for i, scheme in enumerate(schemes_to_embed):
                try:
                    embed_and_store_scheme(db, scheme)
                    logger.info(f"  [{i+1}/{len(schemes_to_embed)}] Embedded: {scheme.scheme_name}")
                except Exception as e:
                    logger.warning(f"  Failed to embed '{scheme.scheme_name}': {e}")
        else:
            logger.info("All schemes already have embeddings.")

        logger.info("Seeding complete!")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
