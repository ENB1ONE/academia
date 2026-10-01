with open("academia_backend/app/api/v1/auth.py", "r", encoding="utf-8") as f:
    data = f.read()

target = """    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()"""
replacement = """    current_user.hashed_password = get_password_hash(data.new_password)
    current_user.force_password_change = False
    db.commit()"""

data = data.replace(target, replacement)

with open("academia_backend/app/api/v1/auth.py", "w", encoding="utf-8") as f:
    f.write(data)
