from sqlalchemy import Column
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import String

from database.database import Base


class Company(Base):
    """
    Stores basic company information obtained
    from the Business Consultation Agent.
    """

    __tablename__ = "companies"

    company_id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String, nullable=False)

    industry = Column(String)

    state = Column(String)

    founders = Column(Integer)

    employees = Column(Integer)

    annual_turnover = Column(Float)