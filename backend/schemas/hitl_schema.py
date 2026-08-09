from typing import Literal, Optional

from pydantic import BaseModel, Field


class RecommendationReviewRequest(BaseModel):
    review_status: Literal[
        "approved",
        "modified",
        "rejected",
        "resolved"
    ]

    lawyer_action: Optional[str] = Field(
        default=None,
        description="Action decided by the lawyer."
    )

    lawyer_note: Optional[str] = Field(
        default=None,
        description="Lawyer's reasoning or additional instructions."
    )


class AlertReviewRequest(BaseModel):
    lawyer_note: Optional[str] = Field(
        default=None,
        description="Lawyer's note regarding the regulatory alert."
    )


class HITLResponse(BaseModel):
    success: bool
    message: str
    data: dict


class HITLReviewQueueResponse(BaseModel):
    success: bool
    data: dict