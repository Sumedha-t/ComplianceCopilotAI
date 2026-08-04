from agents.business_consultation import BusinessConsultationAgent
from schemas.consultation_schema import (
    ConsultationRequest,
    ConsultationData,
    ConsultationResponse,
)


class ConsultationService:
    """
    Service responsible for coordinating the
    Business Consultation workflow.
    """

    def __init__(self):
        self.agent = BusinessConsultationAgent()

    def process(self, consultation: ConsultationRequest) -> ConsultationResponse:
        """
        Process a business consultation request.
        """

        recommendation = self.agent.run(consultation)

        response = ConsultationResponse(
            success=True,
            message="Business consultation completed successfully.",
            data=ConsultationData(
                recommended_structure=recommendation["recommended_structure"],
                required_registrations=recommendation["required_registrations"],
                reason=recommendation["reason"],
            ),
        )

        return response