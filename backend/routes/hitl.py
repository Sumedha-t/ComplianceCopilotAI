from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.database_models import (
    Recommendation,
    RegulatoryAlert,
)

from schemas.hitl_schema import (
    RecommendationReviewRequest,
    AlertReviewRequest,
    HITLResponse,
    HITLReviewQueueResponse,
)


router = APIRouter(
    prefix="/api/hitl",
    tags=["Human-in-the-Loop"],
)


# =========================================================
# RECOMMENDATION REVIEW
# =========================================================

@router.post(
    "/recommendations/{recommendation_id}/review",
    response_model=HITLResponse,
)
@router.post(
    "/recommendations/{recommendation_id}/review",
    response_model=HITLResponse,
)
def review_recommendation(
    recommendation_id: int,
    review: RecommendationReviewRequest,
    db: Session = Depends(get_db),
):
    recommendation = (
        db.query(Recommendation)
        .filter(Recommendation.id == recommendation_id)
        .first()
    )

    if recommendation is None:
        raise HTTPException(
            status_code=404,
            detail="Recommendation not found."
        )

    recommendation.review_status = review.review_status
    recommendation.lawyer_action = review.lawyer_action
    recommendation.lawyer_note = review.lawyer_note
    recommendation.reviewed_at = datetime.utcnow()

    # Determine the authoritative action after HITL review.
    if review.review_status == "approved":

        recommendation.effective_action = (
            recommendation.action
        )

    elif review.review_status == "modified":

        if not review.lawyer_action:
            raise HTTPException(
                status_code=400,
                detail=(
                    "lawyer_action is required when "
                    "review_status is 'modified'."
                )
            )

        recommendation.effective_action = (
            review.lawyer_action
        )

    elif review.review_status == "rejected":

        recommendation.effective_action = None

    elif review.review_status == "resolved":

        recommendation.effective_action = (
            review.lawyer_action
            or recommendation.action
        )

    db.commit()
    db.refresh(recommendation)

    return {
        "success": True,
        "message": "Recommendation reviewed successfully.",
        "data": {
            "id": recommendation.id,
            "document": recommendation.document,
            "priority": recommendation.priority,
            "action": recommendation.action,
            "ai_action": recommendation.action,
            "effective_action": recommendation.effective_action,
            "reason": recommendation.reason,
        },
    }
# =========================================================
# ALERT ACKNOWLEDGEMENT
# =========================================================

@router.post(
    "/alerts/{alert_id}/acknowledge",
    response_model=HITLResponse,
)
def acknowledge_alert(
    alert_id: int,
    review: AlertReviewRequest,
    db: Session = Depends(get_db),
):
    alert = (
        db.query(RegulatoryAlert)
        .filter(
            RegulatoryAlert.id == alert_id
        )
        .first()
    )

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Regulatory alert not found.",
        )

    alert.status = "acknowledged"

    alert.lawyer_note = (
        review.lawyer_note
    )

    alert.acknowledged_at = (
        datetime.utcnow()
    )

    db.commit()
    db.refresh(alert)

    return {
        "success": True,

        "message": (
            "Regulatory alert acknowledged successfully."
        ),

        "data": {
            "id": alert.id,

            "company_id":
                alert.company_id,

            "update_id":
                alert.update_id,

            "status":
                alert.status,

            "lawyer_note":
                alert.lawyer_note,

            "acknowledged_at":
                alert.acknowledged_at,
        },
    }


# =========================================================
# ALERT RESOLUTION
# =========================================================

@router.post(
    "/alerts/{alert_id}/resolve",
    response_model=HITLResponse,
)
def resolve_alert(
    alert_id: int,
    review: AlertReviewRequest,
    db: Session = Depends(get_db),
):
    alert = (
        db.query(RegulatoryAlert)
        .filter(
            RegulatoryAlert.id == alert_id
        )
        .first()
    )

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Regulatory alert not found.",
        )

    alert.status = "resolved"

    alert.lawyer_note = (
        review.lawyer_note
    )

    alert.acknowledged_at = (
        datetime.utcnow()
    )

    db.commit()
    db.refresh(alert)

    return {
        "success": True,

        "message":
            "Regulatory alert resolved successfully.",

        "data": {
            "id": alert.id,

            "company_id":
                alert.company_id,

            "update_id":
                alert.update_id,

            "status":
                alert.status,

            "lawyer_note":
                alert.lawyer_note,

            "acknowledged_at":
                alert.acknowledged_at,
        },
    }


# =========================================================
# LAWYER REVIEW QUEUE
# =========================================================

@router.get(
    "/company/{company_id}",
    response_model=HITLReviewQueueResponse,
)
def get_hitl_queue(
    company_id: int,
    db: Session = Depends(get_db),
):
    recommendations = (
        db.query(Recommendation)
        .filter(
            Recommendation.company_id
            == company_id,

            Recommendation.review_status
            == "pending",
        )
        .order_by(
            Recommendation.created_at.desc()
        )
        .all()
    )

    alerts = (
        db.query(RegulatoryAlert)
        .filter(
            RegulatoryAlert.company_id
            == company_id,

            RegulatoryAlert.status.in_(
                [
                    "new",
                    "re-audit_required",
                ]
            ),
        )
        .order_by(
            RegulatoryAlert.created_at.desc()
        )
        .all()
    )

    return {
        "success": True,

        "data": {
            "company_id":
                company_id,

            "pending_recommendations": [
                {
                    "id":
                        recommendation.id,

                    "document":
                        recommendation.document,

                    "priority":
                        recommendation.priority,

                    "action":
                        recommendation.action,

                    "reason":
                        recommendation.reason,

                    "next_step":
                        recommendation.next_step,

                    "review_status":
                        recommendation.review_status,

                    "lawyer_action":
                        recommendation.lawyer_action,

                    "lawyer_note":
                        recommendation.lawyer_note,

                    "created_at":
                        recommendation.created_at,
                }

                for recommendation
                in recommendations
            ],

            "pending_alerts": [
                {
                    "id":
                        alert.id,

                    "update_id":
                        alert.update_id,

                    "authority":
                        alert.authority,

                    "title":
                        alert.title,

                    "severity":
                        alert.severity,

                    "affected_document":
                        alert.affected_document,

                    "status":
                        alert.status,

                    "lawyer_note":
                        alert.lawyer_note,

                    "created_at":
                        alert.created_at,
                }

                for alert in alerts
            ],
        },
    }