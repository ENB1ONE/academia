from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import List, Optional

from app.core.database import get_db
from app.models.monitoring import PSERecord, WellnessRecord
from app.models.athlete import Athlete
from app.schemas.monitoring import PSECreate, PSEResponse, WellnessCreate, WellnessResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/pse", response_model=PSEResponse)
def create_pse(
    pse_in: PSECreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Depending on role, verify access
    # For simplicity, assuming trainer creates it for now or athlete
    session_load = pse_in.pse_value * pse_in.duration_minutes
    
    db_pse = PSERecord(
        athlete_id=pse_in.athlete_id,
        trainer_id=current_user.id, # Simplification
        date=pse_in.date,
        session_type=pse_in.session_type,
        duration_minutes=pse_in.duration_minutes,
        pse_value=pse_in.pse_value,
        session_load=session_load,
        notes=pse_in.notes
    )
    db.add(db_pse)
    db.commit()
    db.refresh(db_pse)
    return db_pse

@router.get("/pse/{athlete_id}", response_model=List[PSEResponse])
def get_pse_history(
    athlete_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(PSERecord).filter(PSERecord.athlete_id == athlete_id)
    if start_date:
        query = query.filter(PSERecord.date >= start_date)
    if end_date:
        query = query.filter(PSERecord.date <= end_date)
    return query.order_by(PSERecord.date.desc()).all()

@router.post("/wellness", response_model=WellnessResponse)
def create_wellness(
    wellness_in: WellnessCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    average_score = (
        wellness_in.sleep_quality +
        wellness_in.fatigue_level +
        wellness_in.muscle_soreness +
        wellness_in.stress_level +
        wellness_in.mood
    ) / 5.0

    db_wellness = WellnessRecord(
        athlete_id=wellness_in.athlete_id,
        date=wellness_in.date,
        sleep_quality=wellness_in.sleep_quality,
        fatigue_level=wellness_in.fatigue_level,
        muscle_soreness=wellness_in.muscle_soreness,
        stress_level=wellness_in.stress_level,
        mood=wellness_in.mood,
        average_score=average_score,
        notes=wellness_in.notes
    )
    db.add(db_wellness)
    db.commit()
    db.refresh(db_wellness)
    return db_wellness

@router.get("/wellness/{athlete_id}", response_model=List[WellnessResponse])
def get_wellness_history(
    athlete_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(WellnessRecord).filter(WellnessRecord.athlete_id == athlete_id)
    if start_date:
        query = query.filter(WellnessRecord.date >= start_date)
    if end_date:
        query = query.filter(WellnessRecord.date <= end_date)
    return query.order_by(WellnessRecord.date.desc()).all()

@router.get("/load-analysis/{athlete_id}")
def load_analysis(
    athlete_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Calculates ACWR, Monotony, Strain for the last 28 days
    # This is a simplified calculation
    today = date.today()
    start_date = today - timedelta(days=28)
    
    records = db.query(PSERecord).filter(
        PSERecord.athlete_id == athlete_id,
        PSERecord.date >= start_date
    ).all()
    
    # Very basic dummy implementation for structure
    total_load = sum(r.session_load for r in records)
    acwr = 1.0 if total_load > 0 else 0.0 # Placeholder
    
    return {
        "athlete_id": athlete_id,
        "period_days": 28,
        "total_load": total_load,
        "acwr": acwr,
        "monotony": 1.2, # Placeholder
        "strain": total_load * 1.2 # Placeholder
    }
