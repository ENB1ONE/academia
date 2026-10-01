from sqlalchemy import Boolean, Column, Integer, String, Float, Date, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), nullable=False)
    trainer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100))
    workout_type = Column(String(10)) # A, B, C, D, etc.
    scheduled_date = Column(Date)
    notes = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    athlete = relationship("Athlete", back_populates="workouts")
    exercises = relationship("WorkoutExercise", back_populates="workout", cascade="all, delete-orphan")

class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"

    id = Column(Integer, primary_key=True, index=True)
    workout_id = Column(Integer, ForeignKey("workouts.id"), nullable=False)
    exercise_name = Column(String(100), nullable=False)
    sets = Column(Integer, nullable=False)
    reps = Column(String(20), nullable=False) # e.g. '10-12'
    load_kg = Column(Float, nullable=True)
    rest_seconds = Column(Integer, nullable=True)
    order = Column(Integer, nullable=False)
    notes = Column(String(200), nullable=True)

    workout = relationship("Workout", back_populates="exercises")
