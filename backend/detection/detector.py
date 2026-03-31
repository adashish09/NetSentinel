from core.event_bus import event_bus
from detection.ml_model import predict

# =========================
# Detection thresholds
# =========================
PORT_SCAN_THRESHOLD = 12
CONNECTION_RATE_THRESHOLD = 25
CRITICAL_RATE_THRESHOLD = 60
CRITICAL_PORT_THRESHOLD = 45


def detect_intrusion(features):
    src_ip = features["src_ip"]

    # =========================
    # Default classification
    # =========================
    features["anomaly"] = False
    features["severity"] = "NORMAL"
    features["attack_type"] = "Normal Traffic"
    features["reason"] = None
    features["ml_score"] = None

    # =========================
    # RULE ENGINE
    # =========================

    # Critical Port Scan
    if features["unique_ports"] >= CRITICAL_PORT_THRESHOLD:
        features["anomaly"] = True
        features["severity"] = "CRITICAL"
        features["attack_type"] = "Aggressive Port Scan"
        features["reason"] = "Too many unique ports accessed in a short time"

        alert = {
            "type": "CRITICAL_PORT_SCAN",
            "src_ip": src_ip,
            "severity": "CRITICAL",
            "message": "Aggressive port scan detected"
        }

        event_bus.publish("alert", alert)
        event_bus.publish("detected_packet", features)
        return

    # High Port Scan
    if features["unique_ports"] > PORT_SCAN_THRESHOLD:
        features["anomaly"] = True
        features["severity"] = "HIGH"
        features["attack_type"] = "Port Scan"
        features["reason"] = "Multiple destination ports accessed"

        alert = {
            "type": "PORT_SCAN",
            "src_ip": src_ip,
            "severity": "HIGH",
            "message": "Possible port scan detected"
        }

        event_bus.publish("alert", alert)
        event_bus.publish("detected_packet", features)
        return

    # Critical Flood / Traffic Burst
    if features["connection_rate"] >= CRITICAL_RATE_THRESHOLD:
        features["anomaly"] = True
        features["severity"] = "CRITICAL"
        features["attack_type"] = "Traffic Flood"
        features["reason"] = "Very high connection rate detected"

        alert = {
            "type": "FLOOD",
            "src_ip": src_ip,
            "severity": "CRITICAL",
            "message": "Critical traffic flood detected"
        }

        event_bus.publish("alert", alert)
        event_bus.publish("detected_packet", features)
        return

    # Medium Traffic Spike
    if features["connection_rate"] > CONNECTION_RATE_THRESHOLD:
        features["anomaly"] = True
        features["severity"] = "MEDIUM"
        features["attack_type"] = "Traffic Spike"
        features["reason"] = "Suspicious increase in traffic rate"

        alert = {
            "type": "TRAFFIC_SPIKE",
            "src_ip": src_ip,
            "severity": "MEDIUM",
            "message": "Suspicious traffic spike detected"
        }

        event_bus.publish("alert", alert)
        event_bus.publish("detected_packet", features)
        return

    # =========================
    # ML DETECTION
    # =========================
    try:
        result, score = predict(features)
        features["ml_score"] = round(score, 4)

        if result == -1:
            features["anomaly"] = True
            features["severity"] = "LOW"
            features["attack_type"] = "ML Anomaly"
            features["reason"] = f"Isolation Forest flagged anomaly (score: {score:.4f})"

            alert = {
                "type": "ANOMALY",
                "src_ip": src_ip,
                "severity": "LOW",
                "message": "Anomalous traffic detected"
            }

            event_bus.publish("alert", alert)

    except Exception as e:
        print("ML detection error:", e)
        features["reason"] = "ML analysis unavailable"

    # =========================
    # Always publish final classified packet
    # =========================
    event_bus.publish("detected_packet", features)


event_bus.subscribe("features", detect_intrusion)