# coding: utf-8
with open("academia_backend/app/api/v1/athletes.py", "r", encoding="utf-8") as f:
    data = f.read()

target = """    db_athlete = Athlete(
        user_id=user_id,
        trainer_id=current_trainer.id,
        name=athlete_in.name,
        email=athlete_in.email,
        birth_date=athlete_in.birth_date,
        sport=athlete_in.sport,
        position=athlete_in.position
    )"""

replacement = """    db_athlete = Athlete(
        user_id=user_id,
        trainer_id=current_trainer.id,
        name=athlete_in.name,
        email=athlete_in.email,
        birth_date=athlete_in.birth_date,
        sport=athlete_in.sport,
        position=athlete_in.position,
        gender=athlete_in.gender
    )"""

data = data.replace(target, replacement)

with open("academia_backend/app/api/v1/athletes.py", "w", encoding="utf-8") as f:
    f.write(data)
