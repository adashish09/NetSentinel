export function connectPacketStream(onMessage) {

  const ws = new WebSocket("ws://localhost:8000/ws/packets")

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessage(data)
  }

  return ws
}