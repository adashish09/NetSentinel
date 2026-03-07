from fastapi import APIRouter, WebSocket
from api.ws_manager import manager
from database.mongodb import alerts_collection

router = APIRouter()


@router.get("/status")
def status():
    return {
        "engine": "active",
        "module": "NetSentinel"
    }


# -------- ALERT API --------
@router.get("/alerts")
def get_alerts():

    alerts = list(
        alerts_collection
        .find()
        .sort("timestamp", -1)
        .limit(50)
    )

    # convert ObjectId → string
    for a in alerts:
        a["_id"] = str(a["_id"])

    return alerts


# -------- WEBSOCKET --------
@router.websocket("/ws/packets")
async def packet_stream(websocket: WebSocket):

    await manager.connect(websocket)

    try:
        while True:
            await websocket.receive_text()
    except:
        manager.disconnect(websocket)