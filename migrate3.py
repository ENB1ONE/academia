
from app.core.database import engine, Base
from app.models.monitoring import PhysicalTestRecord
Base.metadata.create_all(bind=engine)
print('Physical tests table created')

