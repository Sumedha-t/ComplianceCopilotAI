from database import Base, engine

from models.database_models import (
    Company,
    Document,
    ComplianceReport,
    Recommendation,
    RegulatoryAlert,
)


def initialize_database():

    Base.metadata.create_all(
        bind=engine
    )

    print("Database tables initialized successfully.")


if __name__ == "__main__":

    initialize_database()