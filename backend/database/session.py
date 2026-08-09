from database.database import SessionLocal


def get_db():
    """
    Creates a database session for each request
    and closes it automatically afterwards.
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()