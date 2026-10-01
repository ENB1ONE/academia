
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()
# Try to find existing admin
user = db.query(User).filter(User.email == 'admin@formasync.com').first()
if not user:
    user = db.query(User).first()

if user:
    user.email = 'admin@formclub.com.br'
    user.hashed_password = get_password_hash('FormaClub123')
    db.commit()
    print('Admin credentials updated.')
else:
    new_user = User(
        email='admin@formclub.com.br',
        hashed_password=get_password_hash('FormaClub123'),
        name='Admin Formclub',
        is_active=True,
        is_superuser=True
    )
    db.add(new_user)
    db.commit()
    print('Admin created.')
db.close()

