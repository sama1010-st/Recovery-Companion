import sqlite3

connection = sqlite3.connect("instance/recovery.db")
cursor = connection.cursor()

# عرض الجداول الموجودة
cursor.execute("""
    SELECT name FROM sqlite_master
    WHERE type='table'
""")

tables = cursor.fetchall()

print("Database Tables:")
for table in tables:
    print(table[0])

# عرض التقييمات الصحية المحفوظة
cursor.execute("SELECT * FROM health_checks")
records = cursor.fetchall()

print("\nSaved Health Checks:")
for record in records:
    print(record)

print("\nTotal Records:", len(records))

connection.close()