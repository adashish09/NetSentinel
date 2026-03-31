from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from api.routes import router
from capture.sniffer import start_sniffer
from contextlib import asynccontextmanager
import threading
import asyncio

import features.feature_extractor
import alerts.alert_manager
import detection.detector
import detection.post_detection
import utils.helpers
import alerts.packet_broadcaster

from database.buffer import start_buffer
from api.ws_manager import manager


@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Starting NetSentinel...")

    print("Starting packet buffer...")
    start_buffer()

    # register main event loop for websocket broadcasting
    manager.set_loop(asyncio.get_running_loop())

    # start packet sniffer
    sniffer_thread = threading.Thread(target=start_sniffer, daemon=True)
    sniffer_thread.start()

    yield

    print("Stopping NetSentinel...")


app = FastAPI(
    title="NetSentinel IDS",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def home():
    return {
        "system": "NetSentinel",
        "status": "running"
    }