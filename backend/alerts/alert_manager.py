from core.event_bus import event_bus
from database.mongodb import alerts_collection
from datetime import datetime


def handle_alert(alert):

    alert["timestamp"] = datetime.utcnow()

    alerts_collection.insert_one(alert)

    print("🚨 ALERT:", alert)


event_bus.subscribe("alert", handle_alert)