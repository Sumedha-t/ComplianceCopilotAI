from fastapi import FastAPI

app = FastAPI(
    title="Compliance Copilot AI",
    description="Agentic AI-powered Legal & Regulatory Intelligence Platform",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Compliance Copilot AI Backend is running successfully!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "backend"
    }