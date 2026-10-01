# coding: utf-8
with open("academia_backend/app/api/v1/athletes.py", "r", encoding="utf-8") as f:
    data = f.read()

target_list = """    athletes = query.all()
    return {"athletes": athletes, "total": len(athletes)}"""

replacement_list = """    athletes = query.all()
    
    # Injetar avatar do user
    for athlete in athletes:
        if athlete.user_id:
            user = db.query(User).filter(User.id == athlete.user_id).first()
            if user and user.avatar:
                athlete.photo_url = user.avatar
                
    return {"athletes": athletes, "total": len(athletes)}"""

target_get = """    # Check permissions
    if current_user.role == "treinador" and athlete.trainer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permiss\u00e3o")
    if current_user.role == "atleta" and athlete.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permiss\u00e3o")

    return athlete"""

replacement_get = """    # Check permissions
    if current_user.role == "treinador" and athlete.trainer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permiss\u00e3o")
    if current_user.role == "atleta" and athlete.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permiss\u00e3o")

    if athlete.user_id:
        user = db.query(User).filter(User.id == athlete.user_id).first()
        if user and user.avatar:
            athlete.photo_url = user.avatar

    return athlete"""

data = data.replace(target_list, replacement_list)
data = data.replace(target_get.encode('utf-8').decode('unicode_escape'), replacement_get.encode('utf-8').decode('unicode_escape'))

with open("academia_backend/app/api/v1/athletes.py", "w", encoding="utf-8") as f:
    f.write(data)
