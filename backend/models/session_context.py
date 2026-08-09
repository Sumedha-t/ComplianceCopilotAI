from typing import Any


class SessionContext:
    """
    Shared memory object used by all AI agents during
    a client consultation session.
    """

    def __init__(self):

        self.company_profile: dict[str, Any] = {}

        self.uploaded_documents: list[dict[str, Any]] = []

        self.document_entities: dict[str, Any] = {}

        self.compliance_report: dict[str, Any] = {}

        self.recommendations: list[str] = []

    def update_company_profile(self, profile: dict):

        self.company_profile = profile

    def add_uploaded_document(self, document: dict):

        self.uploaded_documents.append(document)

    def update_document_entities(self, entities: dict):

        self.document_entities = entities

    def update_compliance_report(self, report: dict):

        self.compliance_report = report

    def update_recommendations(self, recommendations: list[str]):

        self.recommendations = recommendations

    def to_dict(self):

        return {
            "company_profile": self.company_profile,
            "uploaded_documents": self.uploaded_documents,
            "document_entities": self.document_entities,
            "compliance_report": self.compliance_report,
            "recommendations": self.recommendations
        }