from core.event_bus import event_bus
from detection.ml_model import predict


PORT_SCAN_THRESHOLD = 15
CONNECTION_RATE_THRESHOLD = 25


def get_severity(features):
    """
    Decide severity based on rule triggers / ML score
    """
    score = features.get("ml_score", 0)

    if features.get("unique_ports", 0) > 30 or features.get("connection_rate", 0) > 50:
        return "CRITICAL"
    elif features.get("unique_ports", 0) > 20 or features.get("connection_rate", 0) > 35:
        return "HIGH"
    elif features.get("anomaly", False):
        return "MEDIUM"
    else:
        return "LOW"


def detect_intrusion(features):

    src_ip = features["src_ip"]

    # default values
    features["anomaly"] = False
    features["anomaly_reason"] = "Normal traffic"
    features["severity"] = "LOW"

    # ---------- RULE ENGINE ----------

    if features["unique_ports"] > PORT_SCAN_THRESHOLD:

        features["anomaly"] = True
        features["anomaly_reason"] = "Port scan behavior detected"
        features["severity"] = get_severity(features)

        alert = {
            "type": "PORT_SCAN",
            "src_ip": src_ip,
            "message": "Possible port scan detected",
            "severity": features["severity"]
        }

        event_bus.publish("alert", alert)
        event_bus.publish("detected_features", features)
        return

    if features["connection_rate"] > CONNECTION_RATE_THRESHOLD:

        features["anomaly"] = True
        features["anomaly_reason"] = "High connection rate / traffic spike"
        features["severity"] = get_severity(features)

        alert = {
            "type": "TRAFFIC_SPIKE",
            "src_ip": src_ip,
            "message": "Suspicious traffic spike detected",
            "severity": features["severity"]
        }

        event_bus.publish("alert", alert)
        event_bus.publish("detected_features", features)
        return

    # ---------- ML DETECTION ----------

    result, score = predict(features)
    features["ml_score"] = float(score)

    if result == -1:

        features["anomaly"] = True
        features["anomaly_reason"] = f"ML anomaly (score: {round(score, 3)})"
        features["severity"] = get_severity(features)

        alert = {
            "type": "ANOMALY",
            "src_ip": src_ip,
            "message": "Anomalous traffic detected",
            "severity": features["severity"]
        }

        event_bus.publish("alert", alert)

    event_bus.publish("detected_features", features)


event_bus.subscribe("features", detect_intrusion)