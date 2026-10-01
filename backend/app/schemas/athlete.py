from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List

class AthleteCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    birth_date: Optional[date] = None
    sport: Optional[str] = None
    position: Optional[str] = None

class AthleteUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    birth_date: Optional[date] = None
    sport: Optional[str] = None
    position: Optional[str] = None
    is_active: Optional[bool] = None

class AthleteResponse(BaseModel):
    id: int
    name: str
    email: Optional[EmailStr] = None
    birth_date: Optional[date] = None
    sport: Optional[str] = None
    position: Optional[str] = None
    photo_url: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AthleteListResponse(BaseModel):
    athletes: List[AthleteResponse]
    total: int
