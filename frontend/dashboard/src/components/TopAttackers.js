import React, { useEffect, useState } from "react"

function getSeverity(count) {
  if (count > 50) return "CRITICAL"
  if (count > 30) return "HIGH"
  if (count > 15) return "MEDIUM"
  return "LOW"
}

function severityColor(severity) {
  switch (severity) {
    case "CRITICAL": return "bg-danger"
    case "HIGH": return "bg-warning text-dark"
    case "MEDIUM": return "bg-info text-dark"
    default: return "bg-secondary"
  }
}

function TopAttackers() {

  const [attackers, setAttackers] = useState({})

  useEffect(() => {

    const ws = new WebSocket("ws://127.0.0.1:8000/ws/packets")

    ws.onmessage = (event) => {
      const packet = JSON.parse(event.data)

      if (!packet.anomaly) return

      setAttackers(prev => {
        const updated = { ...prev }
        updated[packet.src_ip] = (updated[packet.src_ip] || 0) + 1
        return updated
      })
    }

    return () => ws.close()

  }, [])

  const sorted = Object.entries(attackers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="card p-3 h-100 d-flex flex-column">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">⚠️ Top Threat Sources</h5>
        <span className="badge bg-danger">
          {sorted.length} Active
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {sorted.length === 0 ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            <p className="text-secondary mb-0">No suspicious activity yet</p>
          </div>
        ) : (
          sorted.map(([ip, count]) => {
            const severity = getSeverity(count)

            return (
              <div
                key={ip}
                className="d-flex justify-content-between align-items-center mb-3 p-3"
                style={{
                  background: "#111827",
                  border: "1px solid #1e293b",
                  borderRadius: "12px"
                }}
              >
                <div>
                  <div style={{ fontWeight: "600", color: "#f8fafc" }}>{ip}</div>
                  <small className="text-secondary">
                    {count} suspicious packets
                  </small>
                </div>

                <span className={`badge ${severityColor(severity)}`}>
                  {severity}
                </span>
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}

export default TopAttackers