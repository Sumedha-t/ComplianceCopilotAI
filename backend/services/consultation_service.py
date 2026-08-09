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

            message=(
                "Business consultation and initial "
                "compliance assessment completed successfully."
            ),

            data=ConsultationData(

                recommended_structure=
                    recommendation[
                        "recommended_structure"
                    ],

                required_registrations=
                    recommendation[
                        "required_registrations"
                    ],

                industry_compliance=
                    recommendation.get(
                        "industry_compliance",
                        []
                    ),

                state_compliance=
                    recommendation.get(
                        "state_compliance",
                        []
                    ),

                initial_compliance_checklist=
                    recommendation.get(
                        "initial_compliance_checklist",
                        []
                    ),

                next_steps=
                    recommendation.get(
                        "next_steps",
                        []
                    ),

                reason=
                    recommendation[
                        "reason"
                    ],
            ),
        )