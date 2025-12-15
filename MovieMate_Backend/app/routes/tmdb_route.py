from fastapi import APIRouter, Query, HTTPException

from app.services.tmdb_service import (
    search_movie,
    search_tv,
    get_movie_details,
    get_tv_details
)

router = APIRouter(
    prefix="/tmdb",
    tags=["TMDB"]
)

# SEARCH (movie or tv)
@router.get("/search")
def tmdb_search(
    title: str = Query(..., min_length=1),
    content_type: str = Query(..., regex="^(movie|tv)$")
):
    try:
        if content_type == "movie":
            results = search_movie(title)
        else:
            results = search_tv(title)

        # Return only minimal data for selection
        return [
            {
                "id": item["id"],
                "title": item.get("title") or item.get("name"),
                "release_date": item.get("release_date") or item.get("first_air_date"),
                "poster_path": item.get("poster_path"),
            }
            for item in results
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET FULL DETAILS
@router.get("/details/{tmdb_id}")
def tmdb_details(
    tmdb_id: int,
    content_type: str = Query(..., regex="^(movie|tv)$")
):
    try:
        if content_type == "movie":
            return get_movie_details(tmdb_id)
        else:
            return get_tv_details(tmdb_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
