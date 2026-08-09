from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from agents.compliance_decision import (
    ComplianceDecisionAgent,
)


router = APIRouter(
    prefix="/api/action-plan",
    tags=["Compliance Decision Engine"],
)


decision_agent = ComplianceDecisionAgent()


@router.get("/{company_id}")
def get_action_plan(
    company_id: int,
    db: Session = Depends(get_db),
):
    """
    Generate the current prioritized compliance
    action plan for a company.
    """

    try:

        result = decision_agent.run(
            db,
            company_id
        )

        return {
            "success": True,
            "data": result,
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to generate compliance "
                "action plan."
            ),
        )