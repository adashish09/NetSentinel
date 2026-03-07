from fastapi import WebSocket
import asyncio

class ConnectionManager:

    def __init__(self):
        self.active_connections = []
        self.loop = None

    def set_loop(self, loop):
        self.loop = loop

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message):

        for connection in self.active_connections:
            await connection.send_json(message)


manager = ConnectionManager()