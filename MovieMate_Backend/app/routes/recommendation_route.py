
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.recommendation_service import get_recommendations
from app.services.tmdb_service import get_trending_from_tmdb
from app.models.content import Content

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)

@router.post("/")
async def recommend_content(payload: dict, db: Session = Depends(get_db)):

    # -----------------------------
    # Normalize input
    # -----------------------------
    clean_payload = {
        "prompt": str(payload.get("prompt", "") or "").strip(),
        "genre": str(payload.get("genre", "") or "").strip(),
        "content_type": payload.get("content_type", "movie"),
        "language": payload.get("language", "en"),
        "page": int(payload.get("page", 1))
    }

    # -----------------------------
    # Check if user has watch history
    # -----------------------------
    has_history = db.query(Content).filter(
        Content.status.in_(["completed", "watching"])
    ).first() is not None

    # -----------------------------
    # NO HISTORY → TRENDING ONLY
    # -----------------------------
    if not has_history:
        return get_trending_from_tmdb(
            content_type=clean_payload["content_type"],
            page=clean_payload["page"]
        )

    # -----------------------------
    # HAS HISTORY → AI / FILTER LOGIC
    # -----------------------------
    return await get_recommendations(clean_payload, db)
