from sqlalchemy import Boolean, Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Athlete(Base):
    __tablename__ = "athletes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # The athlete's own user account
    trainer_id = Column(Integer, ForeignKey("users.id"), nullable=False) # The trainer
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=True)
    birth_date = Column(Date, nullable=True)
    sport = Column(String(50), nullable=True)
    position = Column(String(50), nullable=True)
    photo_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    trainer = relationship("User", back_populates="athletes", foreign_keys=[trainer_id])
    workouts = relationship("Workout", back_populates="athlete")
    pse_records = relationship("PSERecord", back_populates="athlete")
    wellness_records = relationship("WellnessRecord", back_populates="athlete")
