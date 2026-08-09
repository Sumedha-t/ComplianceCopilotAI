from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String(255), nullable=False, index=True)
    cin = Column(String(50), nullable=True)
    pan = Column(String(20), nullable=True)
    gstin = Column(String(20), nullable=True)

    business_type = Column(String(100), nullable=True)
    industry = Column(String(150), nullable=True)
    state = Column(String(100), nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    documents = relationship(
        "Document",
        back_populates="company",
        cascade="all, delete-orphan"
    )

    compliance_reports = relationship(
        "ComplianceReport",
        back_populates="company",
        cascade="all, delete-orphan"
    )

    recommendations = relationship(
        "Recommendation",
        back_populates="company",
        cascade="all, delete-orphan"
    )

    regulatory_alerts = relationship(
        "RegulatoryAlert",
        back_populates="company",
        cascade="all, delete-orphan"
    )

    new_business_profile = relationship(
        "NewBusinessProfile",
        back_populates="company",
        uselist=False,
        cascade="all, delete-orphan"
    )


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=True
    )

    filename = Column(String(255), nullable=False)

    document_type = Column(
        String(150),
        nullable=True
    )

    file_path = Column(
        String(500),
        nullable=True
    )

    status = Column(
        String(50),
        default="processed"
    )

    extracted_entities = Column(
        Text,
        nullable=True
    )

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    company = relationship(
        "Company",
        back_populates="documents"
    )


class ComplianceReport(Base):
    __tablename__ = "compliance_reports"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=False
    )

    compliance_score = Column(
        Float,
        nullable=False
    )

    risk_level = Column(
        String(50),
        nullable=False
    )

    present_documents = Column(
        Text,
        nullable=True
    )

    missing_documents = Column(
        Text,
        nullable=True
    )

    findings = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    company = relationship(
        "Company",
        back_populates="compliance_reports"
    )


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=False
    )

    document = Column(
        String(150),
        nullable=True
    )

    priority = Column(
        String(50),
        nullable=False
    )

    action = Column(
        String(255),
        nullable=False
    )

    reason = Column(
        Text,
        nullable=True
    )

    next_step = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    company = relationship(
        "Company",
        back_populates="recommendations"
    )


class RegulatoryAlert(Base):
    __tablename__ = "regulatory_alerts"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=False
    )

    update_id = Column(
        String(100),
        nullable=False
    )

    authority = Column(
        String(255),
        nullable=True
    )

    title = Column(
        String(500),
        nullable=False
    )

    severity = Column(
        String(50),
        nullable=False
    )

    affected_document = Column(
        String(150),
        nullable=True
    )

    status = Column(
        String(50),
        default="new"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    company = relationship(
        "Company",
        back_populates="regulatory_alerts"
    )


class NewBusinessProfile(Base):
    """
    Stores the initial compliance/readiness assessment
    generated for a newly consulted business.

    This is separate from ComplianceReport because a new
    business may have no documents yet and therefore does
    not have an audited compliance score.
    """

    __tablename__ = "new_business_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=False,
        unique=True
    )

    recommended_structure = Column(
        String(150),
        nullable=False
    )

    required_registrations = Column(
        Text,
        nullable=True
    )

    industry_compliance = Column(
        Text,
        nullable=True
    )

    state_compliance = Column(
        Text,
        nullable=True
    )

    initial_compliance_checklist = Column(
        Text,
        nullable=True
    )

    next_steps = Column(
        Text,
        nullable=True
    )

    reason = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    company = relationship(
        "Company",
        back_populates="new_business_profile"
    )