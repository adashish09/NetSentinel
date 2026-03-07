from core.event_bus import event_bus
from detection.ml_model import predict


PORT_SCAN_THRESHOLD = 5
CONNECTION_RATE_THRESHOLD = 10


def detect_intrusion(features):

    src_ip = features["src_ip"]

    # ---------- RULE ENGINE ----------

    if features["unique_ports"] > PORT_SCAN_THRESHOLD:

        alert = {
            "type": "PORT_SCAN",
            "src_ip": src_ip,
            "message": "Possible port scan detected"
        }

        event_bus.publish("alert", alert)
        return

    if features["connection_rate"] > CONNECTION_RATE_THRESHOLD:

        alert = {
            "type": "TRAFFIC_SPIKE",
            "src_ip": src_ip,
            "message": "Suspicious traffic spike detected"
        }

        event_bus.publish("alert", alert)
        return

    # ---------- ML DETECTION ----------

    result = predict(features)

    if result == -1:

        alert = {
            "type": "ANOMALY",
            "src_ip": src_ip,
            "message": "Anomalous traffic detected"
        }

        event_bus.publish("alert", alert)


event_bus.subscribe("features", detect_intrusion)