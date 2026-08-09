from pydantic import BaseModel


class DocumentUploadResponse(BaseModel):

    success: bool

    message: str

    data: dict