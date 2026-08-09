import json
from pathlib import Path

from models.session_context import SessionContext


class RecommendationAgent:

    def __init__(self):

        rules_path = (
            Path(__file__).resolve().parent.parent
            / "rules"
            / "recommendation_rules.json"
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

        compliance_report = context.compliance_report

        missing_documents = compliance_report.get(
            "missing_documents",
            []
        )

        recommendations = []

        for document in missing_documents:

            recommendation_rule = self.rules[
                "recommendations"
            ].get(document)

            if not recommendation_rule:
                continue

            recommendation = {
                "document": document,
                "priority": recommendation_rule[
                    "priority"
                ],
                "action": recommendation_rule[
                    "action"
                ],
                "reason": recommendation_rule[
                    "reason"
                ],
                "next_step": recommendation_rule[
                    "next_step"
                ]
            }

            recommendations.append(
                recommendation
            )

        context.recommendations = recommendations

        return context