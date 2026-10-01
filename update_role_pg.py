from app.core.database import SessionLocal
from app.models.user import User

db = SessionLocal()
user = db.query(User).filter(User.email == 'admin@formclub.com.br').first()
if user:
    user.role = 'admin'
    db.commit()
    print("Updated admin role successfully via SQLAlchemy.")
else:
    print("Admin user not found in Postgres.")
db.close()
