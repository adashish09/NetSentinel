import joblib
import os
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../models/isolation_forest.pkl")

model = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("Isolation Forest model loaded")
else:
    print("Warning: Isolation Forest model not found")


def predict(features):

    if model is None:
        return 1, 0

    input_data = pd.DataFrame([{
        "Destination Port": features.get("dst_port", 0) or 0,
        "Packet Length Mean": features.get("packet_length", 0),
        "Flow Packets/s": features.get("connection_rate", 0),
        "Total Fwd Packets": features.get("connection_rate", 0),
        "Total Backward Packets": 0
    }])

    prediction = model.predict(input_data)[0]
    score = model.decision_function(input_data)[0]

    return prediction, score