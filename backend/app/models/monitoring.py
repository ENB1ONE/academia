from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class PSERecord(Base):
    __tablename__ = "pse_records"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), nullable=False)
    trainer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    session_type = Column(String(30), nullable=False) # treino, jogo, fisioterapia
    duration_minutes = Column(Integer, nullable=False)
    pse_value = Column(Integer, nullable=False) # 1-10
    session_load = Column(Integer, nullable=False) # computed: pse_value * duration_minutes
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    athlete = relationship("Athlete", back_populates="pse_records")


class WellnessRecord(Base):
    __tablename__ = "wellness_records"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), nullable=False)
    date = Column(Date, nullable=False)
    sleep_quality = Column(Integer, nullable=False) # 1-5
    fatigue_level = Column(Integer, nullable=False) # 1-5
    muscle_soreness = Column(Integer, nullable=False) # 1-5
    stress_level = Column(Integer, nullable=False) # 1-5
    mood = Column(Integer, nullable=False) # 1-5
    average_score = Column(Float, nullable=False) # computed average
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    athlete = relationship("Athlete", back_populates="wellness_records")
