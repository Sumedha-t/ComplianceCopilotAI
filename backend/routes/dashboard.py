import json

from fastapi import APIRouter, HTTPException

from database import SessionLocal

from models.database_models import (
    Company,
    Document,
    ComplianceReport,
    Recommendation,
    RegulatoryAlert,
)


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Lawyer Dashboard"]
)


def parse_json(value, default):

    if not value:
        return default

    try:
        return json.loads(value)

    except (json.JSONDecodeError, TypeError):
        return default


@router.get("/{company_id}")
async def get_company_dashboard(company_id: int):

    db = SessionLocal()

    try:

        # -------------------------------------------------
        # COMPANY
        # -------------------------------------------------

        company = (
            db.query(Company)
            .filter(Company.id == company_id)
            .first()
        )

        if not company:

            raise HTTPException(
                status_code=404,
                detail="Company not found."
            )

        # -------------------------------------------------
        # DOCUMENTS
        # -------------------------------------------------

        documents = (
            db.query(Document)
            .filter(
                Document.company_id == company_id
            )
            .order_by(
                Document.uploaded_at.desc()
            )
            .all()
        )

        # -------------------------------------------------
        # LATEST COMPLIANCE REPORT
        # -------------------------------------------------

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

        # -------------------------------------------------
        # RECOMMENDATIONS
        # -------------------------------------------------

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

        # -------------------------------------------------
        # REGULATORY ALERTS
        # -------------------------------------------------

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

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return {
            "success": True,

            "data": {

                "company": {
                    "id": company.id,
                    "company_name": company.company_name,
                    "cin": company.cin,
                    "pan": company.pan,
                    "gstin": company.gstin,
                    "business_type": company.business_type,
                    "industry": company.industry,
                    "state": company.state,
                },

                "compliance": (
                    {
                        "compliance_score":
                            compliance_report.compliance_score,

                        "risk_level":
                            compliance_report.risk_level,

                        "present_documents":
                            parse_json(
                                compliance_report.present_documents,
                                []
                            ),

                        "missing_documents":
                            parse_json(
                                compliance_report.missing_documents,
                                []
                            ),

                        "findings":
                            parse_json(
                                compliance_report.findings,
                                []
                            ),

                        "created_at":
                            compliance_report.created_at,
                    }
                    if compliance_report
                    else None
                ),

                "documents": [
                    {
                        "id": document.id,
                        "filename": document.filename,
                        "document_type":
                            document.document_type,
                        "status": document.status,
                        "uploaded_at":
                            document.uploaded_at,
                    }
                    for document in documents
                ],

                "recommendations": [
                    {
                        "id": recommendation.id,
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
                        "created_at":
                            recommendation.created_at,
                    }
                    for recommendation in recommendations
                ],

                "regulatory_alerts": [
                    {
                        "id": alert.id,
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
                        "created_at":
                            alert.created_at,
                    }
                    for alert in regulatory_alerts
                ],
            }
        }

    finally:

        db.close()