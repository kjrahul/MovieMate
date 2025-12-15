from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.watch_history import WatchHistory
from app.models.content import Content
from app.schemas.watch_history_schema import (
    WatchHistoryCreate,
    WatchHistoryResponse
)

router = APIRouter(
    prefix="/watch-history",
    tags=["Watch History"]
)

# ADD watch session
@router.post("/{content_id}", response_model=WatchHistoryResponse)
def add_watch_history(
    content_id: int,
    history: WatchHistoryCreate,
    db: Session = Depends(get_db)
):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    new_history = WatchHistory(
        content_id=content_id,
        minutes_watched=history.minutes_watched,
        watch_date=history.watch_date
    )

    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    return new_history


# GET watch history for content
@router.get("/{content_id}", response_model=List[WatchHistoryResponse])
def get_watch_history(content_id: int, db: Session = Depends(get_db)):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    return db.query(WatchHistory).filter(
        WatchHistory.content_id == content_id
    ).all()
