from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.models.athlete import Athlete
from app.schemas.athlete import AthleteCreate, AthleteUpdate, AthleteResponse, AthleteListResponse
from app.api.deps import get_current_trainer

router = APIRouter()

@router.get("/", response_model=AthleteListResponse)
def list_athletes(
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_trainer = Depends(get_current_trainer)
):
    query = db.query(Athlete).filter(
        Athlete.trainer_id == current_trainer.id,
        Athlete.is_active == True
    )
    
    if search:
        query = query.filter(Athlete.name.ilike(f"%{search}%"))
        
    athletes = query.all()
    return {"athletes": athletes, "total": len(athletes)}

@router.post("/", response_model=AthleteResponse)
def create_athlete(
    athlete_in: AthleteCreate,
    db: Session = Depends(get_db),
    current_trainer = Depends(get_current_trainer)
):
    db_athlete = Athlete(
        trainer_id=current_trainer.id,
        name=athlete_in.name,
        email=athlete_in.email,
        birth_date=athlete_in.birth_date,
        sport=athlete_in.sport,
        position=athlete_in.position
    )
    db.add(db_athlete)
    db.commit()
    db.refresh(db_athlete)
    return db_athlete

@router.get("/{id}", response_model=AthleteResponse)
def get_athlete(
    id: int,
    db: Session = Depends(get_db),
    current_trainer = Depends(get_current_trainer)
):
    athlete = db.query(Athlete).filter(
        Athlete.id == id,
        Athlete.trainer_id == current_trainer.id,
        Athlete.is_active == True
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Atleta não encontrado")
    return athlete

@router.put("/{id}", response_model=AthleteResponse)
def update_athlete(
    id: int,
    athlete_in: AthleteUpdate,
    db: Session = Depends(get_db),
    current_trainer = Depends(get_current_trainer)
):
    athlete = db.query(Athlete).filter(
        Athlete.id == id,
        Athlete.trainer_id == current_trainer.id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Atleta não encontrado")
    
    update_data = athlete_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(athlete, field, value)
        
    db.commit()
    db.refresh(athlete)
    return athlete

@router.delete("/{id}")
def delete_athlete(
    id: int,
    db: Session = Depends(get_db),
    current_trainer = Depends(get_current_trainer)
):
    athlete = db.query(Athlete).filter(
        Athlete.id == id,
        Athlete.trainer_id == current_trainer.id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Atleta não encontrado")
    
    athlete.is_active = False
    db.commit()
    return {"message": "Atleta removido com sucesso"}
