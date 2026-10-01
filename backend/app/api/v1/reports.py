from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.athlete import Athlete
from app.models.monitoring import PSERecord, WellnessRecord
from app.api.deps import get_current_trainer

router = APIRouter()

@router.get("/athlete/{athlete_id}/summary")
def get_athlete_summary(
    athlete_id: int,
    db: Session = Depends(get_db),
    current_trainer = Depends(get_current_trainer)
):
    athlete = db.query(Athlete).filter(
        Athlete.id == athlete_id,
        Athlete.trainer_id == current_trainer.id
    ).first()
    
    if not athlete:
        raise HTTPException(status_code=404, detail="Atleta não encontrado")
        
    recent_pse = db.query(PSERecord).filter(
        PSERecord.athlete_id == athlete_id
    ).order_by(PSERecord.date.desc()).limit(5).all()
    
    recent_wellness = db.query(WellnessRecord).filter(
        WellnessRecord.athlete_id == athlete_id
    ).order_by(WellnessRecord.date.desc()).limit(5).all()
    
    return {
        "athlete": {
            "id": athlete.id,
            "name": athlete.name,
            "sport": athlete.sport
        },
        "recent_pse": recent_pse,
        "recent_wellness": recent_wellness,
        "status": "Normal" # Placeholder status
    }
