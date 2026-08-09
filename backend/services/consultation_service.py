import json

from database import SessionLocal

from models.database_models import (
    Company,
    NewBusinessProfile,
)

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

        # ---------------------------------------------
        # 1. Run business consultation workflow
        # ---------------------------------------------

        recommendation = self.workflow.start_workflow(
            "new_business",
            consultation
        )

        # ---------------------------------------------
        # 2. Open database session
        # ---------------------------------------------

        db = SessionLocal()

        try:

            # -----------------------------------------
            # 3. Create the company/client record
            # -----------------------------------------

            company = Company(
                company_name=consultation.company_name,
                business_type=recommendation[
                    "recommended_structure"
                ],
                industry=consultation.industry,
                state=consultation.state,
            )

            db.add(company)

            # Flush assigns the company ID without
            # committing the transaction yet.
            db.flush()

            # -----------------------------------------
            # 4. Create new-business readiness profile
            # -----------------------------------------

            profile = NewBusinessProfile(
                company_id=company.id,

                recommended_structure=
                    recommendation[
                        "recommended_structure"
                    ],

                required_registrations=json.dumps(
                    recommendation.get(
                        "required_registrations",
                        []
                    )
                ),

                industry_compliance=json.dumps(
                    recommendation.get(
                        "industry_compliance",
                        []
                    )
                ),

                state_compliance=json.dumps(
                    recommendation.get(
                        "state_compliance",
                        []
                    )
                ),

                initial_compliance_checklist=json.dumps(
                    recommendation.get(
                        "initial_compliance_checklist",
                        []
                    )
                ),

                next_steps=json.dumps(
                    recommendation.get(
                        "next_steps",
                        []
                    )
                ),

                reason=recommendation.get(
                    "reason",
                    ""
                ),
            )

            db.add(profile)

            # -----------------------------------------
            # 5. Commit both records together
            # -----------------------------------------

            db.commit()

            # Refresh so generated values are available
            db.refresh(company)
            db.refresh(profile)

            company_id = company.id

        except Exception:

            db.rollback()
            raise

        finally:

            db.close()

        # ---------------------------------------------
        # 6. Return API response
        # ---------------------------------------------

        return ConsultationResponse(

            success=True,

            message=(
                "Business consultation and initial "
                "compliance assessment completed "
                "successfully."
            ),

            data=ConsultationData(

                company_id=company_id,

                recommended_structure=
                    recommendation[
                        "recommended_structure"
                    ],

                required_registrations=
                    recommendation.get(
                        "required_registrations",
                        []
                    ),

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