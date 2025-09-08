# /DaSpCoRate/backend/api/app/models/couple.py

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Couple(Base):
    __tablename__ = "couples" # Name der Datenbanktabelle

    id = Column(Integer, primary_key=True, index=True)
    mr_first_name = Column(String(255), nullable=False)
    mrs_first_name = Column(String(255), nullable=False)
    start_group = Column(String(255), nullable=False)
    start_class = Column(String(255), nullable=False)
    dance_style = Column(String(5), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone_number = Column(String(25), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Beziehung zu den Bewertungen, die dieses Paar erhalten hat
    ratings = relationship(
        "Rating",
        back_populates="couple",
        cascade="all, delete-orphan"
    )
    # Beziehung zu den Session-Anmeldungen dieses Paares
    enrollments = relationship(
        "SessionEnrollment",
        back_populates="couple",
        cascade="all, delete-orphan"
    )