import json
from pathlib import Path

from models.session_context import SessionContext


class ComplianceAgent:

    def __init__(self):

        rules_path = (
            Path(__file__).resolve().parent.parent
            / "rules"
            / "compliance_rules.json"
        )

        with open(
            rules_path,
            "r",
            encoding="utf-8"
        ) as file:

            self.rules = json.load(file)

    def run(
        self,
        context: SessionContext
    ):

        uploaded_types = set()

        for document in context.uploaded_documents:

            document_type = document.get(
                "document_type"
            )

            if document_type:
                uploaded_types.add(
                    document_type
                )

        company_type = context.company_profile.get(
            "recommended_structure",
            "Private Limited Company"
        )

        company_rules = self.rules[
            "company_types"
        ].get(
            company_type
        )

        if not company_rules:

            company_rules = self.rules[
                "company_types"
            ]["Private Limited Company"]

        required_documents = company_rules[
            "required_documents"
        ]

        compliance_score = 0

        present_documents = []

        missing_documents = []

        findings = []

        for requirement in required_documents:

            document_type = requirement[
                "document_type"
            ]

            weight = requirement[
                "weight"
            ]

            reason = requirement[
                "reason"
            ]

            if document_type in uploaded_types:

                compliance_score += weight

                present_documents.append(
                    document_type
                )

                findings.append(
                    {
                        "document": document_type,
                        "status": "present",
                        "weight": weight
                    }
                )

            else:

                missing_documents.append(
                    document_type
                )

                findings.append(
                    {
                        "document": document_type,
                        "status": "missing",
                        "weight": weight,
                        "reason": reason
                    }
                )

        risk_level = self._get_risk_level(
            compliance_score
        )

        report = {
            "compliance_score": compliance_score,
            "risk_level": risk_level,
            "present_documents": present_documents,
            "missing_documents": missing_documents,
            "findings": findings,
            "ruleset": "prototype"
        }

        context.update_compliance_report(
            report
        )

        return context

    def _get_risk_level(
        self,
        score: int
    ):

        if score >= 80:
            return "Low"

        if score >= 60:
            return "Medium"

        return "High"