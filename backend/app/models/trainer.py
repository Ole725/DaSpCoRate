# /DaSpCoRate/backend/app/models/trainer.py

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Trainer(Base):
    __tablename__ = "trainers" # Name der Datenbanktabelle

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone_number = Column(String(25), nullable=True) # nullable=True da DEFAULT NULL in SQL
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Beziehung zu Sessions, die dieser Trainer erstellt hat
    # 'sessions' ist der Name, der für den Zugriff auf verknüpfte Session-Objekte verwendet wird
    sessions = relationship("Session", back_populates="trainer")