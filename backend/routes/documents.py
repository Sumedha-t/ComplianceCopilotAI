from fastapi import APIRouter, UploadFile, File

from services.document_service import DocumentService

router = APIRouter(
    prefix="/api/documents",
    tags=["Document Upload"]
)

document_service = DocumentService()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):

    return document_service.process(
        file.filename
    )