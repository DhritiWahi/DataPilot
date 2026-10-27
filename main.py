from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
import models
from pydantic import BaseModel

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DataPilot Backend")

# Enable CORS so your React frontend can talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schema for request validation
class RequirementCreate(BaseModel):
    source_table: str
    target_table: str
    description: str | None = None

class RequirementResponse(RequirementCreate):
    id: int

    class Config:
        from_attributes = True

@app.get("/api/requirements", response_model=list[RequirementResponse])
def get_requirements(db: Session = Depends(get_db)):
    requirements = db.query(models.PipelineRequirement).all()
    return requirements

@app.post("/api/requirements", response_model=RequirementResponse)
def create_requirement(req: RequirementCreate, db: Session = Depends(get_db)):
    db_requirement = models.PipelineRequirement(
        source_table=req.source_table,
        target_table=req.target_table,
        description=req.description
    )
    db.add(db_requirement)
    db.commit()
    db.refresh(db_requirement)
    return db_requirement