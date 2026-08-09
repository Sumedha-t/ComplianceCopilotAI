from orchestrator.workflow import WorkflowOrchestrator

from schemas.consultation_schema import (
    ConsultationRequest,
    ConsultationData,
    ConsultationResponse,
)


class ConsultationService:

    def __init__(self):

        self.workflow = WorkflowOrchestrator()

    def process(
        self,
        consultation: ConsultationRequest,
    ) -> ConsultationResponse:

        recommendation = self.workflow.start_workflow(
            "new_business",
            consultation
        )

        return ConsultationResponse(
            success=True,
            message="Business consultation completed successfully.",
            data=ConsultationData(
                recommended_structure=recommendation[
                    "recommended_structure"
                ],
                required_registrations=recommendation[
                    "required_registrations"
                ],
                reason=recommendation[
                    "reason"
                ],
            ),
        )