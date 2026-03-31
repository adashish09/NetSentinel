import os
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib

# =========================
# SAFE PATHS
# =========================
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
DATASET_PATH = os.path.join(BASE_DIR, "datasets", "Friday-WorkingHours-Afternoon-DDos.pcap_ISCX.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "isolation_forest.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

print("Using dataset:", DATASET_PATH)
print("Saving model to:", MODEL_PATH)

# =========================
# LOAD DATASET
# =========================
df = pd.read_csv(DATASET_PATH)

# Clean column names
df.columns = df.columns.str.strip()

# Select mapped features
features = df[[
    "Flow Packets/s",
    "Destination Port",
    "Packet Length Mean"
]].copy()

# Replace inf/nan
features.replace([float("inf"), -float("inf")], 0, inplace=True)
features.fillna(0, inplace=True)

# Normalize
scaler = StandardScaler()
X_scaled = scaler.fit_transform(features)

# Train model
model = IsolationForest(
    n_estimators=100,
    contamination=0.05,
    random_state=42
)

model.fit(X_scaled)

# Save model + scaler
joblib.dump(model, MODEL_PATH)
joblib.dump(scaler, SCALER_PATH)

print("✅ Model trained and saved successfully.")