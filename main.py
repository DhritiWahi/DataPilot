
from fastapi import FastAPI

app = FastAPI(title="DataPilot API")


@app.get("/")
def home():
    return {
        "message": "Welcome to DataPilot!",
        "status": "running",
        "next_step": "Build our AI data pipeline copilot",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
