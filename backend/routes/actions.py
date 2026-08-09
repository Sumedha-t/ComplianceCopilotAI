from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.database_models import Recommendation

from schemas.action_schema import (
    ActionStartRequest,
    ActionCompleteRequest,
    ActionBlockRequest,
    ActionResponse,
    ActionQueueResponse,
)


router = APIRouter(
    prefix="/api/actions",
    tags=["Action Execution"],
)


# =========================================================
# START ACTION
# =========================================================

@router.post(
    "/recommendations/{recommendation_id}/start",
    response_model=ActionResponse,
)
def start_action(
    recommendation_id: int,
    request: ActionStartRequest,
    db: Session = Depends(get_db),
):

    recommendation = (
        db.query(Recommendation)
        .filter(
            Recommendation.id == recommendation_id
        )
        .first()
    )

    if recommendation is None:
        raise HTTPException(
            status_code=404,
            detail="Recommendation not found."
        )

    if recommendation.review_status == "rejected":
        raise HTTPException(
            status_code=400,
            detail="Rejected recommendation cannot be started."
        )

    if recommendation.action_status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Action is already completed."
        )

    recommendation.action_status = "in_progress"

    if recommendation.action_started_at is None:
        recommendation.action_started_at = datetime.utcnow()

    if request.note:
        recommendation.lawyer_note = request.note

    db.commit()
    db.refresh(recommendation)

    return {
        "success": True,
        "message": "Compliance action started successfully.",
        "data": {
            "id": recommendation.id,
            "company_id": recommendation.company_id,
            "document": recommendation.document,
            "action": (
                recommendation.effective_action
                or recommendation.lawyer_action
                or recommendation.action
            ),
            "action_status": recommendation.action_status,
            "action_started_at": recommendation.action_started_at,
            "action_completed_at": recommendation.action_completed_at,
            "action_blocked_reason": (
                recommendation.action_blocked_reason
            ),
        },
    }


# =========================================================
# COMPLETE ACTION
# =========================================================

@router.post(
    "/recommendations/{recommendation_id}/complete",
    response_model=ActionResponse,
)
def complete_action(
    recommendation_id: int,
    request: ActionCompleteRequest,
    db: Session = Depends(get_db),
):

    recommendation = (
        db.query(Recommendation)
        .filter(
            Recommendation.id == recommendation_id
        )
        .first()
    )

    if recommendation is None:
        raise HTTPException(
            status_code=404,
            detail="Recommendation not found."
        )

    if recommendation.review_status == "rejected":
        raise HTTPException(
            status_code=400,
            detail="Rejected recommendation cannot be completed."
        )

    if recommendation.action_status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Action is already completed."
        )

    if recommendation.action_status != "in_progress":
        raise HTTPException(
            status_code=400,
            detail=(
                "Action must be started before it can be completed."
            )
        )

    recommendation.action_status = "completed"
    recommendation.action_completed_at = datetime.utcnow()
    recommendation.action_blocked_reason = None

    if request.note:
        recommendation.lawyer_note = request.note

    db.commit()
    db.refresh(recommendation)

    return {
        "success": True,
        "message": "Compliance action completed successfully.",
        "data": {
            "id": recommendation.id,
            "company_id": recommendation.company_id,
            "document": recommendation.document,
            "action": (
                recommendation.effective_action
                or recommendation.lawyer_action
                or recommendation.action
            ),
            "action_status": recommendation.action_status,
            "action_started_at": recommendation.action_started_at,
            "action_completed_at": recommendation.action_completed_at,
            "action_blocked_reason": (
                recommendation.action_blocked_reason
            ),
        },
    }


# =========================================================
# BLOCK ACTION
# =========================================================

@router.post(
    "/recommendations/{recommendation_id}/block",
    response_model=ActionResponse,
)
def block_action(
    recommendation_id: int,
    request: ActionBlockRequest,
    db: Session = Depends(get_db),
):

    recommendation = (
        db.query(Recommendation)
        .filter(
            Recommendation.id == recommendation_id
        )
        .first()
    )

    if recommendation is None:
        raise HTTPException(
            status_code=404,
            detail="Recommendation not found."
        )

    if recommendation.action_status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Completed action cannot be blocked."
        )

    recommendation.action_status = "blocked"
    recommendation.action_blocked_reason = request.reason

    db.commit()
    db.refresh(recommendation)

    return {
        "success": True,
        "message": "Compliance action blocked successfully.",
        "data": {
            "id": recommendation.id,
            "company_id": recommendation.company_id,
            "document": recommendation.document,
            "action": (
                recommendation.effective_action
                or recommendation.lawyer_action
                or recommendation.action
            ),
            "action_status": recommendation.action_status,
            "action_started_at": recommendation.action_started_at,
            "action_completed_at": recommendation.action_completed_at,
            "action_blocked_reason": (
                recommendation.action_blocked_reason
            ),
        },
    }


# =========================================================
# ACTION QUEUE
# =========================================================

@router.get(
    "/company/{company_id}",
    response_model=ActionQueueResponse,
)
def get_action_queue(
    company_id: int,
    db: Session = Depends(get_db),
):

    recommendations = (
        db.query(Recommendation)
        .filter(
            Recommendation.company_id == company_id
        )
        .order_by(
            Recommendation.priority.desc(),
            Recommendation.created_at.desc(),
        )
        .all()
    )

    actions = []

    for recommendation in recommendations:

        if recommendation.review_status == "rejected":
            continue

        actions.append({
            "id": recommendation.id,
            "document": recommendation.document,
            "priority": recommendation.priority,
            "ai_action": recommendation.action,
            "effective_action": (
                recommendation.effective_action
                or recommendation.lawyer_action
                or recommendation.action
            ),
            "review_status": recommendation.review_status,
            "lawyer_reviewed": (
                recommendation.review_status != "pending"
            ),
            "action_status": recommendation.action_status,
            "action_started_at": recommendation.action_started_at,
            "action_completed_at": recommendation.action_completed_at,
            "action_blocked_reason": (
                recommendation.action_blocked_reason
            ),
        })

    return {
        "success": True,
        "data": {
            "company_id": company_id,
            "total_actions": len(actions),
            "actions": actions,
        },
    }