import requests
from app.config import settings
import re
from collections import Counter
from sqlalchemy.orm import Session
from app.models.content import Content


TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

# --------------------------------------------------
# ADD CONTENT – SEARCH & DETAILS (EXISTING LOGIC)
# --------------------------------------------------
def search_movie(title: str):
    url = f"{TMDB_BASE_URL}/search/movie"
    params = {
        "api_key": settings.TMDB_API_KEY,
        "query": title,
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json().get("results", [])


def search_tv(title: str):
    url = f"{TMDB_BASE_URL}/search/tv"
    params = {
        "api_key": settings.TMDB_API_KEY,
        "query": title,
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json().get("results", [])


def get_movie_details(movie_id: int):
    url = f"{TMDB_BASE_URL}/movie/{movie_id}"
    credits_url = f"{url}/credits"
    params = {"api_key": settings.TMDB_API_KEY}

    movie_resp = requests.get(url, params=params)
    credits_resp = requests.get(credits_url, params=params)

    movie_resp.raise_for_status()
    credits_resp.raise_for_status()

    movie_data = movie_resp.json()
    credits_data = credits_resp.json()

    director = None
    for crew in credits_data.get("crew", []):
        if crew.get("job") == "Director":
            director = crew.get("name")
            break

    return {
        "title": movie_data.get("title"),
        "overview": movie_data.get("overview"),
        "poster_url": f"{TMDB_IMAGE_BASE}{movie_data.get('poster_path')}" if movie_data.get("poster_path") else None,
        "genres": ", ".join([g["name"] for g in movie_data.get("genres", [])]),
        "director": director,
        "release_date": movie_data.get("release_date"),
    }


def get_tv_details(tv_id: int):
    url = f"{TMDB_BASE_URL}/tv/{tv_id}"
    credits_url = f"{url}/credits"
    params = {"api_key": settings.TMDB_API_KEY}

    tv_resp = requests.get(url, params=params)
    credits_resp = requests.get(credits_url, params=params)

    tv_resp.raise_for_status()
    credits_resp.raise_for_status()

    tv_data = tv_resp.json()
    credits_data = credits_resp.json()

    director = None
    for crew in credits_data.get("crew", []):
        if crew.get("job") in ["Director", "Executive Producer"]:
            director = crew.get("name")
            break

    return {
        "title": tv_data.get("name"),
        "overview": tv_data.get("overview"),
        "poster_url": f"{TMDB_IMAGE_BASE}{tv_data.get('poster_path')}" if tv_data.get("poster_path") else None,
        "genres": ", ".join([g["name"] for g in tv_data.get("genres", [])]),
        "director": director,
        "total_episodes": tv_data.get("number_of_episodes"),
        "total_seasons": tv_data.get("number_of_seasons"),
    }


# --------------------------------------------------
# RECOMMENDATION – TRENDING (NO HISTORY)
# --------------------------------------------------
def get_trending_from_tmdb(content_type="movie", page=1):
    endpoint = "movie" if content_type == "movie" else "tv"
    url = f"{TMDB_BASE_URL}/trending/{endpoint}/week"

    params = {
        "api_key": settings.TMDB_API_KEY,
        "page": page
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json().get("results", [])
    except Exception as e:
        print(f"TMDB Trending Error: {e}")
        return []


# --------------------------------------------------
# RECOMMENDATION – DISCOVER / SEARCH (FILTERS + PROMPT)
# --------------------------------------------------
def discover_from_tmdb(filters: dict):
    """
    Used when:
    - User has watch history
    - Filters are applied
    - Prompt-based search is used
    """

    content_type = filters.get("content_type", "movie")
    genres = filters.get("preferred_genres", [])
    language = filters.get("language", None)
    page = filters.get("page", 1)
    query_text = filters.get("query")    # prompt search

    endpoint = "movie" if content_type == "movie" else "tv"

    # Genre mapping
    GENRE_MAP = {
        "Action": 28,
        "Comedy": 35,
        "Drama": 18,
        "Sci-Fi": 878,
        "Horror": 27,
        "Romance": 10749,
        "Thriller": 53,
        "Adventure": 12,
        "Fantasy": 14,
        "Animation": 16,
        "Crime": 80,
        "Mystery": 9648
    }

    with_genres = [
        str(GENRE_MAP[g]) for g in genres if g in GENRE_MAP
    ]

    # Base params
    params = {
        "api_key": settings.TMDB_API_KEY,
        "page": page
    }

    # ✅ CRITICAL FIX for Language Filter
    # Uses 'with_original_language' parameter with the 2-letter ISO code (e.g., 'ml', 'hi').
    if language and isinstance(language, str) and len(language) == 2:
        params["with_original_language"] = language

    # ------------------------
    # PROMPT SEARCH (Takes priority over Discover)
    # ------------------------
    if query_text:
        url = f"{TMDB_BASE_URL}/search/{endpoint}"
        params["query"] = query_text

    # ------------------------
    # DISCOVER (FILTERS)
    # ------------------------
    else:
        url = f"{TMDB_BASE_URL}/discover/{endpoint}"
        params["sort_by"] = "popularity.desc"
        params["vote_count.gte"] = 50

        if with_genres:
            params["with_genres"] = ",".join(with_genres)

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json().get("results", [])
    except Exception as e:
        print(f"TMDB Discover/Search Error: {e}")
        return []


# --------------------------------------------------
# RECOMMENDATION HELPERS (USER PREFERENCES, EXCLUSION)
# --------------------------------------------------

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


def get_user_preferred_genres(db: Session, limit=3):
    watched = db.query(Content).filter(
        Content.status.in_(["completed", "watching"])
    ).all()

    genres = []
    for item in watched:
        if item.genre:
            genres.extend([g.strip() for g in item.genre.split(",")])

    return [g for g, _ in Counter(genres).most_common(limit)]


def get_user_languages(db: Session):
    watched = db.query(Content).filter(
        Content.status.in_(["completed", "watching"])
    ).all()

    languages = set()
    for item in watched:
        # Assuming you store the 2-letter language code in the Content model
        if hasattr(item, "language") and item.language:
            languages.add(item.language)

    # Fallback to a diverse set of languages if none are found
    return list(languages) or ["en", "hi", "ta", "ml", "ko"]


# --------------------------------------------------
# MAIN RECOMMENDATION FUNCTION (Logic for /recommendations endpoint)
# --------------------------------------------------
# app/services/tmdb_service.py (Modified get_recommendations function)

# ... (Keep all preceding code and helper functions the same) ...

async def get_recommendations(payload: dict, db: Session):

    # ... (Keep all initial payload parsing the same) ...
    prompt = (payload.get("prompt") or "").strip()
    selected_genre = (payload.get("genre") or "").strip()
    selected_language = payload.get("language")
    page = payload.get("page", 1)
    content_type = payload.get("content_type", "movie") # Ensure default is 'movie'

    is_initial_load = not prompt and not selected_genre

    # -------------------------
    # INITIAL LOAD (Guaranteed Results Logic)
    # -------------------------
    if is_initial_load:
        genres = get_user_preferred_genres(db)
        languages = get_user_languages(db)
        primary_lang = languages[0] if languages else "en" 
        
        # 1. ATTEMPT FOCUSED SEARCH (Preferred Filters)
        results = discover_from_tmdb({
            "content_type": content_type,
            "preferred_genres": genres,
            "language": primary_lang,
            "page": page,
        })
        
        results = exclude_existing_content(db, results)

        # 2. CRITICAL FALLBACK (First attempt)
        if not results:
            print(f"INFO: Initial load failed to find personalized results for {content_type}. Falling back to general discovery.")
            
            # Fallback to broader discovery (no language/genre filters)
            results = discover_from_tmdb({
                "content_type": content_type,
                "preferred_genres": [],
                "language": None,
                "page": page,
            })
            results = exclude_existing_content(db, results)


        # 3. ✅ ULTIMATE GUARANTEE FALLBACK (If even the broad discovery fails)
        if not results:
            print("WARNING: Broad discovery failed. Initiating final fallback to Trending.")
            # This is the simplest, most direct call possible to guarantee results.
            results = get_trending_from_tmdb(content_type=content_type, page=page)
            results = exclude_existing_content(db, results)
        
        # If results are still empty here, it usually means the TMDB API Key is invalid, 
        # or the TMDB service is failing due to a request error.
        
        return results[:20]

    # -------------------------
    # USER FILTER / SEARCH (Explicit input)
    # ... (Keep this section the same) ...
    
    if not selected_language:
        preferred_langs = get_user_languages(db)
        selected_language = preferred_langs[0] if preferred_langs else "en"

    filters = {
        "content_type": content_type,
        "preferred_genres": [selected_genre] if selected_genre else [],
        "language": selected_language,
        "page": page,
    }

    if prompt:
        filters["query"] = prompt

    results = discover_from_tmdb(filters)
    return exclude_existing_content(db, results)