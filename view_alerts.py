import sqlite3

# Connect to our SOC database
connection = sqlite3.connect("soc_alerts.db")
cursor = connection.cursor()

# Read all saved security alerts
cursor.execute("SELECT * FROM alerts")

alerts = cursor.fetchall()

print("===== SAVED SOC SECURITY ALERTS =====")

for alert in alerts:
    print("----------------------------")
    print("Alert ID:", alert[0])
    print("Alert Type:", alert[1])
    print("Severity:", alert[2])
    print("Username:", alert[3])
    print("Source IP:", alert[4])
    print("Timestamp:", alert[5])
    print("Status:", alert[6])

connection.close()
