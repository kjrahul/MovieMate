def generate_review(title: str, notes: str) -> str:
    """
    Generates a short, polished review from user notes.
    This is a rule-based placeholder that can be replaced
    with OpenAI / LLM integration later.
    """

    notes = notes.strip()

    if not notes:
        return f"{title} delivers a solid viewing experience with memorable moments."

    # Simple NLP-style enhancement
    review = (
        f"{title} stands out with {notes}. "
        f"Overall, it offers an engaging and enjoyable experience "
        f"that is worth watching."
    )

    return review
