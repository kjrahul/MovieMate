from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5
    review_text = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    content = relationship("Content", back_populates="reviews")