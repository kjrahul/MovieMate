import re
from collections import Counter
from sqlalchemy.orm import Session
from app.models.content import Content
from app.services.tmdb_service import discover_from_tmdb


# -----------------------------
# Helpers
# -----------------------------

def normalize_title(title: str) -> str:
    if not title:
        return ""
    title = title.lower().strip()
    title = re.sub(r"\(.*?\)", "", title)
    title = re.sub(r"[^a-z0-9\s]", "", title)
    return title.strip()


def exclude_existing_content(db: Session, tmdb_results: list):
    watched_titles = {
        normalize_title(c.title)
        for c in db.query(Content)
        .filter(Content.status.in_(["completed", "watching"]))
        .all()
    }

    return [
        item for item in tmdb_results
        if normalize_title(item.get("title") or item.get("name")) not in watched_titles
    ]


# -----------------------------
# USER PREFERENCES (DB)
# -----------------------------

def get_user_preferred_genres(db: Session, limit=3):
    watched = db.query(Content).filter(
        Content.status.in_(["completed", "watching"])
    ).all()

    genres = []
    for item in watched:
        if item.genre:
            genres.extend([g.strip() for g in item.genre.split(",")])

    return [g for g, _ in Counter(genres).most_common(limit)]


# -----------------------------
# MAIN RECOMMENDATION FUNCTION
# -----------------------------

async def get_recommendations(payload: dict, db: Session):
    """
    Rules:
    - Initial load → DB-based genres, mixed language
    - Filters → strictly what user selects
    """

    content_type = payload.get("content_type", "movie")
    selected_genre = payload.get("genre") or ""
    selected_language = payload.get("language") or ""
    prompt = payload.get("prompt") or ""
    page = payload.get("page", 1)

    is_initial_load = not selected_genre and not prompt and not  selected_language

    # --------------------------------
    # INITIAL LOAD (DB → TMDB)
    # --------------------------------
    if is_initial_load:
        preferred_genres = get_user_preferred_genres(db)

        results = discover_from_tmdb({
            "content_type": content_type,
            "preferred_genres": preferred_genres,
            "language": None,   # ✅ MIXED LANGUAGES
            "page": page,
        })

        return exclude_existing_content(db, results)

    # --------------------------------
    # USER FILTER / SEARCH
    # --------------------------------
    filters = {
        "content_type": content_type,
        "preferred_genres": [],
        "language": None,
        "page": page,
    }

    if selected_genre:
        filters["preferred_genres"].append(selected_genre)

    if selected_language and selected_language != "all":
        filters["language"] = selected_language

    if prompt:
        filters["query"] = prompt

    results = discover_from_tmdb(filters)
    return exclude_existing_content(db, results)
