from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from database.database import Base


class Compliance(Base):
    """
    Stores compliance analysis results.
    """

    __tablename__ = "compliance"

    compliance_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.company_id")
    )

    compliance_score = Column(Integer)

    risk_level = Column(String)

    missing_documents = Column(String)