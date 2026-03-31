from scapy.all import sniff, IP, TCP, UDP, Ether
from datetime import datetime, timezone
from core.event_bus import event_bus
from database.buffer import add_packet
from config import MODE


def process_packet(packet):
    try:
        if not packet.haslayer(IP):
            return

        src_port = None
        dst_port = None

        if packet.haslayer(TCP):
            src_port = packet[TCP].sport
            dst_port = packet[TCP].dport

        elif packet.haslayer(UDP):
            src_port = packet[UDP].sport
            dst_port = packet[UDP].dport

        src_mac = None
        dst_mac = None

        if packet.haslayer(Ether):
            src_mac = packet[Ether].src
            dst_mac = packet[Ether].dst

        packet_data = {
            "timestamp": str(datetime.now(timezone.utc).isoformat()),
            "src_ip": packet[IP].src,
            "dst_ip": packet[IP].dst,
            "src_mac": src_mac,
            "dst_mac": dst_mac,
            "protocol": packet[IP].proto,
            "src_port": src_port,
            "dst_port": dst_port,
            "length": len(packet)
        }

        # keep raw packet buffer for dashboard / backend usage
        add_packet(packet_data)

        # send into pipeline
        event_bus.publish("packet", packet_data)

    except Exception as e:
        print("Packet processing error:", e)


def start_sniffer():
    if MODE == "DEMO":
        print("🟡 DEMO MODE: Live packet sniffer disabled")
        return

    print("🟢 LIVE MODE: NetSentinel Packet Sniffer Started...")

    try:
        sniff(
            prn=process_packet,
            store=False
        )
    except Exception as e:
        print("Sniffer error:", e)