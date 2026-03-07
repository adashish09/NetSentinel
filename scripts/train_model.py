import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

# fake training data for now
data = {
    "packet_length": [60, 70, 80, 90, 100, 110],
    "protocol": [6, 6, 17, 6, 17, 6],
    "connection_rate": [2, 3, 1, 4, 2, 3],
    "unique_ports": [1, 1, 2, 1, 2, 1]
}

df = pd.DataFrame(data)

model = IsolationForest(
    n_estimators=100,
    contamination=0.1,
    random_state=42
)

model.fit(df)

os.makedirs("../models", exist_ok=True)

joblib.dump(model, "../models/isolation_forest.pkl")

print("Model trained and saved")