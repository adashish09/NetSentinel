import socket
import time
import random
import threading

TARGET_IP = "192.168.0.118"   # CHANGE THIS to your machine IP
WEB_PORTS = [80, 443, 8080]
COMMON_PORTS = [22, 53, 80, 443, 8080, 3306, 27017]


# =========================
# Helper: create TCP connection
# =========================
def send_tcp(port, timeout=0.5):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(timeout)
        s.connect((TARGET_IP, port))
        s.close()
    except:
        pass


# =========================
# NORMAL TRAFFIC
# =========================
def normal_traffic(duration=10):
    print("[SIM] Starting NORMAL traffic...")
    end_time = time.time() + duration

    while time.time() < end_time:
        send_tcp(random.choice(WEB_PORTS), timeout=1)
        time.sleep(random.uniform(0.8, 1.5))

    print("[SIM] NORMAL traffic completed.")


# =========================
# LOW SEVERITY ATTACK
# Repeated mild suspicious traffic
# =========================
def low_attack(duration=10):
    print("[SIM] Starting LOW severity suspicious traffic...")
    end_time = time.time() + duration

    while time.time() < end_time:
        send_tcp(random.choice(COMMON_PORTS), timeout=0.5)
        time.sleep(0.25)

    print("[SIM] LOW attack completed.")


# =========================
# MEDIUM SEVERITY ATTACK
# Burst traffic
# =========================
def medium_attack(duration=10):
    print("[SIM] Starting MEDIUM severity burst traffic...")
    end_time = time.time() + duration

    while time.time() < end_time:
        for _ in range(8):
            send_tcp(random.choice(COMMON_PORTS), timeout=0.2)
        time.sleep(0.15)

    print("[SIM] MEDIUM attack completed.")


# =========================
# HIGH SEVERITY ATTACK
# Port scan
# =========================
def high_attack(duration=10):
    print("[SIM] Starting HIGH severity port scan...")
    end_time = time.time() + duration

    while time.time() < end_time:
        for port in range(20, 120):
            send_tcp(port, timeout=0.08)
        time.sleep(0.3)

    print("[SIM] HIGH attack completed.")


# =========================
# CRITICAL SEVERITY ATTACK
# Heavy burst flood
# =========================
def critical_attack(duration=10):
    print("[SIM] Starting CRITICAL flood attack...")
    end_time = time.time() + duration

    while time.time() < end_time:
        threads = []

        for _ in range(50):
            port = random.randint(1, 1000)

            t = threading.Thread(target=send_tcp, args=(port, 0.03))
            t.start()
            threads.append(t)

        for t in threads:
            t.join()

        time.sleep(0.05)

    print("[SIM] CRITICAL attack completed.")


# =========================
# MAIN MENU
# =========================
if __name__ == "__main__":
    print("\n=== NetSentinel Attack Simulator ===")
    print("1. Normal Traffic")
    print("2. Low Severity Attack")
    print("3. Medium Severity Attack")
    print("4. High Severity Attack")
    print("5. Critical Severity Attack")

    choice = input("Select simulation type (1-5): ")

    if choice == "1":
        normal_traffic()
    elif choice == "2":
        low_attack()
    elif choice == "3":
        medium_attack()
    elif choice == "4":
        high_attack()
    elif choice == "5":
        critical_attack()
    else:
        print("Invalid choice.")