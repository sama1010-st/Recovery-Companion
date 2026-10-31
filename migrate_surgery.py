from app import app
from database import db

with app.app_context():
    with db.engine.connect() as connection:
        columns = connection.exec_driver_sql("PRAGMA table_info(users)").fetchall()

        if not any(column[1] == "surgery_type" for column in columns):
            connection.exec_driver_sql(
                "ALTER TABLE users ADD COLUMN surgery_type VARCHAR(20)"
            )
            connection.commit()
            print("surgery_type column added successfully!")
        else:
            print("surgery_type column already exists!")