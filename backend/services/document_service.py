from orchestrator.workflow import WorkflowOrchestrator

from agents.compliance import ComplianceAgent
from agents.recommendation import RecommendationAgent

from services.persistence_service import PersistenceService

from database import SessionLocal


class DocumentService:

    def __init__(self):

        self.workflow = WorkflowOrchestrator()

        self.compliance_agent = ComplianceAgent()

        self.recommendation_agent = RecommendationAgent()

        self.persistence = PersistenceService()

    def process(
        self,
        filename,
    ):

        context = self.workflow.start_workflow(
            "existing_business",
            filename
        )

        db = SessionLocal()

        try:

            current_entities = context.document_entities

            company_name = current_entities.get(
                "company_name"
            )

            cin = current_entities.get(
                "cin"
            )

            existing_company = (
                self.persistence.load_company_context(
                    db,
                    company_name=company_name,
                    cin=cin
                )
            )

            if existing_company:

                context.restore_company(
                    existing_company["company"],
                    existing_company["documents"]
                )

                context.clear_analysis()

            context.update_company_profile(
                context.document_entities
            )

            context = self.compliance_agent.run(
                context
            )

            context = self.recommendation_agent.run(
                context
            )

            company = self.persistence.save_session(
                db,
                context
            )

        finally:

            db.close()

        return {
            "success": True,
            "message": "Document uploaded and compliance analysis completed successfully.",
            "data": context.to_dict(),
            "company_id": company.id
        }