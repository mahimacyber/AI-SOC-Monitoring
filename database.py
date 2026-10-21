
import sqlite3

# Connect to SQLite database
connection = sqlite3.connect("soc_alerts.db")

cursor = connection.cursor()

# Create table for security alerts
cursor.execute("""
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_type TEXT,
    severity TEXT,
    username TEXT,
    source_ip TEXT,
    timestamp TEXT,
    status TEXT DEFAULT 'New'
)
""")

connection.commit()
connection.close()

print("SOC Alert Database Created Successfully!")
