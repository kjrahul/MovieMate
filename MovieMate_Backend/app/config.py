from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    TMDB_API_KEY: str = os.getenv("TMDB_API_KEY")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")

settings = Settings()

ENABLE_AI_RECOMMENDATIONS = False  # turn ON later when stable
