from models.session_context import SessionContext


class DocumentIntelligenceAgent:
    """
    Agent responsible for document understanding.

    Extraction logic will be implemented tomorrow.
    """

    def run(
        self,
        context: SessionContext,
        filename: str,
    ):

        context.add_uploaded_document(
            {
                "filename": filename,
                "status": "uploaded"
            }
        )

        return context