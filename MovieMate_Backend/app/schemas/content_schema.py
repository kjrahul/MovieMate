from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ContentBase(BaseModel):
    title: str
    content_type: str
    genre: str
    platform: str
    status: str
    director: Optional[str] = None
    total_episodes: Optional[int] = None
    episodes_watched: Optional[int] = 0

    # ✅ NEW
    poster_url: Optional[str] = None
    overview: Optional[str] = None


class ContentCreate(ContentBase):
    pass


class ContentUpdate(BaseModel):
    status: Optional[str] = None
    episodes_watched: Optional[int] = None

    # Allow update from TMDB
    poster_url: Optional[str] = None
    overview: Optional[str] = None
    director: Optional[str] = None
    genre: Optional[str] = None
    total_episodes: Optional[int] = None


class ContentResponse(ContentBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

