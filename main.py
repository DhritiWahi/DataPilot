from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database list to store submissions for this simulation
fake_db = []

class PipelineRequirement(BaseModel):
    title: str
    description: str
    source_table: str
    target_table: str

@app.get("/")
def read_root():
    return {"message": "Welcome to DataPilot!", "status": "running"}

# 1. GET Endpoint to fetch all saved requirements
@app.get("/requirements")
def get_requirements():
    return {"status": "success", "data": fake_db}

# 2. POST Endpoint to save a new requirement
@app.post("/requirements")
def create_requirement(requirement: PipelineRequirement):
    fake_db.append(requirement)
    return {
        "status": "success",
        "message": "Requirement received and stored successfully!",
        "data": requirement
    }