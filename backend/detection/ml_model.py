import os
import joblib
import numpy as np

# =========================
# SAFE PATHS
# =========================
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
MODEL_PATH = os.path.join(BASE_DIR, "models", "isolation_forest.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

print("Loading model from:", MODEL_PATH)

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

def predict(features):
    data = np.array([[
        features["connection_rate"],
        features["dst_port"] or 0,
        features["packet_length"]
    ]])

    data_scaled = scaler.transform(data)
    prediction = model.predict(data_scaled)[0]
    score = model.decision_function(data_scaled)[0]

    return prediction, float(score)