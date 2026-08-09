import json

from fastapi import APIRouter, HTTPException

from database import SessionLocal

from models.database_models import (
    Company,
    Document,
    ComplianceReport,
    Recommendation,
    RegulatoryAlert,
    NewBusinessProfile,
)


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Lawyer Dashboard"]
)


def parse_json(value, default=None):
    """
    Convert stored JSON strings into Python objects.
    """

    if default is None:
        default = []

    if value is None or value == "":
        return default

    if isinstance(value, (list, dict)):
        return value

    try:
        return json.loads(value)

    except (json.JSONDecodeError, TypeError):
        return default


# =========================================================
# CLIENT / COMPANY LIST
# =========================================================

@router.get("/companies")
async def get_companies():
    """
    Return all companies for the lawyer/client dashboard.

    Supports both:
    1. Existing businesses with compliance audits
    2. New businesses created through consultation
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

            # ---------------------------------------------
            # Latest compliance report
            # ---------------------------------------------

            latest_report = (
                db.query(ComplianceReport)
                .filter(
                    ComplianceReport.company_id
                    == company.id
                )
                .order_by(
                    ComplianceReport.created_at.desc()
                )
                .first()
            )

            # ---------------------------------------------
            # New business profile
            # ---------------------------------------------

            new_business_profile = (
                db.query(NewBusinessProfile)
                .filter(
                    NewBusinessProfile.company_id
                    == company.id
                )
                .first()
            )

            # ---------------------------------------------
            # Regulatory alerts
            # ---------------------------------------------

            alert_count = (
                db.query(RegulatoryAlert)
                .filter(
                    RegulatoryAlert.company_id
                    == company.id,
                    RegulatoryAlert.status
                    == "re-audit_required"
                )
                .count()
            )

            # ---------------------------------------------
            # Determine client type
            # ---------------------------------------------

            if new_business_profile:

                client_type = "new_business"

            else:

                client_type = "existing_business"

            # ---------------------------------------------
            # Determine compliance status
            # ---------------------------------------------

            if latest_report:

                compliance_status = "audited"

            elif new_business_profile:

                compliance_status = "not_yet_audited"

            else:

                compliance_status = "not_yet_audited"

            result.append(
                {
                    "id":
                        company.id,

                    "company_name":
                        company.company_name,

                    "industry":
                        company.industry,

                    "state":
                        company.state,

                    "business_type":
                        company.business_type,

                    "client_type":
                        client_type,

                    "compliance_status":
                        compliance_status,

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

                    "regulatory_alerts":
                        alert_count,
                }
            )

        return {
            "success": True,
            "data": result
        }

    finally:

        db.close()


# =========================================================
# INDIVIDUAL COMPANY DASHBOARD
# =========================================================

@router.get("/{company_id}")
async def get_company_dashboard(
    company_id: int
):
    """
    Return complete dashboard information for one company.

    Supports both existing-business and new-business clients.
    """

    db = SessionLocal()

    try:

        # -------------------------------------------------
        # COMPANY
        # -------------------------------------------------

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
        # NEW BUSINESS PROFILE
        # -------------------------------------------------

        new_business_profile = (
            db.query(NewBusinessProfile)
            .filter(
                NewBusinessProfile.company_id
                == company_id
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
        # CLIENT TYPE
        # -------------------------------------------------

        if new_business_profile:

            client_type = "new_business"

        else:

            client_type = "existing_business"

        # -------------------------------------------------
        # COMPLIANCE STATUS
        # -------------------------------------------------

        if compliance_report:

            compliance_status = "audited"

        elif new_business_profile:

            compliance_status = "not_yet_audited"

        else:

            compliance_status = "not_yet_audited"

        # -------------------------------------------------
        # NEW BUSINESS PROFILE RESPONSE
        # -------------------------------------------------

        new_business_data = None

        if new_business_profile:

            new_business_data = {

                "id":
                    new_business_profile.id,

                "recommended_structure":
                    new_business_profile.recommended_structure,

                "required_registrations":
                    parse_json(
                        new_business_profile.required_registrations,
                        []
                    ),

                "industry_compliance":
                    parse_json(
                        new_business_profile.industry_compliance,
                        []
                    ),

                "state_compliance":
                    parse_json(
                        new_business_profile.state_compliance,
                        []
                    ),

                "initial_compliance_checklist":
                    parse_json(
                        new_business_profile.initial_compliance_checklist,
                        []
                    ),

                "next_steps":
                    parse_json(
                        new_business_profile.next_steps,
                        []
                    ),

                "reason":
                    new_business_profile.reason,

                "created_at":
                    new_business_profile.created_at,

                "updated_at":
                    new_business_profile.updated_at,
            }

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return {

            "success": True,

            "data": {

                # =========================================
                # CLIENT METADATA
                # =========================================

                "client_type":
                    client_type,

                "compliance_status":
                    compliance_status,

                # =========================================
                # COMPANY
                # =========================================

                "company": {

                    "id":
                        company.id,

                    "company_name":
                        company.company_name,

                    "cin":
                        company.cin,

                    "pan":
                        company.pan,

                    "gstin":
                        company.gstin,

                    "business_type":
                        company.business_type,

                    "industry":
                        company.industry,

                    "state":
                        company.state,

                    "created_at":
                        company.created_at,

                    "updated_at":
                        company.updated_at,
                },

                # =========================================
                # COMPLIANCE
                # =========================================

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

                # =========================================
                # NEW BUSINESS READINESS
                # =========================================

                "new_business_profile":
                    new_business_data,

                # =========================================
                # DOCUMENTS
                # =========================================

                "documents": [

                    {
                        "id":
                            document.id,

                        "filename":
                            document.filename,

                        "document_type":
                            document.document_type,

                        "status":
                            document.status,

                        "uploaded_at":
                            document.uploaded_at,
                    }

                    for document in documents
                ],

                # =========================================
                # RECOMMENDATIONS
                # =========================================

                "recommendations": [

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

                        "created_at":
                            recommendation.created_at,
                    }

                    for recommendation in recommendations
                ],

                # =========================================
                # REGULATORY ALERTS
                # =========================================

                "regulatory_alerts": [

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

                        "created_at":
                            alert.created_at,
                    }

                    for alert in regulatory_alerts
                ],
            }
        }

    finally:

        db.close()