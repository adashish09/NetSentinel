import React, { useEffect, useState, useRef } from "react"

function getRowStyle(packet) {
  if (!packet.anomaly) {
    return {
      backgroundColor: "transparent",
      color: "#e5e7eb",
      cursor: "pointer"
    }
  }

  switch (packet.severity) {
    case "CRITICAL":
      return {
        backgroundColor: "rgba(239, 68, 68, 0.35)",
        color: "#fff",
        cursor: "pointer"
      }
    case "HIGH":
      return {
        backgroundColor: "rgba(249, 115, 22, 0.30)",
        color: "#fff",
        cursor: "pointer"
      }
    case "MEDIUM":
      return {
        backgroundColor: "rgba(234, 179, 8, 0.25)",
        color: "#fff",
        cursor: "pointer"
      }
    default:
      return {
        backgroundColor: "rgba(59, 130, 246, 0.18)",
        color: "#fff",
        cursor: "pointer"
      }
  }
}

function PacketStream({ onSelectPacket }) {
  const [packets, setPackets] = useState([])
  const wsRef = useRef(null)
  const packetBuffer = useRef([])

  useEffect(() => {
    if (wsRef.current) return

    const ws = new WebSocket("ws://127.0.0.1:8000/ws/packets")
    wsRef.current = ws

    ws.onopen = () => {
      console.log("WebSocket connected")
    }

    ws.onmessage = (event) => {
      const packet = JSON.parse(event.data)
      packetBuffer.current.unshift(packet)
    }

    ws.onerror = (err) => {
      console.error("WebSocket error:", err)
    }

    ws.onclose = () => {
      console.log("WebSocket closed")
    }

    // Update UI every 1 sec instead of every packet
    const interval = setInterval(() => {
      if (packetBuffer.current.length > 0) {
        setPackets(prev => {
          const merged = [...packetBuffer.current, ...prev]
          packetBuffer.current = []
          return merged.slice(0, 25)
        })
      }
    }, 1000)

    return () => {
      ws.close()
      wsRef.current = null
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="card p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">📡 Live Packet Stream</h5>
        <span className="badge bg-primary">Live</span>
      </div>

      <div className="stream-scroll">
        <table className="table table-sm table-hover align-middle">
          <thead>
            <tr>
              <th style={{ width: "7%" }}>#</th>
              <th style={{ width: "16%" }}>Source IP</th>
              <th style={{ width: "16%" }}>Destination IP</th>
              <th style={{ width: "14%" }}>Protocol</th>
              <th style={{ width: "14%" }}>Length</th>
              <th style={{ width: "18%" }}>Status</th>
              <th style={{ width: "15%" }}>Severity</th>
            </tr>
          </thead>

          <tbody>
            {packets.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-secondary">
                  Waiting for packets...
                </td>
              </tr>
            )}

            {packets.map((p) => (
              <tr
                key={p.packet_id}
                onClick={() => onSelectPacket && onSelectPacket(p)}
                style={{
                  ...getRowStyle(p),
                  borderLeft: p.anomaly
                    ? `4px solid ${p.severity === "CRITICAL"
                      ? "#ef4444"
                      : p.severity === "HIGH"
                        ? "#f97316"
                        : p.severity === "MEDIUM"
                          ? "#eab308"
                          : "#3b82f6"
                    }`
                    : "4px solid transparent"
                }}
              >
                <td>{p.packet_id}</td>
                <td title={p.src_ip}>{p.src_ip}</td>
                <td title={p.dst_ip}>{p.dst_ip}</td>
                <td>{p.protocol}</td>
                <td>{p.packet_length} B</td>
                <td>
                  <span
                    className={`badge ${p.anomaly
                        ? p.severity === "CRITICAL"
                          ? "bg-danger"
                          : p.severity === "HIGH"
                            ? "bg-warning text-dark"
                            : p.severity === "MEDIUM"
                              ? "bg-info text-dark"
                              : "bg-primary"
                        : "bg-secondary"
                      }`}
                  >
                    {p.anomaly ? p.severity : "Normal"}
                  </span>
                </td>
                <td>{p.severity || "LOW"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PacketStream