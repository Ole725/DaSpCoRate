# /DaSpCoRate/backend/app/schemas/stats.py

from pydantic import BaseModel

class StatsOverview(BaseModel):
    couple_count: int
    trainer_count: int
    upcoming_session_count: int
    past_session_count: int