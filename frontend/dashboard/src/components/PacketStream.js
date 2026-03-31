import React, { useEffect, useState, useRef } from "react"

function getStreamState(status, lastPacketAt) {
  if (status === "Reconnecting...") {
    return {
      label: "Reconnecting",
      color: "#f59e0b"
    }
  }

  if (status === "Disconnected") {
    return {
      label: "Offline",
      color: "#64748b"
    }
  }

  const now = Date.now()
  const idleMs = now - lastPacketAt

  if (idleMs > 5000) {
    return {
      label: "Idle",
      color: "#64748b"
    }
  }

  return {
    label: "Live",
    color: "#22c55e"
  }
}

function PacketStream({ onSelectPacket }) {
  const [packets, setPackets] = useState([])
  const [connectionStatus, setConnectionStatus] = useState("Connecting...")
  const [packetsPerSecond, setPacketsPerSecond] = useState(0)
  const [lastPacketAt, setLastPacketAt] = useState(Date.now())

  const wsRef = useRef(null)
  const reconnectTimeout = useRef(null)
  const packetCounterRef = useRef(0)

  useEffect(() => {
    let isMounted = true

    const connectWebSocket = () => {
      if (!isMounted) return

      const ws = new WebSocket("ws://127.0.0.1:8000/ws/packets")
      wsRef.current = ws

      ws.onopen = () => {
        if (isMounted) setConnectionStatus("Connected")
      }

      ws.onmessage = (event) => {
        const packet = JSON.parse(event.data)

        if (isMounted) {
          setPackets((prev) => [packet, ...prev.slice(0, 29)])
          setLastPacketAt(Date.now())
          packetCounterRef.current += 1
        }
      }

      ws.onerror = (err) => {
        console.error("PacketStream WebSocket error:", err)
      }

      ws.onclose = () => {
        if (isMounted) {
          setConnectionStatus("Reconnecting...")
          reconnectTimeout.current = setTimeout(connectWebSocket, 2000)
        }
      }
    }

    connectWebSocket()

    const ppsInterval = setInterval(() => {
      setPacketsPerSecond(packetCounterRef.current)
      packetCounterRef.current = 0
    }, 1000)

    return () => {
      isMounted = false
      clearInterval(ppsInterval)
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
      if (wsRef.current) wsRef.current.close()
      setConnectionStatus("Disconnected")
    }
  }, [])

  const streamState = getStreamState(connectionStatus, lastPacketAt)

  return (
    <div className="card dashboard-panel packet-stream-panel p-3 h-100">
      {/* ===== HEADER ===== */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
        <div>
          <h5 className="mb-1 packet-stream-title">Live Packet Stream</h5>
          <small className="packet-stream-subtitle">
            Real-time classified traffic feed
          </small>
        </div>

        <div className="d-flex gap-2 flex-wrap align-items-center">
          <span
            className="badge"
            style={{
              backgroundColor: streamState.color,
              color: "#fff"
            }}
          >
            {streamState.label}
          </span>

          <span
            className="badge"
            style={{
              backgroundColor: "#0ea5e9",
              color: "#fff"
            }}
          >
            {packetsPerSecond} pkt/s
          </span>
        </div>
      </div>

      {/* ===== MINI INFO BAR ===== */}
      <div className="packet-stream-meta mb-3 justify-content-center">
        <div className="packet-meta-item ">
          <span className="packet-meta-label">Visible Packets: </span>
          <span className="packet-meta-value">{packets.length}</span>
        </div>

        <div className="packet-meta-item">
          <span className="packet-meta-label">Last Packet: </span>
          <span className="packet-meta-value">
            {Math.max(0, Math.floor((Date.now() - lastPacketAt) / 1000))}s ago
          </span>
        </div>

        <div className="packet-meta-item">
          <span className="packet-meta-label">Connection: </span>
          <span className="packet-meta-value">{connectionStatus}</span>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="stream-scroll">
        <table className="table table-sm table-hover align-middle mb-0 packet-stream-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Source IP</th>
              <th>Destination IP</th>
              <th>Protocol</th>
              <th>Length</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {packets.length === 0 ? (
              <tr className="packet-empty-row">
                <td colSpan="6" className="text-center py-5">
                  <div className="packet-empty-state">
                    <div className="packet-empty-title">Waiting for packets...</div>
                    <div className="packet-empty-subtitle">
                      No traffic observed in the current stream
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              packets.map((p) => (
                <tr
                  key={`${p.packet_id}-${p.timestamp}`}
                  onClick={() => onSelectPacket && onSelectPacket(p)}
                  className={p.anomaly ? "packet-anomaly-row" : "packet-normal-row"}
                  style={{ cursor: "pointer" }}
                >
                  <td>{p.packet_id}</td>
                  <td>{p.src_ip}</td>
                  <td>{p.dst_ip}</td>
                  <td>{p.protocol}</td>
                  <td>{p.packet_length} B</td>
                  <td>
                    {p.anomaly ? (
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            p.severity === "CRITICAL"
                              ? "#ef4444"
                              : p.severity === "HIGH"
                              ? "#f97316"
                              : p.severity === "MEDIUM"
                              ? "#f59e0b"
                              : "#3b82f6",
                          color: "#fff"
                        }}
                      >
                        {p.severity || "ANOMALY"}
                      </span>
                    ) : (
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "#22c55e",
                          color: "#fff"
                        }}
                      >
                        NORMAL
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PacketStream