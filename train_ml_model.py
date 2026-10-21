
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

# Read dataset
data = pd.read_csv("ml_training_data.csv")

print("Total Records:", len(data))

# Select input features
features = [
    "failed_logins_5min",
    "successful_logins_5min",
    "unique_users_5min"
]

X = data[features]
y = data["actual_label"]

# Split dataset into training and testing
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Create Isolation Forest model
model = IsolationForest(
    n_estimators=100,
    contamination=0.06,
    random_state=42
)

# Train model
model.fit(X_train)

print("Machine Learning Model Trained Successfully!")

# Test model
predictions = model.predict(X_test)

# Convert predictions to 0 and 1
predictions = (predictions == -1).astype(int)

print("\nModel Evaluation:")
print(classification_report(
    y_test,
    predictions,
    zero_division=0
))

# Save trained model
joblib.dump(
    {"model": model, "features": features},
    "soc_anomaly_model.joblib"
)

print("ML Model Saved Successfully!")
