from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes.content_route import router as content_router
from app.routes.review_route import router as review_router
from app.routes.watch_history_route import router as history_router
from app.routes.recommendation_route import router as recommendation_router
from app.routes.ai_review_route import router as ai_review_router
from app.routes.time_estimate_route import router as time_estimate_router
from app.routes.tmdb_route import router as tmdb_router




app = FastAPI(
    title="MovieMate API",
    description="Backend for Movie and TV Show Tracking",
    version="1.0.0"
)

# 🔹 CORS FIX (THIS SOLVES YOUR ISSUE)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app.include_router(content_router)
app.include_router(review_router)
app.include_router(history_router)
app.include_router(recommendation_router)
app.include_router(ai_review_router)
app.include_router(time_estimate_router)
app.include_router(tmdb_router)






@app.get("/")
def root():
    return {"message": "MovieMate Backend is running"}
