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

    # =========================================================
    # LOAD EXISTING COMPANY
    # =========================================================

    def load_company_context(
        self,
        db,
        company_name=None,
        cin=None
    ):

        query = db.query(Company)

        if cin:

            company = (
                query
                .filter(Company.cin == cin)
                .first()
            )

        elif company_name:

            clean_name = self._clean_company_name(
                company_name
            )

            company = (
                query
                .filter(
                    Company.company_name == clean_name
                )
                .first()
            )

        else:

            company = None

        if not company:
            return None

        documents = (
            db.query(Document)
            .filter(
                Document.company_id == company.id
            )
            .all()
        )

        return {
            "company": company,
            "documents": documents
        }

    # =========================================================
    # SAVE / RE-AUDIT SESSION
    # =========================================================

    def save_session(
        self,
        db,
        context
    ):

        entities = context.document_entities

        company_name = self._clean_company_name(
            entities.get("company_name")
        )

        company = (
            db.query(Company)
            .filter(
                Company.company_name == company_name
            )
            .first()
        )

        # =====================================================
        # COMPANY
        # =====================================================

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

        # =====================================================
        # DOCUMENTS
        # =====================================================

        for document_data in context.uploaded_documents:

            filename = document_data.get("filename")

            existing_document = (
                db.query(Document)
                .filter(
                    Document.company_id == company.id,
                    Document.filename == filename
                )
                .first()
            )

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

        # =====================================================
        # COMPLIANCE REPORT
        # =====================================================

        report = context.compliance_report

        if report:

            existing_report = (
                db.query(ComplianceReport)
                .filter(
                    ComplianceReport.company_id
                    == company.id
                )
                .order_by(
                    ComplianceReport.id.desc()
                )
                .first()
            )

            if existing_report:

                existing_report.compliance_score = (
                    report.get(
                        "compliance_score",
                        0
                    )
                )

                existing_report.risk_level = (
                    report.get(
                        "risk_level",
                        "Unknown"
                    )
                )

                existing_report.present_documents = (
                    json.dumps(
                        report.get(
                            "present_documents",
                            []
                        )
                    )
                )

                existing_report.missing_documents = (
                    json.dumps(
                        report.get(
                            "missing_documents",
                            []
                        )
                    )
                )

                existing_report.findings = (
                    json.dumps(
                        report.get(
                            "findings",
                            []
                        )
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

        # =====================================================
        # LOAD ALL EXISTING RECOMMENDATIONS
        # =====================================================

        existing_recommendations = (
            db.query(Recommendation)
            .filter(
                Recommendation.company_id == company.id
            )
            .order_by(
                Recommendation.id.desc()
            )
            .all()
        )

        # =====================================================
        # LATEST RECOMMENDATION PER DOCUMENT
        # =====================================================

        existing_by_document = {}

        for recommendation in existing_recommendations:

            key = (
                recommendation.document
                or "general"
            ).strip().lower()

            if key not in existing_by_document:

                existing_by_document[key] = (
                    recommendation
                )

        # =====================================================
        # CURRENT AI RECOMMENDATIONS
        # =====================================================

        new_documents = set()

        for recommendation_data in context.recommendations:

            document = recommendation_data.get(
                "document"
            )

            if not document:
                continue

            key = document.strip().lower()

            new_documents.add(key)

            existing = existing_by_document.get(key)

            # -------------------------------------------------
            # Existing recommendation
            # -------------------------------------------------

            if existing:

                existing.priority = (
                    recommendation_data.get(
                        "priority",
                        "Medium"
                    )
                )

                existing.action = (
                    recommendation_data.get(
                        "action",
                        ""
                    )
                )

                existing.reason = (
                    recommendation_data.get(
                        "reason"
                    )
                )

                existing.next_step = (
                    recommendation_data.get(
                        "next_step"
                    )
                )

                # IMPORTANT:
                # Lawyer/HITL/action state is preserved.

                continue

            # -------------------------------------------------
            # New recommendation
            # -------------------------------------------------

            recommendation = Recommendation(

                company_id=company.id,

                document=document,

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
                ),

                review_status="pending",

                lawyer_action=None,

                lawyer_note=None,

                effective_action=None,

                action_status="not_started",

                action_started_at=None,

                action_completed_at=None,

                action_blocked_reason=None
            )

            db.add(recommendation)

        # =====================================================
        # PRESENT DOCUMENT RECONCILIATION
        # =====================================================
        #
        # If evidence for a requirement now exists:
        #
        # 1. Preserve lawyer action/note.
        # 2. Preserve effective_action.
        # 3. Preserve execution timestamps.
        # 4. Mark the recommendation as resolved.
        # 5. Mark the action as verified unless it was
        #    already completed.
        #
        # This closes BOTH:
        #
        # - the latest AI recommendation
        # - older lawyer-reviewed recommendations
        #
        # for the same requirement.
        # =====================================================

        present_documents = set()

        for document_data in context.uploaded_documents:

            document_type = document_data.get(
                "document_type"
            )

            if document_type:

                present_documents.add(
                    document_type.strip().lower()
                )

        # -----------------------------------------------------
        # Also use the compliance report as the source of truth.
        # This protects reconciliation when uploaded_documents
        # contains only the current workflow payload.
        # -----------------------------------------------------

        if report:

            for document in report.get(
                "present_documents",
                []
            ):

                if document:

                    present_documents.add(
                        document.strip().lower()
                    )

        # -----------------------------------------------------
        # Resolve ALL historical recommendations for
        # requirements that are now satisfied.
        # -----------------------------------------------------

        for recommendation in existing_recommendations:

            document = recommendation.document

            if not document:
                continue

            key = document.strip().lower()

            if key not in present_documents:
                continue

            # Never automatically resolve a lawyer-rejected
            # recommendation.
            if recommendation.review_status == "rejected":
                continue

            # -------------------------------------------------
            # Evidence has satisfied this requirement.
            # -------------------------------------------------

            if recommendation.action_status not in (
                "completed",
                "verified"
            ):

                recommendation.action_status = "verified"

            # -------------------------------------------------
            # IMPORTANT:
            #
            # Once evidence is present, the recommendation is
            # no longer an active compliance action.
            #
            # Preserve all lawyer history while closing it.
            # -------------------------------------------------

            if recommendation.review_status != "resolved":

                recommendation.review_status = "resolved"

            # -------------------------------------------------
            # If a lawyer-modified action existed but evidence
            # has now been supplied, preserve:
            #
            # lawyer_action
            # lawyer_note
            # effective_action
            #
            # but close the workflow state.
            # -------------------------------------------------

        # =====================================================
        # FLUSH / COMMIT
        # =====================================================

        db.commit()
        db.refresh(company)

        return company