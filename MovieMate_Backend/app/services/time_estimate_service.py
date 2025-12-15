from sqlalchemy.orm import Session
from app.models.watch_history import WatchHistory
from app.models.content import Content


def estimate_completion_time(db: Session, content_id: int):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        return None

    # Only valid for TV shows
    if content.content_type != "tv" or not content.total_episodes:
        return {
            "message": "Time estimation is only applicable for TV shows"
        }

    history = db.query(WatchHistory).filter(
        WatchHistory.content_id == content_id
    ).all()

    if not history or content.episodes_watched == 0:
        return {
            "message": "Not enough data to estimate completion time"
        }

    total_minutes = sum(h.minutes_watched for h in history)
    avg_minutes_per_episode = total_minutes / content.episodes_watched

    remaining_episodes = content.total_episodes - content.episodes_watched
    estimated_minutes_remaining = int(remaining_episodes * avg_minutes_per_episode)

    return {
        "average_minutes_per_episode": round(avg_minutes_per_episode, 2),
        "remaining_episodes": remaining_episodes,
        "estimated_minutes_remaining": estimated_minutes_remaining
    }
