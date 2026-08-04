from fastapi import FastAPI

from routes.consultation import router as consultation_router
from routes.documents import router as document_router

app = FastAPI(
    title="Compliance Copilot AI",
    description="Agentic AI-powered Legal & Regulatory Intelligence Platform",
    version="1.0.0",
)

app.include_router(consultation_router)


@app.get("/")
def root():
    return {
        "success": True,
        "message": "Compliance Copilot AI Backend is running successfully."
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "message": "Backend is healthy."
    }
app.include_router(document_router)