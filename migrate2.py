
from app.core.database import engine, Base
from app.models.monitoring import MenstrualRecord
Base.metadata.create_all(bind=engine)
print('Menstrual table created')

