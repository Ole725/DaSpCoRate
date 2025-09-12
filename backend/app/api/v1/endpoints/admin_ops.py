from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Union
from datetime import date

from app.core.database import get_db
from app.dependencies import dependencies
from app.schemas.stats import StatsOverview
from app.crud import couple as crud_couple, session as crud_session, trainer as crud_trainer
from app.models.admin import Admin

router = APIRouter()

@router.get("/stats", response_model=StatsOverview)
def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(dependencies.get_current_admin),
):
    today = date.today()

    trainer_count = crud_trainer.count_all(db) # Ruft die 'count_all'-Methode auf
    couple_count = crud_couple.count_all(db)   # Ruft die 'count_all'-Methode auf
    
    # Hier die neuen Methodennamen verwenden
    upcoming_session_count = crud_session.count_upcoming(db, today=today)
    past_session_count = crud_session.count_past(db, today=today)

    return {
        "trainer_count": trainer_count,
        "couple_count": couple_count,
        "upcoming_session_count": upcoming_session_count,
        "past_session_count": past_session_count,
    }