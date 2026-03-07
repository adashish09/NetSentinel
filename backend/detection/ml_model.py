import os
import joblib
import pandas as pd

MODEL_PATH = "../models/isolation_forest.pkl"

model = None

# load model safely
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("Isolation Forest model loaded")
else:
    print("⚠ ML model not found. Run training script.")


def predict(features):

    global model

    # if model not loaded, skip ML detection
    if model is None:
        return 1

    df = pd.DataFrame([{
        "packet_length": features["packet_length"],
        "protocol": features["protocol"],
        "connection_rate": features["connection_rate"],
        "unique_ports": features["unique_ports"]
    }])

    return model.predict(df)[0]