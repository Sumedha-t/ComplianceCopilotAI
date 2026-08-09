from typing import Literal, Optional

from pydantic import BaseModel, Field


class ActionStartRequest(BaseModel):
    note: Optional[str] = Field(
        default=None,
        description="Optional note when starting the compliance action."
    )


class ActionCompleteRequest(BaseModel):
    note: Optional[str] = Field(
        default=None,
        description="Optional completion note."
    )


class ActionBlockRequest(BaseModel):
    reason: str = Field(
        ...,
        min_length=1,
        description="Reason why the compliance action is blocked."
    )


class ActionResponse(BaseModel):
    success: bool
    message: str
    data: dict


class ActionQueueResponse(BaseModel):
    success: bool
    data: dict