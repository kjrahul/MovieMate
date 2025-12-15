from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)
    content_type = Column(String(20), nullable=False)   # movie | tv
    director = Column(String(255), nullable=True)
    genre = Column(String(100), nullable=False)
    platform = Column(String(100), nullable=False)
    status = Column(String(20), nullable=False)          # watching | completed | wishlist

    total_episodes = Column(Integer, nullable=True)
    episodes_watched = Column(Integer, nullable=False, default=0)

    # ✅ TMDB FIELDS (THIS IS WHAT WAS MISSING)
    poster_url = Column(String(500), nullable=True)
    overview = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reviews = relationship("Review", back_populates="content")