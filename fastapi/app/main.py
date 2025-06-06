from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from model import summarise_text

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

        # Defensive: If no articles, return a clear error
        if not aggregated_articles.strip():
            raise HTTPException(status_code=400, detail="No article content provided for summarization.")

        # Call the summarization function
        summary = summarise_text(aggregated_articles, request.domain)
        if not summary or not summary.strip():
            raise HTTPException(status_code=500, detail="Summarization failed: No summary returned.")
        print(f"Summary: {summary}")
        return {"summary": summary}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error during summarization: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during summarization: {str(e)}")

class QARequest(BaseModel):
    articles: List[str]
    summary: str
    question: str
    domain: Optional[str] = ""

class QAResponse(BaseModel):
    answer: str

@app.post("/answer", response_model=QAResponse)
async def answer_question(request: QARequest):
    try:
        # Compose a prompt for Q/A
        prompt = f"You are an expert news assistant. Given the following summary and articles, answer the user's question as accurately as possible.\n\nSummary:\n{request.summary}\n\nArticles:\n{chr(10).join(request.articles)}\n\nQuestion: {request.question}\n\nAnswer:"
        # Use the same model as summarise_text, but with a Q/A prompt
        answer = summarise_text(prompt, request.domain)
        if not answer or not answer.strip():
            raise HTTPException(status_code=500, detail="No answer generated.")
        return {"answer": answer.strip()}
    except Exception as e:
        print(f"Error during Q/A: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during Q/A: {str(e)}")

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