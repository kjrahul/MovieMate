from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.content import Content
from app.schemas.content_schema import (
    ContentCreate,
    ContentResponse,
    ContentUpdate
)
from app.utils.exceptions import not_found

router = APIRouter(
    prefix="/content",
    tags=["Content"]
)

# CREATE content
@router.post("/", response_model=ContentResponse)
def create_content(content: ContentCreate, db: Session = Depends(get_db)):
    new_content = Content(**content.dict())
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    return new_content


# GET all content with filters
@router.get("/", response_model=List[ContentResponse])
def get_all_content(
    genre: Optional[str] = None,
    platform: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Content)

    if genre:
        query = query.filter(Content.genre == genre)
    if platform:
        query = query.filter(Content.platform == platform)
    if status:
        query = query.filter(Content.status == status)

    return query.all()


# GET single content by ID
@router.get("/{content_id}", response_model=ContentResponse)
def get_content(content_id: int, db: Session = Depends(get_db)):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise not_found("Content")
    return content


# UPDATE content
@router.put("/{content_id}", response_model=ContentResponse)
def update_content(
    content_id: int,
    update_data: ContentUpdate,
    db: Session = Depends(get_db)
):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise not_found("Content")

    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(content, key, value)

    # Auto mark completed for TV shows
    if (
        content.total_episodes
        and content.episodes_watched == content.total_episodes
    ):
        content.status = "completed"

    db.commit()
    db.refresh(content)
    return content


# DELETE content
@router.delete("/{content_id}")
def delete_content(content_id: int, db: Session = Depends(get_db)):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise not_found("Content")

    db.delete(content)
    db.commit()
    return {"message": "Content deleted successfully"}


# ----------------------------------
# TIME ESTIMATE (AI / Analytics)
# ----------------------------------
@router.get("/time-estimate/{content_id}")
def get_time_estimate(content_id: int, db: Session = Depends(get_db)):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    # TV shows: remaining episodes × avg 45 mins
    if content.content_type == "tv" and content.total_episodes:
        remaining = content.total_episodes - (content.episodes_watched or 0)
        if remaining < 0:
            remaining = 0
        return {
            "estimated_minutes_remaining": remaining * 45
        }

    # Movies or insufficient data
    return {
        "estimated_minutes_remaining": None
    }



