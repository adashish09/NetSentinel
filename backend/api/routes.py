from fastapi import APIRouter, WebSocket
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone, timedelta

from api.ws_manager import manager
from database.mongodb import alerts_collection, features_collection
from core.event_bus import event_bus

router = APIRouter()


# =========================
# SIMULATION PACKET MODEL
# =========================
class SimulatedPacket(BaseModel):
    src_ip: str
    dst_ip: str
    src_mac: Optional[str] = "AA:BB:CC:DD:EE:FF"
    dst_mac: Optional[str] = "FF:EE:DD:CC:BB:AA"
    protocol: int = 6
    src_port: Optional[int] = None
    dst_port: Optional[int] = None
    length: int = 100
    timestamp: Optional[str] = None


# =========================
# STATUS API
# =========================
@router.get("/status")
def status():
    return {
        "engine": "active",
        "module": "NetSentinel"
    }


# =========================
# ALERT API
# =========================
@router.get("/alerts")
def get_alerts():
    alerts = list(
        alerts_collection
        .find()
        .sort("timestamp", -1)
        .limit(50)
    )

    for a in alerts:
        a["_id"] = str(a["_id"])

    return alerts

# =========================
# PACKETS SUMMARY API
# =========================
@router.get("/packets-summary")
def packets_summary():
    total_packets = features_collection.count_documents({})

    return {
        "total_packets": total_packets
    }

# =========================
# TOP ATTACKERS API
# =========================
@router.get("/top-attackers")
def top_attackers():
    pipeline = [
        {
            "$group": {
                "_id": "$src_ip",
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {"count": -1}
        },
        {
            "$limit": 5
        }
    ]

    results = list(features_collection.aggregate(pipeline))

    attackers = []

    for r in results:
        attackers.append({
            "ip": r["_id"],
            "count": r["count"]
        })

    return attackers

# =========================
# LIVE THREAT SCORE API
# =========================
@router.get("/threat-score")
def threat_score():
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(seconds=60)

    recent_packets = list(features_collection.find({
        "timestamp": {"$gte": window_start.isoformat()}
    }))

    if not recent_packets:
        return {"score": 0}

    score = 0

    for packet in recent_packets:
        severity = packet.get("severity", "NORMAL")

        if severity == "LOW":
            score += 5
        elif severity == "MEDIUM":
            score += 12
        elif severity == "HIGH":
            score += 20
        elif severity == "CRITICAL":
            score += 30

    # Normalize to 100
    score = min(score, 100)

    return {"score": score}



# =========================
# SIMULATED PACKET API
# =========================
@router.post("/simulate/packet")
def simulate_packet(packet: SimulatedPacket):
    # Pydantic v2-safe replacement for .dict()
    packet_data = packet.model_dump()

    if not packet_data["timestamp"]:
        # timezone-aware current UTC timestamp
        packet_data["timestamp"] = datetime.now(timezone.utc).isoformat()

    # Inject packet into same backend pipeline
    event_bus.publish("packet", packet_data)

    return {
        "status": "ok",
        "message": "Simulated packet injected successfully",
        "packet": packet_data
    }


# =========================
# WEBSOCKET
# =========================
@router.websocket("/ws/packets")
async def packet_stream(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            # Keep socket alive
            await websocket.receive_text()
    except Exception:
        manager.disconnect(websocket)