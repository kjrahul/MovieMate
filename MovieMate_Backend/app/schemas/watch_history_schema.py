from pydantic import BaseModel
from datetime import date

class WatchHistoryCreate(BaseModel):
    minutes_watched: int
    watch_date: date

class WatchHistoryResponse(WatchHistoryCreate):
    id: int
    content_id: int

    class Config:
        orm_mode = True
