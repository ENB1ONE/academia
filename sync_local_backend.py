import re

# 1. Update database.py for connection pool health
db_path = 'backend/app/core/database.py'
with open(db_path, 'r', encoding='utf-8') as f:
    db_code = f.read()

if 'pool_pre_ping' not in db_code:
    db_code = db_code.replace(
        'engine = create_engine(settings.DATABASE_URL)',
        'engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True, pool_recycle=300)'
    )
    with open(db_path, 'w', encoding='utf-8') as f:
        f.write(db_code)
    print("Updated local database.py with pool_pre_ping")

# 2. Update workouts.py to allow admins full access
workouts_path = 'backend/app/api/v1/workouts.py'
with open(workouts_path, 'r', encoding='utf-8') as f:
    w_code = f.read()

old_list = """    query = db.query(Workout).filter(Workout.trainer_id == current_trainer.id)
    if athlete_id:
        query = query.filter(Workout.athlete_id == athlete_id)
    return query.all()"""

new_list = """    if current_trainer.role == "admin":
        query = db.query(Workout)
    else:
        query = db.query(Workout).filter(Workout.trainer_id == current_trainer.id)
    if athlete_id:
        query = query.filter(Workout.athlete_id == athlete_id)
    return query.all()"""

if old_list in w_code:
    w_code = w_code.replace(old_list, new_list)
    print("Updated local list_workouts in workouts.py")

old_create = """    # Verify athlete belongs to trainer
    athlete = db.query(Athlete).filter(
        Athlete.id == workout_in.athlete_id,
        Athlete.trainer_id == current_trainer.id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Atleta não encontrado")"""

new_create = """    # Verify athlete belongs to trainer or is admin
    if current_trainer.role == "admin":
        athlete = db.query(Athlete).filter(
            Athlete.id == workout_in.athlete_id,
            Athlete.is_active == True
        ).first()
    else:
        athlete = db.query(Athlete).filter(
            Athlete.id == workout_in.athlete_id,
            Athlete.trainer_id == current_trainer.id,
            Athlete.is_active == True
        ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Atleta não encontrado")"""

if old_create in w_code:
    w_code = w_code.replace(old_create, new_create)
    print("Updated local create_workout in workouts.py")

old_get = """    workout = db.query(Workout).filter(
        Workout.id == id,
        Workout.trainer_id == current_trainer.id
    ).first()"""

new_get = """    if current_trainer.role == "admin":
        workout = db.query(Workout).filter(Workout.id == id).first()
    else:
        workout = db.query(Workout).filter(
            Workout.id == id,
            Workout.trainer_id == current_trainer.id
        ).first()"""

if old_get in w_code:
    w_code = w_code.replace(old_get, new_get)
    print("Updated local get/update/delete in workouts.py")

with open(workouts_path, 'w', encoding='utf-8') as f:
    f.write(w_code)

# 3. Update athletes.py
athletes_path = 'backend/app/api/v1/athletes.py'
with open(athletes_path, 'r', encoding='utf-8') as f:
    a_code = f.read()

old_ath_list = """    query = db.query(Athlete).filter(
        Athlete.trainer_id == current_trainer.id,
        Athlete.is_active == True
    )"""

new_ath_list = """    if current_trainer.role == "admin":
        query = db.query(Athlete).filter(Athlete.is_active == True)
    else:
        query = db.query(Athlete).filter(
            Athlete.trainer_id == current_trainer.id,
            Athlete.is_active == True
        )"""

if old_ath_list in a_code:
    a_code = a_code.replace(old_ath_list, new_ath_list)
    print("Updated local list_athletes in athletes.py")

with open(athletes_path, 'w', encoding='utf-8') as f:
    f.write(a_code)

print("Local backend synced.")
