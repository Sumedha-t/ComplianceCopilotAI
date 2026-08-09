from sqlalchemy import text

from database import engine


def migrate_hitl_columns():
    with engine.begin() as connection:

        # =================================================
        # RECOMMENDATIONS
        # =================================================

        recommendation_columns = {
            "review_status": "VARCHAR(50) DEFAULT 'pending'",
            "lawyer_action": "TEXT",
            "lawyer_note": "TEXT",
            "reviewed_at": "DATETIME",
        }

        existing_recommendation_columns = {
            row[1]
            for row in connection.execute(
                text("PRAGMA table_info(recommendations)")
            )
        }

        for column_name, column_definition in recommendation_columns.items():

            if column_name not in existing_recommendation_columns:

                connection.execute(
                    text(
                        f"""
                        ALTER TABLE recommendations
                        ADD COLUMN {column_name}
                        {column_definition}
                        """
                    )
                )

                print(
                    f"Added recommendations.{column_name}"
                )

        # =================================================
        # REGULATORY ALERTS
        # =================================================

        alert_columns = {
            "lawyer_note": "TEXT",
            "acknowledged_at": "DATETIME",
        }

        existing_alert_columns = {
            row[1]
            for row in connection.execute(
                text("PRAGMA table_info(regulatory_alerts)")
            )
        }

        for column_name, column_definition in alert_columns.items():

            if column_name not in existing_alert_columns:

                connection.execute(
                    text(
                        f"""
                        ALTER TABLE regulatory_alerts
                        ADD COLUMN {column_name}
                        {column_definition}
                        """
                    )
                )

                print(
                    f"Added regulatory_alerts.{column_name}"
                )

    print("HITL database migration completed successfully.")


if __name__ == "__main__":
    migrate_hitl_columns()