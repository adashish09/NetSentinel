from core.event_bus import event_bus
from collections import defaultdict
import time
from database.mongodb import features_collection
from api.ws_manager import manager
import asyncio

# track ports accessed by source IP
port_tracker = defaultdict(set)

# track connection timestamps
connection_times = defaultdict(list)

WINDOW = 2


def extract_features(packet):

    src_ip = packet["src_ip"]
    dst_port = packet["dst_port"]

    now = time.time()

    connection_times[src_ip].append(now)

    # keep only recent connections
    connection_times[src_ip] = [
        t for t in connection_times[src_ip]
        if now - t < WINDOW
    ]

    if dst_port:
        port_tracker[src_ip].add(dst_port)

    features = {
        "timestamp": packet["timestamp"],
        "src_ip": src_ip,
        "dst_ip": packet["dst_ip"],
        "protocol": packet["protocol"],
        "packet_length": packet["length"],
        "dst_port": dst_port,
        "connection_rate": len(connection_times[src_ip]),
        "unique_ports": len(port_tracker[src_ip])
    }

    # store features in MongoDB
    features_collection.insert_one(features)

    # publish to detection engine
    event_bus.publish("features", features)


    print("Broadcasting packet:", features)
    print("Connected dashboards:", len(manager.active_connections))

    # broadcast packet to dashboard
    # remove mongodb object id before sending to websocket
    if "_id" in features:
        features["_id"] = str(features["_id"])

    print("Broadcasting packet:", features)
    print("Connected dashboards:", len(manager.active_connections))

    if manager.loop and manager.active_connections:
        asyncio.run_coroutine_threadsafe(
            manager.broadcast(features),
            manager.loop
        )



event_bus.subscribe("packet", extract_features)