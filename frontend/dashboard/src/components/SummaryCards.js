import React, { useEffect, useState } from "react"
import ThreatScoreCard from "./ThreatScoreCard"

function SummaryCards() {
  const [stats, setStats] = useState({
    total: 0,
    anomalies: 0,
    critical: 0
  })

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/packets")

    ws.onmessage = (event) => {
      const packet = JSON.parse(event.data)

      setStats(prev => ({
        total: prev.total + 1,
        anomalies: prev.anomalies + (packet.anomaly ? 1 : 0),
        critical: prev.critical + (packet.severity === "CRITICAL" ? 1 : 0)
      }))
    }

    return () => ws.close()
  }, [])

  return (
    <div className="row g-3 mb-4">

      <div className="col-md-3">
        <div className="card p-3 summary-card">
          <h6 className="text-secondary mb-2">Total Packets</h6>
          <h2 className="fw-bold mb-0">{stats.total}</h2>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3 summary-card">
          <h6 className="text-secondary mb-2">Anomalies</h6>
          <h2 className="fw-bold mb-0 text-warning">{stats.anomalies}</h2>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3 summary-card">
          <h6 className="text-secondary mb-2">Critical Threats</h6>
          <h2 className="fw-bold mb-0 text-danger">{stats.critical}</h2>
        </div>
      </div>

      <div className="col-md-3">
        <ThreatScoreCard />
      </div>

    </div>
  )
}

export default SummaryCards