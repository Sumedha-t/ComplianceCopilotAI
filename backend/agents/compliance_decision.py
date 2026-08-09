from datetime import datetime

from models.database_models import (
    Company,
    ComplianceReport,
    Recommendation,
    RegulatoryAlert,
)


class ComplianceDecisionAgent:
    """
    Phase C Decision Engine.

    Consolidates:
    - compliance assessment
    - AI recommendations
    - lawyer HITL decisions
    - regulatory alerts

    into one prioritized, deduplicated ACTIVE action plan.

    Authority hierarchy:
    1. Lawyer-reviewed decision
    2. Regulatory impact
    3. AI recommendation

    Terminal recommendations such as resolved, completed,
    verified, or rejected are excluded from the active plan.
    They remain in the database as audit/history records.
    """

    PRIORITY_ORDER = {
        "Critical": 0,
        "High": 1,
        "Medium": 2,
        "Low": 3,
    }

    # These states mean the recommendation is no longer
    # an active compliance action.
    TERMINAL_REVIEW_STATUSES = {
        "resolved",
        "rejected",
    }

    TERMINAL_ACTION_STATUSES = {
        "completed",
        "verified",
    }

    def run(self, db, company_id: int):

        # =====================================================
        # 1. LOAD COMPANY
        # =====================================================

        company = (
            db.query(Company)
            .filter(Company.id == company_id)
            .first()
        )

        if company is None:
            raise ValueError(
                f"Company {company_id} not found."
            )

        # =====================================================
        # 2. LOAD LATEST COMPLIANCE REPORT
        # =====================================================

        compliance = (
            db.query(ComplianceReport)
            .filter(
                ComplianceReport.company_id == company_id
            )
            .order_by(
                ComplianceReport.created_at.desc()
            )
            .first()
        )

        # =====================================================
        # 3. LOAD RECOMMENDATIONS
        # =====================================================

        recommendations = (
            db.query(Recommendation)
            .filter(
                Recommendation.company_id == company_id
            )
            .order_by(
                Recommendation.created_at.desc(),
                Recommendation.id.desc(),
            )
            .all()
        )

        # =====================================================
        # 4. LOAD REGULATORY ALERTS
        # =====================================================

        alerts = (
            db.query(RegulatoryAlert)
            .filter(
                RegulatoryAlert.company_id == company_id
            )
            .order_by(
                RegulatoryAlert.created_at.desc(),
                RegulatoryAlert.id.desc(),
            )
            .all()
        )

        # =====================================================
        # 5. CONSOLIDATION STORE
        # =====================================================

        # One active action per compliance document.
        #
        # Example:
        #
        # Factory License
        #   AI recommendation
        #   + lawyer modification
        #   + regulatory alert
        #
        # becomes ONE ACTIVE action.
        #
        # If that requirement has already been resolved,
        # completed, or verified, it is excluded entirely
        # from the active action plan.

        consolidated = {}

        # =====================================================
        # 6. PROCESS RECOMMENDATIONS
        # =====================================================

        for recommendation in recommendations:

            # -------------------------------------------------
            # TERMINAL RECOMMENDATIONS
            # -------------------------------------------------
            #
            # These remain in the DB for audit/history but
            # must NOT appear in the current action plan.
            #

            if (
                recommendation.review_status
                in self.TERMINAL_REVIEW_STATUSES
            ):
                continue

            if (
                recommendation.action_status
                in self.TERMINAL_ACTION_STATUSES
            ):
                continue

            # -------------------------------------------------
            # REJECTED
            # -------------------------------------------------

            if recommendation.review_status == "rejected":
                continue

            document = (
                recommendation.document
                or "General Compliance"
            )

            key = document.strip().lower()

            # -------------------------------------------------
            # Determine effective action
            # -------------------------------------------------

            effective_action = getattr(
                recommendation,
                "effective_action",
                None,
            )

            if not effective_action:

                if recommendation.lawyer_action:
                    effective_action = (
                        recommendation.lawyer_action
                    )
                else:
                    effective_action = (
                        recommendation.action
                    )

            # -------------------------------------------------
            # Determine source
            # -------------------------------------------------

            if recommendation.review_status == "modified":

                source = "lawyer_modified"

            elif recommendation.review_status in (
                "approved",
            ):

                source = "lawyer_validated"

            else:

                source = "ai_recommendation"

            priority = (
                recommendation.priority
                or "Medium"
            )

            # -------------------------------------------------
            # Existing active action?
            # -------------------------------------------------

            existing = consolidated.get(key)

            if existing is None:

                consolidated[key] = {
                    "type": "compliance_action",
                    "document": document,
                    "priority": priority,
                    "action": effective_action,
                    "reason": recommendation.reason,
                    "next_step": recommendation.next_step,
                    "source": source,
                    "recommendation_id": recommendation.id,
                    "status": recommendation.review_status,
                    "lawyer_reviewed": (
                        recommendation.review_status
                        != "pending"
                    ),
                    "regulatory_alerts": [],
                }

            else:

                # Lawyer-reviewed recommendations have
                # authority over AI-generated duplicates.
                if source in (
                    "lawyer_modified",
                    "lawyer_validated",
                ):

                    existing["action"] = effective_action

                    existing["source"] = source

                    existing["recommendation_id"] = (
                        recommendation.id
                    )

                    existing["status"] = (
                        recommendation.review_status
                    )

                    existing["lawyer_reviewed"] = True

                # Keep the highest priority.
                if self.PRIORITY_ORDER.get(
                    priority,
                    2
                ) < self.PRIORITY_ORDER.get(
                    existing["priority"],
                    2
                ):

                    existing["priority"] = priority

        # =====================================================
        # 7. PROCESS REGULATORY ALERTS
        # =====================================================

        for alert in alerts:

            # Resolved alerts are historical information.
            if alert.status == "resolved":
                continue

            document = (
                alert.affected_document
                or "General Compliance"
            )

            key = document.strip().lower()

            alert_priority = (
                alert.severity
                or "Medium"
            )

            existing = consolidated.get(key)

            # -------------------------------------------------
            # No recommendation exists
            # -------------------------------------------------

            if existing is None:

                consolidated[key] = {
                    "type": "regulatory_action",
                    "document": document,
                    "priority": alert_priority,
                    "action": (
                        f"Review regulatory update "
                        f"{alert.update_id} and assess "
                        f"its impact on the business."
                    ),
                    "reason": alert.title,
                    "next_step": (
                        alert.lawyer_note
                        or (
                            "Review the affected compliance "
                            "requirement and determine whether "
                            "re-audit or document renewal "
                            "is required."
                        )
                    ),
                    "source": "regulatory_alert",
                    "recommendation_id": None,
                    "alert_id": alert.id,
                    "update_id": alert.update_id,
                    "authority": alert.authority,
                    "status": alert.status,
                    "lawyer_reviewed": False,
                    "regulatory_alerts": [
                        {
                            "alert_id": alert.id,
                            "update_id": alert.update_id,
                            "authority": alert.authority,
                            "severity": alert.severity,
                            "status": alert.status,
                        }
                    ],
                }

                continue

            # -------------------------------------------------
            # Recommendation exists.
            #
            # Attach alert instead of creating duplicate.
            # -------------------------------------------------

            existing.setdefault(
                "regulatory_alerts",
                []
            )

            existing["regulatory_alerts"].append(
                {
                    "alert_id": alert.id,
                    "update_id": alert.update_id,
                    "authority": alert.authority,
                    "severity": alert.severity,
                    "status": alert.status,
                }
            )

            # Regulatory alerts can increase priority,
            # but NEVER overwrite lawyer action.
            if self.PRIORITY_ORDER.get(
                alert_priority,
                2
            ) < self.PRIORITY_ORDER.get(
                existing["priority"],
                2
            ):

                existing["priority"] = alert_priority

        # =====================================================
        # 8. BUILD FINAL ACTIVE ACTION PLAN
        # =====================================================

        actions = list(
            consolidated.values()
        )

        actions.sort(
            key=lambda item: (
                self.PRIORITY_ORDER.get(
                    item["priority"],
                    2
                ),
                item["document"],
            )
        )

        # =====================================================
        # 9. COMPLIANCE STATE
        # =====================================================

        if compliance is not None:

            compliance_score = (
                compliance.compliance_score
            )

            risk_level = (
                compliance.risk_level
            )

        else:

            compliance_score = None
            risk_level = None

        # =====================================================
        # 10. OVERALL DECISION
        # =====================================================

        if any(
            action["priority"] == "Critical"
            for action in actions
        ):

            overall_status = (
                "critical_action_required"
            )

        elif (
            risk_level == "High"
            or any(
                action["priority"] == "High"
                for action in actions
            )
        ):

            overall_status = (
                "high_priority_action_required"
            )

        elif actions:

            overall_status = "action_required"

        else:

            overall_status = "no_immediate_action"

        # =====================================================
        # 11. NEXT BEST ACTION
        # =====================================================

        if actions:

            next_action = actions[0]

            next_best_action = {
                "action": next_action["action"],
                "document": next_action["document"],
                "priority": next_action["priority"],
                "source": next_action["source"],
                "reason": next_action["reason"],
            }

        else:

            next_best_action = {
                "action": (
                    "Continue routine compliance monitoring."
                ),
                "document": None,
                "priority": "Low",
                "source": "decision_engine",
                "reason": (
                    "No unresolved compliance or "
                    "regulatory actions were detected."
                ),
            }

        # =====================================================
        # 12. RETURN DECISION
        # =====================================================

        return {
            "company": {
                "id": company.id,
                "company_name": company.company_name,
                "industry": company.industry,
                "state": company.state,
                "business_type": company.business_type,
            },

            "compliance": {
                "score": compliance_score,
                "risk_level": risk_level,
            },

            "decision": {
                "overall_status": overall_status,
                "total_actions": len(actions),
                "next_best_action": next_best_action,
            },

            "action_plan": actions,

            "generated_at": datetime.utcnow(),
        }