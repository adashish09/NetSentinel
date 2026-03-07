from scapy.all import sniff, IP, TCP, UDP
from datetime import datetime
from core.event_bus import event_bus
from database.buffer import add_packet


def process_packet(packet):

    # ignore packets without IP layer
    if not packet.haslayer(IP):
        return

    try:

        src_port = None
        dst_port = None

        if packet.haslayer(TCP):
            src_port = packet[TCP].sport
            dst_port = packet[TCP].dport

        elif packet.haslayer(UDP):
            src_port = packet[UDP].sport
            dst_port = packet[UDP].dport

        packet_data = {
            "timestamp": str(datetime.utcnow()),
            "src_ip": packet[IP].src,
            "dst_ip": packet[IP].dst,
            "protocol": packet[IP].proto,
            "src_port": src_port,
            "dst_port": dst_port,
            "length": len(packet)
        }

        # store packet (buffered)
        add_packet(packet_data)

        # publish event
        event_bus.publish("packet", packet_data)

    except Exception as e:
        print("Packet processing error:", e)


def start_sniffer():

    print("NetSentinel Packet Sniffer Started...")

    sniff(
        prn=process_packet,
        store=False
    )