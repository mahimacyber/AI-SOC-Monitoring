print("Welcome to AI-Powered SOC Monitoring System")

print("Security Monitoring Started...")

print("System is running successfully!")



import csv
import sqlite3
from collections import defaultdict
from datetime import datetime, timedelta

print("\nChecking Security Logs...")

failed_attempts = defaultdict(list)


def save_alert(alert_type, severity, username, ip, timestamp):
    connection = sqlite3.connect("soc_alerts.db")
    cursor = connection.cursor()

    cursor.execute("""
        SELECT id FROM alerts
        WHERE alert_type = ?
        AND username = ?
        AND source_ip = ?
        AND timestamp = ?
    """, (alert_type, username, ip, timestamp))

    if cursor.fetchone() is None:
        cursor.execute("""
            INSERT INTO alerts
            (alert_type, severity, username, source_ip, timestamp)
            VALUES (?, ?, ?, ?, ?)
        """, (alert_type, severity, username, ip, timestamp))

        connection.commit()
        print("[SAVED] Alert saved to database!")

    connection.close()

with open("sample_logs.csv", newline="", encoding="utf-8") as file:
    logs = list(csv.DictReader(file))

logs.sort(key=lambda log: log["timestamp"])

for log in logs:
    username = log["username"]
    ip = log["source_ip"]
    event_id = log["event_id"]
    time = datetime.fromisoformat(log["timestamp"])

    key = (username, ip)

    # Keep failures from the last 5 minutes
    failed_attempts[key] = [
        t for t in failed_attempts[key]
        if timedelta(0) <= time - t <= timedelta(minutes=5)
    ]

    if event_id == "4625":
        failed_attempts[key].append(time)

        if len(failed_attempts[key]) == 5:
            print(f"[HIGH ALERT] Possible brute-force attack: {ip}")

            save_alert(
    "Possible Brute-Force Attack",
    "HIGH",
    username,
    ip,
    log["timestamp"]
)

    elif event_id == "4624":
        if len(failed_attempts[key]) >= 5:
            print(f"[HIGH ALERT] Suspicious successful login: {username}")
            
            save_alert(
                "Suspicious Successful Login",
                "HIGH",
                username,
                ip,
                log["timestamp"]
            )


        failed_attempts[key].clear()

print("\nSecurity Log Analysis Completed!")
