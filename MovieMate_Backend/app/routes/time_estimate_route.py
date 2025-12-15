from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.time_estimate_service import estimate_completion_time

router = APIRouter(
    prefix="/time-estimate",
    tags=["Time Estimation"]
)

@router.get("/{content_id}")
def get_time_estimate(content_id: int, db: Session = Depends(get_db)):
    result = estimate_completion_time(db, content_id)

    if not result:
        raise HTTPException(status_code=404, detail="Content not found")

    return result
