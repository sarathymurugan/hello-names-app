from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for names
names_storage: List[str] = []

# Pydantic model for request validation
class NameRequest(BaseModel):
    name: str
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Name must be a non-empty string')
        return v.strip()

@app.get("/")
def read_root():
    return {"message": "Welcome to Hello Names API"}

@app.post("/api/names")
def add_name(name_request: NameRequest):
    """
    POST endpoint to add a name to the in-memory storage.
    Validates that name exists and is a non-empty string.
    """
    try:
        names_storage.append(name_request.name)
        return {
            "success": True,
            "message": "Name stored successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "message": str(e)
            }
        )

@app.get("/api/names")
def get_names():
    """
    GET endpoint to retrieve all stored names.
    Returns a list of all names in the storage.
    """
    return {
        "success": True,
        "names": names_storage
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)