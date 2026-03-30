from core.event_bus import event_bus
from collections import defaultdict
import time
from database.mongodb import features_collection

# track ports accessed by source IP
port_tracker = defaultdict(set)

# track connection timestamps
connection_times = defaultdict(list)

WINDOW = 2

# real packet counter
packet_counter = 0


def extract_features(packet):

    global packet_counter
    packet_counter += 1

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

    protocol_map = {
        1: "ICMP",
        6: "TCP",
        17: "UDP"
    }

    protocol_name = protocol_map.get(packet["protocol"], str(packet["protocol"]))

    features = {
        "packet_id": packet_counter,
        "timestamp": packet["timestamp"],
        "src_ip": src_ip,
        "dst_ip": packet["dst_ip"],
        "src_mac": packet["src_mac"],
        "dst_mac": packet["dst_mac"],
        "protocol": protocol_name,
        "packet_length": packet["length"],
        "dst_port": dst_port,
        "connection_rate": len(connection_times[src_ip]),
        "unique_ports": len(port_tracker[src_ip])
    }

    # store features in MongoDB
    result = features_collection.insert_one(features)
    features["_id"] = str(result.inserted_id)

    print("FEATURE EVENT:", features)

    # publish to detection engine
    event_bus.publish("features", features)


event_bus.subscribe("packet", extract_features)