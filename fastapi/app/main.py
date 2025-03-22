from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Create FastAPI app
app = FastAPI(title="FastAPI App")

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",  # React default port
    # Add other origins if needed
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI"}

# Additional endpoints can be added here

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)