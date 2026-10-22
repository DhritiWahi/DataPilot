from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="DataPilot API")


# Define what a incoming pipeline requirement looks like
class PipelineRequirement(BaseModel):
    title: str
    description: str
    source_table: str
    target_table: str


@app.get("/")
def home():
    return {
        "message": "Welcome to DataPilot!",
        "status": "running",
        "next_step": "Accepting pipeline requirements"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# New POST endpoint to receive requirement data
@app.post("/requirements")
def create_requirement(requirement: PipelineRequirement):
    return {
        "status": "success",
        "message": "Requirement received successfully!",
        "data": requirement
    }