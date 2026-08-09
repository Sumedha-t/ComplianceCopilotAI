class SessionContext:
    """
    Shared memory used by the workflow orchestrator and agents.
    """

    def __init__(self):
        self.company_profile = {}
        self.uploaded_documents = []
        self.document_entities = {}
        self.compliance_report = {}
        self.recommendations = []

    def update_company_profile(self, data: dict):
        """
        Merge new company information into the existing profile.
        Existing values are preserved unless the new value is meaningful.
        """
        for key, value in data.items():
            if value is not None and value != "":
                self.company_profile[key] = value

    def add_uploaded_document(self, document: dict):
        """
        Add a processed document to the session.
        """
        self.uploaded_documents.append(document)

    def update_document_entities(self, entities: dict):
        """
        Merge extracted entities from a new document into
        the existing document entity memory.
        Empty or None values do not overwrite existing values.
        """
        for key, value in entities.items():
            if value is not None and value != "":
                self.document_entities[key] = value

    def update_compliance_report(self, report: dict):
        """
        Store or update the compliance analysis.
        """
        self.compliance_report.update(report)

    def add_recommendation(self, recommendation):
        """
        Add a recommendation to the shared memory.
        """
        self.recommendations.append(recommendation)

    def restore_company(
        self,
        company,
        documents
    ):
        """
        Restore previously persisted company information
        and documents from SQLite into the current session.
        """

        if company:

            self.update_company_profile(
                {
                    "company_name": company.company_name,
                    "cin": company.cin,
                    "pan": company.pan,
                    "gstin": company.gstin,
                    "business_type": company.business_type,
                    "industry": company.industry,
                    "state": company.state,
                }
            )

            self.update_document_entities(
                {
                    "company_name": company.company_name,
                    "cin": company.cin,
                    "pan": company.pan,
                    "gstin": company.gstin,
                }
            )

        for document in documents:

            existing = False

            for uploaded_document in self.uploaded_documents:

                if (
                    uploaded_document.get("filename")
                    == document.filename
                ):
                    existing = True
                    break

            if existing:
                continue

            self.add_uploaded_document(
                {
                    "filename": document.filename,
                    "status": document.status,
                    "document_type": document.document_type,
                }
            )

            if document.extracted_entities:

                try:
                    import json

                    entities = json.loads(
                        document.extracted_entities
                    )

                    if isinstance(entities, dict):
                        self.update_document_entities(
                            entities
                        )

                except (
                    json.JSONDecodeError,
                    TypeError
                ):
                    pass

    def clear_analysis(self):
        """
        Clear only the current compliance analysis
        and recommendations before running a fresh audit.
        """
        self.compliance_report = {}
        self.recommendations = []

    def to_dict(self):
        """
        Convert the complete session context into
        JSON-compatible data.
        """
        return {
            "company_profile": self.company_profile,
            "uploaded_documents": self.uploaded_documents,
            "document_entities": self.document_entities,
            "compliance_report": self.compliance_report,
            "recommendations": self.recommendations,
        }