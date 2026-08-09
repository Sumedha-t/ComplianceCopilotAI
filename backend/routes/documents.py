from pathlib import Path
import shutil

from fastapi import APIRouter, File, UploadFile

from services.document_service import DocumentService

router = APIRouter(
    prefix="/api/documents",
    tags=["Document Upload"],
)

document_service = DocumentService()

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_DIRECTORY = BASE_DIR / "uploads"

UPLOAD_DIRECTORY.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):

    destination = UPLOAD_DIRECTORY / file.filename
    print(f"Saving uploaded file to: {destination}")

    with open(destination, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return document_service.process(
        str(destination)
    )