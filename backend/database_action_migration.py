from sqlalchemy import text

from database import engine


def column_exists(connection, table_name, column_name):
    result = connection.execute(
        text(f"PRAGMA table_info({table_name})")
    )

    columns = [row[1] for row in result]

    return column_name in columns


def add_column(connection, table_name, column_name, definition):

    if not column_exists(
        connection,
        table_name,
        column_name
    ):

        connection.execute(
            text(
                f"ALTER TABLE {table_name} "
                f"ADD COLUMN {column_name} {definition}"
            )
        )

        print(
            f"Added {table_name}.{column_name}"
        )


def migrate():

    with engine.begin() as connection:

        add_column(
            connection,
            "recommendations",
            "action_status",
            "VARCHAR(50) DEFAULT 'pending'"
        )

        add_column(
            connection,
            "recommendations",
            "action_started_at",
            "DATETIME"
        )

        add_column(
            connection,
            "recommendations",
            "action_completed_at",
            "DATETIME"
        )

        add_column(
            connection,
            "recommendations",
            "action_blocked_reason",
            "TEXT"
        )

    print(
        "Phase C action execution migration completed successfully."
    )


if __name__ == "__main__":
    migrate()