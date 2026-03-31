import requests
import random
import time

API_URL = "http://127.0.0.1:8000/simulate/packet"


def send_packet(src_ip, dst_ip, port, protocol=6, length=100):
    packet = {
        "src_ip": src_ip,
        "dst_ip": dst_ip,
        "src_mac": "AA:BB:CC:DD:EE:FF",
        "dst_mac": "FF:EE:DD:CC:BB:AA",
        "protocol": protocol,
        "src_port": random.randint(1000, 65000),
        "dst_port": port,
        "length": length
    }

    try:
        requests.post(API_URL, json=packet, timeout=5)
    except Exception as e:
        print("Failed to send simulated packet:", e)


# =========================
# BACKGROUND NORMAL TRAFFIC
# =========================
def background_normal(duration=60):
    print(f"🟢 Background normal traffic for {duration}s...")
    start = time.time()

    while time.time() - start < duration:
        port = random.choice([80, 443, 53, 22])
        protocol = random.choice([6, 17])  # TCP / UDP

        send_packet(
            src_ip=random.choice(["10.0.0.10", "10.0.0.11", "10.0.0.12"]),
            dst_ip="192.168.0.1",
            port=port,
            protocol=protocol,
            length=random.randint(60, 300)
        )

        time.sleep(random.uniform(0.2, 0.8))


# =========================
# LOW ATTACK
# =========================
def low_attack(duration=90):
    print(f"🟡 Low suspicious traffic for {duration}s...")
    start = time.time()

    while time.time() - start < duration:
        # mix normal traffic
        if random.random() < 0.6:
            send_packet(
                src_ip=random.choice(["10.0.0.10", "10.0.0.11"]),
                dst_ip="192.168.0.1",
                port=random.choice([80, 443]),
                protocol=6,
                length=random.randint(60, 250)
            )

        # slightly suspicious source
        send_packet(
            src_ip="10.0.0.20",
            dst_ip="192.168.0.1",
            port=80,
            protocol=6,
            length=random.randint(120, 350)
        )

        time.sleep(0.08)


# =========================
# MEDIUM ATTACK
# =========================
def medium_attack(duration=90):
    print(f"🟠 Medium suspicious traffic for {duration}s...")
    start = time.time()

    while time.time() - start < duration:
        if random.random() < 0.4:
            send_packet(
                src_ip=random.choice(["10.0.0.10", "10.0.0.11"]),
                dst_ip="192.168.0.1",
                port=random.choice([80, 443]),
                protocol=6,
                length=random.randint(60, 250)
            )

        send_packet(
            src_ip="10.0.0.21",
            dst_ip="192.168.0.1",
            port=80,
            protocol=6,
            length=random.randint(150, 500)
        )

        time.sleep(0.05)


# =========================
# HIGH ATTACK
# =========================
def high_attack(duration=90):
    print(f"🔴 Port scan in progress for {duration}s...")
    start = time.time()
    port = 20

    while time.time() - start < duration:
        if random.random() < 0.3:
            send_packet(
                src_ip=random.choice(["10.0.0.10", "10.0.0.11"]),
                dst_ip="192.168.0.1",
                port=random.choice([80, 443]),
                protocol=6,
                length=random.randint(60, 200)
            )

        send_packet(
            src_ip="10.0.0.30",
            dst_ip="192.168.0.1",
            port=port,
            protocol=6,
            length=random.randint(60, 150)
        )

        port += 1
        if port > 120:
            port = 20

        time.sleep(0.03)


# =========================
# CRITICAL ATTACK
# =========================
def critical_attack(duration=90):
    print(f"🚨 Critical flood attack for {duration}s...")
    start = time.time()

    while time.time() - start < duration:
        if random.random() < 0.2:
            send_packet(
                src_ip=random.choice(["10.0.0.10", "10.0.0.11"]),
                dst_ip="192.168.0.1",
                port=random.choice([80, 443, 53]),
                protocol=random.choice([6, 17]),
                length=random.randint(60, 250)
            )

        send_packet(
            src_ip="10.0.0.99",
            dst_ip="192.168.0.1",
            port=random.randint(1, 200),
            protocol=6,
            length=random.randint(200, 1400)
        )

        time.sleep(0.005)


# =========================
# FULL DEMO SCENARIOS
# =========================
def run_low_demo():
    print("\n=== LOW DEMO (~3 min) ===")
    background_normal(45)
    low_attack(90)
    background_normal(45)
    print("✅ Low demo completed")


def run_medium_demo():
    print("\n=== MEDIUM DEMO (~3 min) ===")
    background_normal(45)
    medium_attack(90)
    background_normal(45)
    print("✅ Medium demo completed")


def run_high_demo():
    print("\n=== HIGH DEMO (~3 min) ===")
    background_normal(45)
    high_attack(90)
    background_normal(45)
    print("✅ High demo completed")


def run_critical_demo():
    print("\n=== CRITICAL DEMO (~4 min) ===")
    background_normal(30)
    medium_attack(45)
    high_attack(45)
    critical_attack(90)
    background_normal(30)
    print("✅ Critical demo completed")


def run_mixed_demo():
    print("\n=== FULL MIXED ATTACK DEMO (~5 min) ===")
    background_normal(45)
    low_attack(45)
    background_normal(20)
    medium_attack(45)
    background_normal(20)
    high_attack(45)
    background_normal(20)
    critical_attack(60)
    background_normal(20)
    print("✅ Mixed demo completed")


# =========================
# MENU
# =========================
if __name__ == "__main__":
    print("\n=== NetSentinel Attack Simulator ===")
    print("1. Low Demo (~3 min)")
    print("2. Medium Demo (~3 min)")
    print("3. High Demo (~3 min)")
    print("4. Critical Demo (~4 min)")
    print("5. Full Mixed Demo (~5 min)")

    choice = input("Select simulation type (1-5): ").strip()

    if choice == "1":
        run_low_demo()
    elif choice == "2":
        run_medium_demo()
    elif choice == "3":
        run_high_demo()
    elif choice == "4":
        run_critical_demo()
    elif choice == "5":
        run_mixed_demo()
    else:
        print("❌ Invalid choice")