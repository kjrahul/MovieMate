from sqlalchemy import Column, Integer, ForeignKey, Date
from app.database import Base
from sqlalchemy.orm import relationship

class WatchHistory(Base):
    __tablename__ = "watch_history"

    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"), nullable=False)
    minutes_watched = Column(Integer, nullable=False)
    watch_date = Column(Date, nullable=False)
    content = relationship("Content")