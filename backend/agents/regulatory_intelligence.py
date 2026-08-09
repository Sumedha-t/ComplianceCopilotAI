import json
from pathlib import Path

from models.database_models import (
    Company,
    RegulatoryAlert,
    Document,
    ComplianceReport,
    Recommendation,
)

from models.session_context import SessionContext

from agents.compliance import ComplianceAgent
from agents.recommendation import RecommendationAgent


class RegulatoryIntelligenceAgent:

    def __init__(self):

        rules_path = (
            Path(__file__).resolve().parent.parent
            / "regulatory_sources"
            / "regulatory_updates.json"
        )

        with open(
            rules_path,
            "r",
            encoding="utf-8"
        ) as file:

            self.updates = json.load(
                file
            )["updates"]

        self.compliance_agent = ComplianceAgent()
        self.recommendation_agent = RecommendationAgent()

    # =========================================================
    # BUILD COMPANY CONTEXT
    # =========================================================

    def _build_company_context(
        self,
        company,
        documents
    ):

        context = SessionContext()

        context.restore_company(
            company,
            documents
        )

        return context

    # =========================================================
    # SAVE RE-AUDIT
    # =========================================================

    def _save_reaudit(
        self,
        db,
        company,
        context
    ):
        """
        Persist the compliance assessment generated
        by the regulatory re-audit.

        Compliance reports are retained as audit history.

        Recommendations are protected from duplication:
        an existing pending recommendation for the same
        company + document will not be recreated.

        Lawyer-reviewed recommendations are preserved.
        """

        compliance_report = context.compliance_report

        # -----------------------------------------------------
        # Save compliance report
        #
        # Every regulatory event creates an audit snapshot.
        # This preserves historical compliance information.
        # -----------------------------------------------------

        report = ComplianceReport(
            company_id=company.id,

            compliance_score=
                compliance_report.get(
                    "compliance_score",
                    0
                ),

            risk_level=
                compliance_report.get(
                    "risk_level",
                    "Unknown"
                ),

            present_documents=json.dumps(
                compliance_report.get(
                    "present_documents",
                    []
                )
            ),

            missing_documents=json.dumps(
                compliance_report.get(
                    "missing_documents",
                    []
                )
            ),

            findings=json.dumps(
                compliance_report.get(
                    "findings",
                    []
                )
            )
        )

        db.add(report)

        # -----------------------------------------------------
        # Save recommendations safely
        # -----------------------------------------------------

        for recommendation in context.recommendations:

            document = recommendation.get(
                "document"
            )

            # -------------------------------------------------
            # Check whether an active/pending recommendation
            # already exists for this company and document.
            # -------------------------------------------------

            existing_recommendation = (
                db.query(Recommendation)
                .filter(
                    Recommendation.company_id
                    == company.id,

                    Recommendation.document
                    == document,

                    Recommendation.review_status
                    == "pending"
                )
                .first()
            )

            # -------------------------------------------------
            # Existing pending recommendation:
            #
            # Do NOT create another copy.
            # -------------------------------------------------

            if existing_recommendation:

                continue

            # -------------------------------------------------
            # No pending recommendation:
            #
            # Create a new recommendation.
            #
            # This can happen when:
            # - the previous recommendation was approved
            # - the previous recommendation was modified
            # - the previous recommendation was rejected
            # - no previous recommendation exists
            # -------------------------------------------------

            new_recommendation = Recommendation(

                company_id=
                    company.id,

                document=
                    document,

                priority=
                    recommendation.get(
                        "priority",
                        "Medium"
                    ),

                action=
                    recommendation.get(
                        "action",
                        ""
                    ),

                reason=
                    recommendation.get(
                        "reason",
                        ""
                    ),

                next_step=
                    recommendation.get(
                        "next_step",
                        ""
                    ),

                review_status=
                    "pending"
            )

            db.add(
                new_recommendation
            )

        return compliance_report

    # =========================================================
    # MAIN REGULATORY INTELLIGENCE WORKFLOW
    # =========================================================

    def run(self, db):

        detected_updates = []

        affected_clients = []

        alerts = []

        re_audits = []

        companies = (
            db.query(Company)
            .all()
        )

        # =====================================================
        # PROCESS EACH REGULATORY UPDATE
        # =====================================================

        for update in self.updates:

            update_id = update[
                "update_id"
            ]

            for company in companies:

                # =================================================
                # IDEMPOTENCY CHECK
                # =================================================
                #
                # If this company has already been processed
                # for this regulatory update, skip it.
                #
                # This prevents:
                #
                # Company 1 + REG-001
                # Company 1 + REG-001
                # Company 1 + REG-001
                #
                # from creating duplicate alerts/re-audits.
                # =================================================

                existing_alert = (
                    db.query(
                        RegulatoryAlert
                    )
                    .filter(
                        RegulatoryAlert.company_id
                        == company.id,

                        RegulatoryAlert.update_id
                        == update_id
                    )
                    .first()
                )

                if existing_alert:

                    continue

                # =================================================
                # DETERMINE WHETHER CLIENT IS AFFECTED
                # =================================================

                state_match = (
                    company.state
                    == update[
                        "affected_state"
                    ]
                )

                industry_match = (
                    company.industry
                    == update[
                        "affected_industry"
                    ]
                )

                if not (
                    state_match
                    and industry_match
                ):

                    continue

                # =================================================
                # RECORD DETECTED UPDATE
                # =================================================

                if update not in detected_updates:

                    detected_updates.append(
                        update
                    )

                # =================================================
                # RECORD AFFECTED CLIENT
                # =================================================

                affected_clients.append(
                    {
                        "company_id":
                            company.id,

                        "company_name":
                            company.company_name,

                        "update_id":
                            update_id,

                        "affected_document":
                            update[
                                "affected_document"
                            ]
                    }
                )

                # =================================================
                # LOAD COMPANY DOCUMENTS
                # =================================================

                documents = (
                    db.query(Document)
                    .filter(
                        Document.company_id
                        == company.id
                    )
                    .all()
                )

                # =================================================
                # BUILD FRESH COMPANY CONTEXT
                # =================================================

                context = (
                    self._build_company_context(
                        company,
                        documents
                    )
                )

                context.clear_analysis()

                # =================================================
                # TARGETED COMPLIANCE RE-AUDIT
                # =================================================

                context = (
                    self.compliance_agent.run(
                        context
                    )
                )

                # =================================================
                # GENERATE RECOMMENDATIONS
                # =================================================

                context = (
                    self.recommendation_agent.run(
                        context
                    )
                )

                # =================================================
                # SAVE RE-AUDIT
                # =================================================

                compliance_report = (
                    self._save_reaudit(
                        db,
                        company,
                        context
                    )
                )

                # =================================================
                # CREATE REGULATORY ALERT
                # =================================================

                alert = RegulatoryAlert(

                    company_id=
                        company.id,

                    update_id=
                        update_id,

                    authority=
                        update[
                            "authority"
                        ],

                    title=
                        update[
                            "title"
                        ],

                    severity=
                        update[
                            "severity"
                        ],

                    affected_document=
                        update[
                            "affected_document"
                        ],

                    status=
                        "re-audit_required"
                )

                db.add(
                    alert
                )

                alerts.append(
                    {
                        "company_id":
                            company.id,

                        "company_name":
                            company.company_name,

                        "update_id":
                            update_id,

                        "authority":
                            update[
                                "authority"
                            ],

                        "title":
                            update[
                                "title"
                            ],

                        "severity":
                            update[
                                "severity"
                            ],

                        "affected_document":
                            update[
                                "affected_document"
                            ],

                        "status":
                            "re-audit_required"
                    }
                )

                # =================================================
                # RECORD RE-AUDIT RESULT
                # =================================================

                re_audits.append(
                    {
                        "company_id":
                            company.id,

                        "company_name":
                            company.company_name,

                        "update_id":
                            update_id,

                        "compliance_score":
                            compliance_report.get(
                                "compliance_score",
                                0
                            ),

                        "risk_level":
                            compliance_report.get(
                                "risk_level",
                                "Unknown"
                            ),

                        "missing_documents":
                            compliance_report.get(
                                "missing_documents",
                                []
                            ),

                        "recommendations":
                            context.recommendations
                    }
                )

        # =====================================================
        # COMMIT ALL CHANGES
        # =====================================================

        db.commit()

        # =====================================================
        # RETURN WORKFLOW RESULT
        # =====================================================

        return {
            "detected_updates":
                detected_updates,

            "affected_clients":
                affected_clients,

            "re_audits":
                re_audits,

            "alerts":
                alerts
        }