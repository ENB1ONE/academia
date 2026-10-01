from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.api.v1 import auth, athletes, workouts, monitoring, reports

# Import all models to ensure they are registered with SQLAlchemy
from app.models import user, athlete, workout, monitoring as monitoring_models

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FormClub Training API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(athletes.router, prefix="/api/v1/athletes", tags=["athletes"])
app.include_router(workouts.router, prefix="/api/v1/workouts", tags=["workouts"])
app.include_router(monitoring.router, prefix="/api/v1/monitoring", tags=["monitoring"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "API está funcionando"}
