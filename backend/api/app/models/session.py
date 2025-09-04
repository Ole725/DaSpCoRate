# /DaSpCoRate/backend/api/app/models/session.py

from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Session(Base):
    __tablename__ = "sessions" # Name der Datenbanktabelle

    id = Column(Integer, primary_key=True, index=True)
    trainer_id = Column(Integer, ForeignKey("trainers.id", ondelete="SET NULL"), nullable=True) # FOREIGN KEY
    session_date = Column(Date, nullable=False)
    title = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Beziehung zum Trainer, der diese Session erstellt hat
    # 'trainer' ist der Name für den Zugriff auf das verknüpfte Trainer-Objekt
    trainer = relationship("Trainer", back_populates="sessions")
    # Beziehung zu den Bewertungen in dieser Session
    ratings = relationship("Rating", back_populates="session")
    # Beziehung zu den Anmeldungen für diese Session
    enrollments = relationship("SessionEnrollment", back_populates="session")