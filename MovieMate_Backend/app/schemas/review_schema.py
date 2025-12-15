from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    rating: int
    review_text: Optional[str] = None


class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    review_text: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    content_id: int
    rating: int
    review_text: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
