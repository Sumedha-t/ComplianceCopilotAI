import json
from pathlib import Path


class BusinessConsultationAgent:
    """
    Agent responsible for recommending a suitable business
    structure and generating an initial compliance profile
    for a new business.

    NOTE:
    The compliance mappings in this prototype are demo rules.
    They are not intended to represent an exhaustive legal
    determination of applicable regulations.
    """

    def __init__(self):

        rules_path = (
            Path(__file__).parent.parent
            / "rules"
            / "business_rules.json"
        )

        with open(
            rules_path,
            "r",
            encoding="utf-8"
        ) as file:

            self.rules = json.load(file)

    def run(self, consultation):

        founders = consultation.founders
        employees = consultation.employees
        turnover = consultation.annual_turnover

        industry = consultation.industry.strip().lower()
        state = consultation.state.strip().lower()

        # ==================================================
        # 1. BUSINESS STRUCTURE RECOMMENDATION
        # ==================================================

        recommendation = None

        for company in self.rules["company_structures"]:

            conditions = company["conditions"]

            min_founders = conditions.get(
                "min_founders",
                1
            )

            max_founders = conditions.get(
                "max_founders",
                float("inf")
            )

            max_employees = conditions.get(
                "max_employees",
                float("inf")
            )

            max_turnover = conditions.get(
                "max_turnover",
                float("inf")
            )

            if (
                founders >= min_founders
                and founders <= max_founders
                and employees <= max_employees
                and turnover <= max_turnover
            ):

                recommendation = {
                    "recommended_structure":
                        company["name"],

                    "required_registrations":
                        company["required_registrations"],

                    "reason":
                        company["reason"]
                }

                break

        # --------------------------------------------------
        # Default recommendation
        # --------------------------------------------------

        if recommendation is None:

            recommendation = {
                "recommended_structure":
                    "Private Limited Company",

                "required_registrations": [
                    "PAN",
                    "GST",
                    "Certificate of Incorporation",
                    "DIN",
                    "DSC"
                ],

                "reason":
                    "No exact prototype rule matched. "
                    "Default recommendation applied."
            }

        # ==================================================
        # 2. INDUSTRY-SPECIFIC COMPLIANCE
        # ==================================================

        industry_compliance = []

        industry_rules = self.rules.get(
            "industry_compliance",
            {}
        )

        for industry_name, requirements in industry_rules.items():

            if industry_name.lower() in industry:

                industry_compliance.extend(
                    requirements
                )

                break

        # ==================================================
        # 3. STATE-SPECIFIC COMPLIANCE
        # ==================================================

        state_compliance = []

        state_rules = self.rules.get(
            "state_compliance",
            {}
        )

        for state_name, requirements in state_rules.items():

            if state_name.lower() == state:

                state_compliance.extend(
                    requirements
                )

                break

        # ==================================================
        # 4. REMOVE DUPLICATES
        # ==================================================

        required_registrations = list(
            dict.fromkeys(
                recommendation[
                    "required_registrations"
                ]
            )
        )

        industry_compliance = list(
            dict.fromkeys(
                industry_compliance
            )
        )

        state_compliance = list(
            dict.fromkeys(
                state_compliance
            )
        )

        # ==================================================
        # 5. INITIAL COMPLIANCE CHECKLIST
        # ==================================================

        initial_compliance_checklist = list(
            dict.fromkeys(
                required_registrations
                + industry_compliance
                + state_compliance
            )
        )

        # ==================================================
        # 6. NEXT STEPS
        # ==================================================

        next_steps = [
            "Confirm the recommended business structure.",
            "Complete the applicable registrations.",
        ]

        if industry_compliance:

            next_steps.append(
                "Obtain or verify the applicable "
                "industry-specific approvals."
            )

        if state_compliance:

            next_steps.append(
                "Review the applicable state-level "
                "requirements for the business location."
            )

        next_steps.append(
            "Upload available documents for "
            "compliance verification."
        )

        next_steps.append(
            "Continue monitoring for regulatory changes "
            "that may affect the business."
        )

        # ==================================================
        # 7. FINAL AGENT RESULT
        # ==================================================

        return {

            "recommended_structure":
                recommendation[
                    "recommended_structure"
                ],

            "required_registrations":
                required_registrations,

            "industry_compliance":
                industry_compliance,

            "state_compliance":
                state_compliance,

            "initial_compliance_checklist":
                initial_compliance_checklist,

            "next_steps":
                next_steps,

            "reason":
                recommendation["reason"]
        }