from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.review import Review
from app.models.content import Content
from app.schemas.review_schema import (
    ReviewCreate,
    ReviewUpdate,
    ReviewResponse
)

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)

# ----------------------------------
# ADD REVIEW
# ----------------------------------
@router.post("/{content_id}", response_model=ReviewResponse)
def add_review(
    content_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db)
):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    if review.rating < 1 or review.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    new_review = Review(
        content_id=content_id,
        rating=review.rating,
        review_text=review.review_text
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review


# ----------------------------------
# GET REVIEWS BY CONTENT
# ----------------------------------
@router.get("/{content_id}", response_model=List[ReviewResponse])
def get_reviews(content_id: int, db: Session = Depends(get_db)):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    return db.query(Review).filter(Review.content_id == content_id).all()


# ----------------------------------
# UPDATE REVIEW (rating / text)
# ----------------------------------
@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    review: ReviewUpdate,
    db: Session = Depends(get_db)
):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")

    if review.rating is not None:
        if review.rating < 1 or review.rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        db_review.rating = review.rating

    if review.review_text is not None:
        db_review.review_text = review.review_text

    db.commit()
    db.refresh(db_review)
    return db_review


# ----------------------------------
# DELETE REVIEW
# ----------------------------------
@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db)
):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")

    db.delete(db_review)
    db.commit()
    return {"message": "Review deleted successfully"}
