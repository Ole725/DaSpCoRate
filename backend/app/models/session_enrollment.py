# /DaSpCoRate/backend/app/models/session_enrollment.py

from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class SessionEnrollment(Base):
    __tablename__ = "session_enrollment" # Name der Datenbanktabelle

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False) # FOREIGN KEY
    couple_id = Column(Integer, ForeignKey("couples.id", ondelete="CASCADE"), nullable=False) # FOREIGN KEY
    start_number = Column(Integer, nullable=False)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())

    # Beziehungen zu den verknüpften Session- und Couple-Objekten
    session = relationship("Session", back_populates="enrollments")
    couple = relationship("Couple", back_populates="enrollments")