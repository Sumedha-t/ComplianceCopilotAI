import json
from pathlib import Path

from models.database_models import (
    Company,
    RegulatoryAlert,
    Document
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

        self.compliance_agent = (
            ComplianceAgent()
        )

        self.recommendation_agent = (
            RecommendationAgent()
        )

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

    def run(self, db):

        detected_updates = []

        affected_clients = []

        alerts = []

        re_audits = []

        companies = (
            db.query(Company)
            .all()
        )

        for update in self.updates:

            existing_alert = (
                db.query(
                    RegulatoryAlert
                )
                .filter(
                    RegulatoryAlert.update_id
                    == update["update_id"]
                )
                .first()
            )

            if existing_alert:

                continue

            detected_updates.append(
                update
            )

            for company in companies:

                state_match = (
                    company.state
                    == update["affected_state"]
                )

                industry_match = (
                    company.industry
                    == update["affected_industry"]
                )

                if not (
                    state_match
                    and industry_match
                ):

                    continue

                affected_clients.append(
                    {
                        "company_id": company.id,
                        "company_name": (
                            company.company_name
                        ),
                        "update_id": (
                            update["update_id"]
                        ),
                        "affected_document": (
                            update[
                                "affected_document"
                            ]
                        )
                    }
                )

                documents = (
                    db.query(Document)
                    .filter(
                        Document.company_id
                        == company.id
                    )
                    .all()
                )

                context = (
                    self._build_company_context(
                        company,
                        documents
                    )
                )

                context.clear_analysis()

                context = (
                    self.compliance_agent.run(
                        context
                    )
                )

                context = (
                    self.recommendation_agent.run(
                        context
                    )
                )

                compliance_report = (
                    context.compliance_report
                )

                alert = RegulatoryAlert(
                    company_id=company.id,
                    update_id=update[
                        "update_id"
                    ],
                    authority=update[
                        "authority"
                    ],
                    title=update[
                        "title"
                    ],
                    severity=update[
                        "severity"
                    ],
                    affected_document=update[
                        "affected_document"
                    ],
                    status="re-audit_required"
                )

                db.add(alert)

                alerts.append(
                    {
                        "company_id": company.id,
                        "company_name": (
                            company.company_name
                        ),
                        "update_id": (
                            update["update_id"]
                        ),
                        "authority": (
                            update["authority"]
                        ),
                        "title": (
                            update["title"]
                        ),
                        "severity": (
                            update["severity"]
                        ),
                        "affected_document": (
                            update[
                                "affected_document"
                            ]
                        ),
                        "status": (
                            "re-audit_required"
                        )
                    }
                )

                re_audits.append(
                    {
                        "company_id": company.id,
                        "company_name": (
                            company.company_name
                        ),
                        "update_id": (
                            update["update_id"]
                        ),
                        "compliance_score": (
                            compliance_report.get(
                                "compliance_score",
                                0
                            )
                        ),
                        "risk_level": (
                            compliance_report.get(
                                "risk_level",
                                "Unknown"
                            )
                        ),
                        "missing_documents": (
                            compliance_report.get(
                                "missing_documents",
                                []
                            )
                        ),
                        "recommendations": (
                            context.recommendations
                        )
                    }
                )

        db.commit()

        return {
            "detected_updates": (
                detected_updates
            ),
            "affected_clients": (
                affected_clients
            ),
            "re_audits": re_audits,
            "alerts": alerts
        }