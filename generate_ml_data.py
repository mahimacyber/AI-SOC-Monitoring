
import csv
import random

random.seed(42)

data = []

# Generate 470 normal activity records
for i in range(470):
    failed = random.randint(0, 3)
    successful = random.randint(1, 8)
    unique_users = random.randint(1, 3)

    data.append([
        failed, successful, unique_users, 0
    ])

# Generate 30 suspicious activity records
for i in range(30):
    failed = random.randint(15, 35)
    successful = random.randint(0, 2)
    unique_users = random.randint(1, 10)

    data.append([
        failed, successful, unique_users, 1
    ])

random.shuffle(data)

with open("ml_training_data.csv", "w", newline="") as file:
    writer = csv.writer(file)

    writer.writerow([
        "failed_logins_5min",
        "successful_logins_5min",
        "unique_users_5min",
        "actual_label"
    ])

    writer.writerows(data)

print("ML Training Dataset Created Successfully!")
print("Total Records:", len(data))
