from pydantic import BaseModel, Field
from typing import Optional, List


class RecommendationRequest(BaseModel):
    content_type: str = Field(default="movie", pattern="^(movie|tv)$")
    genre: Optional[str] = None
    language: str = Field(default="en", min_length=2, max_length=5)
    prompt: Optional[str] = ""
