from fastapi import FastAPI

from routes.consultation import router as consultation_router
from routes.documents import router as document_router
from database.database import Base
from database.database import engine

from models.company import Company
from models.document import Document
from models.compliance import Compliance
from models.recommendation import Recommendation
from models.lawyer_note import LawyerNote
from routes.regulatory import router as regulatory_router

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
Base.metadata.create_all(bind=engine)
app.include_router(document_router)
app.include_router(regulatory_router)