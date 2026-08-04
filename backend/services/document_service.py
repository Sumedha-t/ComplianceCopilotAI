from agents.document_intelligence import DocumentIntelligenceAgent
from models.session_context import SessionContext


class DocumentService:

    def __init__(self):

        self.agent = DocumentIntelligenceAgent()

    def process(
        self,
        filename: str
    ):

        context = SessionContext()

        context = self.agent.run(
            context,
            filename
        )

        return {
            "success": True,
            "message": "Document uploaded successfully.",
            "data": context.to_dict()
        }