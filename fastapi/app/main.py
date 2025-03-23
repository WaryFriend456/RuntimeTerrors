from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from .model import summarise_text

# Create FastAPI app
app = FastAPI(
    title="Article Summarization API",
    description="API for summarizing articles using an AI model",
    version="1.0.0"
)

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

class ArticleSummaryRequest(BaseModel):
    articles: List[str]
    domain: Optional[str] = ""

class ArticleSummaryResponse(BaseModel):
    summary: str

@app.post("/summarize", response_model=ArticleSummaryResponse)
async def summarize_articles(request: ArticleSummaryRequest):
    try:
        # Join the list of articles
        aggregated_articles = "\n\n".join(request.articles)
        
        # Call the summarization function
        # print(f"Aggregated Articles: {aggregated_articles}")
        summary = summarise_text(aggregated_articles, request.domain)
        print(f"Summary: {summary}")
        
        return {"summary" : summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during summarization: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI"}

# Additional endpoints can be added here

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)