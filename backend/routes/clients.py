from fastapi import APIRouter

from database import SessionLocal

from models.database_models import (
    Company,
    ComplianceReport,
    RegulatoryAlert,
)


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Lawyer Dashboard"]
)


@router.get("/companies")
async def get_companies():
    """
    Return all companies for the lawyer/client list.
    """

    db = SessionLocal()

    try:

        companies = (
            db.query(Company)
            .order_by(
                Company.company_name.asc()
            )
            .all()
        )

        result = []

        for company in companies:

            latest_report = (
                db.query(ComplianceReport)
                .filter(
                    ComplianceReport.company_id == company.id
                )
                .order_by(
                    ComplianceReport.created_at.desc()
                )
                .first()
            )

            alert_count = (
                db.query(RegulatoryAlert)
                .filter(
                    RegulatoryAlert.company_id == company.id,
                    RegulatoryAlert.status == "re-audit_required"
                )
                .count()
            )

            result.append(
                {
                    "id": company.id,
                    "company_name": company.company_name,
                    "industry": company.industry,
                    "state": company.state,

                    "compliance_score": (
                        latest_report.compliance_score
                        if latest_report
                        else None
                    ),

                    "risk_level": (
                        latest_report.risk_level
                        if latest_report
                        else None
                    ),

                    "regulatory_alerts": alert_count,
                }
            )

        return {
            "success": True,
            "data": result
        }

    finally:
        db.close()