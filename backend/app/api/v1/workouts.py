from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.workout import Workout, WorkoutExercise
from app.models.athlete import Athlete
from app.schemas.workout import WorkoutCreate, WorkoutResponse
from app.api.deps import get_current_trainer

router = APIRouter()

@router.get("/", response_model=List[WorkoutResponse])
def list_workouts(
    athlete_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_trainer = Depends(get_current_trainer)
):
    query = db.query(Workout).filter(Workout.trainer_id == current_trainer.id)
    if athlete_id:
        query = query.filter(Workout.athlete_id == athlete_id)
    return query.all()

@router.post("/", response_model=WorkoutResponse)
def create_workout(
    workout_in: WorkoutCreate,
    db: Session = Depends(get_db),
    current_trainer = Depends(get_current_trainer)
):
    # Verify athlete belongs to trainer
    athlete = db.query(Athlete).filter(
        Athlete.id == workout_in.athlete_id,
        Athlete.trainer_id == current_trainer.id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Atleta não encontrado")

    db_workout = Workout(
        athlete_id=workout_in.athlete_id,
        trainer_id=current_trainer.id,
        name=workout_in.name,
        workout_type=workout_in.workout_type,
        scheduled_date=workout_in.scheduled_date,
        notes=workout_in.notes
    )
    db.add(db_workout)
    db.flush() # To get db_workout.id

    for ex in workout_in.exercises:
        db_ex = WorkoutExercise(
            workout_id=db_workout.id,
            exercise_name=ex.exercise_name,
            sets=ex.sets,
            reps=ex.reps,
            load_kg=ex.load_kg,
            rest_seconds=ex.rest_seconds,
            order=ex.order,
            notes=ex.notes
        )
        db.add(db_ex)

    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.get("/{id}", response_model=WorkoutResponse)
def get_workout(
    id: int,
    db: Session = Depends(get_db),
    current_trainer = Depends(get_current_trainer)
):
    workout = db.query(Workout).filter(
        Workout.id == id,
        Workout.trainer_id == current_trainer.id
    ).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Treino não encontrado")
    return workout

@router.put("/{id}", response_model=WorkoutResponse)
def update_workout(
    id: int,
    workout_in: WorkoutCreate,
    db: Session = Depends(get_db),
    current_trainer = Depends(get_current_trainer)
):
    workout = db.query(Workout).filter(
        Workout.id == id,
        Workout.trainer_id == current_trainer.id
    ).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Treino não encontrado")

    # Update workout fields
    workout.name = workout_in.name
    workout.workout_type = workout_in.workout_type
    workout.scheduled_date = workout_in.scheduled_date
    workout.notes = workout_in.notes

    # Update exercises (simple approach: delete old, insert new)
    db.query(WorkoutExercise).filter(WorkoutExercise.workout_id == id).delete()
    
    for ex in workout_in.exercises:
        db_ex = WorkoutExercise(
            workout_id=workout.id,
            exercise_name=ex.exercise_name,
            sets=ex.sets,
            reps=ex.reps,
            load_kg=ex.load_kg,
            rest_seconds=ex.rest_seconds,
            order=ex.order,
            notes=ex.notes
        )
        db.add(db_ex)

    db.commit()
    db.refresh(workout)
    return workout

@router.delete("/{id}")
def delete_workout(
    id: int,
    db: Session = Depends(get_db),
    current_trainer = Depends(get_current_trainer)
):
    workout = db.query(Workout).filter(
        Workout.id == id,
        Workout.trainer_id == current_trainer.id
    ).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Treino não encontrado")

    db.delete(workout)
    db.commit()
    return {"message": "Treino removido com sucesso"}
