import sqlite3

DB_PATH = "instance/recovery.db"

connection = sqlite3.connect(DB_PATH)

cursor = connection.cursor()

columns = [
    row[1]
    for row in cursor.execute("PRAGMA table_info(users)").fetchall()
]

if "surgery_date" not in columns:

    cursor.execute(
        "ALTER TABLE users ADD COLUMN surgery_date DATE"
    )

    connection.commit()

    print("surgery_date column added successfully.")

else:

    print("surgery_date column already exists.")

connection.close()