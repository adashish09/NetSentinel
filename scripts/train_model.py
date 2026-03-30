import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

# ----------------------------
# Load dataset
# ----------------------------
DATA_PATH = "../datasets/Friday-WorkingHours-Afternoon-DDos.pcap_ISCX.csv"
MODEL_PATH = "../models/isolation_forest.pkl"

print("Loading dataset...")
df = pd.read_csv(DATA_PATH)

# ----------------------------
# Clean column names
# ----------------------------
df.columns = df.columns.str.strip()

print("Available columns:")
print(df.columns.tolist())

# ----------------------------
# Select features matching live NetSentinel traffic
# ----------------------------
selected_columns = [
    "Destination Port",
    "Packet Length Mean",
    "Flow Packets/s",
    "Total Fwd Packets",
    "Total Backward Packets"
]

df = df[selected_columns].copy()

# ----------------------------
# Clean invalid values
# ----------------------------
df.replace([float("inf"), float("-inf")], pd.NA, inplace=True)
df.dropna(inplace=True)

# ----------------------------
# Train Isolation Forest
# ----------------------------
print("Training Isolation Forest model...")

model = IsolationForest(
    n_estimators=100,
    contamination=0.05,
    random_state=42
)

model.fit(df)

# ----------------------------
# Save model
# ----------------------------
os.makedirs("../models", exist_ok=True)
joblib.dump(model, MODEL_PATH)

print(f"Model trained and saved at {MODEL_PATH}")