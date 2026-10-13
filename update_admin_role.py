import sys
from app.core.database import SessionLocal
from app.models.user import User

db = SessionLocal()
# Update brito.eduardo@icloud.com to admin
u4 = db.query(User).filter(User.email == 'brito.eduardo@icloud.com').first()
if u4:
    u4.role = 'admin'
    print(f"Updated {u4.email} to admin")

# Ensure admin@formclub.com.br is admin
u1 = db.query(User).filter(User.email == 'admin@formclub.com.br').first()
if u1:
    u1.role = 'admin'
    print(f"Ensured {u1.email} is admin")

db.commit()

# Print all users
users = db.query(User).all()
for u in users:
    print(f"User: id={u.id}, name={u.name}, email={u.email}, role={u.role}, is_active={u.is_active}")

db.close()
