from pydantic import BaseModel, Field


class ConsultationRequest(BaseModel):
    """
    Request model received from the frontend questionnaire.
    """

    company_name: str = Field(..., example="ABC Manufacturing Pvt Ltd")
    industry: str = Field(..., example="Manufacturing")
    state: str = Field(..., example="Karnataka")
    founders: int = Field(..., ge=1, example=2)
    employees: int = Field(..., ge=1, example=50)
    annual_turnover: float = Field(..., ge=0, example=30000000)


class ConsultationData(BaseModel):
    """
    Actual business recommendation returned by the AI Agent.
    """

    recommended_structure: str
    required_registrations: list[str]
    reason: str


class ConsultationResponse(BaseModel):
    """
    Standard API response.
    """

    success: bool
    message: str
    data: ConsultationData