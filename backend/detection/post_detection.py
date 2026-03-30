from core.event_bus import event_bus
from api.ws_manager import manager
import asyncio


def forward_to_dashboard(features):

    # make websocket-safe
    features["_id"] = str(features.get("_id", ""))

    print("Broadcasting packet:", features)
    print("Connected dashboards:", len(manager.active_connections))

    if manager.loop and manager.active_connections:
        asyncio.run_coroutine_threadsafe(
            manager.broadcast(features),
            manager.loop
        )


event_bus.subscribe("detected_features", forward_to_dashboard)