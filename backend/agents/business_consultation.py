import json
from pathlib import Path


class BusinessConsultationAgent:
    """
    Agent responsible for recommending the most suitable
    business structure based on questionnaire responses.
    """

    def __init__(self):
        rules_path = Path(__file__).parent.parent / "rules" / "business_rules.json"

        with open(rules_path, "r", encoding="utf-8") as file:
            self.rules = json.load(file)

    def run(self, consultation):
        founders = consultation.founders
        employees = consultation.employees
        turnover = consultation.annual_turnover

        for company in self.rules["company_structures"]:

            conditions = company["conditions"]

            min_founders = conditions.get("min_founders", 1)
            max_founders = conditions.get("max_founders", float("inf"))

            max_employees = conditions.get("max_employees", float("inf"))
            max_turnover = conditions.get("max_turnover", float("inf"))

            if (
                founders >= min_founders
                and founders <= max_founders
                and employees <= max_employees
                and turnover <= max_turnover
            ):

                return {
                    "recommended_structure": company["name"],
                    "required_registrations": company["required_registrations"],
                    "reason": company["reason"]
                }

        return {
            "recommended_structure": "Private Limited Company",
            "required_registrations": [
                "PAN",
                "GST",
                "Certificate of Incorporation"
            ],
            "reason": "No exact rule matched. Default recommendation applied."
        }