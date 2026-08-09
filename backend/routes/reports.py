from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from database import SessionLocal

from models.database_models import (
    Company,
    Document,
    ComplianceReport,
    Recommendation,
    RegulatoryAlert,
)

from services.report_service import ReportService


router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"]
)


@router.get("/compliance/{company_id}")
async def download_compliance_report(
    company_id: int
):

    db = SessionLocal()

    try:

        company = (
            db.query(Company)
            .filter(
                Company.id == company_id
            )
            .first()
        )

        if not company:

            raise HTTPException(
                status_code=404,
                detail="Company not found."
            )

        compliance_report = (
            db.query(ComplianceReport)
            .filter(
                ComplianceReport.company_id
                == company_id
            )
            .order_by(
                ComplianceReport.created_at.desc()
            )
            .first()
        )

        documents = (
            db.query(Document)
            .filter(
                Document.company_id
                == company_id
            )
            .all()
        )

        recommendations = (
            db.query(Recommendation)
            .filter(
                Recommendation.company_id
                == company_id
            )
            .order_by(
                Recommendation.created_at.desc()
            )
            .all()
        )

        regulatory_alerts = (
            db.query(RegulatoryAlert)
            .filter(
                RegulatoryAlert.company_id
                == company_id
            )
            .order_by(
                RegulatoryAlert.created_at.desc()
            )
            .all()
        )

        report_service = ReportService()

        report_path = (
            report_service.generate_compliance_report(
                company=company,
                compliance_report=compliance_report,
                documents=documents,
                recommendations=recommendations,
                regulatory_alerts=regulatory_alerts
            )
        )

        return FileResponse(
            path=str(report_path),
            media_type=(
                "application/vnd.openxmlformats-"
                "officedocument.wordprocessingml.document"
            ),
            filename=report_path.name
        )

    finally:

        db.close()