import json
import re

from models.database_models import (
    Company,
    Document,
    ComplianceReport,
    Recommendation,
)


class PersistenceService:

    def _clean_company_name(self, company_name):
        if not company_name:
            return "Unknown Company"

        company_name = company_name.strip()

        patterns = [
            r"^This is to certify that\s+",
            r"^This is certified that\s+",
            r"^Certificate of Incorporation.*?of\s+",
        ]

        for pattern in patterns:
            company_name = re.sub(
                pattern,
                "",
                company_name,
                flags=re.IGNORECASE
            )

        return company_name.strip(" .,:;-")

    def load_company_context(self, db, company_name=None, cin=None):

        query = db.query(Company)

        if cin:
            company = query.filter(
                Company.cin == cin
            ).first()

        elif company_name:
            clean_name = self._clean_company_name(
                company_name
            )

            company = query.filter(
                Company.company_name == clean_name
            ).first()

        else:
            company = None

        if not company:
            return None

        documents = db.query(Document).filter(
            Document.company_id == company.id
        ).all()

        return {
            "company": company,
            "documents": documents
        }

    def save_session(self, db, context):

        entities = context.document_entities

        company_name = self._clean_company_name(
            entities.get("company_name")
        )

        company = db.query(Company).filter(
            Company.company_name == company_name
        ).first()

        if not company:
            company = Company(
                company_name=company_name,
                cin=entities.get("cin"),
                pan=entities.get("pan"),
                gstin=entities.get("gstin"),
                business_type=entities.get("business_type"),
                industry=entities.get(
                    "industry",
                    "Manufacturing"
                ),
                state=entities.get(
                    "state",
                    "Karnataka"
                )
            )

            db.add(company)

        else:
            if entities.get("cin"):
                company.cin = entities["cin"]

            if entities.get("pan"):
                company.pan = entities["pan"]

            if entities.get("gstin"):
                company.gstin = entities["gstin"]

            if entities.get("business_type"):
                company.business_type = (
                    entities["business_type"]
                )

            if entities.get("industry"):
                company.industry = entities["industry"]
            elif not company.industry:
                company.industry = "Manufacturing"

            if entities.get("state"):
                company.state = entities["state"]
            elif not company.state:
                company.state = "Karnataka"

        db.commit()
        db.refresh(company)

        for document_data in context.uploaded_documents:

            filename = document_data.get("filename")

            existing_document = db.query(Document).filter(
                Document.company_id == company.id,
                Document.filename == filename
            ).first()

            if existing_document:
                continue

            document = Document(
                company_id=company.id,
                filename=filename,
                document_type=document_data.get(
                    "document_type"
                ),
                status=document_data.get(
                    "status",
                    "processed"
                ),
                extracted_entities=json.dumps(
                    context.document_entities
                )
            )

            db.add(document)

        db.flush()

        report = context.compliance_report

        if report:
            existing_report = db.query(
                ComplianceReport
            ).filter(
                ComplianceReport.company_id == company.id
            ).order_by(
                ComplianceReport.id.desc()
            ).first()

            if existing_report:
                existing_report.compliance_score = report.get(
                    "compliance_score",
                    0
                )

                existing_report.risk_level = report.get(
                    "risk_level",
                    "Unknown"
                )

                existing_report.present_documents = json.dumps(
                    report.get(
                        "present_documents",
                        []
                    )
                )

                existing_report.missing_documents = json.dumps(
                    report.get(
                        "missing_documents",
                        []
                    )
                )

                existing_report.findings = json.dumps(
                    report.get(
                        "findings",
                        []
                    )
                )

            else:
                compliance_report = ComplianceReport(
                    company_id=company.id,
                    compliance_score=report.get(
                        "compliance_score",
                        0
                    ),
                    risk_level=report.get(
                        "risk_level",
                        "Unknown"
                    ),
                    present_documents=json.dumps(
                        report.get(
                            "present_documents",
                            []
                        )
                    ),
                    missing_documents=json.dumps(
                        report.get(
                            "missing_documents",
                            []
                        )
                    ),
                    findings=json.dumps(
                        report.get(
                            "findings",
                            []
                        )
                    )
                )

                db.add(compliance_report)

        db.query(
            Recommendation
        ).filter(
            Recommendation.company_id == company.id
        ).delete(
            synchronize_session=False
        )

        for recommendation_data in context.recommendations:
            recommendation = Recommendation(
                company_id=company.id,
                document=recommendation_data.get(
                    "document"
                ),
                priority=recommendation_data.get(
                    "priority",
                    "Medium"
                ),
                action=recommendation_data.get(
                    "action",
                    ""
                ),
                reason=recommendation_data.get(
                    "reason"
                ),
                next_step=recommendation_data.get(
                    "next_step"
                )
            )

            db.add(recommendation)

        db.commit()
        db.refresh(company)

        return company