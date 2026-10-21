
import joblib
import pandas as pd
from pathlib import Path

# Load trained Machine Learning model
BASE_DIR = Path(__file__).resolve().parent

saved_data = joblib.load(
    BASE_DIR / "soc_anomaly_model.joblib"
)

model = saved_data["model"]
features = saved_data["features"]


def predict_login_activity(
    failed_logins,
    successful_logins,
    unique_users
):
    activity = pd.DataFrame([{
        "failed_logins_5min": failed_logins,
        "successful_logins_5min": successful_logins,
        "unique_users_5min": unique_users
    }])[features]

    prediction = model.predict(activity)[0]

    if prediction == -1:
        return "SUSPICIOUS"
    else:
        return "NORMAL"
