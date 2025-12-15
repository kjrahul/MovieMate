from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ai_review_service import generate_review

router = APIRouter(
    prefix="/ai-review",
    tags=["AI Review Generator"]
)

class AIReviewRequest(BaseModel):
    title: str
    notes: str

class AIReviewResponse(BaseModel):
    generated_review: str


@router.post("/", response_model=AIReviewResponse)
def ai_review(request: AIReviewRequest):
    review = generate_review(
        title=request.title,
        notes=request.notes
    )
    return {"generated_review": review}
