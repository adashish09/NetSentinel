import React, { useEffect, useState, useRef } from "react"

function getThreatLevel(score) {
  if (score >= 80) return { label: "Critical", color: "#ef4444" }
  if (score >= 60) return { label: "High", color: "#f97316" }
  if (score >= 40) return { label: "Elevated", color: "#eab308" }
  if (score >= 20) return { label: "Guarded", color: "#3b82f6" }
  return { label: "Stable", color: "#22c55e" }
}

function ThreatScoreCard() {
  const [score, setScore] = useState(0)
  const [lastAlert, setLastAlert] = useState("No recent threats")

  const recentPackets = useRef([])

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/packets")

    ws.onmessage = (event) => {
      const packet = JSON.parse(event.data)
      const now = Date.now()

      recentPackets.current.push({
        time: now,
        anomaly: packet.anomaly,
        severity: packet.severity
      })

      if (packet.anomaly) {
        setLastAlert(`${packet.src_ip} • ${packet.severity || "Anomaly"}`)
      }
    }

    const interval = setInterval(() => {
      const now = Date.now()

      // Keep only last 60 seconds
      recentPackets.current = recentPackets.current.filter(
        p => now - p.time < 60000
      )

      const total = recentPackets.current.length
      const anomalies = recentPackets.current.filter(p => p.anomaly).length
      const critical = recentPackets.current.filter(
        p => p.severity === "CRITICAL"
      ).length

      const calculatedScore = Math.min(
        100,
        Math.floor(
          anomalies * 2 +
          critical * 8 +
          (total > 0 ? (anomalies / total) * 50 : 0)
        )
      )

      setScore(calculatedScore)
    }, 2000)

    return () => {
      ws.close()
      clearInterval(interval)
    }
  }, [])

  const threat = getThreatLevel(score)

  return (
    <div className="card p-3 summary-card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="text-secondary mb-0">Threat Score</h6>
        <span
          className="badge"
          style={{
            backgroundColor: threat.color,
            color: "#fff"
          }}
        >
          {threat.label}
        </span>
      </div>

      <h2 className="fw-bold mb-1" style={{ color: threat.color }}>
        {score}/100
      </h2>

      <small className="text-secondary">
        Last Alert: {lastAlert}
      </small>
    </div>
  )
}

export default ThreatScoreCard