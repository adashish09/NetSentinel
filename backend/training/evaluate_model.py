import os
import pandas as pd
from sklearn.metrics import classification_report
import joblib

# =========================
# SAFE PATHS
# =========================
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
DATASET_PATH = os.path.join(BASE_DIR, "datasets", "Friday-WorkingHours-Afternoon-DDos.pcap_ISCX.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "isolation_forest.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

print("Using dataset:", DATASET_PATH)
print("Loading model from:", MODEL_PATH)

# =========================
# LOAD DATASET
# =========================
df = pd.read_csv(DATASET_PATH)
df.columns = df.columns.str.strip()

features = df[[
    "Flow Packets/s",
    "Destination Port",
    "Packet Length Mean"
]].copy()

features.replace([float("inf"), -float("inf")], 0, inplace=True)
features.fillna(0, inplace=True)

# Ground truth labels
labels = df["Label"].apply(lambda x: 1 if x == "BENIGN" else -1)

# Load model
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

X_scaled = scaler.transform(features)
predictions = model.predict(X_scaled)

print("\n=== Evaluation Report ===\n")
print(classification_report(labels, predictions))