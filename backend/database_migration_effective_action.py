from sqlalchemy import text

from database import engine


def migrate():
    with engine.begin() as conn:

        columns = conn.execute(
            text("PRAGMA table_info(recommendations)")
        ).fetchall()

        existing_columns = {row[1] for row in columns}

        if "effective_action" not in existing_columns:
            conn.execute(
                text(
                    "ALTER TABLE recommendations "
                    "ADD COLUMN effective_action TEXT"
                )
            )
            print("Added recommendations.effective_action")
        else:
            print("recommendations.effective_action already exists")

    print("Effective action migration completed successfully.")


if __name__ == "__main__":
    migrate()