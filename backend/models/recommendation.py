from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from database.database import Base


class Recommendation(Base):
    """
    Stores AI generated recommendations.
    """

    __tablename__ = "recommendations"

    recommendation_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.company_id")
    )

    recommendation = Column(String)

    status = Column(String)