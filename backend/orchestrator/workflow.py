from models.session_context import SessionContext

from agents.business_consultation import BusinessConsultationAgent
from agents.document_intelligence import DocumentIntelligenceAgent


class WorkflowOrchestrator:
    """
    Coordinates all AI agents and manages
    the shared Session Context.
    """

    def __init__(self):

        self.context = SessionContext()

        self.business_agent = BusinessConsultationAgent()

        self.document_agent = DocumentIntelligenceAgent()

    def start_workflow(
        self,
        workflow_type: str,
        payload
    ):
        """
        Entry point for all workflows.

        Supported workflows:
        - new_business
        - existing_business
        """

        if workflow_type == "new_business":
            return self.run_business_consultation(payload)

        elif workflow_type == "existing_business":
            return self.run_document_upload(payload)

        else:
            raise ValueError(
                f"Unknown workflow type: {workflow_type}"
            )

    def run_business_consultation(
        self,
        consultation
    ):

        result = self.business_agent.run(
            consultation
        )

        self.context.update_company_profile(
            {
                "company_name": consultation.company_name,
                "industry": consultation.industry,
                "state": consultation.state,
                "recommended_structure":
                    result["recommended_structure"]
            }
        )

        return result

    def run_document_upload(
        self,
        filename
    ):

        self.document_agent.run(
            self.context,
            filename
        )

        return self.context

    def get_context(self):

        return self.context