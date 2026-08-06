from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from database.database import Base


class LawyerNote(Base):
    """
    Stores lawyer comments and approvals.
    """

    __tablename__ = "lawyer_notes"

    note_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.company_id")
    )

    lawyer_name = Column(String)

    note = Column(String)