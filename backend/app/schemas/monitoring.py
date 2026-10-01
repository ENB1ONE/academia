from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class PSECreate(BaseModel):
    athlete_id: int
    date: date
    session_type: str
    duration_minutes: int
    pse_value: int
    notes: Optional[str] = None

class PSEResponse(BaseModel):
    id: int
    athlete_id: int
    trainer_id: int
    date: date
    session_type: str
    duration_minutes: int
    pse_value: int
    session_load: int
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class WellnessCreate(BaseModel):
    athlete_id: int
    date: date
    sleep_quality: int
    fatigue_level: int
    muscle_soreness: int
    stress_level: int
    mood: int
    notes: Optional[str] = None

class WellnessResponse(BaseModel):
    id: int
    athlete_id: int
    date: date
    sleep_quality: int
    fatigue_level: int
    muscle_soreness: int
    stress_level: int
    mood: int
    average_score: float
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
