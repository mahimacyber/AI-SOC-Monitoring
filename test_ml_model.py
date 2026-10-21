
import joblib
import pandas as pd
from pathlib import Path

# Load our trained ML model
BASE_DIR = Path(__file__).resolve().parent

saved_data = joblib.load(
    BASE_DIR / "soc_anomaly_model.joblib"
)

model = saved_data["model"]
features = saved_data["features"]

print("ML Model Loaded Successfully!")

# Create two sample login activities
test_data = pd.DataFrame([
    {
        "failed_logins_5min": 1,
        "successful_logins_5min": 5,
        "unique_users_5min": 2
    },
    {
        "failed_logins_5min": 25,
        "successful_logins_5min": 0,
        "unique_users_5min": 8
    }
])[features]

# Predict unusual activity
predictions = model.predict(test_data)

for i, prediction in enumerate(predictions):
    if prediction == -1:
        print(f"Activity {i+1}: SUSPICIOUS")
    else:
        print(f"Activity {i+1}: NORMAL")
