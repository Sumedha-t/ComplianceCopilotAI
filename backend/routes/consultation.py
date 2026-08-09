from fastapi import APIRouter

from schemas.consultation_schema import (
    ConsultationRequest,
    ConsultationResponse,
)
from services.consultation_service import ConsultationService

router = APIRouter(
    prefix="/api/consultation",
    tags=["Business Consultation"],
)

consultation_service = ConsultationService()


@router.post(
    "/new",
    response_model=ConsultationResponse,
    summary="Recommend Business Structure",
    description="Accepts business questionnaire data and recommends the most suitable legal business structure."
)
def new_business_consultation(
    consultation: ConsultationRequest,
):
    """
    Process a new business consultation request.
    """

    return consultation_service.process(consultation)