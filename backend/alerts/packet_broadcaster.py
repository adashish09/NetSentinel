from core.event_bus import event_bus
from database.mongodb import features_collection
from api.ws_manager import manager
import asyncio


def handle_detected_packet(features):

    # store
    features_collection.insert_one(features)

    # convert id
    if "_id" in features:
        features["_id"] = str(features["_id"])

    print("Broadcasting detected packet:", features)
    print("Connected dashboards:", len(manager.active_connections))
    
    if manager.loop and manager.active_connections:
        asyncio.run_coroutine_threadsafe(
            manager.broadcast(features),
            manager.loop
        )


event_bus.subscribe("detected_packet", handle_detected_packet)
   