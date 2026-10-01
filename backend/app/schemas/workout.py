from pydantic import BaseModel
from datetime import date
from typing import Optional, List

class ExerciseCreate(BaseModel):
    exercise_name: str
    sets: int
    reps: str
    load_kg: Optional[float] = None
    rest_seconds: Optional[int] = None
    order: int
    notes: Optional[str] = None

class WorkoutCreate(BaseModel):
    athlete_id: int
    name: str
    workout_type: str
    scheduled_date: date
    notes: Optional[str] = None
    exercises: List[ExerciseCreate]

class ExerciseResponse(BaseModel):
    id: int
    workout_id: int
    exercise_name: str
    sets: int
    reps: str
    load_kg: Optional[float] = None
    rest_seconds: Optional[int] = None
    order: int
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class WorkoutResponse(BaseModel):
    id: int
    athlete_id: int
    trainer_id: int
    name: str
    workout_type: str
    scheduled_date: date
    notes: Optional[str] = None
    is_completed: bool
    exercises: List[ExerciseResponse]

    class Config:
        from_attributes = True
