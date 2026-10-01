
from app.core.database import engine, Base
from app.models.monitoring import PainRecord
from app.models.athlete import Athlete
from app.models.user import User
Base.metadata.create_all(bind=engine)
print('Tables created')

