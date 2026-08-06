from pathlib import Path

from models.session_context import SessionContext

from utils.document_loader import DocumentLoader
from utils.entity_extractor import EntityExtractor


class DocumentIntelligenceAgent:
    """
    Reads a document, extracts text,
    identifies business entities,
    and stores them inside Session Context.
    """

    def __init__(self):

        self.loader = DocumentLoader()

        self.extractor = EntityExtractor()

    def run(
        self,
        context: SessionContext,
        file_path: str,
    ):

        raw_text = self.loader.load(
            file_path
        )

        entities = self.extractor.extract(
            raw_text
        )

        context.add_uploaded_document(
            {
                "filename": Path(file_path).name,
                "status": "processed"
            }
        )

        context.update_document_entities(
            entities
        )

        return context