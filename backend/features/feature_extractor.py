from core.event_bus import event_bus
from collections import defaultdict
import time

port_tracker = defaultdict(set)
connection_times = defaultdict(list)

WINDOW = 2
packet_counter = 0


def extract_features(packet):
    global packet_counter
    packet_counter += 1

    src_ip = packet["src_ip"]
    dst_port = packet["dst_port"]

    now = time.time()

    connection_times[src_ip].append(now)

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

    event_bus.publish("features", features)


event_bus.subscribe("packet", extract_features)